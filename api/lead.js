/* POST /api/lead — the only server-side surface of the lead-magnet kits.
 *
 * Forwards a lead to the Make scenario in LEADMAGNET_WEBHOOK_URL with the same
 * field names as the Raspadinha route (Name, Phone, Email, Meli_Shopee,
 * "Faturamento por mes"...), so one Make mapping serves both, plus two hidden
 * fields: page = "leadmagnet" and leadmagnet = "leadmagnet-<slug>".
 *
 * The hook lives in env, never in the page: a URL in client code gets scraped
 * and spammed. Without the env var the route answers 503 not_configured.
 */

const KITS = new Set([
  "anuncio-pronto",
  "raio-x-concorrente",
  "cacador-de-produto",
  "lucro-escondido",
]);

/* Airtable choice names, byte-for-byte with Raspadinha (public/index.html). */
const MELI_SHOPEE = [
  "Só no Mercado Livre",
  "Só na Shopee",
  "Nos dois (Mercado Livre e Shopee)",
  "Estou começando / Outro",
];
const NOT_SELLING_YET = "Estou começando / Outro";
const REVENUE = [
  "Menos de R$ 25.000",
  "R$ 25.000 – 100.000",
  "R$ 100.000 – 500.000",
  "R$ 500.000 – 2.500.000",
  "Mais de R$ 2.500.000",
];

const ALLOWED_ORIGINS = [/^https:\/\/br\.joompulse\.net$/, /^https:\/\/leadmagnet[a-z0-9-]*\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];
const DEADLINE_MS = 8000;

const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) || null : null);
const pick = (v, list) => (list.includes(v) ? v : null);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, reason: "method" });
  }
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.some((re) => re.test(origin))) {
    return res.status(403).json({ ok: false, reason: "origin" });
  }

  let b = req.body;
  if (typeof b === "string") {
    try { b = JSON.parse(b); } catch { b = null; }
  }
  if (!b || typeof b !== "object") return res.status(400).json({ ok: false, reason: "body" });

  /* Honeypot: a bot fills every input, a person never sees this one. Answer
     ok so the bot moves on, but forward nothing. */
  if (b.website) return res.status(200).json({ ok: true });

  const slug = typeof b.kit === "string" ? b.kit : "";
  if (!KITS.has(slug)) return res.status(400).json({ ok: false, reason: "kit" });

  const payload = {
    submission_id: text(b.submission_id, 64),
    Name: text(b.Name, 120),
    Phone: text(b.Phone, 120),
    Email: text(b.Email, 160),
    Meli_Shopee: pick(b.Meli_Shopee, MELI_SHOPEE),
    Business_type: null,
    "Quantos colaboradores": null,
    "Faturamento por mes": pick(b["Faturamento por mes"], REVENUE),
    "Usou analiticos antes": null,
    Offline_event_in_form: null,
  };

  const missing = ["Name", "Phone", "Email", "Meli_Shopee", "Faturamento por mes"].filter((k) => !payload[k]);
  if ((payload.Phone || "").replace(/\D/g, "").length < 10) missing.push("Phone");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.Email || "")) missing.push("Email");
  if (missing.length) return res.status(400).json({ ok: false, reason: "incomplete", missing: [...new Set(missing)] });

  const u = b.utm && typeof b.utm === "object" ? b.utm : {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) payload[k] = text(u[k], 200);
  payload.referrer = text(b.referrer, 500);
  payload.landing_url = text(b.landing_url, 500);

  /* Meta CAPI / ads attribution, read by shared/jp-track.js. COOKIES is the raw
     cookie string under the same name the Tilda contract uses; event_id equals
     the pixel Lead's eventID so Meta dedupes browser and server events. */
  const a = b.attribution && typeof b.attribution === "object" ? b.attribution : {};
  payload.fbp = text(a.fbp, 128);
  payload.fbc = text(a.fbc, 512);
  payload.fbclid = text(a.fbclid, 512);
  payload.gclid = text(a.gclid, 512);
  payload.ttclid = text(a.ttclid, 512);
  payload.COOKIES = text(a.cookies, 4000);
  payload.user_agent = text(a.user_agent, 500) || text(req.headers["user-agent"], 500);
  payload.client_ip_address = text(String(req.headers["x-forwarded-for"] || "").split(",")[0], 64);
  payload.event_id = payload.submission_id;
  payload.event_source_url = payload.landing_url;

  /* The two hidden fields this route exists for. */
  payload.page = "leadmagnet";
  payload.leadmagnet = "leadmagnet-" + slug;

  payload.is_mql = payload.Meli_Shopee !== NOT_SELLING_YET;
  payload.form = "leadmagnet-" + slug;
  payload.source = "leadmagnet-" + slug;
  payload.submitted_at = new Date().toISOString();

  const hook = process.env.LEADMAGNET_WEBHOOK_URL;
  if (!hook) {
    console.error("LEADMAGNET_WEBHOOK_URL is not set");
    return res.status(503).json({ ok: false, reason: "not_configured" });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), DEADLINE_MS);
  try {
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) {
      console.error("make answered", r.status);
      return res.status(502).json({ ok: false, reason: "upstream" });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    clearTimeout(timer);
    console.error("make unreachable:", e.name, e.message);
    return res.status(504).json({ ok: false, reason: "timeout" });
  }
};

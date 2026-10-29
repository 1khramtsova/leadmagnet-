/* ---------------------------------------------------------------
   Motor dos kits de prompts (anuncio-pronto, raio-x-concorrente,
   cacador-de-produto, lucro-escondido).

   A página define window.KIT = { slug, name, steps:[{t, why, p}] } e marca:
     [data-kit-form]   onde o formulário é desenhado
     [data-kit-list]   onde a lista de prompts é desenhada
     [data-cd="h|m|s"] dígitos do contador (até 23:59:59 de São Paulo)
     [data-kit-cta]    botões que levam ao formulário
   O visual é 100% da página: aqui só saem classes kf-* e kl-*.
   Envio: POST /api/lead → Make (hidden: page=leadmagnet,
   leadmagnet=leadmagnet-<slug>). Desbloqueio fica no localStorage;
   depois do envio o lead vai pro WhatsApp buscar o material.
   --------------------------------------------------------------- */
(function () {
  "use strict";
  var KIT = window.KIT;
  if (!KIT) return;

  var STORE = "kit-unlocked-" + KIT.slug;
  var Q1 = { key: "Meli_Shopee", title: "Onde você vende hoje?",
    options: ["Só no Mercado Livre", "Só na Shopee", "Nos dois (Mercado Livre e Shopee)", "Estou começando / Outro"] };
  var Q2 = { key: "Faturamento por mes", title: "Faturamento mensal",
    options: ["Menos de R$ 25.000", "R$ 25.000 – 100.000", "R$ 100.000 – 500.000", "R$ 500.000 – 2.500.000", "Mais de R$ 2.500.000"] };

  var WA = "https://api.whatsapp.com/send/?phone=5511947626384&text="
    + encodeURIComponent("Quero receber meu material gratuito: " + (KIT.name || KIT.slug))
    + "&type=phone_number&app_absent=0";

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function sid() {
    try { return crypto.randomUUID(); } catch (e) { return "c-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }
  }

  /* ---------- atribuição ---------- */
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  function utm() {
    var q = new URLSearchParams(location.search), out = {}, saved = {};
    try { saved = JSON.parse(sessionStorage.getItem("kit-utm") || "{}"); } catch (e) {}
    UTM_KEYS.forEach(function (k) { out[k] = q.get(k) || saved[k] || null; });
    try { sessionStorage.setItem("kit-utm", JSON.stringify(out)); } catch (e) {}
    return out;
  }
  var UTM = utm();

  /* ---------- contador: 15 min a partir da 1ª visita deste navegador ----------
     Guardado no localStorage pra não reiniciar no F5; quando zera, começa
     outra janela de 15 min em vez de ficar parado em 00:00. */
  var WINDOW_MS = 15 * 60 * 1000, CD_KEY = "kit-deadline-" + KIT.slug;
  var cdEls = document.querySelectorAll("[data-cd]");
  var deadline = +store(CD_KEY) || 0;
  function tick() {
    var now = Date.now();
    if (deadline <= now) { deadline = now + WINDOW_MS; store(CD_KEY, String(deadline)); }
    var left = Math.ceil((deadline - now) / 1000);
    var v = { m: Math.floor(left / 60), s: left % 60 };
    cdEls.forEach(function (el) { el.textContent = String(v[el.getAttribute("data-cd")]).padStart(2, "0"); });
  }
  if (cdEls.length) { tick(); setInterval(tick, 1000); }

  /* ---------- formulário ---------- */
  var formHost = document.querySelector("[data-kit-form]");
  var answers = {}, contact = { name: "", phone: "", email: "" }, sending = false;

  function field(id, label, type, ph, ac) {
    return '<label class="kf-field" id="kf-f-' + id + '"><span class="kf-label">' + label + '</span>'
      + '<input class="kf-input" id="kf-' + id + '" type="' + type + '" placeholder="' + ph + '" autocomplete="' + ac + '"'
      + (type === "email" ? ' autocapitalize="off" spellcheck="false"' : "")
      + (type === "tel" ? ' inputmode="tel"' : "") + ' value="' + esc(contact[id]) + '">'
      + '<span class="kf-err"></span></label>';
  }
  function pills(q) {
    var n = q === Q1 ? "1" : "2";
    return '<label class="kf-q" id="kf-q-' + n + '"><span class="kf-label">' + q.title + '</span>'
      + '<span class="kf-sel"><select class="kf-input kf-select" data-q="' + esc(q.key) + '">'
      + '<option value="" disabled' + (answers[q.key] ? "" : " selected") + '>Selecione…</option>'
      + q.options.map(function (o) {
        return '<option' + (answers[q.key] === o ? " selected" : "") + ">" + esc(o) + "</option>";
      }).join("")
      + '</select></span><span class="kf-err"></span></label>';
  }
  function renderForm() {
    if (!formHost) return;
    if (store(STORE)) { renderDone(); return; }
    formHost.innerHTML = '<form class="kf" novalidate>'
      + '<div class="kf-head">' + (formHost.getAttribute("data-title") || "Receba o kit grátis") + "</div>"
      + field("name", "Seu nome", "text", "Maria Silva", "name")
      + field("phone", "Seu WhatsApp", "tel", "(11) 99999-9999", "tel")
      + field("email", "Seu e-mail", "email", "maria@loja.com.br", "email")
      + pills(Q1) + pills(Q2)
      + '<input type="text" name="website" tabindex="-1" autocomplete="off" class="kf-hp" aria-hidden="true">'
      + '<button class="kf-submit" type="submit">' + (formHost.getAttribute("data-cta") || "Liberar meu kit agora") + "</button>"
      + '<p class="kf-status" role="status"></p>'
      + '<p class="kf-fine">Kit gratuito e exclusivo para sellers do Mercado Livre. Nós processamos seus dados de acordo com a nossa <a href="https://joompulse.com/policy" target="_blank" rel="noopener">política de privacidade</a>.</p>'
      + "</form>";
    var f = formHost.querySelector("form");
    ["name", "phone", "email"].forEach(function (id) {
      var i = f.querySelector("#kf-" + id);
      i.addEventListener("input", function () {
        if (id === "phone") i.value = maskPhone(i.value);
        contact[id] = i.value; setErr("kf-f-" + id, "");
      });
    });
    f.addEventListener("change", function (e) {
      var s = e.target.closest(".kf-select"); if (!s) return;
      answers[s.getAttribute("data-q")] = s.value;
      s.classList.add("kf-filled");
      setErr(s.closest(".kf-q").id, "");
    });
    f.addEventListener("submit", submit);
  }
  function maskPhone(v) {
    var d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  function setErr(id, msg) {
    var box = document.getElementById(id); if (!box) return;
    box.classList.toggle("kf-bad", !!msg);
    box.querySelector(".kf-err").textContent = msg;
  }
  function validate() {
    var ok = true;
    function chk(id, good, msg) { setErr(id, good ? "" : msg); if (!good) ok = false; }
    chk("kf-f-name", contact.name.trim().length >= 2, "Digite seu nome.");
    chk("kf-f-phone", contact.phone.replace(/\D/g, "").length >= 10, "Digite um WhatsApp válido com DDD.");
    chk("kf-f-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()), "Digite um e-mail válido.");
    chk("kf-q-1", !!answers[Q1.key], "Escolha uma opção.");
    chk("kf-q-2", !!answers[Q2.key], "Escolha uma opção.");
    return ok;
  }
  function submit(e) {
    e.preventDefault();
    if (sending || !validate()) {
      var bad = formHost.querySelector(".kf-bad"); if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var f = e.target, btn = f.querySelector(".kf-submit"), st = f.querySelector(".kf-status");
    sending = true; btn.disabled = true; btn.classList.add("kf-loading"); st.textContent = "";
    var body = {
      kit: KIT.slug, submission_id: sid(),
      Name: contact.name.trim(), Phone: contact.phone.trim(), Email: contact.email.trim(),
      Meli_Shopee: answers[Q1.key], "Faturamento por mes": answers[Q2.key],
      website: f.querySelector(".kf-hp").value,
      utm: UTM, referrer: document.referrer || null, landing_url: location.href,
    };
    fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (x) {
        sending = false;
        if (x.j && x.j.ok) { unlock(true); return; }
        btn.disabled = false; btn.classList.remove("kf-loading");
        st.textContent = x.status === 400
          ? "Confira os campos e tente de novo."
          : "Não conseguimos enviar agora. Tente de novo em alguns segundos.";
      })
      .catch(function () {
        sending = false; btn.disabled = false; btn.classList.remove("kf-loading");
        st.textContent = "Sem conexão. Tente de novo.";
      });
  }
  function renderDone() {
    formHost.innerHTML = '<div class="kf kf-done"><div class="kf-check">✓</div>'
      + '<div class="kf-head">Kit liberado!</div>'
      + "<p>Seus " + KIT.steps.length + " prompts estão logo abaixo, prontos pra copiar.</p>"
      + '<a class="kf-submit" href="' + WA + '">Receber no WhatsApp →</a>'
      + '<p><a href="#kit">Ver meus prompts ↓</a></p></div>';
  }
  function unlock(fresh) {
    store(STORE, "1");
    document.documentElement.classList.add("kit-open");
    renderDone(); renderList();
    if (fresh) {
      if (window.fbq) try { window.fbq("track", "Lead", { content_name: "leadmagnet-" + KIT.slug }); } catch (e) {}
      /* pausa curta pro pixel sair antes de trocar de página */
      setTimeout(function () { location.href = WA; }, 900);
    }
  }

  /* ---------- lista de prompts ---------- */
  var listHost = document.querySelector("[data-kit-list]");
  function hl(text) {
    return esc(text).replace(/\[([^\]]+)\]/g, '<mark class="kl-var">[$1]</mark>');
  }
  function renderList() {
    if (!listHost) return;
    var open = !!store(STORE);
    listHost.innerHTML = KIT.steps.map(function (s, i) {
      var n = String(i + 1).padStart(2, "0");
      return '<article class="kl-card' + (open ? " kl-open" : " kl-locked") + '">'
        + '<div class="kl-top"><span class="kl-num">' + n + "</span>"
        + '<div class="kl-meta"><h3 class="kl-title">' + esc(s.t) + "</h3>"
        + '<p class="kl-why">' + esc(s.why) + "</p></div></div>"
        + (open
          ? '<pre class="kl-prompt">' + hl(s.p) + "</pre>"
            + '<button class="kl-copy" type="button" data-i="' + i + '">Copiar prompt</button>'
          : '<div class="kl-teaser" aria-hidden="true">' + esc(s.p.slice(0, 220)) + "</div>"
            + '<a class="kl-lock" href="#form" data-kit-cta>🔒 Liberar com o formulário</a>')
        + "</article>";
    }).join("");
  }
  if (listHost) listHost.addEventListener("click", function (e) {
    var b = e.target.closest(".kl-copy"); if (!b) return;
    var text = KIT.steps[+b.getAttribute("data-i")].p;
    var done = function () {
      b.textContent = "✓ Copiado!"; b.classList.add("kl-copied");
      setTimeout(function () { b.textContent = "Copiar prompt"; b.classList.remove("kl-copied"); }, 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); } catch (x) {} t.remove(); done();
    }
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-kit-cta]"); if (!a) return;
    e.preventDefault();
    var target = store(STORE) ? document.getElementById("kit") : document.getElementById("form");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!store(STORE)) setTimeout(function () { var i = document.getElementById("kf-name"); if (i) i.focus({ preventScroll: true }); }, 500);
  });

  /* ---------- cena «Copia → Cola → Usa» (KIT.demo) ---------- */
  var cpHost = document.querySelector("[data-kit-cp]");
  if (cpHost && KIT.demo) {
    var d = KIT.demo;
    cpHost.innerHTML = '<div class="cp" aria-hidden="true">'
      + '<div class="cp-steps"><span><b>1</b>Copia</span><i>→</i><span><b>2</b>Cola na IA</span><i>→</i><span><b>3</b>Usa</span></div>'
      + '<div class="cp-stage">'
      +   '<div class="cp-prompt"><div class="cp-tag">' + esc(d.label) + '</div>'
      +     '<div class="cp-code">' + hl(d.prompt) + '</div>'
      +     '<span class="cp-btn">⧉ Copiar prompt</span></div>'
      +   '<div class="cp-chat"><div class="cp-bar"><i></i><i></i><i></i><span>ChatGPT · Claude · Gemini</span></div>'
      +     '<div class="cp-me">' + esc(d.me) + '</div>'
      +     '<div class="cp-ai">' + d.ai.map(function (l, i) { return "<div>" + (i === 0 ? "<b>IA</b>" : "") + esc(l) + "</div>"; }).join("") + "</div>"
      +   "</div>"
      + "</div></div>";
  }

  /* link de entrega do WhatsApp (?acesso=liberado): abre o kit sem formulário,
     porque o navegador do WhatsApp não tem o localStorage do envio */
  var viaLink = new URLSearchParams(location.search).get("acesso") === "liberado";
  if (viaLink) store(STORE, "1");
  if (store(STORE)) document.documentElement.classList.add("kit-open");
  renderForm(); renderList();
  if (viaLink) setTimeout(function () { var l = document.getElementById("kit"); if (l) l.scrollIntoView({ behavior: "smooth" }); }, 400);
})();

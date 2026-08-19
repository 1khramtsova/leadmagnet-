/**
 * POST /api/lead — recebe os cadastros das landings de lead magnet.
 *
 * Hoje funciona como stub: valida, registra o lead no log da Vercel
 * (Deployments → Runtime Logs) e devolve ok.
 *
 * Para começar a mandar os leads pra valer, basta criar a variável de
 * ambiente na Vercel (Settings → Environment Variables) — sem tocar no código:
 *
 *   LEAD_WEBHOOK_URL   URL do webhook (Albato, Kommo, Make, n8n, Zapier...).
 *                      O corpo vai como JSON, com todos os campos do formulário.
 *   LEAD_WEBHOOK_TOKEN opcional — vai no header Authorization: Bearer <token>.
 *   LEAD_REDIRECT_URL  opcional — pra onde o lead é levado depois do envio.
 *                      Se não existir, vale o CONFIG.redirectUrl da página.
 */

const FIELDS = [
  'leadmagnet',
  'nome', 'telefone', 'email', 'onde_vende', 'faturamento', 'consentimento',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'partner',
  'page_url', 'referrer'
];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  const lead = {};
  for (const field of FIELDS) {
    const value = body[field];
    if (typeof value === 'string' && value.trim()) lead[field] = value.trim().slice(0, 500);
  }

  if (!lead.nome || !lead.email || !lead.telefone) {
    return res.status(400).json({ ok: false, error: 'missing_required_fields' });
  }

  lead.recebido_em = new Date().toISOString();

  // Fica visível em Deployments → Runtime Logs enquanto não houver webhook.
  console.log('[lead]', JSON.stringify(lead));

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (process.env.LEAD_WEBHOOK_TOKEN) {
        headers.Authorization = `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}`;
      }
      const upstream = await fetch(webhook, {
        method: 'POST',
        headers,
        body: JSON.stringify(lead)
      });
      if (!upstream.ok) {
        // O lead já está no log — não travamos a entrega do material por isso.
        console.error('[lead] webhook respondeu', upstream.status, await upstream.text());
      }
    } catch (error) {
      console.error('[lead] webhook falhou:', error && error.message);
    }
  }

  return res.status(200).json({
    ok: true,
    redirect: process.env.LEAD_REDIRECT_URL || null
  });
};

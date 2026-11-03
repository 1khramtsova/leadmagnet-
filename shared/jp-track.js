/* ---------------------------------------------------------------
   Meta pixel + cookies de atribuição pra toda página JoomPulse.

   Sem o pixel ninguém grava _fbp/_fbc e o CAPI do Make recebe o lead
   sem nada pra casar com o clique. Aqui:
     - o mesmo pixel do site principal (GTM-PR4T673C) com PageView;
     - _fbc (fb.1.<ms>.<fbclid>) e _fbp gravados em primeira parte,
       90 dias, no domínio .joompulse.net/.com — o pixel reaproveita;
     - gclid/ttclid guardados pra não se perderem entre páginas;
     - window.jpAttribution() devolve tudo pro payload do formulário;
     - window.jpLead(eventId, data) dispara o Lead com eventID igual
       ao submission_id, pro Meta deduplicar pixel × CAPI.
   Cópia idêntica vive no repo raspadinha (public/assets/jp-track.js).
   --------------------------------------------------------------- */
(function () {
  "use strict";
  var PIXEL_ID = "1743374269929384";
  var DAYS = 90;

  var host = location.hostname;
  var domain = /(^|\.)joompulse\.(net|com)$/.test(host) ? "." + host.split(".").slice(-2).join(".") : "";

  function get(name) {
    try {
      var m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      return m ? decodeURIComponent(m[1]) : "";
    } catch (e) { return ""; }
  }
  function set(name, value) {
    try {
      document.cookie = name + "=" + encodeURIComponent(value) + "; Max-Age=" + DAYS * 86400 + "; Path=/; SameSite=Lax"
        + (domain ? "; Domain=" + domain : "") + (location.protocol === "https:" ? "; Secure" : "");
    } catch (e) {}
  }
  function fbclidOf(fbc) { return fbc ? fbc.split(".").slice(3).join(".") : ""; }

  var q = new URLSearchParams(location.search);
  var fbclid = q.get("fbclid");
  if (fbclid && fbclidOf(get("_fbc")) !== fbclid) set("_fbc", "fb.1." + Date.now() + "." + fbclid);
  if (!get("_fbp")) set("_fbp", "fb.1." + Date.now() + "." + Math.floor(Math.random() * 1e10));
  ["gclid", "ttclid"].forEach(function (k) { var v = q.get(k); if (v) set("jp_" + k, v); });

  /* base code oficial do pixel */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");

  window.jpAttribution = function () {
    var fbc = get("_fbc");
    return {
      fbp: get("_fbp") || null,
      fbc: fbc || null,
      fbclid: q.get("fbclid") || fbclidOf(fbc) || null,
      gclid: q.get("gclid") || get("jp_gclid") || null,
      ttclid: q.get("ttclid") || get("jp_ttclid") || null,
      cookies: (function () { try { return document.cookie || null; } catch (e) { return null; } })(),
      user_agent: navigator.userAgent || null,
    };
  };
  window.jpLead = function (eventId, data) {
    try { window.fbq("track", "Lead", data || {}, eventId ? { eventID: String(eventId) } : undefined); } catch (e) {}
  };
})();

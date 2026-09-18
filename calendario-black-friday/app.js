/* Estado, localStorage, cálculos e render do placar. Sem rede. */
(function () {
  "use strict";
  const C = window.CONTENT;
  const KEY = "bf-calendario-v1";
  const DELTA_THRESHOLD = 0.05;
  const $ = (id) => document.getElementById(id);
  const el = (tag, attrs, ...children) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") n.className = v; else if (k === "dataset") Object.assign(n.dataset, v); else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else if (v !== null && v !== undefined) n.setAttribute(k, v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) n.append(c.nodeType ? c : document.createTextNode(String(c)));
    return n;
  };

  /* ---------------------------------------------------------- estado */
  function defaults() {
    const s = { v: 1, prazos: {}, alavancas: {}, checklist: {}, placar: [], updatedAt: null };
    for (const p of C.prazos.items) s.prazos[p.id] = { done: false, doneAt: null };
    for (const a of C.cronograma.items) s.alavancas[a.id] = false;
    for (const c of C.checklist.items) s.checklist[c.n] = c.type === "date" ? { date: null } : c.type === "text" ? { text: "" } : { done: false };
    return s;
  }
  function load() {
    const s = defaults();
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return s;
      const j = JSON.parse(raw);
      if (j && typeof j === "object") {
        for (const id of Object.keys(s.prazos)) if (j.prazos && j.prazos[id]) s.prazos[id] = { done: !!j.prazos[id].done, doneAt: j.prazos[id].doneAt || null };
        for (const id of Object.keys(s.alavancas)) if (j.alavancas && id in j.alavancas) s.alavancas[id] = !!j.alavancas[id];
        for (const n of Object.keys(s.checklist)) if (j.checklist && j.checklist[n]) {
          const it = j.checklist[n], def = s.checklist[n];
          if ("date" in def) def.date = it.date || null; else if ("text" in def) def.text = typeof it.text === "string" ? it.text : ""; else def.done = !!it.done;
        }
        if (Array.isArray(j.placar)) s.placar = j.placar.filter((w) => w && typeof w === "object").map((w) => ({
          id: String(w.id || uid()), semana: typeof w.semana === "string" ? w.semana : "",
          visitas: num(w.visitas), novosSeguidores: num(w.novosSeguidores), vendas: num(w.vendas), seguidoresTotais: num(w.seguidoresTotais), compraram: num(w.compraram), voltaram: num(w.voltaram),
        }));
      }
    } catch (e) { /* estado corrompido: começa limpo */ }
    return s;
  }
  const num = (v) => (v === null || v === undefined || v === "" ? null : Number.isFinite(Number(v)) ? Math.max(0, Math.floor(Number(v))) : null);
  const uid = () => Math.random().toString(36).slice(2, 10);
  let state = load();
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      state.updatedAt = new Date().toISOString();
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* armazenamento indisponível: a página continua funcionando */ }
    }, 300);
  }

  /* ---------------------------------------------------------- cálculos */
  function pctCompraram(w) { return w.seguidoresTotais > 0 && w.compraram !== null ? (w.compraram / w.seguidoresTotais) * 100 : null; }
  function faltaMeta(w) { if (w.seguidoresTotais === null || w.compraram === null) return null; return Math.max(0, Math.ceil(w.seguidoresTotais * 0.05) - w.compraram); }
  function trend(cur, prev) {
    if (cur === null || prev === null) return null;
    if (prev === 0) return cur > 0 ? "up" : "flat";
    const d = (cur - prev) / prev;
    return d > DELTA_THRESHOLD ? "up" : d < -DELTA_THRESHOLD ? "down" : "flat";
  }
  function sortedWeeks() { return [...state.placar].sort((a, b) => (a.semana || "").localeCompare(b.semana || "") || a.id.localeCompare(b.id)); }
  function leitura(w, prev) {
    const pct = pctCompraram(w);
    if (!prev) return { text: C.placar.leitura.first, extra: pct !== null && pct < 5 ? C.placar.leitura.r4 : null, first: true };
    const v = trend(w.visitas, prev.visitas), s = trend(w.novosSeguidores, prev.novosSeguidores), vd = trend(w.vendas, prev.vendas);
    if (v === "up" && s === "up" && vd === "down") return { text: C.placar.leitura.r1 };
    if (v === "down") return { text: C.placar.leitura.r2 };
    if (v === "up" && s === "down") return { text: C.placar.leitura.r3 };
    if (pct !== null && pct < 5) return { text: C.placar.leitura.r4 };
    return { text: C.placar.leitura.r5 };
  }
  const fmtPct = (p) => p === null ? "—" : p.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";

  /* ---------------------------------------------------------- hero, nav, rodapé */
  function renderStatic() {
    document.title = C.meta.title;
    $("hero-h1").textContent = C.hero.h1; $("hero-h2").textContent = C.hero.h2; $("hero-speaker").textContent = C.hero.speaker;
    $("how-title").textContent = C.hero.howTitle; $("how-tagline").textContent = C.hero.tagline; $("how-privacy").textContent = C.hero.privacy;
    $("how-list").replaceChildren(...C.hero.how.map((t) => el("li", null, t)));
    $("nav").replaceChildren(...C.nav.map(([href, label]) => el("a", { href }, label)));
    $("prazos-title").textContent = C.prazos.title; $("prazos-caption").textContent = C.prazos.caption;
    $("cronograma-title").textContent = C.cronograma.title; $("cronograma-caption").textContent = C.cronograma.caption;
    $("datas-title").textContent = C.datas.title; $("datas-caption").textContent = C.datas.caption;
    $("placar-title").textContent = C.placar.title; $("placar-caption").textContent = C.placar.caption; $("placar-add").textContent = C.placar.addWeek;
    $("placar-print-hint").textContent = C.print.placarHint; $("checklist-print-hint").textContent = C.print.checklistHint;
    $("checklist-title").textContent = C.checklist.title; $("checklist-intro").textContent = C.checklist.intro;
    $("footer-line").textContent = C.footer.line; $("clear-data").textContent = C.footer.clear;
    // tabela em branco só para impressão
    const cols = [C.placar.weekLabel, ...C.placar.fields.map((f) => f.label), C.placar.computed.pct];
    $("placar-blank").replaceChildren(el("table", null, el("thead", null, el("tr", null, ...cols.map((c) => el("th", null, c)))), el("tbody", null, ...Array.from({ length: 6 }, () => el("tr", null, ...cols.map(() => el("td", null, "")))))));
  }

  /* ---------------------------------------------------------- prazos */
  function renderPrazos() {
    const list = $("prazos-list");
    list.replaceChildren(...C.prazos.items.map((p) => {
      const st = state.prazos[p.id];
      const cb = el("input", { type: "checkbox", id: `prazo-${p.id}`, checked: st.done ? "" : null, onchange: (e) => { st.done = e.target.checked; if (st.done && !st.doneAt) { st.doneAt = today(); date.value = st.doneAt; } row.dataset.done = String(st.done); updateProgress(); save(); } });
      const date = el("input", { type: "date", class: "input input--sm", id: `prazo-date-${p.id}`, value: st.doneAt || "", onchange: (e) => { st.doneAt = e.target.value || null; if (st.doneAt && !st.done) { st.done = true; cb.checked = true; row.dataset.done = "true"; updateProgress(); } save(); } });
      const row = el("div", { class: "row", dataset: { done: String(st.done) } },
        el("div", { class: "row__check" }, cb),
        el("label", { for: `prazo-${p.id}` }, el("div", { class: "row__date" }, p.data), el("div", { class: "row__serve" }, p.serve), el("div", { class: "row__text" }, p.pronto)),
        el("div", { class: "row__meta" }, el("label", { for: `prazo-date-${p.id}` }, C.prazos.doneAtLabel), date));
      return row;
    }));
    updateProgress();
  }
  function updateProgress() { const n = C.prazos.items.filter((p) => state.prazos[p.id].done).length; $("prazos-progress").textContent = C.prazos.progress(n, C.prazos.items.length); }
  const today = () => new Date().toISOString().slice(0, 10);

  /* ---------------------------------------------------------- cronograma */
  function renderCronograma() {
    $("cronograma-list").replaceChildren(...C.cronograma.items.map((a) => {
      const row = el("div", { class: "row row--lever", dataset: { done: String(state.alavancas[a.id]) } },
        el("div", { class: "row__check" }, el("input", { type: "checkbox", id: `alv-${a.id}`, checked: state.alavancas[a.id] ? "" : null, onchange: (e) => { state.alavancas[a.id] = e.target.checked; row.dataset.done = String(e.target.checked); save(); } })),
        el("label", { for: `alv-${a.id}` }, el("div", { class: "row__date" }, a.alavanca), el("div", { class: "row__when" }, a.quando), el("div", { class: "row__text" }, a.como)),
        el("div", { class: "row__meta" }, el("label", { for: `alv-${a.id}` }, C.cronograma.onLabel)));
      return row;
    }));
  }

  /* ---------------------------------------------------------- datas */
  function renderDatas() {
    $("datas-list").replaceChildren(...C.datas.blocks.map((b) => el("div", { class: "datas__block" }, el("h3", { class: "datas__title" }, b.title),
      ...b.items.map((i) => el("div", { class: "datas__item" }, el("div", { class: "datas__data" }, i.data), el("div", { class: "datas__missao" }, i.missao), el("div", { class: "datas__acao" }, i.acao))))));
  }

  /* ---------------------------------------------------------- placar */
  function renderPlacar() {
    const list = $("placar-list");
    const weeks = sortedWeeks();
    if (!weeks.length) { list.replaceChildren(el("div", { class: "placar__empty" }, C.placar.empty)); return; }
    list.replaceChildren(...weeks.map((w, i) => weekCard(w, i)));
    updateComputed();
  }
  function weekCard(w) {
    const fields = C.placar.fields.map((f) => el("label", { class: "field" }, el("span", null, f.label), el("input", { type: "number", inputmode: "numeric", min: "0", step: "1", class: "input", value: w[f.key] === null ? "" : String(w[f.key]), oninput: (e) => { w[f.key] = num(e.target.value); updateComputed(); save(); } }), el("small", null, f.hint)));
    const semana = el("input", { type: "date", class: "input input--sm", value: w.semana || "", "aria-label": C.placar.weekLabel, onchange: (e) => { w.semana = e.target.value || ""; save(); renderPlacar(); } });
    const card = el("article", { class: "week", dataset: { id: w.id } },
      el("div", { class: "week__head" }, el("label", null, C.placar.weekLabel, semana), el("button", { type: "button", class: "btn btn--ghost btn--sm btn--danger", onclick: () => { state.placar = state.placar.filter((x) => x.id !== w.id); save(); renderPlacar(); } }, C.placar.removeWeek)),
      el("div", { class: "week__fields" }, ...fields),
      el("div", { class: "week__out" },
        el("div", { class: "stat" }, el("span", { class: "stat__label" }, C.placar.computed.pct), el("span", { class: "stat__value", dataset: { out: "pct" } }, "—")),
        el("div", { class: "stat" }, el("span", { class: "stat__label" }, C.placar.computed.meta), el("span", { class: "stat__value", dataset: { out: "meta" } }, "—")),
        el("div", { class: "stat__label", dataset: { out: "falta" } }, ""),
        el("div", { class: "trends", dataset: { out: "trends" } }),
        el("div", { class: "leitura", dataset: { out: "leitura" } }, "")));
    return card;
  }
  function updateComputed() {
    const weeks = sortedWeeks();
    weeks.forEach((w, i) => {
      const card = document.querySelector(`.week[data-id="${w.id}"]`); if (!card) return;
      const out = (k) => card.querySelector(`[data-out="${k}"]`);
      const pct = pctCompraram(w), falta = faltaMeta(w);
      out("pct").textContent = fmtPct(pct);
      const meta = out("meta");
      if (pct === null) { meta.textContent = "—"; meta.className = "stat__value"; } else { meta.textContent = pct >= 5 ? C.placar.metaOk : C.placar.metaBelow; meta.className = "stat__value " + (pct >= 5 ? "stat__value--ok" : "stat__value--warn"); }
      out("falta").textContent = falta !== null && falta > 0 ? C.placar.faltaMeta(falta) : "";
      const prev = i > 0 ? weeks[i - 1] : null;
      const trends = out("trends"); trends.replaceChildren();
      if (prev) for (const k of ["visitas", "novosSeguidores", "vendas"]) { const t = trend(w[k], prev[k]); if (t) trends.append(el("span", { class: `chip chip--${t}` }, `${C.placar.trendLabels[k]}: ${C.placar.trend[t]}`)); }
      const L = leitura(w, prev);
      const box = out("leitura"); box.className = "leitura" + (L.first ? " leitura--first" : "");
      box.replaceChildren(...[el("div", null, L.text), L.extra ? el("div", { style: "margin-top:6px" }, L.extra) : null].filter(Boolean));
    });
  }
  $("placar-add").addEventListener("click", () => {
    state.placar.push({ id: uid(), semana: today(), visitas: null, novosSeguidores: null, vendas: null, seguidoresTotais: null, compraram: null, voltaram: null });
    save(); renderPlacar();
    const last = document.querySelector(`.week[data-id="${state.placar[state.placar.length - 1].id}"] input[type="number"]`); if (last) last.focus();
  });

  /* ---------------------------------------------------------- checklist */
  function renderChecklist() {
    $("checklist-list").replaceChildren(...C.checklist.items.map((c) => {
      const st = state.checklist[c.n];
      let control;
      if (c.type === "date") control = el("input", { type: "date", class: "input input--sm", id: `chk-${c.n}`, value: st.date || "", onchange: (e) => { st.date = e.target.value || null; refresh(); save(); } });
      else if (c.type === "text") control = el("input", { type: "text", class: "input", id: `chk-${c.n}`, value: st.text, maxlength: "120", oninput: (e) => { st.text = e.target.value; refresh(); save(); } });
      else control = el("input", { type: "checkbox", id: `chk-${c.n}`, checked: st.done ? "" : null, onchange: (e) => { st.done = e.target.checked; refresh(); save(); } });
      const row = el("div", { class: "check" + (c.type === "text" ? " check--wide" : ""), dataset: { n: c.n } }, el("span", { class: "check__n" }, c.n), el("label", { class: "check__label", for: `chk-${c.n}` }, c.label), control);
      return row;
    }));
    refresh();
    function refresh() {
      let missing = 0;
      for (const c of C.checklist.items) {
        const st = state.checklist[c.n];
        const empty = c.type === "date" ? !st.date : c.type === "text" ? !st.text.trim() : !st.done;
        if (empty) missing++;
        const row = document.querySelector(`.check[data-n="${c.n}"]`); if (row) row.dataset.empty = String(empty);
      }
      const v = $("checklist-verdict"); v.dataset.state = missing ? "missing" : "done"; v.textContent = missing ? C.checklist.missing(missing) : C.checklist.done;
    }
  }

  /* ---------------------------------------------------------- limpar */
  $("clear-data").addEventListener("click", () => {
    if (!window.confirm(C.footer.clearConfirm)) return;
    try { localStorage.removeItem(KEY); } catch (e) {}
    state = defaults(); renderAll(); $("clear-note").textContent = C.footer.cleared; setTimeout(() => { $("clear-note").textContent = ""; }, 4000);
  });

  /* ---------------------------------------------------------- nav ativa */
  function watchNav() {
    const links = [...document.querySelectorAll(".nav a")];
    const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false")); }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  function renderAll() { renderPrazos(); renderCronograma(); renderDatas(); renderPlacar(); renderChecklist(); }
  renderStatic(); renderAll(); watchNav();
})();

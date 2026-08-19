/* ---------------------------------------------------------------
   JoomPulse — comportamento padrão das landings de lead magnet.
   Faz três coisas, todas opcionais:
     1. realça os [parâmetros] dentro de .prompt
     2. liga os botões .copy à caixa .prompt do mesmo bloco
     3. filtra os cartões [data-search] pela busca #search
   Carregue com <script src="/shared/leadmagnet.js" defer></script>.
   --------------------------------------------------------------- */
(function () {
  'use strict';

  // 1. Realce dos [parâmetros] — guarda o texto cru para a cópia.
  document.querySelectorAll('[data-prompt]').forEach(function (el) {
    el.dataset.raw = el.textContent;
    el.innerHTML = el.textContent
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\[([^\]]+)\]/g, '<span class="token">[$1]</span>');
  });

  // 2. Copiar
  document.querySelectorAll('.copy').forEach(function (btn) {
    var box = btn.parentNode.querySelector('[data-prompt]');
    if (!box) return;
    var label = btn.textContent;

    function done() {
      btn.textContent = '✓ Copiado!';
      btn.classList.add('is-done');
      setTimeout(function () {
        btn.textContent = label;
        btn.classList.remove('is-done');
      }, 1800);
    }

    // Safari/iOS antigo e páginas sem HTTPS não têm clipboard API.
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = box.dataset.raw;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }

    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(box.dataset.raw).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  // 3. Busca
  var search = document.getElementById('search');
  if (!search) return;
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
  var noun  = search.dataset.noun || 'prompts';

  search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (c) {
      var hit = !q || c.dataset.search.indexOf(q) !== -1 ||
                (c.dataset.n && c.dataset.n.indexOf(q) === 0);
      c.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    if (count) {
      count.textContent = (shown === cards.length ? cards.length : shown + ' de ' + cards.length) + ' ' + noun;
    }
    if (empty) empty.style.display = shown ? 'none' : 'block';
  });
})();

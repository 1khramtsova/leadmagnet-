# leadmagnet-

Статические лендинги-лидмагниты JoomPulse. Деплоятся на Vercel из `main` — без сборки,
без зависимостей: обычные HTML + CSS + JS.

## Что где лежит

```
/
├── shared/               общее для всех лидмагнитов
│   ├── brand.css         дизайн-токены и компоненты (кит из Figma «Joom Pulse — Arquivos»)
│   ├── leadmagnet.js     копирование промптов, подсветка [параметров], поиск
│   ├── logo.svg          логотип JoomPulse (для светлой темы)
│   └── logo-white.png    логотип JoomPulse (для тёмной темы)
├── _template/            заготовка нового лидмагнита
│   └── page.html
├── prompts-ia/           «50 prompts de IA» для Mercado Livre  → /prompts-ia
├── prompts-shopee/       «50 prompts de IA» для Shopee         → /prompts-shopee
│   ├── index.html
│   └── assets/           картинки только этой страницы
└── vercel.json           редиректы
```

Правило простое: **одна папка = один лидмагнит**, внутри `index.html`.
Vercel сам отдаёт `<папка>/index.html` по адресу `/<папка>`. Ничего регистрировать не надо.

## Как добавить новый лидмагнит

```bash
git checkout main && git pull
cp -r _template meu-material
mv meu-material/page.html meu-material/index.html
mkdir meu-material/assets            # если нужны свои картинки
```

Дальше в `meu-material/index.html`:

1. Заменить всё, что помечено `ЗАМЕНИТЬ` — title, description, заголовок, тексты, футер.
2. Выбрать тему в теге `<body>`:
   * `data-theme="shopee"` — тёмная бордово-красная (лончевый кит Shopee);
   * без атрибута — светлая синяя (продуктовый кит JoomPulse).
3. Наполнить карточки. Каждая карточка — это:
   ```html
   <article class="card p-card" data-n="01" data-search="текст для поиска в нижнем регистре">
     <h3 class="p-num">01</h3>
     <p class="p-pain">“боль словами селлера”</p>
     <div class="p-part">
       <div class="prompt" data-prompt>текст промпта с [параметром]</div>
       <button class="copy" type="button">Copiar prompt</button>
     </div>
   </article>
   ```
   `shared/leadmagnet.js` сам подсветит `[параметры]`, повесит копирование на кнопку
   и включит поиск по `data-search`. Ничего писать на JS не нужно.

Проверить локально:

```bash
python3 -m http.server 8000      # из корня репозитория, не из папки лидмагнита —
                                 # иначе не подтянется /shared/
open http://localhost:8000/meu-material/
```

Запушить в `main` — Vercel задеплоит автоматически, страница будет на `/<папка>`.

## Дизайн-система

Цвета, шрифты, скругления и компоненты живут в `shared/brand.css` как CSS-переменные.
На странице не должно быть захардкоженных цветов — только `var(--accent)`, `var(--text)` и т.д.
Тогда лидмагнит перекрашивается сменой одного атрибута `data-theme`.

Шрифты: **Poppins** — заголовки, **Inter** — текст (подключаются с Google Fonts).

Новая тема добавляется в `brand.css` одним блоком:

```css
[data-theme="minha-tema"] {
  --bg: #…; --surface: #…; --text: #…; --accent: #…;
}
```

## Корневой адрес

`vercel.json` редиректит `/` на `/prompts-ia` — так было настроено под первую рассылку.
Если нужно переключить корень на другой материал, поменяйте `destination` там же.

## Чего тут нет

Сборки, npm, фреймворков. Если лидмагниту вдруг понадобится бэкенд, форма с базой
или свой домен — это повод завести отдельный репозиторий, а не усложнять этот.

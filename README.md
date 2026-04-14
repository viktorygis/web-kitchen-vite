# web-kitchen-vite — Vite + Nunjucks (MPA) + SCSS + JS + отдельный PHP API

Многостраничный сайт (MPA) на **Vite** с шаблонами **Nunjucks**.
Стили пишутся на **SCSS**, скрипты — модульные (**ESM**).
Отправка писем (если нужна) делается через **PHP API**, который деплоится **отдельно от `dist/`**.

---

## Содержание

- [Требования](#требования)
- [Установка](#установка)
- [Запуск в разработке](#запуск-в-разработке)
- [Сборка (production)](#сборка-production)
- [Просмотр сборки локально](#просмотр-сборки-локально)
- [Структура проекта (подробно)](#структура-проекта-подробно)
- [Шаблоны Nunjucks](#шаблоны-nunjucks)
- [Стили (SCSS)](#стили-scss)
- [JavaScript](#javascript)
- [Деплой](#деплой)
  - [Frontend (dist)](#frontend-dist)
  - [Backend (PHP API — отдельно)](#backend-php-api--отдельно)
- [Частые проблемы](#частые-проблемы)
- [Команды](#команды)

---

## Требования

- **Node.js**: 18+ (рекомендуется актуальная LTS)
- **npm**: 9+

---

## Установка

```bash
npm install
```

---

## Запуск в разработке

Команда запускает:

1. рендер Nunjucks → HTML (`src/pages/**/*.njk` → `src/site/**/*.html`)
2. Vite dev server (отдаёт HTML из `src/site`)

```bash
npm run dev

```

После запуска сайт доступен по адресу, который покажет Vite
(обычно `http://localhost:5173/`).

---

## Сборка (production)

```bash
npm run build
```

Результат сборки будет в папке `dist/`.

---

## Просмотр сборки локально

```bash
npm run preview
```

---

## Структура проекта (подробно)

> `dist/` генерируется автоматически и обычно не хранится в Git.
> `src/site/` — сгенерированные HTML-страницы (результат рендера Nunjucks), их тоже обычно не правят руками.

```text
project-root/
  # -----------------------------
  # Root (конфигурация и команды)
  # -----------------------------
  .gitignore                        # исключения для Git (обычно включает dist/ и src/site/)
  package-lock.json                 # блокировка версий npm (не редактировать вручную)
  package.json                      # зависимости и скрипты
  README.md                         # документация (этот файл)
  vite.config.js                    # конфигурация Vite (root: src/site)

  # -----------------------------------------
  # Скрипты автоматизации (Node scripts)
  # -----------------------------------------
  scripts/
    render-njk.mjs                  # рендер Nunjucks -> HTML перед dev/build

  # -----------------------------
  # Исходники (то, что редактируем)
  # -----------------------------
  src/
    # 1) Шаблоны страниц (Nunjucks)
    pages/
      index.njk

      # примеры разделов
      about-css/
        animation.njk
        flex.njk
        grid.njk
        ...
      about-html/
        tags.njk
        forms.njk
        ...
      about-js-teoria/
        scope.njk
        promises.njk
        ...
      about-js-praktika/
        tasks-01.njk
        ...
      about-react/
        intro.njk
        ...
      about-scss/
        variables.njk
        mixins.njk
        ...
      about-vue/
        intro.njk
        ...

      # дополнительные страницы
      catalog.njk
      mentors.njk
      services.njk
      login.njk
      registration.njk
      vscode.njk
      404.njk

    # 2) Layouts (каркас страниц)
    layouts/
      base.njk                      # общий layout (head/header/footer + content + script)
      plain.njk                     # (опц.) layout без header/footer
      error.njk                     # (опц.) layout для 404/ошибок

    # 3) Partials (переиспользуемые блоки)
    partials/
      head.njk                      # <head>: meta/og/title/favicon и т.д.
      header.njk                    # меню/шапка
      footer.njk                    # футер
      popup.njk                     # попапы/модалки
      sidebar.njk                   # (опц.) боковая навигация
      breadcrumbs.njk               # (опц.)
      pagination.njk                # (опц.)

    # 4) Vite entry
    main.js                         # импортирует SCSS и основной JS

    # 5) SCSS стили
    styles/
      main.scss                     # главный SCSS entry
      variables.scss                # переменные проекта (цвета, размеры, шрифты)
      mixins.scss                   # (опционально)
      functions.scss                # (опционально)
      base/
        reset.scss                  # reset/normalize
        typography.scss             # базовая типографика
        helpers.scss                # утилитарные классы
      components/
        header.scss
        footer.scss
        buttons.scss
        forms.scss
        popup.scss
        table.scss
        note.scss
        ...
      pages/
        index.scss                  # (опционально) стили конкретных страниц
        about-css.scss
        about-html.scss
        ...

    # 6) JavaScript
    scripts/
      app.js                        # основной JS (инициализация)
      modules/
        menu.js
        popup.js
        tabs.js
        accordion.js
        validators.js
        api.js                      # (опц.) обертки для fetch
        form-send.js                # (опц.) отправка форм на /api/mail/send.php
        storage.js                  # (опц.) localStorage helpers
        ...
      pages/
        index.js                    # (опц.) JS только для конкретной страницы
        catalog.js
        ...

    # 7) Сгенерированные HTML (выход рендера Nunjucks)
    #    НЕ редактировать вручную — генерируется `npm run render`
    site/
      index.html
      about-css/
        animation.html
        flex.html
        grid.html
        ...
      about-html/
        tags.html
        forms.html
        ...
      ...                           # 1:1 соответствует структуре src/pages

  # -----------------------------------------
  # Статика без обработки (копируется в dist)
  # -----------------------------------------
  public/
    img/
      ...
    fonts/
      ...
    favicon.ico
    robots.txt
    sitemap.xml
    .well-known/                    # (опц.)

  # -----------------------------
  # Результат сборки (production)
  # -----------------------------
  dist/
    index.html
    about-css/
      animation.html
      ...
    assets/
      *.css                         # итоговый CSS из SCSS
      *.js                          # итоговый JS из main.js + импортов
    img/                            # из public/img
    fonts/                          # из public/fonts
    favicon.ico
    robots.txt
    sitemap.xml
```

---

## Шаблоны Nunjucks

### Рендер страниц

- Исходники: `src/pages/**/*.njk`
- Результат рендера: `src/site/**/*.html`
- Скрипт рендера: `scripts/render-njk.mjs`

Рендер выполняется перед `dev` и `build`.

### Подключение общих частей (partials)

```njk
{% include "partials/head.njk" %}
{% include "partials/header.njk" %}

<main>...</main>

{% include "partials/footer.njk" %}
```

---

## Стили (SCSS)

Главный файл:

- `src/styles/main.scss`

Подключается через Vite entry `src/main.js`:

```js
import "./styles/main.scss";
```

> Не нужно подключать CSS вручную через `<link>` (например `style.min.css`) — Vite сам соберёт и подключит итоговый CSS.

---

## JavaScript

Основной вход (Vite entry):

- `src/main.js`

Пример:

```js
import "./styles/main.scss";
import "./scripts/app.js";
```

### Подключение на страницах

Так как `vite.config.js` использует `root: "src/site"`, а `main.js` лежит в `src/`,
скрипт подключается через алиас:

```html
<script type="module" src="/@src/main.js"></script>
```

> Алиас `/@src` настроен в `vite.config.js`.

---

## Деплой

### Frontend (dist)

1. Собрать проект:

```bash
npm run build
```

2. Загрузить содержимое `dist/` в корень сайта (DocumentRoot), например:

- `public_html/` (на большинстве хостингов)
- или `/var/www/site/public/` (на VPS)

---

### Backend (PHP API — отдельно)

> PHP не кладём в `dist/`, деплоим отдельно.

Рекомендуемая структура на сервере:

```text
server-root/
  public_html/                     # сюда загружается dist/*
    index.html
    assets/                        # итоговые CSS/JS
    img/
    fonts/
    ...

  api/                             # php-эндпоинты (деплой отдельно)
    mail/send.php
    config/
      secrets.php                  # НЕ хранить в репозитории
```

Фронтенд может отправлять формы на:

- `POST /api/mail/send.php`

---

## Частые проблемы

### 1) Стили/JS не применяются

Проверь:

- что на страницах подключён скрипт:
  - `<script type="module" src="/@src/main.js"></script>`
- что в `src/main.js` есть импорты:
  - `import "./styles/main.scss";`
  - `import "./scripts/app.js";`

### 2) В `dist/` появляется лишняя папка `css`

Причина обычно в том, что в `public/` есть папка `css/`.
Vite копирует содержимое `public/` в `dist/` без обработки.

Если стили собираются из `src/styles/main.scss`, папка `public/css` не нужна.

### 3) Предупреждения Sass про `darken()`

Нужно заменить `darken()` на `sass:color`, например:

- `@use "sass:color";`
- `color.adjust($c, $lightness: -15%)`

---

## Команды

- `npm run dev` — разработка (render + vite)
- `npm run build` — production сборка в `dist/`
- `npm run preview` — локальный просмотр `dist/`
- `npm run render` — только рендер Nunjucks → HTML (`src/site`)
#   w e b - k i t c h e n - v i t e  
 
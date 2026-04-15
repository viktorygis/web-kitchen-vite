# web-kitchen-vite — Vite MPA + SCSS + JS

Многостраничный сайт (MPA) на **Vite** с HTML-шаблонами через `@@include()`.
Стили пишутся на **SCSS**, скрипты — модульные (**ESM**).
Отправка писем (если нужна) делается через **PHP API**, который деплоится **отдельно от `dist/`**.

---

## Содержание

- [Требования](#требования)
- [Установка](#установка)
- [Запуск в разработке](#запуск-в-разработке)
- [Сборка (production)](#сборка-production)
- [Просмотр сборки локально](#просмотр-сборки-локально)
- [Структура проекта](#структура-проекта)
- [HTML-шаблоны и партиалы](#html-шаблоны-и-партиалы)
- [Стили (SCSS)](#стили-scss)
- [JavaScript](#javascript)
- [Деплой](#деплой)
- [Частые проблемы](#частые-проблемы)

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

```bash
npm run dev
```

После запуска сайт доступен по адресу `http://localhost:5173/`.

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

## Структура проекта

```text
project-root/
  .gitignore
  package.json                          # зависимости и скрипты
  vite.config.js                        # конфигурация Vite (root: src)

  scripts/
    vite-plugin-html-include.js         # Vite-плагин для @@include()

  public/                               # статические ресурсы (шрифты, img)
    fonts/
    img/

  src/                                  # корень Vite (root: "src")
    index.html                          # главная страница

    # Страницы (по разделам)
    about-html/
      start-html.html
      tags-html.html
      ...
    about-css/
      start-css.html
      animation.html
      ...
    about-scss/
      start-scss.html
      ...
    about-js-teoria/
      ...
    about-js-praktika/
      ...
    about-design/
      ...
    about-vue/
      ...
    about-react/
      ...
    vscode.html

    # Общие части (партиалы) — не являются отдельными страницами
    partials/
      head.html       # <meta>, <title>, CDN-стили/скрипты
      header.html     # навигация
      footer.html     # подвал
      popup.html      # всплывающее окно (если есть)
      js.html         # основной <script type="module">

    # JavaScript
    main.js
    scripts/
      app.js
      modules/

    # Стили
    styles/
      main.scss
      ...
```

---

## HTML-шаблоны и партиалы

Вместо Nunjucks используется легковесный Vite-плагин (`scripts/vite-plugin-html-include.js`),
который обрабатывает директивы `@@include()` прямо в HTML-файлах.

### Синтаксис

```html
@@include('partials/head.html', {"title": "Заголовок страницы", "description": "Описание"})
@@include('../partials/header.html', {})
@@include('../partials/footer.html', {})
```

- Путь указывается **относительно текущего файла**.
- Переменные из второго аргумента (`{...}`) замещают плейсхолдеры `@@key` внутри партиала.

### Пример новой страницы

```html
<!DOCTYPE html>
<html lang="ru">
  @@include('../partials/head.html', {"title": "Моя страница", "description": "Описание"})
  <body>
    <div class="wrapper">
      @@include('../partials/header.html', {})
      <main class="page">
        <section class="section">
          <div class="container">
            <h1>Заголовок</h1>
          </div>
        </section>
      </main>
      @@include('../partials/footer.html', {})
    </div>
    @@include('../partials/popup.html', {})
    @@include('../partials/js.html', {})
  </body>
</html>
```

> Для корневых страниц (`src/index.html`) путь начинается с `'partials/...'`,
> для вложенных (`src/about-html/start-html.html`) — с `'../partials/...'`.

---

## Стили (SCSS)

Точка входа: `src/styles/main.scss`

Подключается через `src/main.js`:

```js
import "./styles/style.scss";
import "./scripts/app.js";
```

Vite компилирует SCSS автоматически при запуске `dev` или `build`.

---

## JavaScript

Основной вход: `src/main.js`

Подключается на всех страницах через партиал `src/partials/js.html`:

```html
<script type="module" src="/main.js"></script>
```

При сборке Vite собирает и хеширует JS-бандл в `dist/assets/`.

---

## Деплой

### Frontend (dist)

После `npm run build` папка `dist/` содержит весь статический сайт.
Просто скопируйте её содержимое на хостинг.

Страницы доступны по URL вида:
- `/` (index.html)
- `/about-html/start-html.html`
- `/about-css/animation.html`
- и т.д.

### Backend (PHP API — отдельно)

PHP-файлы **не** входят в `dist/`. Деплоятся отдельно.

---

## Частые проблемы

### Партиал не найден

Убедитесь, что путь в `@@include('...')` правильно указывает на `src/partials/`:
- Из `src/index.html`: `@@include('partials/head.html', {...})`
- Из `src/about-html/start-html.html`: `@@include('../partials/head.html', {...})`

### Страница не находится

Убедитесь, что HTML-файл лежит в `src/` (или поддиректории) и НЕ в директории `partials/`.
Vite автоматически обнаруживает все HTML-страницы в `src/`, исключая `src/partials/`.

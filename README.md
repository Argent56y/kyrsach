# MONOSPACE

Веб-сайт «Конфигуратор рабочего места программиста» для курсового проекта. Главная страница остается статичной и использует HTML5, CSS3, SCSS и обычный JavaScript, а отдельная страница `configurator.html` подключает React только для интерактивного ядра конфигуратора.

## Что реализовано

- адаптивная главная страница с каталогом, FAQ, промо-блоками и SVG-иконками;
- XML-каталог компонентов в `src/data/configurator.xml`;
- React-конфигуратор с выбором товаров, расчетом итоговой цены и проверкой совместимости;
- сохранение выбранной сборки в `localStorage`;
- независимость `index.html` от React-сборки.

## Документация

- `docs/project-explanation.md` — пояснение к проекту для размещения на GitHub;
- `docs/prototype.md` — текстовая спецификация прототипа интерфейса;
- `docs/hybrid-architecture.md` — описание гибридной архитектуры;
- `docs/testing.md` — локальная проверка и GitHub Actions;
- `docs/project-parts.md` — история выполнения частей.

## Публикация

Проект подготовлен к GitHub Pages. После push в ветку `main` workflow `GitHub Pages` собирает проект и публикует папку `dist`.

Ожидаемый адрес после включения Pages в репозитории:

```text
https://argent56y.github.io/kyrsach/
```

## Проверка

```bash
npm run check
npm run build
npm run dev
```

После запуска dev-сервера главная страница доступна по `/`, конфигуратор — по `/configurator.html`.

Дополнительные сведения о проекте находятся в `docs/project-explanation.md`, а проверка и GitHub Actions описаны в `docs/testing.md`.

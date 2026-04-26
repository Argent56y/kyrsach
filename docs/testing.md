# Проверка проекта

Часть 9 закрывает требования по тестированию и подготовке к GitHub.

## Локальная проверка

```bash
npm run check
```

Команда выполняет два шага:

- `scripts/check-project.js` проверяет обязательные файлы, XML-каталог, отсутствие черновых надписей и независимость `index.html` от React;
- `npm run build` проверяет production-сборку Vite.

## GitHub Actions

В `.github/workflows/super-linter.yml` настроен Super-Linter `v8.3.0`. Workflow запускается при `push`, `pull_request` и вручную через `workflow_dispatch`.

После публикации проекта на GitHub во вкладке Actions должен появиться workflow `Super-Linter`.

## Ручная HTML-проверка

Для требования W3C Markup Validation Service можно проверить страницы вручную:

- `index.html`;
- `configurator.html`;
- HTML-файлы из папки `dist/` после `npm run build`.

# Project Overview

## What is this project?

`next-demo` — это стартовое Next.js 16 приложение, демонстрирующее базовые возможности фреймворка: App Router, Server Components, динамические маршруты, API routes и работу с данными.

## Features

- **App Router** — файловая структура определяет маршрутизацию
- **Server Components по умолчанию** — страницы рендерятся на сервере
- **Динамические маршруты** — страница поста `/post/[id]`
- **API Routes** — бэкенд-эндпоинты `/api/posts`
- **Tailwind CSS v4** — утилитарный CSS с новой синтаксической моделью `@import "tailwindcss"`
- **Тёмная тема** — автоматическое переключение через `prefers-color-scheme`
- **TypeScript strict mode** — строгая типизация
- **Google Fonts** — Geist Sans + Geist Mono через `next/font/google`

## Pages

| Page             | Route        | Type     | Description                |
|------------------|--------------|----------|----------------------------|
| Home             | `/`          | Server   | Стартовая страница-шаблон  |
| Posts listing    | `/posts`     | Server   | Список всех постов         |
| Post detail      | `/post/[id]` | Server   | Детальный просмотр поста   |
| About            | `/about`     | Server   | Информационная страница    |
| Not Found        | —            | Server   | Кастомная страница 404     |

## Static data

Данные хранятся в `data/posts.json` — массив объектов с полями `id`, `title`, `date`, `text`.

```json
[
  { "id": "0001", "title": "first", "date": "01.01.2026 17:13:00", "text": "this is my first post" },
  { "id": "0002", "title": "second", "date": "02.01.2026 17:13:00", "text": "this is my second post" }
]
```

## Current status

Проект находится на начальной стадии — это минимальный блог-демо без базы данных, авторизации или i18n.

# Architecture

## Tech Stack

| Layer         | Technology                      |
|---------------|---------------------------------|
| Framework     | Next.js 16.2.4 (App Router)     |
| Runtime       | React 19.2.4                    |
| Language      | TypeScript 5 (strict)           |
| Styling       | Tailwind CSS v4                 |
| Fonts         | next/font/google (Geist)        |
| Linting       | ESLint 9 (flat config)          |
| PostCSS       | @tailwindcss/postcss            |

## Rendering model

Все страницы — **Server Components**. Данные загружаются на сервере через `async/await` в компонентах страниц. Нет ни одного `'use client'` компонента.

## Data flow

Двухуровневая модель доступа к данным:

```
┌─────────────────────────────────────────────────────────┐
│  Browser (page component)                               │
│                                                         │
│  PostsPage (Server Component)                          │
│    └─ calls lib/api.ts → getAllPosts()                 │
│           └─ fetch('http://localhost:3000/api/posts')   │
│                                                         │
│  PostPage (Server Component)                           │
│    └─ calls lib/api.ts → getPostById(id)               │
│           └─ fetch('http://localhost:3000/api/posts/:id')│
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  API Routes (server-side)                               │
│                                                         │
│  GET /api/posts        → lib/posts.ts → getAllPosts()  │
│  GET /api/posts/[id]   → lib/posts.ts → getPostById()  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Data source                                            │
│                                                         │
│  data/posts.json (imported with { type: 'json' })      │
└─────────────────────────────────────────────────────────┘
```

### Два слоя абстракции

| Файл          | Назначение                        | Кто использует                |
|---------------|-----------------------------------|-------------------------------|
| `lib/posts.ts`  | Прямое чтение JSON-файла         | API route handlers            |
| `lib/api.ts`    | HTTP-обёртка над own API routes  | Page components               |

**Почему так:** Page-компоненты (Server Components) вызывают `lib/api.ts`, который делает `fetch` к собственным API-роутам. API-роуты, в свою очередь, используют `lib/posts.ts` для прямого чтения файла с диска. Это создаёт HTTP-overhead даже внутри Server Components — паттерн, характерный для демонстрационных проектов.

## Routing

- **Статические:** `/`, `/posts`, `/about`
- **Динамические:** `/post/[id]` — параметр `id` доступен через `await params` (Next.js 16 pattern)
- **Catch-all 404:** `app/post/[id]/not-found.tsx` — scoped не найдена страница

## Next.js 16 specifics

- `params` в page props — это `Promise`, нужно `await params`
- `next.config.ts` — TypeScript-конфиг (ESM)
- Turbopack доступен через `next dev --turbopack`

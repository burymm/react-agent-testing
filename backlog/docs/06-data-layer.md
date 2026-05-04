# Data Layer

## Post type

```typescript
export interface Post {
  id: string;    // Unique identifier, e.g. "0001"
  title: string; // Post title
  date: string;  // Date string, format "DD.MM.YYYY HH:mm:ss"
  text: string;  // Post body content
}
```

## Data source: `data/posts.json`

Статический JSON-файл — единственный источник данных. Импортируется с `import assertions`:

```typescript
import postsData from '@/data/posts.json' with { type: 'json' };
```

## Direct access: `lib/posts.ts`

Низкоуровневый слой — читает JSON напрямую. Используется API route handlers.

| Function            | Returns          | Description          |
|---------------------|------------------|----------------------|
| `getAllPosts()`     | `Post[]`         | All posts            |
| `getPostById(id)`   | `Post \| undefined` | Single post by ID |

```typescript
import postsData from '@/data/posts.json' with { type: 'json' };

export function getAllPosts(): Post[] {
  return postsData as Post[];
}

export function getPostById(id: string): Post | undefined {
  return postsData.find((p: Post) => p.id === id);
}
```

## HTTP wrapper: `lib/api.ts`

Высокоуровневый слой — делает fetch-запросы к собственным API-роутам. Используется page components.

| Function            | Returns              | Fetches from          |
|---------------------|----------------------|-----------------------|
| `getAllPosts()`     | `Promise<Post[]>`    | `GET /api/posts`      |
| `getPostById(id)`   | `Promise<Post \| null>` | `GET /api/posts/:id` |

```typescript
async function getJson<T>(path: string): Promise<T | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}
```

**Environment variable:** `NEXT_PUBLIC_SITE_URL` — base URL для fetch (по умолчанию `http://localhost:3000`).

**Важно:** `cache: 'no-store'` означает, что данные никогда не кэшируются — каждый запрос идёт "в живую". Для Server Components в Next.js это означает, что данные будут перерендерены при каждом запросе страницы.

## Architecture trade-off

Текущий паттерн (page → lib/api.ts → fetch → API route → lib/posts.ts → JSON) создаёт лишний HTTP-hop даже внутри Server Components. Альтернативы:

1. **Прямой импорт в pages:** page → lib/posts.ts (без HTTP) — быстрее, проще
2. **Текущий:** page → lib/api.ts → fetch → API route — сохраняет разделение, но с оверхедом
3. **Server actions:** page → server action → lib/posts.ts — идиоматичный Next.js 16 подход

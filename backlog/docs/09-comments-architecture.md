# Comments Feature — Architecture

## Problem

К постам нужен функционал комментариев: отображение списка + форма добавления. Без БД (сейчас используется `data/posts.json`).

## Design decisions

### 1. Хранение данных

**Решение:** JSON-файл `data/comments.json`

**Почему:** Консистентно с текущим паттерном (`data/posts.json`). Нет внешней БД — нет смысла внедрять её только ради комментариев.

**Trade-offs:**

| Plus | Minus |
|------|-------|
| Простота, no dependencies | Не подходит для high-load |
| Консистентно с текущим кодом | Race conditions при concurrent writes |
| Работает локально без setup | Нет транзакций, индексов |

**Для продакшена:** при росте трафика → Supabase/PostgreSQL (что уже заложено в CLAUDE.md roadmap).

### 2. Компонентная модель

**Решение:** Гибридный подход — Server Component для отображения + Client Component для формы

```
<PostDetail page>  (Server Component)
  ├── <PostContent post={post} />  (Server Component — уже есть)
  └── <CommentsSection postId={id} />  (Server Component — обёртка)
       ├── <CommentList comments={comments} />  (Server Component)
       └── <CommentForm postId={id} />  (Client Component — "use client")
```

**Почему не весь `<CommentsSection>` — Client Component:**

| Approach | Server render | Form interactivity | SEO |
|----------|--------------|--------------------|-----|
| Всё Client | ❌ Flash при mount | ✅ | ❌ |
| Гибрид (наше) | ✅ Список сервером | ✅ Форма клиентом | ✅ Список индексируется |

Список комментариев рендерится на сервере (SEO, no flash). Форма — client component, потому что нужен `useState`, `useEffect`, event handlers.

### 3. Стратегия обновления списка

**Решение:** Optimistic update + fallback refetch

```
User clicks "Submit"
  → Client-side validation passes
  → Comment added to local state IMMEDIATELY (optimistic)
  → POST /api/comments fires in background
    → Success (201): keep optimistic comment, add server id
    → Error (500): remove optimistic comment, show error message
```

**Почему не просто refetch:**

- Refetch: 2 сетевых запроса (POST + GET) → пользователь ждёт ~300-800ms до появления комментария
- Optimistic: 1 запрос (POST) → пользователь видит результат мгновенно

**Почему не Server Actions:**

- Server Actions требуют `'use server'` directive — это Next.js 14+ feature
- В текущем проекте нет Server Actions, сохраняем консистентность с существующим паттерном (API routes + fetch)
- Можно рефакторить в Server Actions при следующем обновлении

### 4. Валидация формы

| Field | Required | Validation |
|-------|----------|------------|
| name  | Yes | `trim().length >= 1` |
| email | No | Если заполнён — regex `email` формат |
| text  | Yes | `trim().length >= 1` |

**Почему email необязательный:** Снижает friction для пользователя. Можно сделать обязательным позже.

**Валидация на клиенте:** HTML5 `required` + JS `onChange`/`onBlur` валидация каждого поля.

**Валидация на сервере:** API route обязательно валидирует `name` и `text` перед записью.

## Files to create/modify

### New files

| File | Purpose |
|------|---------|
| `data/comments.json` | Хранилище комментариев |
| `lib/comments.ts` | Direct data access (read/write JSON) |
| `app/api/posts/[id]/comments/route.ts` | GET — получить комментарии поста |
| `app/api/comments/route.ts` | POST — создать комментарий |
| `app/components/comment-list.tsx` | Server Component — список комментариев |
| `app/components/comment-form.tsx` | Client Component — форма добавления |
| `app/components/comments-section.tsx` | Server Component — обёртка, glue code |

### Modified files

| File | Change |
|------|--------|
| `lib/api.ts` | Добавить `getComments(postId)` и `createComment(data)` |
| `app/post/[id]/page.tsx` | Импортировать `<CommentsSection>` |

## Data model

```typescript
interface PostComment {
  id: string;       // UUID v4, e.g. "a1b2c3d4-..."
  postId: string;   // ID поста, e.g. "0001"
  name: string;     // Имя автора
  email: string;    // Email (опциональный, валидированный)
  text: string;     // Текст комментария
  createdAt: string; // ISO 8601, e.g. "2026-01-15T10:30:00.000Z"
}
```

## API endpoints

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/posts/:postId/comments` | Получить все комментарии поста |
| POST | `/api/comments` | Создать комментарий |

## File structure after changes

```
app/
├── api/
│   └── posts/
│       └── [id]/
│           ├── comments/
│           │   └── route.ts          ← NEW: GET comments
│           └── route.ts
├── comments/
│   └── route.ts                       ← NEW: POST create comment
├── components/
│   ├── comment-form.tsx               ← NEW: Client Component
│   ├── comment-list.tsx               ← NEW: Server Component
│   ├── comments-section.tsx           ← NEW: Server Component wrapper
│   └── navbar.tsx
└── post/
    └── [id]/
        ├── not-found.tsx
        └── page.tsx                   ← MODIFIED: add <CommentsSection>

data/
├── comments.json                      ← NEW
└── posts.json

lib/
├── api.ts                             ← MODIFIED: add comment functions
├── comments.ts                        ← NEW: direct data access
└── posts.ts
```

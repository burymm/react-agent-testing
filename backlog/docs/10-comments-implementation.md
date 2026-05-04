# Comments — Implementation Details

## 1. Data model & storage

### `data/comments.json`

```json
[]
```

Пустой массив при старте. Структура хранит все комментарии всех постов в одном файле.

**Почему один файл, а не `data/comments/{postId}.json`:**

- Проще читать все комментарии (один `import`)
- Фильтрация по `postId` — O(n) операция, для демо-проекта приемлемо
- Легче масштабировать при переходе на БД (одна таблица)

### `lib/comments.ts`

```typescript
import commentsData from '@/data/comments.json' with { type: 'json' };
import { v4 as uuidv4 } from 'uuid'; // или crypto.randomUUID()

export interface PostComment {
  id: string;
  postId: string;
  name: string;
  email: string;
  text: string;
  createdAt: string;
}

export function getCommentsByPostId(postId: string): PostComment[] {
  return (commentsData as PostComment[])
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addComment(comment: Omit<PostComment, 'id' | 'createdAt'>): PostComment {
  const newComment: PostComment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  // append to JSON file (writeFileSync)
  return newComment;
}
```

**Порядок сортировки:** новые комментарии сверху (`DESC` по `createdAt`).

**Генерация ID:** `crypto.randomUUID()` — встроен в Node.js, не требует внешних зависимостей.

---

## 2. API routes

### `GET /api/posts/[id]/comments`

**File:** `app/api/posts/[id]/comments/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getCommentsByPostId } from '@/lib/comments';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = getCommentsByPostId(id);
  return NextResponse.json(comments);
}
```

**Response 200:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "postId": "0001",
    "name": "Ivan",
    "email": "ivan@example.com",
    "text": "Отличная статья!",
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
]
```

### `POST /api/comments`

**File:** `app/api/comments/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { addComment } from '@/lib/comments';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postId, name, email, text } = body;

  // Server-side validation
  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: 'Name and text are required' },
      { status: 400 }
    );
  }

  // Email validation (if provided)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  const comment = addComment({ postId, name: name.trim(), email: email?.trim() || '', text: text.trim() });
  return NextResponse.json(comment, { status: 201 });
}
```

**Request body:**
```json
{ "postId": "0001", "name": "Ivan", "email": "ivan@example.com", "text": "Great post!" }
```

**Response 201:** Returns created comment with `id` and `createdAt`

**Response 400:** `{ "error": "Name and text are required" }`

---

## 3. Components

### `CommentList` — Server Component

**File:** `app/components/comment-list.tsx`

```tsx
import { PostComment } from '@/lib/comments';

interface CommentListProps {
  comments: PostComment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-zinc-500">No comments yet</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((c) => (
        <li key={c.id} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="mb-1 flex items-center gap-2">
            <strong className="font-medium">{c.name}</strong>
            {c.email && <span className="text-sm text-zinc-400">{c.email}</span>}
            <time className="ml-auto text-xs text-zinc-400">{formatDate(c.createdAt)}</time>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">{c.text}</p>
        </li>
      ))}
    </ul>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
```

### `CommentForm` — Client Component

**File:** `app/components/comment-form.tsx`

```tsx
'use client';

import { useState } from 'react';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

interface FormState {
  name: string;
  email: string;
  text: string;
}

interface Errors {
  name?: string;
  text?: string;
  email?: string;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [form, setForm] = useState<FormState>({ name: '', email: '', text: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.text.trim()) e.text = 'Text is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);

    // Optimistic update
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      postId,
      name: form.name.trim(),
      email: form.email.trim(),
      text: form.text.trim(),
      createdAt: new Date().toISOString(),
    };
    onCommentAdded(optimisticComment);
    setForm({ name: '', email: '', text: '' });

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, ...form }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const saved = await res.json();
      // Replace optimistic with real server data
      onCommentAdded({ ...optimisticComment, id: saved.id, createdAt: saved.createdAt });
    } catch {
      // Revert optimistic update
      onCommentAdded({ ...optimisticComment, _deleted: true });
      setServerError('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {serverError && <p className="text-red-500">{serverError}</p>}
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputClass(errors.name)}
      />
      {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}

      <input
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputClass(errors.email)}
      />
      {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}

      <textarea
        placeholder="Comment"
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        rows={3}
        className={inputClass(errors.text)}
      />
      {errors.text && <span className="text-sm text-red-500">{errors.text}</span>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Add comment'}
      </button>
    </form>
  );
}
```

### `CommentsSection` — Server Component (glue)

**File:** `app/components/comments-section.tsx`

```tsx
import { getAllPostsComments, getCommentsByPostId } from '@/lib/comments';
import { CommentList } from './comment-list';
import { CommentForm } from './comment-form';

interface CommentsSectionProps {
  postId: string;
}

export async function CommentsSection({ postId }: CommentsSectionProps) {
  const comments = getCommentsByPostId(postId);

  return (
    <section className="mt-12 flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Comments</h2>
      <CommentList comments={comments} />
      <CommentForm postId={postId} />
    </section>
  );
}
```

---

## 4. Integration into post page

### `app/post/[id]/page.tsx` (modified)

```tsx
import { getPostById } from '@/lib/api';
import NotFound from '@/app/post/[id]/not-found';
import { CommentsSection } from '@/app/components/comments-section';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) return <NotFound />;

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-3xl min-w-2xl px-16 py-32">
        <h1 className="mb-2 text-3xl font-semibold uppercase font-bold">{post.title}</h1>
        <p className="mb-6 text-sm text-zinc-500">{post.date}</p>
        <p className="text-zinc-600 dark:text-zinc-400">{post.text}</p>

        <CommentsSection postId={id} />
      </div>
    </div>
  );
}
```

**Изменения:** +2 строки импорта, +1 JSX-элемент `<CommentsSection />` под контентом поста.

---

## 5. Optimistic update mechanism

Поскольку `<CommentForm>` — client component, а `<CommentList>` — server component, нужна связь между ними.

**Проблема:** Server Component (`CommentList`) не может получить state от Client Component (`CommentForm`).

**Решения:**

| Approach | Описание | Когда использовать |
|----------|----------|-------------------|
| **Context + State lifting** | Поднять state в общий Client wrapper | Если весь блок — Client |
| **Refetch после POST** | После успешного POST делаем `location.reload()` или refetch | Простой вариант |
| **Window event + re-render** | Dispatch custom event, Server Component не реагирует | ❌ Не сработает |
| **Refetch в form** | Form делает fetch списка после POST, обновляет свой локальный state | ✅ Выбираем |

**Выбранный подход:** Form держит собственный список комментариев в `useState`, изначально загружает их через `useEffect`. После POST обновляет свой state (optimistic + reconcile). Список рендерится внутри client-обёртки.

Это значит, что `CommentList` тоже становится частью client component, а Server Component отвечает только за initial data props. Пересмотренная архитектура:

```
<CommentsSection postId={id}>        — Server Component
  preload: fetch comments via lib/comments
  ↓ props: initialComments
  <CommentsClient                     — Client Component ("use client")
    initialComments={initialComments}
    postId={id}
  />
```

`CommentsClient` управляет всем state: список комментариев, optimistic updates, форма.

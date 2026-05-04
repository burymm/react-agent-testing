# API Routes

## GET /api/posts

**File:** `app/api/posts/route.ts`

Возвращает массив всех постов из `data/posts.json`.

**Response:** `200 OK`
```json
[
  { "id": "0001", "title": "first", "date": "01.01.2026 17:13:00", "text": "this is my first post" },
  { "id": "0002", "title": "second", "date": "02.01.2026 17:13:00", "text": "this is my second post" }
]
```

**Implementation:**
```typescript
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = getAllPosts();
  return NextResponse.json(posts);
}
```

---

## GET /api/posts/[id]

**File:** `app/api/posts/[id]/route.ts`

Возвращает один пост по ID из `data/posts.json`.

**Parameters:**
| Param | Type   | Description          |
|-------|--------|----------------------|
| id    | string | Post ID (e.g. "0001") |

**Response:** `200 OK`
```json
{ "id": "0001", "title": "first", "date": "01.01.2026 17:13:00", "text": "this is my first post" }
```

**Response:** `404 Not Found`
```json
{ "error": "Post not found" }
```

**Implementation:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPostById } from '@/lib/posts';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}
```

**Next.js 16 note:** `params` — это `Promise<{ id: string }>`, требуется `await params`.

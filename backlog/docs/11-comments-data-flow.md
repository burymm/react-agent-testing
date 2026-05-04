# Comments — Data Flow & Component Tree

## Component hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│  app/post/[id]/page.tsx              (Server Component)      │
│  • async GET / post data via lib/api.ts                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  <PostContent> — title, date, text                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  <CommentsSection postId={id}>  (Server Component)     │  │
│  │  • reads comments from data/comments.json              │  │
│  │  • passes initialComments to client wrapper            │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  <CommentsClient>  (Client Component)            │  │  │
│  │  │  "use client"                                    │  │  │
│  │  │                                                  │  │  │
│  │  │  state: comments[] = initialComments             │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌───────────────────────┐                      │  │  │
│  │  │  │ <CommentList>         │                      │  │  │
│  │  │  │ renders comments[]   │                      │  │  │
│  │  │  └───────────────────────┘                      │  │  │
│  │  │                                                  │  │  │
│  │  │  ┌───────────────────────┐                      │  │  │
│  │  │  │ <CommentForm>         │                      │  │  │
│  │  │  │ POST /api/comments    │                      │  │  │
│  │  │  │ optimistic update     │                      │  │  │
│  │  │  │ onCommentAdded(cb)    │                      │  │  │
│  │  │  └───────────────────────┘                      │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Data flow — загрузка комментариев

```
Browser: /post/0001
  │
  ├─ Server: page.tsx
  │   └─ lib/api.ts → getPostById("0001")
  │       └─ fetch("/api/posts/0001")
  │           └─ lib/posts.ts → getPostById("0001")
  │               └─ data/posts.json
  │
  └─ Server: CommentsSection
      └─ lib/comments.ts → getCommentsByPostId("0001")
          └─ data/comments.json
              └─ pass initialComments[] → CommentsClient
                  └─ Client renders CommentList
```

## Data flow — добавление комментария

```
User fills form & clicks "Add comment"
  │
  ├─ 1. Client validation
  │   ├─ name: trim() >= 1 ? ✅
  │   ├─ text: trim() >= 1 ? ✅
  │   └─ email: empty OR valid pattern ? ✅
  │
  ├─ 2. Optimistic update
  │   └─ comments.push({ id: "temp-1707958200000", ...comment, _optimistic: true })
  │   └─ UI: comment appears instantly
  │
  ├─ 3. POST /api/comments
  │   └─ body: { postId: "0001", name: "...", email: "...", text: "..." }
  │       │
  │       ├─ 201 Created → response: { id: "uuid", createdAt: "..." }
  │       │   └─ Reconcile: replace temp-id with real id
  │       │   └─ UI: comment stays (updated with server id)
  │       │
  │       └─ 400/500 Error
  │           └─ Remove optimistic comment from state
  │           └─ Show error message
  │           └─ UI: comment disappears, error shown
  │
  └─ 4. Form reset
      └─ name: "", email: "", text: ""
```

## State lifecycle

```
┌─ CommentsClient state ─────────────────────────────────────┐
│                                                             │
│  initial: comments[] = props.initialComments (server data) │
│                                                             │
│  + optimistic:  push({ id: temp-*, text: "...", _opt: true })│
│  - reconcile:   replace temp-* with server.id              │
│  - revert:      remove item with temp-* on error           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Server-side validation (defense in depth)

Даже с клиентской валидацией, сервер обязан валидировать:

```
POST /api/comments
  │
  ├─ Parse JSON body
  ├─ Validate: name present && non-empty → 400 if not
  ├─ Validate: text present && non-empty → 400 if not
  ├─ Validate: email pattern (if provided) → 400 if bad
  ├─ Write to data/comments.json
  └─ Return 201 with created comment
```

## Error scenarios

| Scenario | Client behavior | Server response |
|----------|----------------|-----------------|
| Network error | Revert optimistic, show error | — |
| Invalid data | Revert optimistic, show error | 400 + error message |
| Server crash | Revert optimistic, show error | 500 or timeout |
| Duplicate submit | `submitting` state prevents double-click | — |

## Security considerations

- **Rate limiting:** Не реализовано. Для демо — приемлемо. Для продакшена нужен middleware limiter
- **XSS:** Текст комментария рендерится как `{comment.text}` — React автоматически экранирует. Опасно только если рендерить через `dangerouslySetInnerHTML`
- **CSRF:** Для GET API — не критично. Для POST — нужен токен в продакшене
- **Input sanitization:** `.trim()` на клиенте и сервере. Длина текста не ограничена — можно добавить `maxLength`

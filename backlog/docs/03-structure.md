# Project Structure

```
next-demo/
├── app/                          # App Router (root-level, not src/)
│   ├── about/
│   │   └── page.tsx              # /about — About page
│   ├── api/
│   │   └── posts/
│   │       ├── route.ts          # GET /api/posts — list all posts
│   │       └── [id]/
│   │           └── route.ts      # GET /api/posts/:id — single post
│   ├── components/
│   │   └── navbar.tsx            # Shared navigation bar
│   ├── post/
│   │   └── [id]/
│   │       ├── page.tsx          # /post/:id — post detail
│   │       └── not-found.tsx     # 404 for missing posts
│   ├── posts/
│   │   └── page.tsx              # /posts — posts listing
│   ├── favicon.ico               # Favicon
│   ├── globals.css               # Global styles (Tailwind v4)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # / — home page
├── data/
│   └── posts.json                # Static JSON data (2 posts)
├── lib/
│   ├── api.ts                    # Client-facing API wrapper (HTTP fetch)
│   └── posts.ts                  # Direct data access (JSON import)
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── backlog/
│   └── docs/                     # Project documentation (this)
├── eslint.config.mjs             # ESLint 9 flat config
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS + Tailwind config
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Dependency lock file
├── AGENTS.md                     # AI agent instructions
├── CLAUDE.md                     # Claude Code instructions
└── README.md                     # Standard Next.js README
```

## Key directories

| Directory       | Purpose                                |
|-----------------|----------------------------------------|
| `app/`          | App Router — pages, layouts, API routes |
| `app/components/` | Shared React components (not src/)   |
| `data/`         | Static JSON data files                 |
| `lib/`          | Business logic, data access layers     |
| `public/`       | Static files served at `/`             |
| `backlog/docs/` | Project documentation                  |

## Notes

- В отличие от стандартных шаблонов, `app/` находится в корне проекта, а не в `src/`
- Пути `@/*` маппятся на `"./*"` (корень проекта) — см. tsconfig.json
- Нет директории `src/` — всё лежит в корне

CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Swiss Guide - Next.js 15 tourism guide application for Switzerland with multilingual support (next-intl), Supabase backend, and admin panel for content management.

## Commands

```bash
npm run dev              # Start dev server (Turbopack, --no-experimental-webstorage)
npm run build            # Production build (4GB memory limit, ESLINT_NO_DEV_ERRORS=true)
npm run start            # Start production server
npm run lint             # Run ESLint

# E2E Tests (Playwright)
#npm run test:e2e         # Run headless tests
#npm run test:e2e:ui      # Run with UI
#npm run test:e2e:headed  # Run headed tests
#npm run test:e2e:install # Install Playwright browsers
```

## Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router) with Turbopack
- **React:** 19 with Server Components by default
- **Language:** TypeScript (strict mode, paths: @/* → src/*)
- **Styling:** SCSS Modules (`.module.scss`) + `clsx` for conditional classes
- **i18n:** next-intl (locales: ['en'], default: 'en', localePrefix: 'always')
- **Database:** Supabase (SSR + client)
- **Forms:** Custom hooks (useMailForm pattern)
- **Sliders:** Swiper

### Directory Structure
```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/             # i18n routes (tours, blogs, reviews, admin)
│   ├── api/                  # API routes (/api/content, /api/admin/*, /api/mail)
│   └── sitemap.ts            # Dynamic sitemap generation
├── components/
│   ├── layout/               # Layout (Navbar, Footer, MainHeader, Navigation)
│   ├── ui/                   # UI primitives (Button, Modal, SafeImage)
│   ├── _sliders/             # Swiper sliders (tours, blog, reviews, tour photos)
│   └── _pages/               # Page-level components
├── lib/
│   ├── legacy/supabase/      # Supabase client, server, middleware, DB helpers
│   └── images.ts             # Image helpers (getPrimaryImg)
├── hooks/                    # Custom hooks (useMailForm)
├── contexts/                 # React Context (ModalContext)
├── assets/
│   ├── types/                # TypeScript types
│   ├── app-data/             # Static data (tours, blogs, reviews)
│   └── constants.ts          # Constants (STORAGE_URL)
└── styles/                   # Global SCSS (variables, mixins, reset)
```

### Key Patterns

**Server vs Client Components:**
- Server Components by default
- Use `'use client'` only for: event handlers, useState/useEffect, browser APIs
- Layouts and pages are Server Components; interactive wrappers are Client (e.g., `*PageClient.tsx`)

**Data Flow:**
1. Supabase RPC `get_grouped_by_type` → `/api/content` → Client-side fetch in useEffect
2. Admin CRUD operations → Supabase functions in `@/lib/legacy/supabase/db`
3. Form submissions → `/api/*` routes → server-side processing

**State Management:**
- `useContext` for shared state (DatabaseProvider, ModalContext)
- Custom hooks for complex logic (useMailForm, useDatabase)
- Avoid prop drilling beyond 2-3 levels

**Image Handling:**
- Use `next/image` with `fill` prop
- Images stored in Supabase Storage bucket `tours`
- Helper: `getPrimaryImg(files)` from `@/lib/images`
- Constant: `STORAGE_URL` from `@/assets/constants`

**Styling:**
- SCSS Modules: `import classes from './Component.module.scss'`
- Conditional classes: `import cx from 'clsx'`
- Global styles: `@import '@/styles/variables'` for shared variables/mixins

### Localization (next-intl)

```tsx
// i18n/routing.ts - defines locales
// i18n/navigation.ts - exports wrapped navigation APIs
// src/middleware.ts - redirects / → /en, handles www redirect
```

All routes are prefixed: `/en/tours`, `/en/blogs`, etc. Root `/` redirects 301 to `/en`.

[//]: # (### Admin Panel)

[//]: # ()
[//]: # (- Route: `/[locale]/admin`)

[//]: # (- Components: `src/components/admin/`)

[//]: # (- Authentication: JWT-based &#40;`/api/admin/auth`&#41;)

[//]: # (- CRUD: Tours, Blogs, Reviews &#40;Supabase&#41;)

[//]: # (- File upload: `/api/admin/upload`)

### SEO

- Dynamic sitemap generation (`src/app/sitemap.ts`)
- StructuredData component for JSON-LD
- Metadata via next-intl metadata helpers

## Environment Variables

Required for local dev (copy `.env.vercel`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
JWT_SECRET=              # Admin auth
SMTP_USER=               # Yandex mail
SMTP_PASS=
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
EMAILS_FOR_FEEDBACK=
```

## Code Style

- **Components:** Functional with hooks, TypeScript interfaces for props
- **Naming:** PascalCase (components), camelCase (hooks/utils), kebab-case (SCSS)
- **No `any`:** Use `unknown` if truly unknown, define interfaces
- **No inline styles:** SCSS Modules only (except dynamic values)
- **Error handling:** try/catch with user-friendly messages

## Important Paths

- Supabase client: `@/lib/legacy/supabase/api-client`
- Supabase CRUD: `@/lib/legacy/supabase/db`
- Types: `@/assets/types/types`
- Custom hooks: `@/hooks/`
- Constants: `@/assets/constants`@AGENTS.md

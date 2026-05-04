# Homepage Redesign — Architecture

## Problem

The current homepage (`/`) is the default create-next-app template with:
- "To get started, edit the page.tsx file" heading
- "Deploy Now" / "Documentation" buttons linking to Vercel/Next.js
- Next.js and Vercel logos

It conveys nothing about this project or its origin.

## New Homepage — What it should say

The homepage should communicate:

1. **Project purpose** — what is `next-demo`
2. **AI-first authorship** — development done by Claude agent (Anthropic)
3. **Team lead** — Mikalai Bury (burymm)
4. **Links to sections** — Posts, About navigation

## Visual Concept

A clean, minimal landing page — consistent with existing Tailwind/zinc palette:

```
┌─────────────────────────────────────────────┐
│  [Navbar: Main | Posts | About]             │
├─────────────────────────────────────────────┤
│                                             │
│           (centered, max-w-3xl)             │
│                                             │
│      🤖  (or simple icon)                   │
│                                             │
│   Built by Claude                           │
│   (an AI agent by Anthropic)                │
│                                             │
│   next-demo — a Next.js 16 blog            │
│   with JSONPlaceholder integration          │
│                                             │
│   ┌──────────┐  ┌──────────┐                │
│   │  Posts   │  │  About   │                │
│   └──────────┘  └──────────┘                │
│                                             │
│   ─────────────────────────────────────     │
│   Team lead: Mikalai Bury (burymm)         │
│   LLM: Claude (Anthropic)                  │
│                                             │
└─────────────────────────────────────────────┘
```

## Design Decisions

### Why not just "about" text?

This project is a demo of AI-human collaboration. The homepage should immediately convey:
- **What** — a Next.js blog
- **Who built it** — Claude AI agent
- **Who led it** — human team lead

### Why "Built by Claude" not "Made with AI"?

"Built by Claude" is specific and honest. It names the tool, not a vague category. Users can then explore what Claude means.

### LLM mention

We explicitly state the LLM used: **Claude (Anthropic)**. This isn't a generic "AI" claim — it's an attribution.

### Palette

Reuses existing Tailwind/zinc utility classes — no new CSS. Consistent with `/posts` and `/about` pages.

## Component Tree

```
/home (Server Component)
  ├── Hero section — title + subtitle
  ├── CTA buttons → /posts, /about
  └── Credits section — team lead + LLM info
```

No client interactivity needed — pure Server Component.

## Files to Change

| File | Change |
|------|--------|
| `app/page.tsx` | Full rewrite of the template |
| `app/layout.tsx` | Update `metadata` (title, description) |

## Files to Create

| File | Purpose |
|------|---------|
| `backlog/docs/12-homepage-redesign.md` | This document |

## Test Plan for Task Creation

Use this checklist as acceptance criteria for implementation and review.

### Functional Tests

- [ ] Opening `/` shows the new homepage content instead of the default create-next-app template.
- [ ] The hero section contains attribution text: `Built by Claude` and `(an AI agent by Anthropic)`.
- [ ] The page describes the project as `next-demo` and mentions it is a Next.js 16 blog with JSONPlaceholder integration.
- [ ] A visible team lead attribution is present: `Mikalai Bury (burymm)`.
- [ ] Two CTA links/buttons exist: `Posts` and `About`.
- [ ] `Posts` navigates to `/posts`.
- [ ] `About` navigates to `/about`.

### Layout and Style Tests

- [ ] Content is centered and visually compact (hero + CTA + credits), matching the minimal landing concept.
- [ ] Navbar includes navigation links `Main`, `Posts`, `About` (if global navbar is present in layout).
- [ ] Page styling uses existing Tailwind/zinc utilities; no dedicated CSS file is introduced for this task.
- [ ] Homepage remains responsive on mobile viewport (320px+): no clipped text, overlapping blocks, or horizontal scrolling.

### Architecture and Code Tests

- [ ] `app/page.tsx` is implemented as a Server Component (no `'use client'`, no client-only hooks).
- [ ] No unnecessary client interactivity or browser-only APIs are added.
- [ ] `app/layout.tsx` metadata is updated to reflect the new homepage purpose (title + description).

### Regression / Cleanup Tests

- [ ] Default template artifacts are fully removed: Next.js/Vercel logos and `Deploy Now`/`Documentation` actions are absent from `/`.
- [ ] `/posts` and `/about` routes still open successfully after homepage changes.
- [ ] `npm run lint` passes without new errors related to homepage/layout changes.

### Optional E2E Scenarios (Playwright)

- [ ] Visit `/`, verify hero text and team/LLM attribution are visible.
- [ ] Click `Posts`, assert URL is `/posts`.
- [ ] Navigate back, click `About`, assert URL is `/about`.

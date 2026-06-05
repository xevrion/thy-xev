# Migration Plan: React + Vite → Next.js (App Router)

> Written 2026-06-05. Based on analysis of current thy-xev codebase + inspiration from anishshobithps.com.

---

## Current State (What We Have)

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React 19 + Vite 7 + React Router v7 | Client-side only, CSR |
| Styling | Tailwind CSS v4 + CSS variables | Already good, minimal changes needed |
| Blog | 18 `.md` files in `src/posts/`, parsed with `import.meta.glob` | Plain markdown, custom frontmatter |
| Markdown render | `react-markdown` + `rehype-highlight` + `remarkGfm` | Works, but no MDX |
| Backend | Express.js on port 3001 | Spotify, WakaTime, GitHub, view counters |
| Routing | React Router v7, all routes in `App.tsx` | 8 routes total |
| Animations | GSAP SplitText + Framer Motion + View Transition API | Heavy, must keep |
| DevOps | Docker (2 containers: Nginx frontend + Node backend) on DigitalOcean | GHCR images, 3 GitHub Actions |
| SEO | react-head for meta tags, static `sitemap.xml`, JSON-LD | Weak (CSR, no real SSR) |

---

## Why Migrate to Next.js

### Problems with the current setup

1. **CSR = bad SEO** — React renders on the client. Crawlers see an empty HTML shell. Blog posts are invisible to Google.
2. **Blog can't grow properly** — No MDX (can't embed React components in posts), no reading time from AST, no dynamic OG images per post, no table of contents.
3. **Static sitemap** — `public/sitemap.xml` is manually maintained. Every new post requires updating it manually.
4. **Meta tags via react-head** — Works but runs client-side. OG scrapers (Slack, Twitter, Discord) hit the HTML before JS runs and get blank tags.
5. **View counter hack** — A whole Express server just to count views + proxy APIs. Next.js API routes + edge functions eliminate the need for this.
6. **Two containers** — Frontend Nginx container + Backend Node container. Next.js collapses this into one.

### What Next.js gives us

- **SSG for blog posts** — Pre-rendered HTML at build time. Perfect SEO, fast first load.
- **MDX** — Embed React components inside posts (interactive demos, callouts, tooltips).
- **Dynamic OG images** — `/og` route generates per-page social preview images.
- **Auto sitemap** — `sitemap.ts` exports all routes including every blog post.
- **Server Actions** — Replace the Express view counter with 5 lines of server code.
- **API Routes** — Spotify, WakaTime, GitHub proxied inside the same process.
- **`next/image`** — Automatic WebP conversion, lazy loading, no layout shift.
- **One container** — Next.js replaces both the Vite frontend and Nginx.

---

## What to Keep (Zero Changes Needed)

- All CSS variables and color tokens — paste directly into `app/globals.css`
- Tailwind v4 config — compatible as-is
- All font imports (Space Grotesk, Inter, Caveat)
- All 18 `.md` post files — copy into `content/blog/`
- `constants/projects.json` and `constants/data.json`
- All public assets (`/public` folder)
- The Express backend — keep it running in its own container (it handles Spotify OAuth which is stateful)
- All animation libraries (GSAP, Framer Motion) — work fine with `"use client"` directive
- Docker infrastructure — just update the frontend image to Next.js

---

## What Changes

### Routing
| Old (React Router `App.tsx`) | New (Next.js file) |
|---|---|
| `/` | `app/page.tsx` |
| `/about` | `app/about/page.tsx` |
| `/posts` | `app/posts/page.tsx` |
| `/posts/:slug` | `app/posts/[slug]/page.tsx` |
| `/projects` | `app/projects/page.tsx` |
| `/contact` | `app/contact/page.tsx` |
| `/resume` | `app/resume/page.tsx` |
| `/now` | `app/now/page.tsx` |
| — | `app/og/route.tsx` (new: dynamic OG images) |
| — | `app/sitemap.ts` (new: auto-generated) |
| — | `app/robots.ts` (new: replaces `public/robots.txt`) |

### Blog Post Format (upgrade from `.md` → `.mdx`)

**Current frontmatter:**
```md
# Post Title
Date: 25-05-2025
Tags: react, typescript, vite

Content here...
```

**New frontmatter (ISO dates, YAML standard):**
```yaml
---
title: "Post Title"
description: "Short summary for SEO and cards"
date: "2025-05-25"
tags: ["react", "typescript", "vite"]
---

Content here with optional React components...
```

The title moves from being the first line of content into frontmatter. This is a one-time conversion on all 18 posts.

### Components → `"use client"` directive

Every component that uses:
- `useState`, `useEffect`, `useRef`
- Framer Motion
- GSAP
- Event listeners
- `localStorage`

...needs `"use client"` at the top. Everything else can be a Server Component.

**Forced client components:**
- `NavBar.tsx` (theme toggle, mobile menu, weather, Discord status)
- `SpotifyWidget.tsx`
- `WakatimeWidget.tsx`
- `GithubContributions.tsx`
- `CommandPalette.tsx`
- `ThemeToggle.tsx`
- `PageWrapper.tsx` (Framer Motion)
- `PostPage.tsx` (interactive elements)
- `reactbits/splittext.tsx` (GSAP)
- `LinkPreview.tsx` (hover state)

**Can be Server Components:**
- `Skills.tsx`
- `Socials.tsx`
- `Projects.tsx` (static JSON data)
- Static parts of `About.tsx`

### Environment Variables

| Old | New |
|---|---|
| `VITE_API_URL` | `NEXT_PUBLIC_API_URL` |
| `VITE_OPENWEATHER_KEY` | `NEXT_PUBLIC_OPENWEATHER_KEY` |

Server-only vars (Spotify, WakaTime, GitHub tokens) move to Next.js API routes and no longer need `NEXT_PUBLIC_` prefix — they stay private on the server.

### Docker

**Current:** 2 containers (Nginx + Node backend)
**After:** 2 containers (Next.js + Node backend)

The Nginx container is replaced with Next.js running `next start` on port 3000. The `nginx.conf` is gone. Next.js handles its own routing and static file serving.

---

## Migration Phases

### Phase 1 — Scaffold & Config
- `npx create-next-app@latest thy-xev-next --typescript --tailwind --app --src-dir --no-eslint`
- Copy over `globals.css` (colors, fonts, custom classes)
- Copy `constants/`, `public/`, `src/assets/`
- Set up `next.config.ts` with security headers + rewrites
- Configure `next/font` for Space Grotesk + Inter + Caveat

### Phase 2 — Layout & Navigation
- Migrate `NavBar.tsx` → `"use client"` component
- Create `app/layout.tsx` with theme provider, font classes, and NavBar
- Migrate `ThemeToggle.tsx` with `next-themes`
- Migrate `PageWrapper.tsx` (Framer Motion layout animations)
- Test dark/light toggle + page transitions

### Phase 3 — Static Pages
Migrate these in order (simplest first):
1. `/contact` — just links, pure server component
2. `/about` — Skills component + bio
3. `/projects` — JSON data, mostly static
4. `/resume` — static page
5. `/now` — static text
6. `/` (Hero) — most complex (all the widgets), save for last in this phase

### Phase 4 — Blog System
- Install: `next-mdx-remote` or `fumadocs-mdx` (Anish uses Fumadocs — worth considering)
- Convert all 18 `.md` posts to `.mdx` with updated frontmatter
- Build `app/posts/page.tsx` — listing with search (keep Fuse.js) + tag filter
- Build `app/posts/[slug]/page.tsx` — single post with `generateStaticParams()`
- Add reading time remark plugin (walk AST, skip code blocks, 200 wpm)
- Add Shiki syntax highlighting (replace highlight.js) — light/dark themes
- Add `generateMetadata()` per post (title, description, OG tags)
- Auto-generate table of contents from headings

### Phase 5 — API Routes (replace Express for non-OAuth endpoints)
Move these to `app/api/`:
- `/api/wakatime/daily` → proxies WakaTime
- `/api/wakatime/languages` → language breakdown
- `/api/github/contributions` → GitHub GraphQL proxy
- `/api/views/[slug]` → view counter (replace file-based with edge KV or keep file)
- `/api/discord` → Lanyard proxy (or call directly from client)

**Keep Express for:** Spotify OAuth (needs redirect callback, session state — easier to leave in its own service)

### Phase 6 — Dynamic OG Images
- Create `app/og/route.tsx`
- Generate per-page dark card: title, description, tags, date
- Wire up in `generateMetadata()` for all pages and posts
- Replace static `public/meta.png`

### Phase 7 — SEO & Metadata
- Delete `public/sitemap.xml` and `public/robots.txt`
- Create `app/sitemap.ts` (auto-includes all blog posts)
- Create `app/robots.ts`
- Audit JSON-LD — we already have it, just port to server components
- Verify all OG tags render in source HTML (not JS-injected)

### Phase 8 — Docker Update
- Update `Dockerfile` frontend stage: remove Nginx, add `next start`
- Update `docker-compose.yml` frontend service
- Update GitHub Actions workflow for new build process
- Test full stack locally with `docker compose up`

### Phase 9 — Polish & Parity Check
- Command palette (`Cmd+K`) — migrate with `"use client"`
- Custom cursor (Cursorify) — may need `"use client"` wrapper
- GSAP SplitText — ensure it only runs after mount (`useEffect`)
- Locomotive scroll — check compatibility with App Router
- View transitions for theme toggle — works in Next.js
- Check all Framer Motion page transitions
- Run Lighthouse before/after comparison

---

## Risky Parts to Watch

### GSAP SplitText
GSAP needs the DOM. In Next.js SSR, any GSAP initialization must be inside `useEffect`. The current `reactbits/splittext.tsx` probably runs on mount already, but double-check it doesn't run at module level.

### Locomotive Scroll
`locomotive-scroll` v5 (beta) + React 19 + Next.js App Router can conflict. May need to wrap in a `"use client"` provider and initialize after hydration. Alternatively, replace with native CSS scroll-driven animations (zero dependency).

### Framer Motion Page Transitions
App Router doesn't have the same exit-animation lifecycle as React Router. The `AnimatePresence` pattern needs to be rethought. Solution: wrap `{children}` in a layout-level `AnimatePresence` with a keyed inner div.

### View Counter (File-based)
`views.json` in the Express server works fine. If we move view counting to Next.js API routes, we need a persistent store (can't write to filesystem on Vercel/ephemeral deploys, but we're on our own VPS so it's fine).

### `import.meta.glob` (Vite-specific)
The current `src/utils/posts.ts` uses `import.meta.glob()` which is Vite-only. In Next.js, replace with `fs.readdir` + `fs.readFile` in a server utility, or use `next-mdx-remote` which handles this for you.

---

## New Features to Add During Migration

These are from `INSPIRATION.md` and make sense to build in alongside the migration rather than after:

1. **Dynamic OG images** — already in Phase 6, build it properly
2. **MDX components** — custom `<Callout>`, `<Note>`, code blocks with filename headers
3. **Reading progress** — SVG circle or scroll-driven CSS (zero JS version)
4. **Post description in frontmatter** — used for SEO + card previews
5. **Better post cards** — add description + reading time to cards on `/posts`
6. **Auto sitemap** — replaces manual `public/sitemap.xml`

---

## What We're NOT Doing (Yet)

- **Guestbook** — needs DB + auth (Clerk), save for after migration
- **Blog comments** — same, needs DB
- **Mood reactions** — same
- **Fumadocs** — powerful but heavy; we'll start with `next-mdx-remote`, migrate to Fumadocs later if needed
- **Neon DB** — no DB until we build guestbook/comments

---

## Files to Delete After Migration

```
src/App.tsx              # replaced by file-based routing
src/main.tsx             # replaced by app/layout.tsx
vite.config.ts           # gone
index.html               # gone (Next.js handles this)
nginx.conf               # gone (Next.js serves itself)
tsconfig.app.json        # merge into tsconfig.json
start.bat                # Windows dev script, replace with npm commands
```

---

## Estimated Effort

| Phase | Complexity | Est. Time |
|---|---|---|
| 1. Scaffold & Config | Low | 1–2 hrs |
| 2. Layout & Navigation | Medium | 2–3 hrs |
| 3. Static Pages | Low–Medium | 3–4 hrs |
| 4. Blog System | High | 4–6 hrs |
| 5. API Routes | Medium | 2–3 hrs |
| 6. OG Images | Medium | 2–3 hrs |
| 7. SEO & Metadata | Low | 1–2 hrs |
| 8. Docker Update | Low–Medium | 1–2 hrs |
| 9. Polish & Parity | Medium | 2–4 hrs |
| **Total** | | **~18–29 hrs** |

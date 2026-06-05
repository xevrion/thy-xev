# Migration Log: React + Vite → Next.js (App Router)

> Started 2026-06-05. Tracking what's done, what's in progress, what's left.

---

## Status Overview

| Phase | Status |
|---|---|
| Scaffold & Config | ✅ Done |
| Layout & Navigation | ✅ Done |
| Static Pages | ✅ Done |
| Blog System (Fumadocs) | ✅ Done |
| Font fix | ✅ Done |
| API Routes (move Express → Next.js) | ✅ Done |
| Dynamic OG Images | ✅ Done |
| JSON-LD Structured Data | ✅ Done |
| Table of Contents (blog posts) | ✅ Done |
| Blog search/filter polish | ✅ Done |
| Custom scrollbar | ✅ Done |
| Docker Update | ⬜ Not started |
| Guestbook / Comments | ⬜ Not started (needs DB + auth) |

---

## What's Done

### Framework & Tooling
- [x] Migrated from React + Vite + React Router v7 → **Next.js 16.2.7** App Router (in-place, same folder)
- [x] Switched package manager and runtime to **Bun** (`bun --bun next dev/build/start`)
- [x] `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `index.html` deleted
- [x] `tsconfig.json` merged + updated for Next.js
- [x] `.gitignore` updated (`.next`, `.post-cache`, lockfiles)

### Routing
- [x] All routes converted to `app/` file-based routing
- [x] `/posts` renamed to `/blogs` throughout
- [x] `useNavigate`/`useLocation` (React Router) → `useRouter`/`usePathname` (next/navigation)
- [x] Redirect shortcuts in `next.config.ts`: `/github`, `/linkedin`, `/twitter`, `/mail`, `/discord`, `/spotify`

### Layout & Fonts
- [x] `src/app/layout.tsx` with root metadata, ThemeProvider, NavBar, MouseGlow, CommandPalette, NuqsAdapter
- [x] Decorative diagonal stripe borders (left/right, xl+ screens)
- [x] Fonts migrated from `@import url(googleapis.com)` → **`next/font/google`** (`Inter`, `Space_Grotesk`, `Caveat`) injected as CSS variables
- [x] `suppressHydrationWarning` on `<html>` for theme flicker prevention
- [x] `font-optical-sizing: auto` + `font-style: normal` fully restored on all font utility classes

### Theme
- [x] Custom `useTheme` hook replaced with **`next-themes`**
- [x] `ThemeProvider.tsx` wrapper with `attribute="class"`
- [x] ThemeToggle has `mounted` guard + View Transition API circle animation

### Blog System — Fumadocs
- [x] Installed `fumadocs-mdx@14.2.7`, `fumadocs-core@16.6.0`, `fumadocs-ui@16.6.0`
- [x] `source.config.ts` at root — Shiki dual-theme (`github-dark` / `github-light`), `remarkReadingTime` plugin, `lastModified` plugin (git-based file modification date)
- [x] `src/lib/remarkReadingTime.ts` — reading time from prose AST only (skips code blocks), 260 wpm
- [x] `src/lib/source.ts` — Fumadocs `loader()` at `/blogs` base URL
- [x] `src/mdx-components.tsx` — MDX component registry
- [x] `postinstall: "fumadocs-mdx"` in `package.json` — auto-regenerates `.source/` types
- [x] All 18 posts converted from custom `.md` → `.mdx` with YAML frontmatter
- [x] Moved to `content/blog/` directory
- [x] Blog route changed to `[...slug]` (compatible with `source.generateParams()`)
- [x] All 18 posts statically generated at build time (SSG)
- [x] First post load: ~700ms (vs 8s before), subsequent: instant (static HTML)
- [x] Dropped custom unified/Shiki pipeline + `.post-cache/` disk cache

### Blog Post Format
```yaml
---
title: "Post Title"
description: "One line summary"
date: YYYY-MM-DD
tags:
  - tag1
  - tag2
---
Content...
```

### SEO & Metadata
- [x] `generateMetadata()` on all pages and blog posts (replaces `react-head`)
- [x] `src/app/sitemap.ts` — auto-generates sitemap including all blog posts
- [x] `src/app/robots.ts` — replaces old `public/robots.txt`
- [x] OpenGraph + Twitter card tags per post (title, description, publishedTime, tags, canonical URL)
- [x] Per-post dynamic OG image URL wired into `generateMetadata()`

### API Routes (Express → Next.js)
All proxy routes live in `src/app/api/`. Express is now only needed for Spotify OAuth:
- [x] `/api/now-playing` — Spotify currently playing (Node runtime, no cache)
- [x] `/api/wakatime-daily` — today's coding time (5 min cache via `revalidate`)
- [x] `/api/wakatime-languages` — 7-day language breakdown aggregated (5 min cache)
- [x] `/api/github-contributions` — GitHub GraphQL contributions graph (1h cache)
- [x] `/api/views` — total site visit counter, GET + POST (file-based `views.json`)
- [x] `/api/views/[slug]` — per-post view counter, GET + POST, IP rate-limited (10 min window)
- [x] All frontend components (`SpotifyWidget`, `WakatimeWidget`, `WakatimeLanguages`, `GithubContributions`, `VisitorCount`, `CommandPalette`, `usePostViews`) updated to call `/api/...` relative paths — `NEXT_PUBLIC_API_URL` dropped entirely

**Note:** Keep Express service only for Spotify OAuth `/login` + `/callback` (needs redirect URI + session state).

### Dynamic OG Images
- [x] `src/app/og/route.tsx` — edge runtime, 1200×630, your site palette (taupe bg `#2e2a27`, diagonal stripe texture, `soft-royal-blue` accents, `battleship-gray` text)
- [x] Parameters: `?title=...&description=...&path=...&tags=comma,separated`
- [x] Wired into root layout metadata (default OG) and per-post `generateMetadata()` (per-post OG with tags encoded in URL)
- [x] Uses `next/og` `ImageResponse` (built-in, no extra deps)
- [x] Preview locally: `http://localhost:3000/og?title=My+Post&tags=nextjs,typescript&path=blogs`

### JSON-LD Structured Data
- [x] `src/components/JsonLd.tsx` — zero-dep component, supports `person`, `website`, `webpage`, `article`, `breadcrumb` schema types
- [x] `src/lib/site.ts` — shared `siteConfig` object used by `JsonLd`, OG route, and any future SEO features
- [x] `Person` + `WebSite` schemas injected in root layout (every page)
- [x] `BlogPosting` schema injected on each individual blog post page (title, description, publishedAt, tags, author, publisher)
- [x] Removed duplicate inline JSON-LD from `Hero.tsx` (was hardcoded there before)

### Table of Contents (blog posts)
- [x] `src/components/TableOfContents.tsx` — two components:
  - **`DesktopTOC`** — sticky sidebar to the right of post content on `xl+` screens; depth-indented links; active heading tracked via `IntersectionObserver` and highlighted in `soft-royal-blue`
  - **`MobileTOC`** — sticky bar below navbar on `<xl` screens; collapsible list; SVG progress circle (scroll % through post); shows current heading + `x/total` counter
- [x] TOC extracted at build time using `getTableOfContents(rawMarkdown)` from `fumadocs-core/content/toc` — `page.data.getText('raw')` gives raw MDX, headings parsed from it
- [x] `PostPage.tsx` updated to a CSS grid layout: `1fr 200px` on desktop, single column on mobile
- [x] **Updated date** shown in post meta — `lastModified` fumadocs-mdx plugin reads git history for file modification date; shown as "Updated [date]" below publish date if different

### Blog Posts Page (`/blogs`) — Polish
- [x] **Fused control group** — Tags popover + per-page selector joined into a single button group with shared border and vertical separator (same pattern as anishshobithps.com, our palette)
- [x] **Tags popover** — multi-select checkbox list, shows active count badge, "Clear all" shortcut, auto-closes on outside click
- [x] **Per-page selector** — dropdown with options 5 / 10 / 15 / 20, defaults to 10
- [x] **Pagination** — page number list with ellipsis for large counts, prev/next arrows, "Showing X–Y of Z posts" count
- [x] **Active tag pills** — appear below controls when tags are selected, × to remove individually
- [x] **URL-synced state via `nuqs`** — search query (`?q=`), active tags (`?tags=`), page (`?page=`), and per-page (`?per=`) all live in the URL; links are shareable and bookmarkable; `Suspense` boundary wraps `BlogsClient` (required by `nuqs` internals)
- [x] Search still uses **Fuse.js** fuzzy matching (better than anish's plain `includes()`) — typo-tolerant, weighted title vs description

### Custom Scrollbar
- [x] Thin floating pill scrollbar via `::-webkit-scrollbar` — 10px total width, thumb is `battleship-gray` at 35% opacity with a 3px border matching the page background color, creating a floating effect
- [x] Dark mode: border matches `#2e2a27` (taupe); Light mode: border matches `#f2eeea`
- [x] Both `--scrollbar-thumb` and `--scrollbar-bg` defined as CSS vars in `globals.css`, overridden in `html.light`

### New Features Added
- [x] **Mouse glow** — `requestAnimationFrame` cursor follower via direct DOM ref (`MouseGlow.tsx`)
- [x] **Reading progress bar** — zero-lag, writes directly to `ref.current.style` (no `useState`) (`ReadingProgress.tsx`)
- [x] **Scroll-driven CSS fade** — `.scroll-fade-x` / `.scroll-fade-y` mask-image utilities in `globals.css`
- [x] **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- [x] **Shiki syntax highlighting** — dual light/dark theme, compiled at build time

### Components Updated
- [x] `NavBar.tsx` — `usePathname` from next/navigation
- [x] `CommandPalette.tsx` — `useRouter` from next/navigation, `useTheme` from next-themes, `/api/now-playing`
- [x] `ThemeToggle.tsx` — `useTheme` from next-themes
- [x] `LinkPreview.tsx` — fixed `motion/react` → `framer-motion` import
- [x] All `VITE_*` env vars replaced with `NEXT_PUBLIC_*`
- [x] `PostPage.tsx` — grid layout, expanded meta (date, updatedAt, readingTime, views, tags), TOC prop
- [x] `BlogsClient.tsx` — nuqs URL state, fused controls, pagination, tag popover, per-page select

---

## What's Left

### Docker Update
- [ ] Update frontend `Dockerfile` — replace Nginx stage with `next start`
- [ ] Remove `nginx.conf`
- [ ] Update `docker-compose.yml` frontend service (port 3000)
- [ ] Update GitHub Actions workflows for new build process

**Note:** Express service still needs its own container — used for Spotify OAuth only.

### Guestbook / Comments (future)
Needs a real database — do this when you're ready:
- [ ] **Neon** (serverless Postgres) — DB
- [ ] **Drizzle ORM** — schema + queries
- [ ] **Clerk** — auth (GitHub/Google login)
- [ ] Guestbook page at `/guestbook`
- [ ] Comments section at bottom of each blog post
- [ ] Mood reaction picker on blog posts (4-state emoji, tracked by IP hash — no login required)

### Other Nice-to-Haves
- [ ] Typing animation on hero — cycle through "developer", "pianist", "iit student"
- [ ] Flicker text SVG animation (like anishshobithps.com) for name/initials
- [ ] Dynamic project fetching from GitHub API instead of static `constants/projects.json`
- [ ] Dual favicons (light/dark SVG) — OS picks via `prefers-color-scheme` in `<link>`
- [ ] `/blog/:path*.mdx` redirect to raw MDX (LLM-friendly route)
- [ ] Cursor trail effect (lowest priority)
- [ ] Delete leftover `content/*.md` files (originals, now unused — `.mdx` versions in `content/blog/`)

---

## Tech Stack (Current)

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.7 (App Router, Turbopack) |
| Runtime / PM | Bun |
| Styling | Tailwind CSS v4 + CSS variables |
| Fonts | next/font/google (Space Grotesk, Inter, Caveat) |
| Blog | Fumadocs (fumadocs-mdx 14.2.7 + fumadocs-core/ui 16.6.0) |
| Syntax highlighting | Shiki (via fumadocs rehypeCodeOptions, dual theme) |
| Animations | GSAP SplitText + Framer Motion + View Transition API |
| Theme | next-themes |
| Search | Fuse.js (client-side fuzzy search) + nuqs (URL state sync) |
| Backend | Express.js on port 3001 (Spotify OAuth only now) |
| DevOps | Docker + GHCR + GitHub Actions → DigitalOcean VPS |

---

## Known Issues / Notes

- **Spotify/WakaTime/GitHub widgets show errors in dev** — expected, env vars (`SPOTIFY_REFRESH_TOKEN`, `WAKATIME_API_KEY`, `GITHUB_PAT`) need to be in `.env.local`. Works fine in production.
- **`.source/` directory** — auto-generated by `fumadocs-mdx` codegen, committed to repo. Re-generated on `postinstall` and on `bun dev` start.
- **`content/` old `.md` files** — the originals in `content/*.md` are still there alongside `content/blog/*.mdx`. The `.md` files are unused and can be deleted.
- **`views.json` location** — in dev, the file writes to the project root (cwd). In production on VPS, `DATA_DIR` env var must point to a persistent volume path so views survive container restarts.
- **`lastModified` (updated date)** — requires git history on the machine running the build. In CI/Docker, make sure the repo is fully cloned (not shallow clone), otherwise the plugin won't find dates.

---

## Inspiration Reference
Techniques studied from `anishshobithps.com` (cloned at `~/Coding/anishshobithps.com`):
- Fused button group pattern for controls (Tags + per-page)
- TOC desktop sidebar + mobile collapsible with progress circle
- URL-synced search state via `nuqs`
- Custom scrollbar floating pill
- JSON-LD schema structure
- Dynamic OG image route pattern
- `lastModified` plugin for updated date on posts

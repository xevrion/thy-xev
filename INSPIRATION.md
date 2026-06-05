# Inspiration & Techniques from anishshobithps.com

> Analyzed on 2026-06-05. Reference: ~/Coding/anishshobithps.com  
> Goal: learn techniques to implement in our own style — NOT copying.

---

## Tech Stack Overview

His site is **Next.js 16 (App Router) + TypeScript**, bundled with **Bun**, styled with **Tailwind CSS 4**, and uses **Fumadocs** as the MDX/blog platform. Database is **PostgreSQL via Neon** (serverless), ORM is **Drizzle**, and auth is **Clerk**.

We are currently: **React + Vite + no backend**.

---

## 1. Blog Post Structure

**Storage:** MDX files inside `/content/blog/` — one `.mdx` file per post.

**Frontmatter schema:**
```yaml
---
title: "Post Title"
description: "Short summary"
date: "2025-04-20"
tags: ["nextjs", "typescript"]
---
```

**What's great about it:**
- Tags enable category filtering with zero extra work
- `description` powers OG meta and list previews
- Dates are ISO format — consistent, sortable, no surprises

**For us:** We can replicate the exact same frontmatter format with our own markdown setup. Clean and minimal.

---

## 2. Markdown → HTML Pipeline

**Stack:** Fumadocs MDX → Remark → Rehype → Shiki

**Remark plugins:**
- Custom `remarkReadingTime` — walks the AST, skips code blocks, calculates at 260 wpm
- `fumadocs-mdx/plugins/last-modified` — auto-tracks file modification date

**Rehype / syntax highlighting:**
- **Shiki** with `github-light` / `github-dark` themes based on color mode
- Inline code uses `tailing-curly-colon` mode (shows `text:` prefix hint)

**Table of Contents:**
- Auto-generated from headings via `fumadocs-core/toc`
- Desktop: sidebar with scroll-fade CSS effect
- Mobile: collapsible with circular SVG progress indicator

**For us:** We can use `remark` + `rehype` + `shiki` even without Fumadocs. The reading time plugin pattern (walk AST, skip code nodes) is easy to copy in spirit.

---

## 3. Typography & Formatting

**Fonts:**
- Body: `Plus Jakarta Sans` (Google Fonts)
- Code: `Geist Mono` (Google Fonts)
- Both use `font-display: swap`

**Color system:** **OKLch** color space — more perceptually uniform than HSL/hex. All colors defined as CSS custom properties (`--primary`, `--accent`, etc.).

**Prose:** Blog articles use a `prose` Tailwind class with consistent line-height, heading sizes, and code block styling.

**Typography components:**
- `TypographyH1`, `TypographyLead`, `TypographyMuted`, `TypographyMark`, `TypographySmall`
- Re-usable components ensure consistent heading/text hierarchy everywhere

**For us:** We should define our own color tokens in OKLch and extract typography into components instead of scattering Tailwind classes.

---

## 4. Guestbook

**Tech:** PostgreSQL + Drizzle ORM + Clerk auth

**Schema:**
- `guestbook_entries`: id, clerk_user_id, message (2–280 chars), is_pinned, is_deleted, timestamps
- `guestbook_likes`: composite key (entry_id, clerk_user_id)

**Key behaviors:**
- Soft deletion (never hard-delete — `is_deleted` flag)
- Owner-only pin/unpin via `OWNER_CLERK_USER_ID` env var
- One like per user per entry
- Homepage shows 15 random non-pinned entries as a preview teaser
- `revalidatePath('/guestbook')` on every mutation (Next.js ISR)
- Clerk webhook: when user deletes account, cascade-delete their entries + likes

**For us:** This is the cleanest guestbook design I've seen. The "random preview on homepage" idea is clever — creates social proof without showing a static set. Soft deletes + owner pin are both worth stealing in spirit.

---

## 5. Blog Comments System

**Tech:** Same DB stack + Clerk

**Schema:**
- `blog_posts`: id, slug (auto-created on first comment/reaction)
- `blog_comments`: id, post_id, parent_id (nullable = threaded!), clerk_user_id, body (max 1000 chars), is_pinned, is_deleted
- `blog_comment_likes`: (comment_id, clerk_user_id) composite
- `blog_reactions`: ip_hash + mood ("terrible" / "bad" / "good" / "amazing") per post
- `blog_reads`: ip_hash per post (unique constraint = one read per IP)

**Privacy for anonymous data:**
- IP addresses are **SHA-256 hashed with a salt** before storage — raw IPs never saved
- This covers read counts and mood reactions without needing auth

**Comment features:**
- Threaded replies via `parent_id` — flat DB, recursive tree built in app
- Optimistic UI with React 19 `useOptimistic` hook
- Pin/unpin (owner only), soft delete, like/unlike

**Mood/reaction system:**
- 4-state emoji mood picker per blog post
- Tracked by IP hash (no login required)
- Shows counts per mood — great engagement signal without friction

**For us:** The mood picker is a low-friction engagement feature worth implementing. Read tracking with IP hashing is privacy-conscious and clever. Threaded comments are complex but the `parent_id` pattern is simple.

---

## 6. Dynamic OG Image Generation

**Route:** `/og` — server-rendered at request time

**Tech:** `@takumi-rs/image-response` (Rust-based, fast)

**Design elements:**
- 1200×630px dark theme
- Grid background pattern
- Radial gradient glows (green-tinted)
- SVG `<feTurbulence>` noise texture overlay
- Vignette
- Breadcrumb path display
- "Available for hire" badge
- Tags displayed (up to 4, truncated to 20 chars)
- Dynamic font sizing based on title/description length

**Metadata helper:** `buildOGMeta()` / `buildMeta()` functions that construct full OpenGraph + Twitter Card + canonical meta in one call.

**For us:** Dynamic OG images make link previews look polished. Even a simple dark-card with title + description is 10× better than no OG image.

---

## 7. SEO & Structured Data

**JSON-LD schemas implemented:**
- `Person` — author profile
- `WebSite` — with SearchAction
- `WebPage` — standard page
- `BlogPosting` — full article schema (datePublished, dateModified, keywords, author)
- `BreadcrumbList` — navigation structure

**Sitemap:** Auto-generated from source pages, blog posts prioritized at 0.7 change-frequency hints per page type.

**Robots.txt:** Disallows `/branding`, `/admin`, allows everything else, references sitemap.

**For us:** JSON-LD is pure HTML injection — no framework needed. We should at minimum add `Person` + `WebSite` + `BlogPosting` schemas.

---

## 8. Dark / Light Mode

**Stack:** `next-themes` + CSS custom properties in OKLch

**Implementation:**
- `<html>` has `suppressHydrationWarning`
- Theme toggle supports light / dark / system
- Uses `useSyncExternalStore` to prevent hydration mismatch
- Dual SVG favicons: `favicon-light.svg` + `favicon-dark.svg` — OS picks via `prefers-color-scheme` media query in `<link>` tag

**For us:** We already have dark mode. The dual-favicon trick is a nice touch. `useSyncExternalStore` pattern for avoiding flash is worth noting.

---

## 9. Cool Unique Features Worth Learning From

### A. Mouse Glow Effect
- Fixed 100×100px blurred div that follows the cursor
- Uses `requestAnimationFrame` — no jank, no re-renders
- Hides on pointer leave, shows on enter
- Pure CSS: `blur-3xl` filter, `pointer-events: none`

### B. Scroll-Driven CSS Animations (zero JS)
- `.scroll-fade-effect-y` utility: fades top/bottom of scrollable content
- Uses native `animation-timeline: scroll()` — no JS at all
- Applied to the blog TOC sidebar scroll

### C. Reading Progress Circle (Mobile TOC)
- SVG circle with animated `stroke-dashoffset`
- Shows scroll progress through blog post
- `transition-all duration-300 ease-out`

### D. Flicker Text Animation
- SVG-based characters with randomized flicker keyframes
- Three duration presets (3.2s, 3.7s, 4s)
- Respects `prefers-reduced-motion`

### E. Physics-Based Bouncing Logo
- Logo(s) bounce around a container with gravity + velocity simulation
- DOM-based with `transform3d` (no canvas)
- Configurable count, opacity, angles

### F. Custom Loader
- SVG clip-path animation — fills like water rising
- Dual element: ghost outline + filled clone with animated clip
- Cubic-bezier easing

### G. Resume Download Endpoint
- `/api/resume` streams PDF from GitHub releases
- Sets filename as `Name_Resume-YYYY-MM-DD.pdf` dynamically
- Cache headers (3600s) + streaming

### H. Redirect Shortcuts
- `/github`, `/linkedin`, `/mail` are redirect routes
- Clean shareable links, no external URL in content

### I. Umami Analytics Proxy
- Self-hosted Umami stats proxied through `/stats/*`
- Privacy-first analytics (no cookies, GDPR-compliant)
- CSP headers whitelisted for Clerk domains

### J. Admin Panel
- Protected by `OWNER_CLERK_USER_ID` env var check (no separate roles table)
- CRUD for: comments, reactions, guestbook, projects
- Simple but effective ownership model

### K. LLM-Friendly Blog Route
- `/blog/:path*.mdx` redirects to raw MDX content
- Intentional — lets LLMs read blog posts as plain text

---

## 10. Security Headers

Implemented in `next.config.mjs`:
- `Content-Security-Policy` (Clerk domains whitelisted)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Permissions-Policy`: disables camera, mic, geolocation
- `Referrer-Policy: strict-origin-when-cross-origin`

**For us:** These are free wins. Add them to our Nginx config or Express middleware.

---

## Should We Move from React (Vite) to Next.js?

### Why Next.js would help us

| Feature we want | React/Vite | Next.js |
|---|---|---|
| Blog with MDX | DIY setup | Native with Fumadocs/Contentlayer |
| Server-side DB queries | Need separate API | Server Components / Server Actions |
| Dynamic OG images | Very hard | Built-in `/og` route pattern |
| SEO (real crawlable HTML) | Poor (CSR) | Excellent (SSR/SSG) |
| Image optimization | Manual | `next/image` built-in |
| API routes | Need Express | Colocated in `/app/api/` |
| Sitemap/robots | Manual | `sitemap.ts` / `robots.ts` |

### Why to stay on React/Vite (for now)

- Our site is currently a **personal portfolio with no blog** — Next.js benefits are moot without content
- Vite dev experience is faster and simpler
- Migration is non-trivial (routing, layouts, hydration changes)
- Next.js adds complexity (server vs client components, caching gotchas)

### Recommendation

**Move to Next.js when we're ready to add a blog.** The blog is where SSG/SSR, MDX, dynamic OG images, and read tracking all pay off. Without a blog, migrating just to have Next.js is over-engineering.

**Plan:**
1. Keep Vite until we're ready to build the blog
2. When adding the blog: start a new Next.js project (App Router), migrate existing pages, then build blog on top
3. Use Fumadocs or Contentlayer for MDX — don't wire it manually

---

## Priority Features to Implement (Our Own Style)

Ranked by impact vs. effort:

1. **Dynamic OG images** — high SEO/social impact, medium effort
2. **JSON-LD structured data** — free SEO wins, low effort
3. **Security headers** — free, add to Nginx now
4. **Blog with MDX + reading time** — requires Next.js migration or DIY remark pipeline
5. **Guestbook** — fun, requires auth + DB
6. **Mood reactions on blog posts** — low friction engagement, IP-hashed
7. **Mouse glow effect** — purely cosmetic but satisfying, low effort
8. **Scroll-driven fade animations** — pure CSS, zero effort
9. **Threaded blog comments** — complex, worth doing right with Clerk
10. **Reading progress circle** — SVG, fun polish detail

thy personal website~


todo
- [x] make basic structure
- [x] decide theme
- [x] think about markdown pages
- [x] first work on implementing basic functionality

   - [x] add listening now (spotify api)
   - [x] make the spotify thing- pretty
   - [x] add online offline status.. maybe discord(lanyard) 
   - [x] add keystrokes and mouse clicks counter and uptime too
   - [x] add current project which you're working on
   - [ ] add upcoming contests on leetcode,codechef and codeforces
     - [x] codeforces
     - [ ] codechef (dont have api)
     - [ ] leetcode (dont have api)
- [x] make about section
  - [x] add tech stack
- [x] make contact section
- [x] make projects section
   - [x] basic page structure
   - [x] some cool effects
   - [x] current working
   - [x] past projects
   - [ ] dynamic fetching from github repos
 
- [x] make posts section (markdown)
- [x] make it pretty
- [x] hosting
  - [x] digital ocean 16$ VPS
  - [x] bought domain for free from name.com 
- [x] add live coding stats (Wakatime API)  
  - [x] show time spent coding today  
  - [x] show time spent coding till now (all time)  
  - [x] show time spent coding this week
  - [x] show language breakdown (bar chart with per-language colors, last 7 days)

- [x] add weather widget (OpenWeather / WeatherAPI)  
  - [x] fetch weather for Surat + Jodhpur  
  - [x] display temp, condition + small icon  
  - [x] make it fit theme (minimal / glowy)  

- [ ] add AI-generated summaries for projects  
  - [ ] generate 1–2 line tagline from project description using API  
  - [ ] show tagline under each project card dynamically  

- [x] integrate search in posts page
  - [x] client-side fuzzy + substring search using fuse.js (no server needed)
  - [x] searches title, description, and tags

- [ ] add testimonials section (research other personal sites before proceeding)

- [x] add Resume section (pdf download + online view)
  - [x] hosted on Google Drive, embedded via iframe (no forced download)
  - [x] download button + /resume route + Resume nav link

- [x] light/dark theme?
  - [x] toggle button to switch themes  
  - [x] save preference in localStorage

- [x] github contribution graph
  - [x] real data via GitHub GraphQL API
  - [x] SVG heatmap with soft-royal-blue palette, hover tooltips, legend
  - [x] scrolls to most recent week, works on mobile

- [x] reading time on posts
  - [x] show "X min read" on post cards and at top of each post
  - [x] now computed via remarkReadingTime plugin (prose-only, skips code blocks)

- [x] post tags + filter
  - [x] tags stored in YAML frontmatter, parsed by Fumadocs
  - [x] tag chips on post cards, filter on /blogs page, shown on post page
  - [x] horizontal scroll if too many tags

- [x] command palette (Cmd+K / Ctrl+K)
  - [x] fuzzy search across pages, posts, projects
  - [x] keyboard navigable, opens from anywhere on site
  - [x] actions: toggle theme, open spotify song, social links
  - [x] desktop only

- [x] /now page
  - [x] what i'm currently learning, reading, building, listening to
  - [x] updated manually, personal and casual tone
  - [x] linked from hero and command palette

- [x] visitor count per post
  - [x] stored in server/views.json on VPS
  - [x] localStorage-gated on frontend (one count per browser, forever)
  - [x] show "X reads" on post cards and post page
  - [x] total site visitor counter on home page

- [x] migrate to Next.js (from React + Vite + React Router)
  - [x] App Router, SSG, generateStaticParams, generateMetadata
  - [x] next-themes replacing custom useTheme hook
  - [x] useRouter/usePathname replacing react-router hooks

- [x] rename /posts to /blogs

- [x] switch to Bun as package manager + runtime

- [x] migrate blog to Fumadocs (Anish's stack)
  - [x] fumadocs-mdx 14.2.7 + fumadocs-core/ui 16.6.0 on Next.js 16
  - [x] MDX compiled at build time (no per-request rendering)
  - [x] Shiki dual-theme syntax highlighting (github-dark / github-light)
  - [x] remarkReadingTime plugin for accurate reading time
  - [x] all 18 posts converted to .mdx with YAML frontmatter
  - [x] description field on posts

- [x] auto sitemap + robots.txt (Next.js metadata routes)

- [x] redirect shortcuts: /github, /linkedin, /twitter, /mail, /discord, /spotify

- [x] mouse glow effect following cursor

- [x] reading progress bar on blog posts (zero-lag, direct DOM writes)

- [x] scroll-driven CSS fade utility (.scroll-fade-x/y)

- [x] security headers (X-Frame-Options, X-Content-Type-Options, etc.)

- [x] fully dockerized + GitHub Actions CI/CD to DigitalOcean VPS

- [ ] typing animation on hero (lowest priority)
  - [ ] cycle through "developer", "designer", "pianist", "iit student"

- [ ] cursor trail effect (lowest priority)
  - [ ] subtle particle trail on desktop only

- [ ] add guestbook / comments
  - [ ] needs Neon (Postgres) + Drizzle ORM + Clerk auth (like Anish)

- [ ] dynamic project fetching from GitHub repos

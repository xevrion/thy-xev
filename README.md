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
  - [x] searches title, summary, and full post content

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

- [x] post tags + filter
  - [x] tags stored as "Tags:" line in markdown, parsed like Date
  - [x] tag chips on post cards, filter on /posts page, shown on post page
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

- [ ] visitor count per post
  - [ ] store counts in JSON file on VPS Express server
  - [ ] rate limited endpoint to prevent spam/abuse
  - [ ] show "X reads" on post cards and post page

- [ ] typing animation on hero (lowest priority)
  - [ ] cycle through "developer", "designer", "pianist", "iit student"

- [ ] cursor trail effect (lowest priority)
  - [ ] subtle particle trail on desktop only
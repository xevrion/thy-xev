# Dockerizing My Portfolio & Automating Deployments
Date: 14-04-2026
Tags: docker, deployment, vps, CICD

My portfolio was running on a DigitalOcean VPS in the most fragile way possible.

The frontend was being served directly from a `dist/` folder by nginx. The backend was a TypeScript Express server running via `ts-node` under pm2. Deployments were a single SSH action that did `git pull`, `npm ci`, `npm run build`, and `pm2 restart`.

It worked. Until it didn't.

The problem that finally broke me: I added `helmet` and `express-rate-limit` to my backend. Installed them locally, used them in code, everything worked. Pushed to main. Deployment ran. Server crashed.

`Cannot find package 'helmet'`

The packages were installed manually on the VPS but never saved to `package.json`. When the deploy ran `npm ci`, it wiped them. The old deploy script was masking this class of bugs for months.

That's when I decided to properly dockerize everything.

## Goals

- Frontend and backend each in their own container
- Images built and pushed to GHCR via GitHub Actions
- VPS pulls and restarts containers on every push to main
- No more "works on my machine" dependency issues
- Keep nginx and Certbot on the host (no reason to complicate SSL)

## The Setup

The project structure is a monorepo — React/Vite frontend at the root, Express/TypeScript backend in `server/`.

### Backend Dockerfile

The backend compiles TypeScript to JavaScript in a builder stage, then runs the output with plain `node` in production — no `ts-node` at runtime:

```dockerfile
# Stage 1: build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json index.ts ./
RUN npx tsc

# Stage 2: run
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
```

The two-stage build keeps the final image small — dev dependencies and TypeScript compiler don't end up in production.

### Frontend Dockerfile

The frontend builds with Vite and gets served by nginx:

```dockerfile
# Stage 1: build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_OPENWEATHER_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_OPENWEATHER_KEY=$VITE_OPENWEATHER_KEY

RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

The `VITE_*` variables are passed as Docker build args because Vite bakes them into the bundle at build time — they need to exist during `npm run build`, not at runtime. These come from GitHub Actions secrets.

The nginx config inside the container is minimal — just serve static files and handle SPA routing:

```nginx
server {
    listen 3000;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Compose

Both containers are wired together with a compose file. The backend gets env vars injected and mounts a volume for `views.json` (post view counts that need to persist across deploys):

```yaml
services:
  frontend:
    image: ghcr.io/xevrion/thy-xev/frontend:latest
    restart: unless-stopped
    ports:
      - "3000:3000"

  backend:
    image: ghcr.io/xevrion/thy-xev/backend:latest
    restart: unless-stopped
    ports:
      - "3001:3001"
    env_file: .env
    environment:
      - DATA_DIR=/app/data
    volumes:
      - views_data:/app/data

volumes:
  views_data:
```

### nginx on the Host

The host nginx now proxies to the containers instead of serving files directly. The SSL setup (Let's Encrypt via Certbot) stays untouched:

```nginx
server {
    server_name xevrion.dev www.xevrion.dev;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/xevrion.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xevrion.dev/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

## GitHub Actions

Three workflows handle the CI/CD:

**Build Frontend** — triggers on changes to `src/`, `public/`, `Dockerfile`, etc. Builds and pushes the frontend image to GHCR with the correct env vars baked in.

**Build Backend** — triggers on changes to `server/`. Builds and pushes the backend image.

**Deploy** — triggers after either build workflow succeeds. SSHes into the VPS, writes the `.env` file from GitHub secrets, pulls the new images, and restarts containers.

```yaml
- name: Pull and restart containers
  uses: appleboy/ssh-action@v1
  with:
    host: ${{ secrets.SERVER_IP }}
    username: xevrion
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd ~/app
      printf '%s\n' \
        "SPOTIFY_CLIENT_ID=${{ secrets.SPOTIFY_CLIENT_ID }}" \
        "SPOTIFY_REFRESH_TOKEN=${{ secrets.SPOTIFY_REFRESH_TOKEN }}" \
        > .env
      docker compose pull
      docker compose up -d --remove-orphans
      docker image prune -f
```

The `docker image prune -f` at the end cleans up old image layers so the VPS disk doesn't fill up over time.

## What I Learned

**`npm ci` is stricter than `npm install`** — it installs exactly what's in `package-lock.json` and fails if `package.json` is inconsistent. This is what exposed my missing dependencies. It's annoying when it breaks things but it's the right behavior.

**Build args vs runtime env vars** — Vite env vars (`VITE_*`) must exist at build time because the bundler inlines them. Backend env vars are loaded at runtime. These are fundamentally different and need different solutions.

**Keep SSL on the host** — putting nginx + Certbot inside Docker is possible but adds complexity for no real benefit on a single-server setup. The host nginx proxying to containers is simpler and Certbot keeps working with zero changes.

**Volumes for persistent data** — any data your container writes to disk needs a volume, or it disappears on every deploy. My `views.json` was getting wiped until I moved it to a named volume.

The whole setup now takes about 2-3 minutes from `git push` to live — build, push, deploy. Every dependency is locked. Every build is reproducible. And I never have to SSH in to fix a crashed pm2 process again.

# Stage 1: build
FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
RUN bun run postinstall

# Build-time env vars needed by Next.js at build time
ARG NEXT_PUBLIC_OPENWEATHER_KEY
ENV NEXT_PUBLIC_OPENWEATHER_KEY=$NEXT_PUBLIC_OPENWEATHER_KEY

RUN bun --bun next build

# Stage 2: run
FROM oven/bun:1-slim
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["bun", "server.js"]

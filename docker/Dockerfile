# syntax=docker/dockerfile:1.7

# ─────────────────────────────────────────────────────────────────────────
# Production Dockerfile — multi-stage build for a Next.js 16 (App Router)
# application using `output: "standalone"`.
#
# Stage layout:
#   1. deps     -> install dependencies only (cached separately from source)
#   2. builder  -> compile the Next.js production build
#   3. runner   -> minimal runtime image, no build tools, no source maps
#      of dev dependencies, runs as a non-root user
#
# Build (from the repo root, since the build context needs the whole app):
#   docker build -f docker/Dockerfile -t portfolio:latest .
#
# Run:
#   docker run -p 3000:3000 portfolio:latest
# ─────────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=22-alpine

# ── Stage 1: dependencies ──────────────────────────────────────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# Only copy the manifest files first so Docker can cache this layer and
# skip `npm install` entirely on rebuilds where dependencies didn't change.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── Stage 2: build ──────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Stage 3: runtime ─────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as a dedicated, unprivileged user rather than root.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# `output: "standalone"` produces a self-contained server bundle: only the
# node_modules that are actually used at runtime are copied in, which keeps
# the final image small (no dev dependencies, no full node_modules tree).
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Basic container-level health check hitting the app itself. Requires the
# `/api/health` route shipped in this repo (app/api/health/route.ts).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(r.status!==200)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["node", "server.js"]

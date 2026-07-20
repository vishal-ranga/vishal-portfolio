# Architecture

## Application layer

```
Browser
   │
   ▼
Next.js 16 App Router (React 19, TypeScript)
   ├── Static pages (/, /projects/[slug]) — prerendered at build time
   ├── Dynamic route (/api/contact) — server-side form handler
   └── Health route (/api/health) — used by Docker/Kubernetes probes
```

The app is server-rendered where it benefits SEO and cache-ability (the
marketing pages, project case studies) and uses `output: "standalone"` so
the production build is a self-contained Node.js server — no separate
build step needed inside the container beyond `npm run build`.

## Request path in production (Docker Compose / self-hosted)

```
Internet
   │
   ▼
Nginx (reverse proxy)
   ├── /_next/static/*  → cached 1 year, immutable
   ├── /images/*        → cached 1 day
   ├── /api/*           → rate-limited (10 req/s, burst 20), never cached
   └── /*               → proxied to the Next.js standalone server
   │
   ▼
Next.js standalone server (port 3000, container: "app")
```

Nginx terminates the connection, applies security headers, gzip, and
caching policy, then proxies to the application container over the
internal Docker network. The app container is never exposed directly.

## Request path on Kubernetes

```
Ingress (nginx-ingress + cert-manager TLS)
   │
   ▼
Service (ClusterIP, portfolio-svc)
   │
   ▼
Deployment (2+ replicas, rolling updates, resource limits,
            liveness/readiness probes hitting /api/health)
```

`k8s/hpa.yaml` is included but not applied by default — it's there so
autoscaling is a one-command addition (`kubectl apply -f k8s/hpa.yaml`)
once the metrics-server addon is on the cluster.

## CI/CD

Two pipelines exist and are complementary rather than redundant:

- **GitHub Actions** (`.github/workflows/ci.yml`) — runs on every push/PR:
  install → lint → type-check → build. This is the fast feedback loop
  gating merges to `main`.
- **Jenkins** (`jenkins/Jenkinsfile`) — a fuller pipeline intended to run
  after merge: the same checks, plus Docker image build, registry push,
  and a deploy stage. Modeled on how a company with its own build
  infrastructure (rather than only relying on a SaaS CI) would structure
  this.

## Why these specific choices

- **`output: "standalone"`**: without it, a Docker image would need the
  entire `node_modules` tree plus the Next.js source — often several
  hundred MB larger than necessary. Standalone output traces only the
  dependencies actually imported at runtime.
- **Nginx in front of Node, not instead of it**: Next.js's server handles
  routing/rendering; Nginx handles what it's genuinely better at —
  TLS termination, static asset caching, gzip, and rate limiting — so
  neither layer duplicates the other's job.
- **Non-root containers everywhere**: both the Dockerfile (`USER nextjs`)
  and the Kubernetes `securityContext` (`runAsNonRoot: true`) run the app
  as an unprivileged user, which is a baseline expectation in any real
  production review.

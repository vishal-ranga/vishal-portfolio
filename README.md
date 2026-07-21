# Vishal Ranga — Cloud & DevOps Engineer Portfolio

A production-grade personal portfolio: a Next.js 16 / React 19 /
TypeScript application, deployed the way a real small service would be —
containerized, reverse-proxied, health-checked, CI/CD'd, and documented
for Kubernetes even where a live cluster isn't wired up yet.

**Live app:** deployed on Vercel. **This repo** additionally contains a
full self-hosted deployment path (Docker → Nginx → Jenkins/GitHub Actions
→ Kubernetes-ready manifests) as a demonstration of DevOps practice.

---

## Table of contents

- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Features](#features)
- [Folder structure](#folder-structure)
- [Local development](#local-development)
- [Docker](#docker)
- [Docker Compose](#docker-compose)
- [Nginx](#nginx)
- [CI/CD](#cicd)
- [Kubernetes (future deployment target)](#kubernetes-future-deployment-target)
- [Ansible provisioning](#ansible-provisioning)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Interview talking points](#interview-talking-points)

---

## Architecture

```
Internet → Nginx (TLS, gzip, caching, rate limiting)
             │
             ▼
        Next.js 16 standalone server (App Router, React 19, TypeScript)
             │
             ├── Static/prerendered pages (/, /projects/[slug])
             ├── /api/contact  — server-side form handler
             └── /api/health   — liveness/readiness endpoint
```

Full explanation, including the Kubernetes request path and the reasoning
behind each architectural choice, is in **[`docs/architecture.md`](docs/architecture.md)**.

## Tech stack

**Application**
- [Next.js 16](https://nextjs.org) (App Router, Turbopack, `output: "standalone"`)
- [React 19](https://react.dev) + TypeScript 6
- [Tailwind CSS 4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Lucide](https://lucide.dev) icon set (plus two local SVG components for
  brand marks lucide no longer ships — see `components/icons/BrandIcons.tsx`)
- Self-hosted fonts via `@fontsource/*` (Inter, Space Grotesk, IBM Plex Mono)

**Infrastructure / DevOps**
- Docker (multi-stage build, non-root runtime)
- Docker Compose (production and development stacks)
- Nginx (reverse proxy, caching, gzip, security headers, rate limiting)
- Jenkins (declarative pipeline: lint → type-check → build → image → push → deploy)
- GitHub Actions (PR-gating CI: lint, type-check, build)
- Kubernetes manifests (Deployment, Service, Ingress, ConfigMap, Secret
  template, HPA — ready to apply, not applied by default)
- Ansible (provisions Git, Docker, Node.js, Nginx, and Jenkins on a bare
  Ubuntu host)
- Terraform (scoped, not yet implemented — see `terraform/README.md`)

## Features

- Fully typed, App Router–based Next.js site with server-rendered and
  statically generated routes
- Command palette (⌘K-style) for fast in-site navigation
- Case-study project pages generated from a typed data layer (`data/projects.ts`)
- SEO: `sitemap.ts`, `robots.ts`, `manifest.ts`, structured data in `app/layout.tsx`
- Accessible, keyboard-navigable UI with semantic HTML throughout
- Security headers applied at both the Next.js and Nginx layers
- A working `/api/health` endpoint wired into every layer of the stack
  (Docker `HEALTHCHECK`, Kubernetes probes, Nginx passthrough)

## Folder structure

```
portfolio/
├── app/                    Next.js App Router — routes, layouts, API handlers
├── components/             Reusable UI components
│   └── icons/BrandIcons.tsx  Local GitHub/LinkedIn icons (see CHANGELOG.md)
├── data/                   Typed content — edit these to change what the site says
├── hooks/                  Custom React hooks
├── lib/                    Small shared utilities
├── types/                  Shared TypeScript types
├── public/                 Static assets (resume PDF, profile photo)
│
├── docker/
│   ├── Dockerfile             Multi-stage production build
│   ├── docker-compose.yml     Production stack (app + Nginx)
│   ├── docker-compose.dev.yml Development stack (hot reload)
│   └── .dockerignore
│
├── nginx/
│   ├── nginx.conf              Global tuning (gzip, rate-limit zone)
│   └── default.conf            Server block: reverse proxy + caching
│
├── jenkins/
│   ├── Jenkinsfile             Declarative pipeline
│   └── pipeline.md             How to wire it up on a real Jenkins instance
│
├── .github/workflows/
│   └── ci.yml                  PR-gating CI (see CHANGELOG.md for why this
│                                lives at `.github/`, not `github/`)
│
├── ansible/
│   ├── playbook.yml
│   ├── inventory.ini
│   └── roles/                  git, docker, nodejs, nginx, jenkins
│
├── terraform/
│   └── README.md               Scoped plan for future IaC (not yet implemented)
│
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.example.yaml     Template only — never commit real secrets
│   ├── deployment.yaml         Resource limits, liveness/readiness probes
│   ├── service.yaml
│   ├── ingress.yaml            TLS via cert-manager annotations
│   └── hpa.yaml                Autoscaling — not applied by default
│
├── scripts/                    docker-build.sh, compose-up.sh, verify.sh
├── docs/                       architecture.md, deployment.md,
│                                interview-questions.md, resume-project-description.md
├── CHANGELOG.md                Full record of this modernization pass
└── SETUP_GUIDE.md              Plain-language walkthrough for editing content
```

## Local development

Requires Node.js 22+.

```bash
npm install
npm run dev
```

Open http://localhost:3000. For non-technical, step-by-step instructions
on editing the actual site content, see **[`SETUP_GUIDE.md`](SETUP_GUIDE.md)**.

Before pushing, run the same checks CI runs:

```bash
./scripts/verify.sh
```

## Docker

```bash
./scripts/docker-build.sh
docker run -p 3000:3000 portfolio:latest
```

Multi-stage build: dependencies are installed and cached separately from
the app source, the production build runs in its own stage, and only the
traced `standalone` output ships in the final image — which runs as a
non-root user and exposes a `HEALTHCHECK` on `/api/health`.

## Docker Compose

```bash
./scripts/compose-up.sh
```

Brings up the app **and** an Nginx reverse proxy in front of it — the
closer-to-production path. Open http://localhost (port 80, via Nginx).

For local development with hot reload instead of a static image:

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

## Nginx

`nginx/nginx.conf` + `nginx/default.conf` configure: gzip compression,
immutable long-term caching for hashed `_next/static` assets, short-term
caching for `/images/`, per-IP rate limiting on `/api/`, standard security
headers, and SPA-friendly proxying for everything else to the Next.js
standalone server.

## CI/CD

- **GitHub Actions** (`.github/workflows/ci.yml`): runs on every push and
  PR — install, lint, type-check, build. Fast feedback, gates merges.
- **Jenkins** (`jenkins/Jenkinsfile`): fuller pipeline for after a merge —
  the same checks, plus Docker image build, registry push, and a deploy
  stage. See `jenkins/pipeline.md` for setup instructions.

## Kubernetes (future deployment target)

Manifests in `k8s/` are production-ready — resource limits, liveness and
readiness probes, a rolling update strategy with zero downtime, a
TLS-terminating Ingress, and an HPA — but are **not applied against a live
cluster by default**, since none is wired to this repo yet. Full apply
instructions, including what to change first (registry image path, Ingress
host), are in **[`docs/deployment.md`](docs/deployment.md)**.

## Ansible provisioning

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --ask-become-pass
```

Provisions a bare Ubuntu host with Git, Docker, Node.js 22, Nginx, and
Jenkins — everything the rest of this repo's tooling expects to find on a
self-hosted deployment target.

## Screenshots

_Add screenshots here before publishing — e.g._

```markdown
![Homepage](docs/screenshots/homepage.png)
![Project case study](docs/screenshots/project-detail.png)
![Command palette](docs/screenshots/command-palette.png)
```

## Roadmap

- [ ] Wire up a real test suite (Vitest/Playwright) — the Jenkins pipeline
      already detects and runs one the moment `package.json` defines it
- [ ] Terraform for actual cloud infrastructure (scoped in `terraform/README.md`)
- [ ] Apply the Kubernetes manifests against a real cluster (EKS/GKE/kind)
- [ ] Wire `/api/contact` to a real mail provider via `k8s/secret.example.yaml`
- [ ] TypeScript 7.x once `typescript-eslint` ships 7.1 support (see `CHANGELOG.md`)

## Interview talking points

See **[`docs/interview-questions.md`](docs/interview-questions.md)** for a
full set of likely interview questions about this repo's frontend,
Docker, Kubernetes, CI/CD, and Nginx decisions — with answers.

For a resume-ready description of this project at three different
lengths, see **[`docs/resume-project-description.md`](docs/resume-project-description.md)**.

---

Built by [Vishal Ranga](https://github.com/vishal-ranga) ·
[LinkedIn](https://www.linkedin.com/in/vishal-ranga-8a5403274)


writing this line just to test jenkins working
# Resume-Ready Project Description

Use whichever length fits the space you have.

## One-liner

Production-grade personal portfolio (Next.js 16, React 19, TypeScript) with
a full containerized deployment pipeline — Docker, Nginx, Jenkins, GitHub
Actions, and Kubernetes manifests — built to mirror real company DevOps
practice rather than a static site export.

## Short (2–3 bullets, resume format)

- Built and deployed a Next.js 16 / React 19 / TypeScript portfolio site
  with a multi-stage Docker build (`output: standalone`), cutting the
  production image to only the runtime dependencies actually used.
- Designed a full CI/CD path: GitHub Actions for lint/type-check/build on
  every PR, and a Jenkins pipeline for build → Docker image → registry
  push → deploy, provisioned onto a bare Ubuntu host via Ansible.
- Authored production-ready Kubernetes manifests (Deployment, Service,
  Ingress with TLS, resource limits, liveness/readiness probes, HPA) and
  an Nginx reverse-proxy layer with gzip, caching, and rate limiting.

## Longer (for a portfolio "About this project" page or cover letter)

This repository is a personal portfolio site, but it's built and deployed
the way a small production service would be, not as a static export. The
application itself is a Next.js 16 App Router site in TypeScript, styled
with Tailwind CSS and animated with Framer Motion, with prerendered
marketing pages and a server-side contact form endpoint.

Around that application sits a deployment stack I designed end-to-end: a
multi-stage Dockerfile producing a minimal, non-root runtime image; an
Nginx reverse proxy configured with gzip, immutable asset caching, and
per-route rate limiting; a GitHub Actions workflow gating every pull
request on lint/type-check/build; a Jenkins pipeline modeling the fuller
build → containerize → push → deploy flow a company's internal CI would
run after merge; an Ansible playbook that provisions a bare Ubuntu host
with everything the stack needs (Docker, Nginx, Jenkins, Node.js) in one
run; and a complete set of Kubernetes manifests — namespace, ConfigMap,
Secret template, Deployment with resource limits and health probes,
Service, TLS-terminating Ingress, and an HPA — ready to apply the moment
a cluster is available.

The goal was to make the operational half of the project as deliberate as
the frontend half: every config file is commented, every choice (why
standalone output, why Nginx in front of Node rather than instead of it,
why non-root containers) is documented in `docs/architecture.md`, and
nothing here is a placeholder that doesn't actually work.

# Deployment Guide

There are four deployment paths documented here, from simplest to most
production-like. Pick the one that matches what you're demonstrating.

## 1. Vercel (simplest — what the live portfolio actually runs on)

No custom install or build command needed:

```
Build Command:   npm run build
Install Command: npm install
Output:          (auto-detected — Next.js)
```

Push to a GitHub repo, import it in Vercel, done. This is the fastest
path and the one most recruiters will actually click on.

## 2. Local Docker

```bash
./scripts/docker-build.sh
docker run -p 3000:3000 portfolio:latest
```

Open http://localhost:3000. The container runs `node server.js` directly
against the standalone build — no `npm install` happens at container
start, which is the whole point of the multi-stage build.

## 3. Docker Compose (app + Nginx reverse proxy)

This is the closest to how a small production deployment would actually
look — Nginx in front, handling TLS/caching/rate-limiting, proxying to
the app container over an internal network.

```bash
./scripts/compose-up.sh
# or directly:
docker compose -f docker/docker-compose.yml up --build -d
```

Open http://localhost (port 80, via Nginx — not 3000 directly).

For local development with hot reload instead:

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

## 4. Kubernetes (documented, not deployed by default)

Per the brief this repo was built against, the manifests in `k8s/` are
production-ready but intentionally **not** applied against a live
cluster — there's no cluster wired to this repo yet. To actually deploy:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.example.yaml   # after copying to secret.yaml and filling in real values
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Optional, once metrics-server is installed on the cluster:
kubectl apply -f k8s/hpa.yaml
```

Before applying `deployment.yaml`, replace `YOUR_REGISTRY/portfolio:latest`
with a real image pushed to your registry (see the Jenkins pipeline's
"Docker Push" stage, or push manually):

```bash
docker tag portfolio:latest ghcr.io/YOUR_USERNAME/portfolio:latest
docker push ghcr.io/YOUR_USERNAME/portfolio:latest
```

And before applying `ingress.yaml`, replace the placeholder host
(`vishalranga.dev`) with your real domain, and point its DNS at your
ingress controller's external IP.

## Provisioning a server from scratch (Ansible)

If deploying to a bare Ubuntu VM rather than a managed platform,
`ansible/playbook.yml` installs Git, Docker, Node.js, Nginx, and Jenkins
in one run:

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --ask-become-pass
```

Edit `ansible/inventory.ini` first with the real host/user/SSH key.

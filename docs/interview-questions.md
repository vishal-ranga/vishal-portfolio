# Interview Questions You Could Get About This Project (with Answers)

## Frontend / Next.js

**Q: Why the App Router instead of Pages Router?**
A: The App Router is where Next.js has put active development since 13 —
React Server Components, nested layouts, and colocated route handlers
(`app/api/contact/route.ts`) all come from it. Server Components also mean
less JavaScript shipped to the client by default: components that don't
need interactivity render fully on the server.

**Q: Why `output: "standalone"` in `next.config.ts`?**
A: It makes `next build` trace the exact set of dependencies each page
actually imports and copy only those into `.next/standalone`, instead of
requiring the whole `node_modules` tree in the deployment artifact. That's
what keeps the Docker image lean — the runtime stage never runs
`npm install`, it just copies the already-traced output.

**Q: How would you improve Core Web Vitals further?**
A: Three concrete levers already in play: static generation for every page
that doesn't need per-request data, `next/image`-equivalent handling for
the profile photo, and self-hosted fonts via `@fontsource/*` (avoids a
render-blocking request to Google Fonts). Beyond that, the next lever
would be route-level code-splitting for anything Framer Motion touches
that isn't above the fold.

## Docker

**Q: Walk me through the multi-stage Dockerfile.**
A: Three stages. `deps` installs dependencies with `npm ci` off a
manifest-only COPY, so that layer is cached and skipped on rebuilds where
`package.json`/`package-lock.json` didn't change. `builder` copies in the
full source and runs `next build`. `runner` is the actual shipped image —
it copies only `public/`, `.next/standalone`, and `.next/static` from the
builder stage, runs as a non-root user, and starts `node server.js`
directly. No build tools, no dev dependencies, no source ever ship in the
final image.

**Q: Why run as a non-root user?**
A: If the container is ever compromised — a dependency vulnerability, a
request-smuggling bug, whatever — a non-root process limits what an
attacker can do inside the container (can't bind privileged ports, can't
write outside its own file ownership). It's a small addition
(`addgroup`/`adduser` + `USER nextjs`) that removes an entire class of
easy privilege escalation.

**Q: What's the HEALTHCHECK doing?**
A: It hits `/api/health` — a route that does no dependency calls, just
confirms the Node process is alive and responding — every 30 seconds.
Docker marks the container `unhealthy` after 3 consecutive failures,
which is what orchestrators (Compose, Swarm, or a rollout controller)
use to decide whether to route traffic to it or restart it.

## Kubernetes

**Q: Why both a liveness and a readiness probe pointed at the same
endpoint?**
A: They answer different questions even when checking the same route.
Readiness asks "should this pod currently receive traffic?" — if it
fails, the pod is pulled from the Service's endpoints but left running.
Liveness asks "is this pod stuck and needs a restart?" — if it fails
repeatedly, Kubernetes kills and restarts the container. Same health
signal, different consequence.

**Q: Why `maxUnavailable: 0` in the rolling update strategy?**
A: It guarantees full capacity is maintained during a deploy — Kubernetes
must bring up a new pod (`maxSurge: 1`) before terminating an old one,
rather than ever dropping below the replica count. For a 2-replica
deployment this means zero-downtime rollouts, at the cost of briefly
running 3 pods during the transition.

**Q: The Secret is checked in as `secret.example.yaml`, not `secret.yaml`
— why?**
A: Kubernetes Secrets are base64-encoded, not encrypted, so they should
never be committed with real values regardless of repo visibility. The
`.example` file documents the expected shape; the real `secret.yaml` is
gitignored and only ever exists on the machine/CI runner applying it — or
better, is managed by an actual secrets manager instead of a plain
Kubernetes Secret at all.

## CI/CD

**Q: Why both GitHub Actions and a Jenkinsfile — isn't that redundant?**
A: In a real org they usually serve different moments in the pipeline.
GitHub Actions here is the fast, always-on check gating every PR — install,
lint, type-check, build, nothing that needs infrastructure. The Jenkins
pipeline models what runs after merge, where you need long-lived build
agents with Docker installed, registry credentials, and a real deploy
target — the kind of setup that's more common to self-host on an internal
Jenkins instance than to run inside a SaaS Action runner.

**Q: How do you keep secrets out of the Jenkinsfile?**
A: `withCredentials` pulls the registry username/password from Jenkins'
credential store by ID (`dockerhub-credentials`) at runtime — the
Jenkinsfile itself never contains a value, only a reference to where the
value lives.

## Nginx

**Q: Why terminate at Nginx instead of exposing the Node server directly?**
A: Node's HTTP server is fine at handling application logic but isn't
where you want TLS termination, static asset caching, or rate limiting to
live — Nginx does all three more efficiently and with far more battle-
tested defaults. It also means the app container's port is never directly
reachable from outside the Docker network; only Nginx is.

**Q: What does the rate limit on `/api/` actually protect against?**
A: `limit_req_zone ... rate=10r/s` with `burst=20 nodelay` caps sustained
request rate per client IP to the contact-form endpoint, which is the one
route on this site that does real work server-side (validates and
processes form input). It's a basic defense against scripted abuse of
that endpoint without needing a full WAF.

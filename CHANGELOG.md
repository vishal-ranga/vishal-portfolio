# Changelog — DevOps Modernization Pass

Everything below was verified by actually running `npm install`, `npm run
lint`, `npx tsc --noEmit`, and `npm run build` locally — not assumed.

## Dependency updates

| Package | Before | After | Note |
|---|---|---|---|
| `react`, `react-dom` | 19.2.4 | ^19.2.7 | patch bump |
| `@types/node` | ^20 | ^22 | matches Node 22 LTS used in the Docker base image |
| `@types/react` | ^19 | ^19.2.17 | pinned to latest |
| `@types/react-dom` | ^19 | ^19.2.3 | pinned to latest |
| `@tailwindcss/postcss`, `tailwindcss` | ^4 | ^4.3.3 | pinned to latest 4.x |
| `eslint` | ^9 | ^9.39.5 | latest **9.x** — see "Decisions" below for why not 10 |
| `typescript` | ^5 | ^6.0.3 | latest **6.x** — see "Decisions" below for why not 7 |
| `next`, `eslint-config-next`, `framer-motion`, `lucide-react`, `@fontsource/*` | — | unchanged | already on latest at time of this pass |

## Breaking change fixed: `lucide-react` removed brand icons

`lucide-react` no longer exports `GitHub` or `LinkedIn` icon components —
the package dropped brand/logo marks from its published set. The build
failed on 5 files that imported them. Fixed by adding
`components/icons/BrandIcons.tsx`, two local SVG components
(`GitHubIcon`, `LinkedInIcon`) drawn in the same 24×24 stroke-based style
as the rest of the site's lucide icons, and swapping the imports in:

- `components/Footer.tsx`
- `components/Contact.tsx`
- `components/CommandPalette.tsx`
- `components/ProjectsGrid.tsx`
- `app/projects/[slug]/page.tsx`

Zero visual or layout change — same icon size, same stroke weight, same
`currentColor` behavior.

## Decisions worth knowing about

**TypeScript stayed on 6.x, not 7.x.** TypeScript 7.0 (the native Go-port
compiler, "Project Corsa") reached general availability on July 8, 2026.
It was tried here, but it broke `typescript-eslint` (used internally by
`eslint-config-next`) with a hard crash — TS 7.0 ships without the stable
programmatic compiler API that tool needs; that lands in 7.1, expected
around October 2026. TypeScript 6.0.3, the officially recommended
transition release, is what's pinned instead. This is a real, current
ecosystem constraint, not an oversight — revisit once `typescript-eslint`
publishes TS 7.1 support.

**ESLint stayed on 9.x, not 10.x.** `eslint-config-next@16.2.10`'s plugin
chain (`eslint-plugin-import`, `eslint-plugin-jsx-a11y`, etc.) declares
peer support only up to `eslint@^9`. Installing `eslint@10` produced
invalid peer resolutions. Pinned to the latest 9.x release instead.

**`next.config.ts` no longer accepts `eslint`/`typescript` config keys.**
Next.js 16 decoupled ESLint from `next build` (there's no more integrated
`next lint`). The keys were removed from the config rather than left in
as dead, type-error-producing config.

**One un-actionable `npm audit` finding.** A moderate PostCSS advisory
appears in the audit output, but it's inside `next`'s own bundled internal
`postcss` dependency (v8.4.31), not the app's actual Tailwind pipeline
(which resolves to a safe v8.5.20). `npm audit fix --force` would
downgrade `next` to version 9 to "fix" it — not a real fix. Documenting
this rather than hiding it or force-downgrading the framework.

## Configuration changes

- Removed a dev-only `allowedDevOrigins` IP allowlist from
  `next.config.ts` (was scoped to one developer's local network setup).
- Added `output: "standalone"` — required for the lean multi-stage Docker
  build.
- Added global security headers (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) via
  `next.config.ts` `headers()`.
- Added `app/api/health/route.ts` — a dependency-free health check used
  by the Docker `HEALTHCHECK`, Kubernetes liveness/readiness probes, and
  the Nginx health passthrough.

## New: full DevOps layer

Everything under `docker/`, `nginx/`, `jenkins/`, `.github/workflows/`,
`ansible/`, `terraform/`, `k8s/`, `scripts/`, and `docs/` is new in this
pass. See `README.md` for the full folder structure and `docs/` for the
explanations behind each piece.

## Note on the requested folder layout

The original brief asked for GitHub Actions to live at
`github/workflows/ci.yml`. That path is placed at `.github/workflows/ci.yml`
instead — GitHub only discovers workflow files under the dotted
`.github/` directory; a non-dotted `github/` folder is invisible to
GitHub Actions entirely. Flagging this explicitly rather than shipping a
workflow file GitHub would silently never run.

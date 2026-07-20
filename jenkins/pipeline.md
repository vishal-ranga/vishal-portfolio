# Jenkins Pipeline

This project ships a declarative `Jenkinsfile` (in this folder) that models a
realistic CI/CD flow for a containerized Next.js application.

## Stages

| Stage             | What it does                                             | Gate |
|--------------------|-----------------------------------------------------------|------|
| Checkout           | Pulls the source from SCM                                 | —    |
| Install Dependencies | `npm ci` — fails the build on any lockfile drift         | Yes  |
| Lint               | `npm run lint` (ESLint, flat config)                       | Yes  |
| Type Check         | `npx tsc --noEmit`                                         | Yes  |
| Test               | Runs `npm test` if a test script exists                    | Conditional |
| Build              | `npm run build` (Next.js production build)                 | Yes  |
| Docker Build       | Builds the multi-stage image from `docker/Dockerfile`      | Yes  |
| Docker Push        | Pushes `:latest` and `:<build number>` tags — `main` only  | Yes  |
| Deploy             | Placeholder — swap in `kubectl`, Ansible, or a Vercel hook  | `main` only |

## Setting this up on a real Jenkins instance

1. **Agent requirements**: Node.js 22.x and Docker CLI available on the
   build agent. `ansible/playbook.yml` in this repo provisions exactly
   that on a fresh Ubuntu host.
2. **Credentials**: create a Jenkins credential of type "Username with
   password" named `dockerhub-credentials` (or update the ID in the
   `Jenkinsfile`) pointing at your container registry.
3. **Job type**: create a "Pipeline" job (or "Multibranch Pipeline" if you
   want PR branches to run lint/build automatically), pointing "Pipeline
   script from SCM" at this repository with the script path set to
   `jenkins/Jenkinsfile`.
4. **Registry**: replace `REGISTRY = 'docker.io/YOUR_DOCKERHUB_USERNAME'`
   in the `Jenkinsfile` with your actual registry path (Docker Hub, GHCR,
   ECR, etc.).
5. **Deploy stage**: this is intentionally a placeholder. In a real
   environment it would typically call one of:
   - `kubectl set image deployment/portfolio portfolio=$REGISTRY/$IMAGE_NAME:$IMAGE_TAG -n portfolio`
   - `ansible-playbook -i ansible/inventory.ini ansible/playbook.yml`
   - A Vercel deploy hook URL (`curl -X POST $VERCEL_DEPLOY_HOOK`)

## Why a "Test" stage that's conditional

There's no test suite committed to this repository yet, so the pipeline
detects whether `package.json` defines a `test` script and only runs it if
one exists. This keeps the pipeline honest — it doesn't fake a green
checkmark for tests that don't exist — while making it a zero-effort
drop-in the moment a test suite is added (Jest, Vitest, Playwright, etc.).

## Relationship to GitHub Actions

This repo also ships `.github/workflows/ci.yml`, which runs lint/type-check/
build on every push and PR. The two aren't redundant in a real company
setup: GitHub Actions is commonly used as the fast feedback loop on every
PR, while Jenkins (often running inside the company's own network, next to
internal deployment targets) handles the build → image → deploy pipeline
after a merge to `main`.

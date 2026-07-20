#!/usr/bin/env bash
# Bring up the production stack (app + Nginx) via Docker Compose.
#
# Usage: ./scripts/compose-up.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker compose -f "${REPO_ROOT}/docker/docker-compose.yml" up --build -d

echo "Stack is up. App is served via Nginx at http://localhost"
echo "Tail logs with: docker compose -f docker/docker-compose.yml logs -f"

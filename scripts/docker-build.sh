#!/usr/bin/env bash
# Build the production Docker image from the repository root.
#
# Usage: ./scripts/docker-build.sh [tag]

set -euo pipefail

TAG="${1:-portfolio:latest}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "Building ${TAG} from ${REPO_ROOT} ..."
docker build \
  -f "${REPO_ROOT}/docker/Dockerfile" \
  -t "${TAG}" \
  "${REPO_ROOT}"

echo "Done. Run it with:"
echo "  docker run -p 3000:3000 ${TAG}"

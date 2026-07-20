#!/usr/bin/env bash
# Runs the same checks as CI, locally, before you push.
#
# Usage: ./scripts/verify.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${REPO_ROOT}"

echo "==> Installing dependencies (npm ci)"
npm ci --no-audit --no-fund

echo "==> Linting"
npm run lint

echo "==> Type checking"
npx tsc --noEmit

echo "==> Building"
npm run build

echo ""
echo "All checks passed."

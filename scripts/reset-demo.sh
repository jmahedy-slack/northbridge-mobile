#!/usr/bin/env bash
# Restore this repository to the tagged vulnerable demonstration baseline.
# Usage: RESET_DEMO=true ./scripts/reset-demo.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TAG="demo-baseline-vulnerable"

if [[ "${RESET_DEMO:-}" != "true" ]]; then
  echo "Refusing to reset."
  echo "This command discards commits after ${TAG} and restores the vulnerable baseline."
  echo "Re-run with an explicit confirmation:"
  echo
  echo "  RESET_DEMO=true ./scripts/reset-demo.sh"
  echo
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This directory is not a git repository."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Working tree is not clean. Commit, stash, or discard local changes before resetting."
  echo
  git status --short
  echo
  echo "The reset was not performed."
  exit 1
fi

if ! git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null; then
  echo "Tag ${TAG} is not present locally. Fetching tags…"
  git fetch --tags --force origin "${TAG}:refs/tags/${TAG}" 2>/dev/null || git fetch --tags origin
fi

if ! git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null; then
  echo "Could not find tag ${TAG}."
  exit 1
fi

git reset --hard "${TAG}"

rm -rf .expo dist web-build coverage .metro-health-check* .tsbuildinfo
rm -f expo-env.d.ts

echo
echo "Vulnerable demonstration baseline restored."
echo "  tag:    ${TAG}"
echo "  commit: $(git rev-parse --short HEAD) ($(git rev-parse HEAD))"
echo "  branch: $(git branch --show-current || echo '(detached)')"
echo
echo "The application is in the insecure baseline state. Do not ship this build."

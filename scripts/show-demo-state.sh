#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

TAG="demo-baseline-vulnerable"

branch="$(git branch --show-current 2>/dev/null || echo '(detached)')"
commit="$(git rev-parse HEAD 2>/dev/null || echo 'unknown')"
short="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
dirty="$(git status --porcelain)"
clean="yes"
[[ -n "$dirty" ]] && clean="no"

tag_at_head="none"
if git describe --tags --exact-match HEAD >/dev/null 2>&1; then
  tag_at_head="$(git describe --tags --exact-match HEAD)"
fi

baseline_commit="missing"
if git rev-parse -q --verify "refs/tags/${TAG}" >/dev/null; then
  baseline_commit="$(git rev-parse "${TAG}")"
fi

baseline_active="no"
if [[ "$commit" == "$baseline_commit" ]]; then
  baseline_active="yes"
fi

echo "Northbridge Mobile — demo state"
echo "  branch:                 ${branch}"
echo "  commit:                 ${short} (${commit})"
echo "  tag at HEAD:            ${tag_at_head}"
echo "  working tree clean:     ${clean}"
echo "  vulnerable baseline:    ${baseline_active}"
if [[ "$baseline_commit" != "missing" ]]; then
  echo "  ${TAG}:  $(git rev-parse --short "${TAG}")"
fi
if [[ "$clean" == "no" ]]; then
  echo
  git status --short
fi

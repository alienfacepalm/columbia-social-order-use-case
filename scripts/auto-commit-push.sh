#!/usr/bin/env bash
# Check for changes, commit, and push. Run once or periodically.
# Usage:
#   ./scripts/auto-commit-push.sh           # run once
#   ./scripts/auto-commit-push.sh 60        # run every 60 seconds

set -e
cd "$(dirname "$0")/.."

do_commit_push() {
  if [[ -n "$(git status --porcelain)" ]]; then
    git add .
    git commit -m "Auto-save: $(date '+%Y-%m-%d %H:%M:%S')"
    git push
    echo "[$(date '+%H:%M:%S')] Committed and pushed."
  else
    echo "[$(date '+%H:%M:%S')] No changes."
  fi
}

INTERVAL="${1:-0}"

if [[ "$INTERVAL" =~ ^[0-9]+$ ]] && [[ "$INTERVAL" -gt 0 ]]; then
  echo "Checking for changes every ${INTERVAL}s (Ctrl+C to stop)."
  while true; do
    do_commit_push
    sleep "$INTERVAL"
  done
else
  do_commit_push
fi

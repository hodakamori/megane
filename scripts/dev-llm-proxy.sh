#!/usr/bin/env bash
#
# scripts/dev-llm-proxy.sh
#
# One-shot launcher for trying out the docs-demo "Free Demo" AI chat locally:
#   1. Builds WASM if it hasn't been built yet
#   2. Starts the Cloudflare Worker proxy (`wrangler dev`) in the background
#   3. Points the Vite dev server at it via VITE_LLM_PROXY_URL and starts it
#
# Both processes run in the foreground of this script; Ctrl-C stops both.
#
# Prerequisites:
#   - workers/llm-proxy/.dev.vars must exist with a real OPENROUTER_API_KEY
#     (copy workers/llm-proxy/.dev.vars.example and fill it in — see
#     https://openrouter.ai/keys for a free key)
#
# Usage:
#   scripts/dev-llm-proxy.sh
#
# Options:
#   --proxy-port <port>   Port for `wrangler dev` (default 8787)
#   --app-port <port>     Port for the Vite dev server (default 5173)
#   -h | --help           Show this help

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

PROXY_PORT=8787
APP_PORT=5173

while [[ $# -gt 0 ]]; do
  case "$1" in
    --proxy-port)
      PROXY_PORT="$2"
      shift 2
      ;;
    --app-port)
      APP_PORT="$2"
      shift 2
      ;;
    -h|--help)
      sed -n '3,23p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

PROXY_DIR="$REPO_ROOT/workers/llm-proxy"
DEV_VARS="$PROXY_DIR/.dev.vars"

if [[ ! -f "$DEV_VARS" ]]; then
  echo "error: $DEV_VARS not found." >&2
  echo "       Copy workers/llm-proxy/.dev.vars.example to .dev.vars and fill in" >&2
  echo "       a real OPENROUTER_API_KEY (free key: https://openrouter.ai/keys)." >&2
  exit 1
fi

if ! grep -q "^ALLOWED_ORIGIN=" "$DEV_VARS"; then
  echo "warning: $DEV_VARS has no ALLOWED_ORIGIN override." >&2
  echo "         Add ALLOWED_ORIGIN=http://localhost:$APP_PORT or the proxy will" >&2
  echo "         reject requests from the local Vite dev server with 403." >&2
fi

if [[ ! -d "$REPO_ROOT/crates/megane-wasm/pkg" ]]; then
  echo "==> WASM package not found, building it (this may take a while)..."
  npm run build:wasm
fi

PROXY_URL="http://localhost:$PROXY_PORT"
PIDS=()

cleanup() {
  echo
  echo "==> Stopping background processes..."
  for pid in "${PIDS[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "==> Starting LLM proxy worker on $PROXY_URL ..."
(
  cd "$PROXY_DIR"
  npx wrangler dev --port "$PROXY_PORT"
) &
PIDS+=("$!")

echo "==> Waiting for the proxy to come up..."
for _ in $(seq 1 30); do
  status=0
  curl -s -o /dev/null --max-time 1 "$PROXY_URL" || status=$?
  # exit code 7 = "couldn't connect"; anything else means the port is open
  # and the worker responded (even with a 4xx for a bare GET).
  [[ "$status" -ne 7 ]] && break
  sleep 1
done

echo "==> Starting Vite dev server on http://localhost:$APP_PORT ..."
echo "    VITE_LLM_PROXY_URL=$PROXY_URL"
VITE_LLM_PROXY_URL="$PROXY_URL" npx vite --port "$APP_PORT" &
PIDS+=("$!")

wait

#!/usr/bin/env bash
#
# Install code-server + the Microsoft Jupyter extension family + the locally
# built megane VSIX into a deterministic --user-data-dir under
# /tmp/megane-code-server (or the path in MEGANE_CODE_SERVER_DIR).
#
# Used by tests/e2e/widget-vscode.spec.ts and tests/e2e/vscode.spec.ts.
# Idempotent: re-running is a no-op when nothing is missing or out of date.
#
# Override the binary location with `MEGANE_CODE_SERVER_BIN=/path/to/code-server`
# if your distro has it pre-installed somewhere unusual.
set -euo pipefail

CS_DIR="${MEGANE_CODE_SERVER_DIR:-/tmp/megane-code-server}"
mkdir -p "$CS_DIR"

CS_BIN="${MEGANE_CODE_SERVER_BIN:-}"
if [[ -z "$CS_BIN" ]]; then
  if command -v code-server >/dev/null 2>&1; then
    CS_BIN="$(command -v code-server)"
  else
    echo "[install-code-server] installing code-server"
    curl -fsSL https://code-server.dev/install.sh | sh
    CS_BIN="$(command -v code-server)"
  fi
fi
echo "[install-code-server] using $CS_BIN"

"$CS_BIN" --user-data-dir "$CS_DIR" --install-extension ms-toolsai.jupyter
"$CS_BIN" --user-data-dir "$CS_DIR" --install-extension ms-python.python

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VSIX="$(ls -1 "$REPO_ROOT"/vscode-megane/vscode-megane-*.vsix 2>/dev/null | sort -V | tail -1 || true)"
if [[ -z "$VSIX" ]]; then
  echo "[install-code-server] no VSIX found under vscode-megane/. Run 'npm --prefix vscode-megane run package' first." >&2
  exit 1
fi
echo "[install-code-server] installing $VSIX"
"$CS_BIN" --user-data-dir "$CS_DIR" --install-extension "$VSIX"

echo "[install-code-server] done. user-data-dir=$CS_DIR"

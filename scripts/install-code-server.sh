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
#
# The default installer (https://code-server.dev/install.sh) downloads a
# prebuilt binary from GitHub Releases. In sandboxed / proxied environments
# that fetch is often blocked (HTTP 403). Set MEGANE_CODE_SERVER_USE_NPM=1 (or
# leave the curl installer to fail — this script falls back automatically) to
# build code-server from the npm package into MEGANE_CODE_SERVER_PREFIX
# (default: <repo>/.code-server). The npm build compiles native modules:
#   - kerberos needs the GSSAPI headers → install `libkrb5-dev` (Debian/Ubuntu)
#     or `krb5-devel` (Fedora) first, otherwise node-gyp fails on
#     `gssapi/gssapi.h: No such file or directory`.
#   - @vscode/ripgrep's postinstall downloads a prebuilt rg from GitHub, which
#     is also blocked behind the same proxy; the fallback seeds the system `rg`
#     (must be on PATH) so that download is skipped.
set -euo pipefail

CS_DIR="${MEGANE_CODE_SERVER_DIR:-/tmp/megane-code-server}"
mkdir -p "$CS_DIR"

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Build code-server from the npm package when the prebuilt binary is
# unavailable. Echoes the resulting binary path on success, returns non-zero
# on failure.
install_code_server_via_npm() {
  local prefix="${MEGANE_CODE_SERVER_PREFIX:-$REPO_ROOT/.code-server}"
  local bin="$prefix/node_modules/.bin/code-server"
  if [[ -x "$bin" ]] && "$bin" --version >/dev/null 2>&1; then
    echo "$bin"
    return 0
  fi

  echo "[install-code-server] building code-server from npm into $prefix" >&2
  if ! command -v rg >/dev/null 2>&1; then
    echo "[install-code-server] WARNING: system 'rg' (ripgrep) not on PATH; @vscode/ripgrep will try to download a prebuilt binary and may fail behind a proxy." >&2
  fi

  mkdir -p "$prefix"
  # Give the prefix its own package.json so `npm install` treats it as an
  # isolated project. Without it npm walks up to the repo root's package.json
  # and installs code-server into the repo's node_modules instead.
  [[ -f "$prefix/package.json" ]] || echo '{"name":"megane-code-server-host","private":true}' > "$prefix/package.json"
  # Install without running the native/download postinstall so a blocked
  # ripgrep fetch doesn't abort the whole install.
  (cd "$prefix" && npm install code-server --unsafe-perm --no-save --ignore-scripts) >&2

  local cs_pkg="$prefix/node_modules/code-server"
  local vscode_dir="$cs_pkg/lib/vscode"
  (cd "$vscode_dir" && npm install --unsafe-perm --omit=dev --ignore-scripts) >&2

  # Seed the system ripgrep so @vscode/ripgrep's postinstall skips its
  # GitHub download (it exits early when bin/ already exists).
  if command -v rg >/dev/null 2>&1; then
    local rgpath
    rgpath="$(command -v rg)"
    find "$cs_pkg" -type d -path "*@vscode/ripgrep" 2>/dev/null | while read -r rgdir; do
      mkdir -p "$rgdir/bin"
      cp "$rgpath" "$rgdir/bin/rg"
    done
  fi

  # Now compile the native modules (kerberos, sqlite3, spdlog, ...) and run
  # the code-server postinstall (symlinks + built-in extension deps).
  (cd "$vscode_dir" && npm rebuild --unsafe-perm) >&2
  (cd "$cs_pkg" && npm_config_unsafe_perm=true npm run postinstall) >&2

  [[ -x "$bin" ]] && "$bin" --version >/dev/null 2>&1 && { echo "$bin"; return 0; }
  return 1
}

CS_BIN="${MEGANE_CODE_SERVER_BIN:-}"
if [[ -z "$CS_BIN" ]]; then
  if command -v code-server >/dev/null 2>&1; then
    CS_BIN="$(command -v code-server)"
  elif [[ "${MEGANE_CODE_SERVER_USE_NPM:-0}" == "1" ]]; then
    CS_BIN="$(install_code_server_via_npm)"
  else
    echo "[install-code-server] installing code-server via code-server.dev"
    if curl -fsSL https://code-server.dev/install.sh | sh; then
      CS_BIN="$(command -v code-server)"
    else
      echo "[install-code-server] code-server.dev installer failed; falling back to npm build" >&2
      CS_BIN="$(install_code_server_via_npm)"
    fi
  fi
fi
echo "[install-code-server] using $CS_BIN"

"$CS_BIN" --user-data-dir "$CS_DIR" --install-extension ms-toolsai.jupyter
"$CS_BIN" --user-data-dir "$CS_DIR" --install-extension ms-python.python

VSIX="$(ls -1 "$REPO_ROOT"/vscode-megane/vscode-megane-*.vsix 2>/dev/null | sort -V | tail -1 || true)"
if [[ -z "$VSIX" ]]; then
  echo "[install-code-server] no VSIX found under vscode-megane/. Run 'npm --prefix vscode-megane run package' first." >&2
  exit 1
fi
echo "[install-code-server] installing $VSIX"
"$CS_BIN" --user-data-dir "$CS_DIR" --install-extension "$VSIX"

echo "[install-code-server] done. user-data-dir=$CS_DIR"

#!/usr/bin/env bash
#
# scripts/setup-local.sh
#
# One-shot installer for local development / manual testing of megane:
#   * Python package (megane) via maturin develop
#   * JupyterLab extension (megane-jupyterlab, shipped inside the wheel)
#   * VSCode extension (.vsix built from vscode-megane/, optionally installed
#     into a code / code-insiders / codium / code-server / cursor CLI)
#
# The script is idempotent: re-running is a no-op when nothing is missing.
# All steps can be run individually via subcommands.
#
# Usage:
#   scripts/setup-local.sh                 # install everything (python + vscode)
#   scripts/setup-local.sh all             # same
#   scripts/setup-local.sh python          # build frontend + maturin develop
#   scripts/setup-local.sh jupyter         # alias for `python` (lab ext is in wheel)
#   scripts/setup-local.sh vscode          # build + package + install VSIX
#   scripts/setup-local.sh doctor          # print environment status
#   scripts/setup-local.sh clean           # remove local build artifacts
#
# Options (must come AFTER the subcommand, if any):
#   --skip-deps             skip npm install / uv sync / wasm-pack / maturin install
#   --no-vscode-install     build the .vsix but do not install it into a code CLI
#   --code-bin <path>       explicit code/code-server/codium binary to install into
#   --code-server-userdir   when installing into code-server, use the dir that
#                           install-code-server.sh uses (/tmp/megane-code-server)
#   -h | --help             show help
#
# Environment overrides:
#   MEGANE_CODE_BIN         same as --code-bin
#   MEGANE_CODE_SERVER_DIR  --user-data-dir for code-server (default
#                           /tmp/megane-code-server when --code-server-userdir
#                           is set or the binary is code-server)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

# ----- logging helpers ------------------------------------------------------
log()  { printf '\033[1;34m[setup-local]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[setup-local]\033[0m %s\n' "$*" >&2; }
err()  { printf '\033[1;31m[setup-local]\033[0m %s\n' "$*" >&2; }
have() { command -v "$1" >/dev/null 2>&1; }

# ----- argument parsing -----------------------------------------------------
SUBCOMMAND="all"
SKIP_DEPS=0
INSTALL_VSCODE=1
CODE_BIN="${MEGANE_CODE_BIN:-}"
USE_CODE_SERVER_USERDIR=0

print_help() {
  sed -n '2,35p' "$0" | sed 's/^# \{0,1\}//'
}

# Optional first positional = subcommand.
if [[ $# -gt 0 && "$1" != -* ]]; then
  SUBCOMMAND="$1"
  shift
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-deps) SKIP_DEPS=1 ;;
    --no-vscode-install) INSTALL_VSCODE=0 ;;
    --code-bin) CODE_BIN="$2"; shift ;;
    --code-server-userdir) USE_CODE_SERVER_USERDIR=1 ;;
    -h|--help) print_help; exit 0 ;;
    *) err "unknown option: $1"; print_help; exit 2 ;;
  esac
  shift
done

case "$SUBCOMMAND" in
  all|python|jupyter|vscode|doctor|clean) ;;
  *) err "unknown subcommand: $SUBCOMMAND"; print_help; exit 2 ;;
esac

# ----- prerequisite checks --------------------------------------------------
ensure_prereqs() {
  have cargo  || { err "cargo not found (install Rust toolchain)"; exit 1; }
  have node   || { err "node not found (need Node.js 22+)"; exit 1; }
  have npm    || { err "npm not found"; exit 1; }

  if ! have wasm-pack; then
    log "wasm-pack missing -> cargo install wasm-pack"
    cargo install wasm-pack
  fi
  if ! have maturin; then
    log "maturin missing -> installing"
    if have uv;  then uv pip install --system maturin || pip install maturin
    elif have pip; then pip install maturin
    else err "neither uv nor pip available; cannot install maturin"; exit 1
    fi
  fi
}

# ----- shared build steps ---------------------------------------------------
ensure_npm_deps() {
  if [[ ! -d node_modules ]]; then
    log "installing root npm deps"
    npm install
  else
    log "node_modules present (skip npm install; pass no flag to refresh manually)"
  fi
}

ensure_wasm_built() {
  if [[ ! -d crates/megane-wasm/pkg ]]; then
    log "building WASM (npm run build:wasm)"
    npm run build:wasm
  else
    log "WASM pkg present"
  fi
}

ensure_uv_synced() {
  if have uv; then
    log "uv sync --extra dev"
    uv sync --extra dev
  else
    warn "uv not found; skipping Python venv sync. Install uv from https://docs.astral.sh/uv/"
  fi
}

# Run a command preferring the project's uv-managed venv if present.
run_in_env() {
  if have uv && [[ -d .venv ]]; then
    uv run "$@"
  else
    "$@"
  fi
}

# ----- python / jupyterlab --------------------------------------------------
do_python() {
  if [[ $SKIP_DEPS -eq 0 ]]; then
    ensure_prereqs
    ensure_npm_deps
    ensure_uv_synced
  fi
  ensure_wasm_built

  log "full frontend build (app + widget + lib + jupyterlab labextension)"
  npm run build

  log "maturin develop --release (installs megane + bundled labextension)"
  run_in_env maturin develop --release

  log "Python + JupyterLab extension installed."
  log "  Verify Python:     run_in_env python -c 'import megane; print(megane.__file__)'"
  log "  Verify JupyterLab: run_in_env jupyter labextension list  (look for megane-jupyterlab)"
  log "  Launch JupyterLab: run_in_env jupyter lab"
}

# ----- vscode extension -----------------------------------------------------
detect_code_bin() {
  if [[ -n "$CODE_BIN" ]]; then
    if [[ -x "$CODE_BIN" ]] || have "$CODE_BIN"; then
      printf '%s' "$CODE_BIN"
      return 0
    fi
    warn "specified --code-bin not executable: $CODE_BIN"
  fi
  for bin in code code-insiders codium vscodium cursor code-server; do
    if have "$bin"; then
      printf '%s' "$bin"
      return 0
    fi
  done
  return 1
}

install_vsix_into_code() {
  local vsix="$1"
  local bin
  if ! bin="$(detect_code_bin)"; then
    warn "no code/code-insiders/codium/cursor/code-server binary found in PATH"
    warn "install manually with:  code --install-extension $vsix"
    return 0
  fi

  local extra=()
  # If using code-server, mirror install-code-server.sh's user-data-dir layout
  # so test harnesses can find the extension.
  if [[ "$bin" == *code-server* || $USE_CODE_SERVER_USERDIR -eq 1 ]]; then
    local cs_dir="${MEGANE_CODE_SERVER_DIR:-/tmp/megane-code-server}"
    mkdir -p "$cs_dir"
    extra+=("--user-data-dir" "$cs_dir")
    log "code-server user-data-dir = $cs_dir"
  fi

  log "installing $vsix into $bin"
  "$bin" "${extra[@]}" --install-extension "$vsix" --force
}

do_vscode() {
  if [[ $SKIP_DEPS -eq 0 ]]; then
    ensure_prereqs
    ensure_npm_deps
  fi
  ensure_wasm_built

  pushd vscode-megane >/dev/null
  if [[ ! -d node_modules ]]; then
    log "installing vscode-megane npm deps"
    npm install
  fi
  log "building vscode-megane (webview + extension)"
  npm run build
  log "packaging .vsix (vsce package)"
  npm run package
  popd >/dev/null

  local vsix
  vsix="$(ls -1 vscode-megane/vscode-megane-*.vsix 2>/dev/null | sort -V | tail -1 || true)"
  if [[ -z "$vsix" ]]; then
    err "vsce produced no .vsix under vscode-megane/"
    exit 1
  fi
  log "built $vsix"

  if [[ $INSTALL_VSCODE -eq 1 ]]; then
    install_vsix_into_code "$vsix"
  else
    log "skipping VSCode install (--no-vscode-install). VSIX path: $vsix"
  fi
}

# ----- doctor ---------------------------------------------------------------
do_doctor() {
  printf '%-22s %s\n' "node"        "$({ have node && node --version; } || echo MISSING)"
  printf '%-22s %s\n' "npm"         "$({ have npm && npm --version; } || echo MISSING)"
  printf '%-22s %s\n' "cargo"       "$({ have cargo && cargo --version; } || echo MISSING)"
  printf '%-22s %s\n' "wasm-pack"   "$({ have wasm-pack && wasm-pack --version; } || echo MISSING)"
  printf '%-22s %s\n' "uv"          "$({ have uv && uv --version; } || echo MISSING)"
  printf '%-22s %s\n' "maturin"     "$({ have maturin && maturin --version; } || echo MISSING)"
  printf '%-22s %s\n' "python"      "$({ have python && python --version 2>&1; } || echo MISSING)"
  printf '%-22s %s\n' "code"        "$({ have code && code --version | head -1; } || echo "not in PATH")"
  printf '%-22s %s\n' "code-server" "$({ have code-server && code-server --version | head -1; } || echo "not in PATH")"
  printf '%-22s %s\n' "node_modules" "$([[ -d node_modules ]] && echo present || echo missing)"
  printf '%-22s %s\n' "wasm pkg"    "$([[ -d crates/megane-wasm/pkg ]] && echo present || echo missing)"
  printf '%-22s %s\n' "labext build" "$([[ -d wheel-share/data/share/jupyter/labextensions/megane-jupyterlab ]] && echo present || echo missing)"
  printf '%-22s %s\n' "vscode .vsix" "$(ls -1 vscode-megane/vscode-megane-*.vsix 2>/dev/null | tail -1 || echo "not built")"
}

# ----- clean ----------------------------------------------------------------
do_clean() {
  log "removing local build artifacts"
  rm -rf \
    dist \
    python/megane/static/app \
    python/megane/static/widget.js \
    wheel-share/data/share/jupyter/labextensions/megane-jupyterlab \
    vscode-megane/out \
    vscode-megane/webview/dist \
    jupyterlab-megane/lib \
    jupyterlab-megane/tsconfig.tsbuildinfo
  rm -f vscode-megane/vscode-megane-*.vsix
  log "done. (cargo/target and node_modules left intact; remove manually if needed)"
}

# ----- dispatch -------------------------------------------------------------
case "$SUBCOMMAND" in
  all)     do_python; do_vscode ;;
  python)  do_python ;;
  jupyter) do_python ;;  # alias: lab extension is shipped inside the wheel
  vscode)  do_vscode ;;
  doctor)  do_doctor ;;
  clean)   do_clean ;;
esac

log "setup-local: '$SUBCOMMAND' finished"

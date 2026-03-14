#!/bin/bash
# SessionStart hook: automatically set up megane dev environment
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

log() { echo "[session-start] $*"; }

# --- GitHub CLI ---
if ! command -v gh &>/dev/null; then
  log "Installing GitHub CLI..."
  GH_VERSION=$(curl -fsSL https://api.github.com/repos/cli/cli/releases/latest 2>/dev/null \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['tag_name'].lstrip('v'))" 2>/dev/null)
  if [ -n "$GH_VERSION" ]; then
    curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz" -o /tmp/gh.tar.gz \
      && tar -xzf /tmp/gh.tar.gz -C /tmp \
      && sudo cp "/tmp/gh_${GH_VERSION}_linux_amd64/bin/gh" /usr/local/bin/gh \
      && rm -rf /tmp/gh.tar.gz "/tmp/gh_${GH_VERSION}_linux_amd64"
    log "GitHub CLI installed: $(gh --version | head -1)"
  else
    log "WARNING: Could not fetch gh release info, skipping gh install"
  fi
else
  log "GitHub CLI already installed: $(gh --version | head -1)"
fi

# --- wasm-pack ---
if ! command -v wasm-pack &>/dev/null; then
  log "Installing wasm-pack..."
  cargo install wasm-pack
  log "wasm-pack installed"
else
  log "wasm-pack already installed"
fi

# --- maturin ---
if ! command -v maturin &>/dev/null; then
  log "Installing maturin..."
  pip install maturin 2>/dev/null || uv pip install maturin
  log "maturin installed"
else
  log "maturin already installed"
fi

# --- Node modules ---
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
  log "Running npm install..."
  PUPPETEER_SKIP_DOWNLOAD=1 npm install
  log "npm install complete"
else
  log "node_modules already exists"
fi

# --- WASM build ---
if [ ! -d "$PROJECT_ROOT/crates/megane-wasm/pkg" ]; then
  log "Building WASM (npm run build:wasm)..."
  npm run build:wasm
  log "WASM build complete"
else
  log "WASM pkg already built"
fi

# --- Python dependencies ---
if command -v uv &>/dev/null; then
  log "Syncing Python dependencies..."
  uv sync --extra dev 2>/dev/null || log "uv sync skipped (non-critical)"
else
  log "uv not found, skipping Python deps"
fi

log "Dev environment ready!"

#!/bin/bash
# SessionStart hook: automatically set up megane dev environment
set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

log() { echo "[session-start] $*"; }

# --- GitHub CLI ---
if ! command -v gh &>/dev/null; then
  log "Installing GitHub CLI via apt..."
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg 2>/dev/null
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null
  sudo apt-get update -qq && sudo apt-get install -y -qq gh
  log "GitHub CLI installed: $(gh --version | head -1)"
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

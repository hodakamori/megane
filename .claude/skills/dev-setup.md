---
description: Set up and verify the megane development environment. Use at session start or when build tools are missing.
---

# Dev Environment Setup & Verification

## Step 1: Check required tools

Run these checks and install if missing:
- `which wasm-pack` — if not found: `cargo install wasm-pack`
- `which maturin` — if not found: `pip install maturin`
- `which uv` — should be available at /root/.local/bin/uv
- `node --version` — should be v22+
- `cargo --version` — should be available

## Step 2: Check node_modules

If `node_modules/` does not exist, run `npm install`.

## Step 3: Check WASM build

If `crates/megane-wasm/pkg/` does not exist, run `npm run build:wasm`.
This step is REQUIRED before `npm run dev` or `npm run build` will work.

## Step 4: Check Python environment

- Run `uv sync --extra dev` to ensure Python deps are installed
- If Python tests are needed, also run `maturin develop --release` to build the native extension

## Step 5: Verify

- Run `npm test` to confirm TypeScript tests pass
- Run `cargo test -p megane-core` to confirm Rust tests pass

## Common Failures

- "wasm-pack: command not found" → `cargo install wasm-pack`
- "maturin: command not found" → `pip install maturin`
- Vite dev server fails with missing WASM → run `npm run build:wasm` first
- Python import errors → run `maturin develop --release`
- Node module not found → run `npm install`

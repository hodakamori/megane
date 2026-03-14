# megane - Claude Code Instructions

## CRITICAL RULES

1. **Commit messages MUST be in English.** Never use Japanese or any other language in commit messages.
2. **NEVER use Puppeteer.** Although `puppeteer` is in package.json, it is NOT used by any script. All E2E tests and screenshot scripts use **Playwright** from the global install at `/opt/node22/lib/node_modules/`. Scripts resolve it via `createRequire("/opt/node22/lib/node_modules/")`.
3. **Always build WASM before running the dev server or full build.** The WASM pkg directory (`crates/megane-wasm/pkg/`) does not exist until `npm run build:wasm` is run.

## Dev Environment Setup

Required tools (install if missing):
- `wasm-pack`: `cargo install wasm-pack`
- `maturin`: `pip install maturin` or `uv pip install maturin`
- Node.js 22+, Rust/Cargo, Python 3.11, uv

Setup sequence:
```
npm install
cargo install wasm-pack     # if `which wasm-pack` fails
npm run build:wasm           # MUST run before dev server
uv sync --extra dev          # Python dependencies
```

## Project Overview

megane is a molecular viewer: Rust core (parsers) + TypeScript/React frontend (Three.js) + Python backend (FastAPI/anywidget).
Rust compiles to both PyO3 (Python) and WASM (browser) via a Cargo workspace with three crates:
- `megane-core` — Core parsers (PDB, GRO, XYZ, MOL, CIF, LAMMPS, XTC, .traj)
- `megane-wasm` — WASM bindings (wasm-bindgen)
- `megane-python` — PyO3 Python extension

## Key Commands

| Command | What it does |
|---|---|
| `npm run build:wasm` | Compile Rust to WASM (MUST run first) |
| `npm run build` | Full build: WASM + tsc + Vite app + Vite widget |
| `npm run dev` | Vite dev server (requires WASM already built) |
| `maturin develop --release` | Build+install Python extension (editable) |
| `npm test` | TypeScript unit tests (vitest) |
| `cargo test -p megane-core` | Rust parser tests |
| `python -m pytest` | Python tests (needs maturin develop first) |
| `node tests/e2e/snapshot.test.mjs` | E2E visual snapshot tests (Playwright) |
| `node tests/e2e/snapshot.test.mjs --update` | Update E2E snapshot baselines |
| `make test-all` | All tests combined |
| `node scripts/dev-preview.mjs --screenshot` | Dev preview screenshots |
| `node scripts/capture-screenshots.mjs` | Hero screenshot for docs |

## Architecture

- TypeScript source: `src/` (import alias `@/` → `src/`)
- Python source: `python/megane/`
- Rust crates: `crates/{megane-core,megane-python,megane-wasm}/`
- Vite configs: `vite.config.ts` (app), `vite.widget.config.ts` (widget), `vite.webview.config.ts` (VSCode)
- App builds to: `python/megane/static/app/`
- Widget builds to: `dist/`
- Test fixtures: `tests/fixtures/` (PDB, XYZ, XTC files)
- E2E snapshots: `tests/e2e/snapshots/`

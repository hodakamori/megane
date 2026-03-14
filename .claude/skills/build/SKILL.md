---
description: Build megane components (WASM, frontend, Python wheel). Use when asked to build or when build errors occur.
---

# Building megane

## Build Order (IMPORTANT)

WASM must be built BEFORE TypeScript/Vite. The dependency chain is:

1. `npm run build:wasm` — Compiles Rust to WASM (creates `crates/megane-wasm/pkg/`)
2. `tsc` — TypeScript compilation (imports from WASM pkg)
3. `vite build` — Bundles the app
4. `vite build --config vite.widget.config.ts` — Bundles the widget

`npm run build` does all of these in order.

## Individual Build Commands

| Command | What | When to use |
|---|---|---|
| `npm run build:wasm` | Rust → WASM | After Rust code changes, or if pkg/ is missing |
| `npm run build:app` | WASM + tsc + Vite app | For standalone web app |
| `npm run build:widget` | Widget bundle only | After TS changes to widget code |
| `npm run build:lib` | WASM + widget lib | For npm publishing |
| `npm run build` | Everything | Full release build |
| `maturin develop --release` | Python extension | After Rust changes, for Python testing |
| `maturin build --release` | Python wheel | For distribution |

## Prerequisites

- `wasm-pack` must be installed (`cargo install wasm-pack` if missing)
- `maturin` must be installed for Python builds (`pip install maturin`)
- `npm install` must have been run

## Checking WASM Build Status

If `crates/megane-wasm/pkg/` directory exists, WASM is built.
If not, run `npm run build:wasm` before anything else.

## Dev Server

```
npm run dev
```
Starts Vite on port 5173. Requires WASM to already be built.

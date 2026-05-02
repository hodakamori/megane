# megane - Claude Code Instructions

## CRITICAL RULES

1. **Commit messages MUST be in English.** Never use Japanese or any other language in commit messages.
2. **NEVER use Puppeteer.** The repo uses **Playwright**:
   - The current `*.spec.ts` E2E suite uses `@playwright/test` via the local `playwright` 1.56 devDependency (installed by `npm ci`).
   - Legacy `*.mjs` scripts (`scripts/dev-preview.mjs`, `scripts/capture-screenshots.mjs`, `tests/e2e/test_vscode_render.mjs`, `tests/e2e/vscode_full_screen.test.mjs`, etc.) resolve Playwright from the global install via `createRequire("/opt/node22/lib/node_modules/")`. The shared helper is `tests/e2e/utils/playwright.mjs` — reuse it instead of duplicating the `createRequire` block.
   - `puppeteer` is **not** a dependency. Do not add it.
3. **Always build WASM before running the dev server or full build.** The WASM pkg directory (`crates/megane-wasm/pkg/`) does not exist until `npm run build:wasm` is run.
4. **Always create a PR after pushing changes.** Use `gh pr create` to open a pull request. PR titles and descriptions must be in English. See the `github-cli` skill for remote URL workaround. Before reporting completion, verify CI passes with `gh run list`.
5. **In plan mode, strictly follow the approved plan.** Do not skip steps, reorder them, or add unplanned work. If the plan needs changes, explain the reason and get approval before deviating.
6. **All file formats should behave consistently across hosts.** When you add a parser or feature to one platform (standalone webapp, Jupyter widget, JupyterLab labextension, VSCode extension), register it on every host unless there is a host-specific reason not to. The single source of truth is `docs/docs/platform-support.md`; update its tables in the same PR. Host registration points: `crates/megane-wasm/src/lib.rs` (browser parsers), `src/components/nodes/LoadStructureNode.tsx` / `LoadTrajectoryNode.tsx` (standalone accept lists), `jupyterlab-megane/src/filetypes.ts`, `vscode-megane/package.json` `customEditors`.

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

megane is a molecular viewer: Rust core (parsers) + TypeScript/React frontend (Three.js) + Python backend (FastAPI/anywidget) + VSCode extension.
Rust compiles to both PyO3 (Python) and WASM (browser) via a Cargo workspace with three crates:
- `megane-core` — Core parsers (PDB, GRO, XYZ, MOL, CIF, LAMMPS data + LAMMPS trajectory, GROMACS topology, XTC, ASE `.traj`)
- `megane-wasm` — WASM bindings (wasm-bindgen)
- `megane-python` — PyO3 Python extension

## Key Commands

### Build

| Command | What it does |
|---|---|
| `npm run build:wasm` | Compile Rust to WASM (MUST run first) |
| `npm run build` | Full build: WASM + tsc + Vite app + Vite widget + Vite lib + JupyterLab labextension |
| `npm run build:app` | WASM + tsc + Vite app only |
| `npm run build:widget` | Vite widget bundle only |
| `npm run build:lib` | WASM + widget bundle + npm library bundle (`vite.lib.config.ts`) |
| `npm run build:lab` | Build only the JupyterLab labextension (`jupyterlab-megane/`) |
| `npm run dev` | Vite dev server (requires WASM already built) |
| `maturin develop --release` | Build+install Python extension (editable) |

### Test

| Command | What it does |
|---|---|
| `npm test` | TypeScript unit tests (vitest) |
| `cargo test -p megane-core` | Rust parser tests |
| `python -m pytest` | Python tests (needs maturin develop first) |
| `npm run test:e2e` | Full Playwright suite (all projects) |
| `npm run test:e2e:webapp` | Webapp project (Vite static, port 15173) |
| `npm run test:e2e:contract` | Cross-platform contract project |
| `npm run test:e2e:widget-jupyterlab` | anywidget in JupyterLab |
| `npm run test:e2e:widget-vscode` | anywidget in code-server (`MEGANE_E2E_MODE=1`) |
| `npm run test:e2e:jupyterlab-doc` | DocWidget in JupyterLab |
| `npm run test:e2e:vscode` | VSCode custom editor (`MEGANE_E2E_MODE=1`) |
| `npm run test:e2e:vscode:legacy[:update]` | Legacy `vscode_full_screen.test.mjs` runner |
| `MEGANE_E2E_UPDATE=1 npm run test:e2e:<project>` | Re-baseline a project's PNGs |
| `npm run test:all` | vitest + full Playwright suite |
| `make test-all` | Python + TypeScript + Rust + active Playwright projects + notebooks + integration |

### Lint / Format / Preview

| Command | What it does |
|---|---|
| `npm run lint` / `lint:fix` | ESLint over `src/` |
| `npm run format` / `format:check` | Prettier over `src/` |
| `node scripts/dev-preview.mjs --screenshot` | Dev preview screenshots |
| `node scripts/capture-screenshots.mjs` | Hero screenshot for docs |

## Skills

Project-specific skills are defined in `.claude/skills/`. Each skill provides instructions for a specific workflow.

- **At the start of a task**, run the `validate-skills` skill to confirm all skills are loaded.
- **Always follow the instructions** in each skill when performing the corresponding workflow.
- Skills cover: committing (`commit`), GitHub CLI usage (`github-cli`), dev environment setup (`dev-setup`), building (`build`), testing (`testing`), E2E coverage runbook (`e2e-coverage`), preview capture (`preview`), pre-release checklist (`pre-release`), post-release verification (`post-release`), and skill validation (`validate-skills`). Total: 10 skills.

## Architecture

- TypeScript source: `src/` (import alias `@/` → `src/`)
- Python source: `python/megane/`
- Rust crates: `crates/{megane-core,megane-python,megane-wasm}/`
- VSCode extension workspace: `vscode-megane/` (extension code + `vite.webview.config.ts` for the webview bundle)
- JupyterLab labextension source: `jupyterlab-megane/` (built with `@jupyterlab/builder` / webpack, imports the shared `src/` viewer via webpack alias `@megane/*`)
- Vite configs at repo root:
  - `vite.config.ts` — webapp
  - `vite.widget.config.ts` — anywidget bundle
  - `vite.lib.config.ts` — npm library (`megane-viewer`) bundle
  - `vite.docs-demo.config.ts` — docs demo build
  - VSCode webview config lives at `vscode-megane/vite.webview.config.ts` (not at repo root)
- Playwright config at repo root: `playwright.config.ts` (declares all E2E projects)
- App builds to: `python/megane/static/app/`
- Widget builds to: `dist/`
- JupyterLab labextension builds to: `wheel-share/data/share/jupyter/labextensions/megane-jupyterlab/` and is shipped in the wheel via `[tool.maturin] data = "wheel-share"`
- Test fixtures: `tests/fixtures/` (PDB, XYZ, XTC files)
- E2E baselines: `tests/e2e/baselines/<project>/` (committed PNGs for the `*.spec.ts` 3-layer suite)
- Legacy `*.test.mjs` snapshots: `tests/e2e/snapshots/` (kept while the legacy runners survive)

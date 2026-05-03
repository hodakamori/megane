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
6. **All file formats should behave consistently across hosts.** When you add a parser or feature to one platform (standalone webapp, Jupyter widget, JupyterLab labextension, VSCode extension), register it on every host unless there is a host-specific reason not to. The single source of truth is `docs/docs/platform-support.md`; update its tables in the same PR. Host registration points: `crates/megane-wasm/src/lib.rs` (browser parsers), `src/components/nodes/LoadStructureNode.tsx` / `LoadTrajectoryNode.tsx` (standalone accept lists), `jupyterlab-megane/src/filetypes.ts`, `vscode-megane/package.json` `customEditors`. Walk the full checklist in the `add-format` skill — drift between hosts is the #1 source of "format X works in the webapp but not in VSCode/JupyterLab" bugs.
7. **The Jupyter widget (anywidget `MolecularViewer`) does not mount the visual pipeline editor.** Pipeline data still flows in via `MolecularViewer.set_pipeline()` (`_pipeline_json` + `_node_snapshots_data`), but the in-cell `PipelineEditor` UI is intentionally not rendered — the host cell chrome cannot reliably lay it out. Do not re-introduce a `pipeline=True` opt-in or a `_pipeline_enabled` traitlet. Visual editing lives in the standalone webapp, JupyterLab labextension, and VSCode extension only.
8. **Codecov is a hard merge gate — write tests for every new line you add.** The `test-rust`, `test-ts`, and `test-python` jobs in `.github/workflows/ci.yml` upload coverage to Codecov with `fail_ci_on_error: true`, and `codecov.yml` requires **patch coverage ≥ 70 %** on every PR (project coverage is off, only the diff is gated). New parsers, pipeline nodes, React components, Python API, and Rust modules MUST ship with unit tests in the same PR — relying on E2E does not count because E2E is local-only and unmeasured. Reproduce the gate locally before pushing: `npm test -- --coverage` (TS → `coverage/ts/lcov.info`), `cargo llvm-cov --package megane-core --lcov --output-path lcov.info` (Rust), `python -m pytest --cov-report=xml:coverage.xml` (Python). The `make coverage-all` target (or `make coverage-ts` / `coverage` / `coverage-rust`) wraps these. If you genuinely cannot cover a line (e.g. unreachable defensive branch) document why in the PR description rather than disabling the check. See the `testing` skill for details.

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
| `npm test -- --coverage` | vitest with V8 coverage → `coverage/ts/lcov.info` (matches Codecov upload) |
| `cargo test -p megane-core` | Rust parser tests |
| `cargo llvm-cov --package megane-core --lcov --output-path lcov.info` | Rust coverage in the exact form CI uploads |
| `python -m pytest` | Python tests (needs maturin develop first); pytest config already enables `--cov` |
| `python -m pytest --cov-report=xml:coverage.xml` | Python coverage in the exact form CI uploads |
| `make coverage-all` | Run all three coverage targets locally before pushing |
| `npm run test:all` | vitest + full Playwright suite |
| `make test-all` | Python + TypeScript + Rust + active Playwright projects + notebooks + integration |

#### E2E (Playwright)

E2E is **local-only by policy** — CI does not run any E2E project (port-bind races + font/fontconfig pixel drift on hosted runners). Re-baseline locally and commit PNGs under `tests/e2e/baselines/<project>/`. Full runbook including environment setup, per-host quirks, and matrix expansion lives in `.claude/skills/e2e-coverage/SKILL.md`.

| Category | Scripts | Notes |
|---|---|---|
| Full sweep | `npm run test:e2e` | All Playwright projects |
| Host projects | `:webapp`, `:contract`, `:widget-jupyterlab`, `:widget-vscode`, `:jupyterlab-doc`, `:vscode` | `:webapp` / `:contract` run a Vite static server on port 15173; `:widget-vscode` / `:vscode` need `MEGANE_E2E_MODE=1` |
| Feature × 5-host matrices | `:modify-node`, `:camera`, `:measurement`, `:subsystems`, `:trajectory-bonds` | Each runs the feature on `webapp`, `jupyterlab-doc`, `vscode`, `widget-jupyterlab`, `widget-vscode`. Per-host variants exist (e.g. `:trajectory-bonds:webapp`, `:camera:webapp`) |
| Single-feature projects | `:format-loading`, `:playback`, `:sidebar`, `:widget-api`, `:widget-examples`, `:pipeline-editor`, `:pipeline-file`, `:render-modal`, `:phase2` | Webapp host unless the project name encodes another |
| Legacy mjs runner | `:vscode:legacy`, `:vscode:legacy:update` | `tests/e2e/vscode_full_screen.test.mjs` |
| Re-baseline flag | `MEGANE_E2E_UPDATE=1 npm run test:e2e:<project>` | Unlinks the existing baseline before capture |

When invoking Playwright directly (`npx playwright test ...`), prefix with `PATH="$(pwd)/.venv/bin:$PATH"` so the `jupyterlab-doc` / `widget-jupyterlab` projects can spawn the venv `jupyter`. `uv run make test-all` already does this implicitly. Re-baseline only when the failure is a pixel diff; treat timeouts and runtime errors as real regressions and fix the root cause instead.

### Lint / Format / Preview

| Command | What it does |
|---|---|
| `npm run lint` / `lint:fix` | ESLint over `src/` |
| `npm run format` / `format:check` | Prettier over `src/` |
| `node scripts/dev-preview.mjs --screenshot` | Dev preview screenshots |
| `node scripts/capture-screenshots.mjs` | Hero screenshot for docs |

## Skills

Project-specific skills are defined in `.claude/skills/`. Each skill provides instructions for a specific workflow. Always follow the skill's instructions when performing the corresponding task.

A SessionStart hook (`.claude/hooks/session-start.sh`) injects a reminder pointing here at the start of every session and asks the agent to verify the skills below appear in the system reminder's `available skills` list.

| Skill | What it covers |
|---|---|
| `commit` | Git commit guidelines (English-only messages, conventional style, post-commit CI verification) |
| `github-cli` | `gh` CLI usage, including the remote-URL workaround for sandboxed envs |
| `dev-setup` | Verifying / installing the dev toolchain (wasm-pack, maturin, uv, Node 22+) |
| `build` | Build commands and required ordering (WASM first) |
| `testing` | Test taxonomy across TypeScript, Rust, Python, and E2E |
| `e2e-coverage` | Full Playwright matrix runbook across the 5 host platforms |
| `preview` | Screenshot/video capture for visual review |
| `pre-release` | Pre-release checklist (tests, version bump, dry-run, tag) |
| `post-release` | Post-release verification (publish workflows, package availability, docs) |
| `add-format` | Per-host registration checklist for new file formats (enforces CRITICAL RULE #6) |

Total: 10 skills.

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

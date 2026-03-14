---
description: Run tests for megane. Covers TypeScript, Rust, Python, and E2E tests. IMPORTANT: E2E tests use Playwright, NOT Puppeteer.
---

# Running Tests

## CRITICAL: Playwright, NOT Puppeteer

All E2E tests and browser scripts use Playwright from `/opt/node22/lib/node_modules/`.
NEVER try to use Puppeteer, even though it appears in package.json.
NEVER install @playwright/test locally or try to run `npx playwright`.
Scripts resolve Playwright via: `createRequire("/opt/node22/lib/node_modules/")`

## Unit Tests

### TypeScript (vitest)
```
npm test
```
Config: `vitest.config.ts`. Tests: `tests/ts/`. Environment: jsdom.

### Rust
```
cargo test -p megane-core
```
Tests the core parser crate.

### Python
```
python -m pytest
```
Requires `maturin develop --release` to have been run first.
Tests: `tests/python/`. Config: `pyproject.toml` under `[tool.pytest.ini_options]`.

## E2E Tests

### Snapshot tests (visual regression)
```
node tests/e2e/snapshot.test.mjs
```
- Starts Vite dev server automatically
- Requires WASM to be built (`npm run build:wasm`)
- Uses pixelmatch for pixel-level comparison (threshold 0.15, max diff 2%)
- Baselines stored in `tests/e2e/snapshots/`
- To update baselines: `node tests/e2e/snapshot.test.mjs --update`

### Widget render tests (Jupyter)
```
node tests/e2e/test_widget_render.mjs
```
- Starts JupyterLab automatically
- Requires `maturin develop --release` and full Python setup
- Tests both small molecule (1crn, 327 atoms) and large (water_100k, 100k atoms)

## Run All Tests
```
make test-all
```
Runs: Python tests + TypeScript tests + Rust tests + E2E snapshot tests.

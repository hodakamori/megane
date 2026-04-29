---
description: Run tests for megane. Covers TypeScript, Rust, Python, and E2E tests. IMPORTANT: E2E tests use Playwright, NOT Puppeteer.
---

# Running Tests

## CRITICAL: Playwright, NOT Puppeteer

All E2E tests and browser scripts use Playwright. The cross-platform
3-layer suite (`tests/e2e/*.spec.ts`) uses `@playwright/test` via the
local `playwright` devDependency installed by `npm ci`.

The legacy `*.mjs` scripts (`tests/e2e/snapshot.test.mjs` etc.) still
resolve Playwright through `createRequire("/opt/node22/lib/node_modules/")`.
NEVER try to use Puppeteer, even though it appears in package.json.

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

## E2E Tests (cross-platform 3-layer suite)

### Playwright Test runner (current)

The 3-layer suite (`webapp.spec.ts`, `contract.spec.ts`,
`widget-jupyterlab.spec.ts`, `jupyterlab-doc.spec.ts`) is run via
`@playwright/test`. Each spec asserts the same fixture in three layers:

1. **DOM contract** — required `data-testid` set + `data-megane-context`
2. **Full-page pixel diff** — entire window incl. host UI chrome
3. **Viewer-region pixel diff** — clipped to `data-testid="viewer-root"`

Baselines live under `tests/e2e/baselines/<project>/` and are committed.

### Prerequisites

Run once per fresh clone:

```sh
npm ci                       # installs `playwright` 1.56 locally
npm run build:wasm           # WASM is required by both webapp + widget
npx playwright install chromium
```

For the JupyterLab-hosted projects:

```sh
npm run build:widget                # python/megane/static/widget.js
pip install -e ".[dev]" jupyterlab  # provides `jupyter lab` on PATH
```

For the JupyterLab DocWidget project specifically:

```sh
npm run build:lab
mkdir -p "$(jupyter --data-dir)/labextensions"
cp -r wheel-share/data/share/jupyter/labextensions/megane-jupyterlab \
      "$(jupyter --data-dir)/labextensions/"
```

For the WebApp + Contract projects (these depend on a static-served
production build):

```sh
npx tsc && npx vite build    # outputs to python/megane/static/app/
```

### Running a single project

```sh
npm run test:e2e:webapp
npm run test:e2e:contract
npm run test:e2e:widget-jupyterlab
npm run test:e2e:jupyterlab-doc
```

### Running everything

```sh
npx playwright test          # all projects
```

### CI vs. local split

**All four E2E projects are local-only.** We attempted to run them on
GH-hosted ubuntu-latest runners but ran into two
CI-environment-specific issues we don't want to maintain workarounds
for:

  - `webapp` / `contract`: Playwright's webServer manager hits a
    non-deterministic port-bind race against the Node static server,
    failing within 5 seconds before any spec runs.
  - `widget-jupyterlab` / `jupyterlab-doc`: pixel-diff baseline drift
    between the dev-container Chromium and the CI Chromium
    fonts/fontconfig (small but enough to exceed our 2 % tolerance).

The expected pre-merge workflow is:

1. Run all 4 projects locally as part of any UI-touching change.
2. Commit any updated baselines under `tests/e2e/baselines/<project>/`.
3. CI does NOT re-run E2E. Reviewers verify locally if needed.

### Updating baselines

Local re-baselining (when an intentional UI change has shifted pixels):

```sh
rm tests/e2e/baselines/webapp/<name>.png
npx playwright test --project=webapp        # creates a fresh baseline
git add tests/e2e/baselines/webapp/<name>.png
```

`compareToBaseline()` in `tests/e2e/lib/setup.ts` writes the captured
PNG and returns `isNew: true` when the file does not exist, so the test
passes on first run.

If a comparison fails it writes `<name>.diff.png` and `<name>.new.png`
next to the baseline; both are gitignored. Inspect them, then either
fix the regression or replace the baseline.

### Troubleshooting

- **`waitForReady` timed out** — `window.__megane_test_ready.firstFrame`
  was never set. Either WASM failed to load or the renderer crashed
  pre-mount. Check the trace via `npx playwright show-trace
  test-results/<job>/trace.zip`.
- **`webServer` exits in 5 seconds (webapp/contract local)** — port
  15173 is already taken; kill any leftover Vite/static-server process:
  `pkill -f serve-static.mjs; pkill -f vite`.
- **Pixel diff > 2 % unexpectedly** — almost always a font/cursor/clock
  drift in the host UI. Add a `mask` region to `stabilizeUi()` rather
  than widening the diff threshold.

## Legacy E2E (kept for one release)

```
node tests/e2e/snapshot.test.mjs            # legacy webapp pixel-diff
node tests/e2e/test_widget_render.mjs       # legacy widget render
node tests/e2e/test_notebook_screenshots.mjs
node tests/e2e/test_vscode_render.mjs       # post-release VSCode
```

These are scheduled to be removed once their coverage is fully
replicated by the spec.ts suite.

## Run All Tests

```
make test-all
```

Runs: Python tests + TypeScript tests + Rust tests + the active
`@playwright/test` projects.

## Reporting Results — CI Check Required

After pushing changes and before reporting test results to the user, verify that CI has passed on the remote branch:

```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
gh run list --branch "$(git branch --show-current)" --limit 1
git remote set-url origin "$ORIG_REMOTE"
```

- If CI is still running, wait and re-check.
- If CI has failed, inspect with `gh run view <run-id> --log-failed`, fix the issue, and push again.
- Only report success after CI passes.
- Note: **All E2E projects are local-only**; CI does not run any of
  them. Verify locally before pushing changes that touch
  WebApp / Viewport / MoleculeRenderer / Widget / DocWidget paths.

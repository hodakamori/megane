---
description: Run tests for megane. Covers TypeScript, Rust, Python, and E2E tests. IMPORTANT: E2E tests use Playwright, NOT Puppeteer.
---

# Running Tests

## CRITICAL: Playwright, NOT Puppeteer

All E2E tests and browser scripts use Playwright. The cross-platform
3-layer suite (`tests/e2e/*.spec.ts`) uses `@playwright/test` via the
local `playwright` 1.56 devDependency installed by `npm ci`.

The surviving legacy `*.mjs` scripts (`tests/e2e/perf_app.test.mjs`,
`perf_widget.test.mjs`, `widget_interaction.test.mjs`,
`test_notebook_screenshots.mjs`, `test_vscode_render.mjs`,
`vscode_full_screen.test.mjs`) resolve Playwright through
`createRequire("/opt/node22/lib/node_modules/")`. The shared helper is
`tests/e2e/utils/playwright.mjs` — reuse it instead of duplicating the
`createRequire` block. `puppeteer` is **not** in `package.json`; never
add it.

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

## Coverage & Codecov (merge gate)

**Codecov is a hard merge gate — see CRITICAL RULE #8 in `CLAUDE.md`.** The
three CI jobs that upload coverage all use `fail_ci_on_error: true`, and
`codecov.yml` requires **patch coverage ≥ 70 %** on every PR (project
coverage status is `off`, so only the diff matters — but the diff matters a
lot).

What this means in practice:
- Every new function / branch / pipeline node / React component / parser
  needs a unit test in the same PR. E2E does not count toward Codecov
  because E2E is local-only and unmeasured.
- A PR that adds 100 lines of TS but no `tests/ts/` updates will fail the
  TS Codecov patch check, which fails CI, which blocks merge.
- Adding a Rust parser without `#[test]` cases under that crate's `tests/`
  module will fail the Rust patch check.

### Local commands that match what CI uploads

| Stack | Command | Output | CI job that consumes it |
|---|---|---|---|
| TypeScript | `npm test -- --coverage` | `coverage/ts/lcov.info` | `test-ts` |
| Rust | `cargo llvm-cov --package megane-core --lcov --output-path lcov.info` | `lcov.info` | `test-rust` |
| Python | `python -m pytest --cov-report=xml:coverage.xml` | `coverage.xml` | `test-python` |

`cargo llvm-cov` requires `cargo install cargo-llvm-cov` once; the pytest
`--cov` flag is already wired via `pyproject.toml` `addopts`.

The convenience wrappers in the `Makefile` produce HTML reports under
`coverage/{python,ts,rust}/index.html` for browsing, but they don't emit
the lcov / xml files that match the CI uploads — use the table above when
you want to predict the Codecov result:

```sh
make coverage-ts      # → coverage/ts/index.html
make coverage         # → coverage/python/index.html
make coverage-rust    # → coverage/rust/tarpaulin-report.html (needs cargo-tarpaulin)
make coverage-all     # all three
```

### Patch coverage rules (`codecov.yml`)

- Three flags are tracked separately: `python`, `typescript`, `rust`.
  Each is filtered by path (`python/megane/`, `src/` + `vscode-megane/src/`
  + `jupyterlab-megane/src/`, `crates/`).
- `tests/`, `docs/`, `python/megane/static/**`, and `*.d.ts` are ignored.
- The patch target is **70 % with 0 % threshold**, so a single uncovered
  branch in a small diff can drop you below the line. When you change only
  one file, run the matching coverage command and inspect the per-file
  report before pushing.

### Legitimate exceptions

If a line genuinely cannot be covered (e.g. a defensive branch that's
unreachable from public APIs, or platform-gated code that only runs in a
specific host), document the gap in the PR description and prefer
`#[cfg(...)]` / `/* c8 ignore next */` / `# pragma: no cover` over
disabling the gate. Never set `fail_ci_on_error: false` or relax
`codecov.yml` to make a PR pass.

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
npm run test:e2e:widget-vscode       # requires MEGANE_E2E_MODE=1 + code-server
npm run test:e2e:vscode              # requires MEGANE_E2E_MODE=1 + code-server
```

### E2E project map (5 distribution platforms)

The viewer ships through 5 hosts. Each is a Playwright project with its own
boot prerequisites. Cross-platform parity is asserted via `contract`.

| Project | Host | Port | Prereqs | Command |
|---|---|---|---|---|
| `webapp` | Vite static | 15173 | `npm run build` | `npm run test:e2e:webapp` |
| `contract` | webapp baseline | 15173 | `npm run build` | `npm run test:e2e:contract` |
| `widget-jupyterlab` | anywidget in `jupyter lab` | 18888 | `npm run build:widget` | `npm run test:e2e:widget-jupyterlab` |
| `jupyterlab-doc` | DocWidget in `jupyter lab` | 18889 | `npm run build:lab` + labextension copy | `npm run test:e2e:jupyterlab-doc` |
| `widget-vscode` | anywidget in code-server + ms-toolsai.jupyter | dynamic | `scripts/install-code-server.sh` + VSIX | `MEGANE_E2E_MODE=1 npm run test:e2e:widget-vscode` |
| `vscode` | VSCode custom editor | dynamic | `scripts/install-code-server.sh` + VSIX | `MEGANE_E2E_MODE=1 npm run test:e2e:vscode` |

`MEGANE_E2E_MODE=1` causes the megane VSCode extension to inject
`window.__MEGANE_TEST__ = true` into the webview, which is what triggers
`MoleculeRenderer` testMode. Without it, the webview-hosted projects time out
in `waitForReady`.

### Cross-host feature specs

Feature-oriented specs (`format-loading`, `playback`, `sidebar`,
`widget-api`, `pipeline-editor`, `pipeline-file`, `render-modal`)
target webapp by default. Cross-host parametrization via `MEGANE_HOST`
is supported by the host fixture but most current specs only have a
webapp implementation:

```sh
MEGANE_HOST=widget-jupyterlab npm run test:e2e:format-loading
```

`MEGANE_HOST` accepts `webapp | widget-jupyterlab | widget-vscode |
jupyterlab-doc | vscode`. Default is `webapp`. See
`.claude/skills/e2e-coverage/SKILL.md` for the full per-feature runbook.

### Running everything

```sh
npx playwright test          # all projects
```

### CI vs. local split

**All E2E projects are local-only.** We attempted to run them on
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

1. Run the relevant Playwright projects locally as part of any UI-touching change.
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
node tests/e2e/test_notebook_screenshots.mjs   # notebook screenshot capture
node tests/e2e/test_vscode_render.mjs          # post-release VSCode rendering check
node tests/e2e/vscode_full_screen.test.mjs     # also wired as `npm run test:e2e:vscode:legacy`
node tests/e2e/perf_app.test.mjs               # webapp performance probe
node tests/e2e/perf_widget.test.mjs            # widget performance probe
node tests/e2e/widget_interaction.test.mjs     # legacy widget interaction screenshots
```

These are scheduled to be removed once their coverage is fully
replicated by the spec.ts suite. The deleted `snapshot.test.mjs` and
`test_widget_render.mjs` runners have already been retired in favour of
the Playwright projects.

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

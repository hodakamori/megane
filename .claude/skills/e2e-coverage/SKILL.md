---
description: Run, extend, or re-baseline the megane E2E coverage suite. Covers all 5 platforms (webapp, JupyterLab DocWidget, VSCode custom editor, Jupyter widget in JupyterLab, Jupyter widget in VSCode notebook). Use when adding new E2E specs, debugging baseline drift, reproducing a UI bug across hosts, or running the full local-only matrix.
---

# E2E Coverage Suite (5 Platforms)

The megane viewer ships through 5 distribution targets. Each one renders the same `MeganeViewer` React component, but the host chrome and bootstrap path differ. This skill is the canonical runbook for exercising the full matrix locally.

## CRITICAL: Playwright, NOT Puppeteer

All E2E uses `@playwright/test`. `puppeteer` is **not** in `package.json`; only `playwright` 1.56 is installed. Never add or invoke Puppeteer.

E2E is **local-only by policy** — see `.claude/skills/testing/SKILL.md`. CI does not run any E2E project (port-bind races + font-fontconfig pixel drift on hosted runners). Run locally before merging UI-touching PRs.

## Architecture Recap

3-layer assertions in `tests/e2e/lib/setup.ts`:

1. **DOM contract** — `assertDomContract(scope, items[])` — required `data-testid` set + `data-megane-context`
2. **Full-page pixel diff** — `expectFullPageMatch(page, project, name)` — entire window incl. host UI chrome
3. **Viewer-region pixel diff** — `expectViewerRegionMatch(scope, project, name)` — clipped to `data-testid="viewer-root"`, also used for cross-platform parity (`expectParityWithContract`)

Ready signal: `?test=1` URL or `globalThis.__MEGANE_TEST__=true` triggers `MoleculeRenderer` testMode and exposes `window.__megane_test_ready = {firstFrame, dataLoaded, frame, renderEpoch, atomCount}`. Sync via `waitForReady(scope, {needsData, untilEpoch, timeout})`.

Host emulation lives in `tests/e2e/lib/hosts/`:
- `jupyterlab.ts` — `startJupyterLab`, `openLabNotebook`, `writeNotebook`
- `code-server.ts` — `startCodeServer`, `openVscodeFile`, `getWebviewFrame`

Pixel thresholds: `PIXEL_THRESHOLD=0.15`, `MAX_DIFF_PERCENT=2.0` (4.0 for cross-platform parity). Do NOT raise these to hide flakiness — mask jittery regions in `stabilizeUi()` instead.

Baselines: `tests/e2e/baselines/<project>/<name>.png`, committed. First run auto-creates them.

## One-Time Setup

```sh
# Toolchain
npm ci
cargo install wasm-pack          # if missing
pip install maturin              # if missing
uv sync --extra dev

# Build artefacts E2E depends on
npm run build:wasm
npm run build                    # WASM + tsc + Vite app + widget + lab ext
maturin develop --release        # editable Python extension
npx playwright install chromium

# JupyterLab labextension install (for jupyterlab-doc)
mkdir -p "$(jupyter --data-dir)/labextensions"
cp -r wheel-share/data/share/jupyter/labextensions/megane-jupyterlab \
      "$(jupyter --data-dir)/labextensions/"

# VSCode hosts (only if running widget-vscode / vscode)
bash scripts/install-code-server.sh    # code-server + ms-toolsai.jupyter + local VSIX
npm --prefix vscode-megane run build   # ensures media/webview.js is fresh
```

## 5-Platform Runbook

One command per platform. Each one is independent.

```sh
# 1. Webapp (Vite static, port 15173)
npm run test:e2e:webapp

# 2. Jupyter widget in JupyterLab (port 18888)
npm run build:widget && npm run test:e2e:widget-jupyterlab

# 3. Jupyter widget in VSCode notebook (code-server + ms-toolsai.jupyter)
MEGANE_E2E_MODE=1 npm run test:e2e:widget-vscode

# 4. JupyterLab extension (DocWidget direct-open, port 18889)
npm run test:e2e:jupyterlab-doc

# 5. VSCode custom editor (.pdb / .megane.json)
MEGANE_E2E_MODE=1 npm run test:e2e:vscode
```

`MEGANE_E2E_MODE=1` causes `vscode-megane/src/extension.ts` to inject `window.__MEGANE_TEST__=true` into the webview HTML preamble alongside `__MEGANE_CONTEXT__`. Without it, the renderer never enters testMode and `waitForReady` will time out.

## Per-Feature Runbook (Cross-Host)

Feature specs live alongside the platform specs and each defines its own Playwright project:

```sh
npm run test:e2e:format-loading      # PDB/GRO/XYZ/MOL/SDF/CIF/LAMMPS load on webapp
npm run test:e2e:playback            # play/pause/scrub/fps on webapp
npm run test:e2e:sidebar             # CollapsiblePanel (Pipeline panel) toggle on webapp
npm run test:e2e:widget-api          # programmatic frame_index / selected_atoms in JupyterLab
npm run test:e2e:pipeline-editor     # seeded node kinds + Render button mounts modal
npm run test:e2e:pipeline-file       # drag-drop .megane.json on webapp
npm run test:e2e:render-modal        # snapshot mode (GIF/MP4 gated by MEGANE_E2E_FFMPEG=1)
```

Measurement (right-click selection) and the AppearancePanel slider tests
were planned but pulled from this PR: the webapp doesn't mount
AppearancePanel, and reliable measurement coverage needs a renderer-side
hook to expose projected atom positions. The test IDs are in place for a
follow-up.

Specs that iterate hosts read `MEGANE_HOST=webapp|widget-jupyterlab|widget-vscode|jupyterlab-doc|vscode`. Default = webapp.

```sh
# Sweep an existing cross-host-capable spec across every host:
for host in webapp widget-jupyterlab widget-vscode jupyterlab-doc vscode; do
  MEGANE_HOST=$host npm run test:e2e:format-loading
done
```

(There is no `test:e2e:measurement` script — measurement coverage was deferred, see the note above.)

## Run Everything

```sh
npm run test:e2e          # all Playwright projects
make test-all             # + Python + Rust + TS unit + perf
```

## Adding a New Spec

Boilerplate that satisfies the 3-layer pattern:

```ts
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  expectFullPageMatch,
  expectViewerRegionMatch,
  waitForReady,
} from "./lib/setup";

const PLATFORM = "webapp";          // or another project name

test.describe("my new feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("default state matches contract", async ({ page }) => {
    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
      { testid: "my-new-thing", visible: true },
    ]);
    await expectFullPageMatch(page, PLATFORM, "my-feature-default");
    await expectViewerRegionMatch(page, PLATFORM, "my-feature-default-viewer");
  });
});
```

Then declare a project in `playwright.config.ts`:

```ts
{ name: "my-feature", testMatch: /my-feature\.spec\.ts$/ }
```

And add a script to `package.json`:

```
"test:e2e:my-feature": "playwright test --project=my-feature"
```

Cross-host specs use the host fixture from `tests/e2e/lib/host-fixture.ts`:

```ts
import { hostFixture } from "./lib/host-fixture";
const test = hostFixture();             // reads MEGANE_HOST
test("works on every host", async ({ scope, project, context }) => {
  await assertDomContract(scope, defaultViewerContract({ context }));
  await expectViewerRegionMatch(scope, project, "default-viewer");
});
```

## Re-baselining Workflow

Single test:

```sh
rm tests/e2e/baselines/<project>/<name>.png
npm run test:e2e:<project>          # creates fresh baseline
git add tests/e2e/baselines/<project>/<name>.png
```

Bulk:

```sh
MEGANE_E2E_UPDATE=1 npm run test:e2e:<project>
git add tests/e2e/baselines/<project>/
```

`MEGANE_E2E_UPDATE=1` is plumbed through `expectFullPageMatch` / `expectViewerRegionMatch`: when set, the existing baseline is unlinked before capture, so the next run writes a fresh one.

When a comparison fails, `<name>.diff.png` and `<name>.new.png` land next to the baseline. They are gitignored. Inspect them, then either fix the regression or replace the baseline.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `waitForReady` timeout (webapp/contract) | WASM not built or renderer crashed | `npm run build:wasm`; check `test-results/<job>/trace.zip` |
| `waitForReady` timeout (widget-vscode/vscode) | `MEGANE_E2E_MODE=1` not set or extension didn't pick it up | rerun with the env var; rebuild VSIX with `npm --prefix vscode-megane run build` |
| webServer exits in 5s | port 15173 in use | `pkill -f serve-static.mjs; pkill -f vite` |
| `jupyter lab` fails to boot | port 18888/18889 in use | `pkill -f "jupyter-lab"` |
| code-server install missing | first M3 run | `bash scripts/install-code-server.sh` |
| Webview frame not found | code-server version drift | `getWebviewFrame()` falls back to `iframe[src*="vscode-webview"]`; check selector |
| Pixel diff > 2 % unexpectedly | font/cursor/clock drift | add `mask` region in `stabilizeUi()`, do NOT raise threshold |
| widget-jupyterlab `widget.js missing` | `npm run build:widget` not run | run it before the project |
| jupyterlab-doc `labextension not built` | `npm run build:lab` not run + copy step skipped | rerun setup commands above |

## Cross-References

- `.claude/skills/testing/SKILL.md` — overall test taxonomy and the local-only policy
- `.claude/skills/build/SKILL.md` — WASM / widget / lab-extension build prerequisites
- `.claude/skills/dev-setup/SKILL.md` — toolchain install
- `tests/e2e/lib/setup.ts` — 3-layer helper implementation
- `tests/e2e/lib/hosts/` — host emulation modules
- `playwright.config.ts` — project definitions

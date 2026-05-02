---
description: Pre-release checklist for megane. Run before tagging and publishing a new version. Covers tests, build, versioning, docs, and dry-run validation.
---

# Pre-Release Checklist

Run this skill before creating a release tag. Complete every phase in order.

## Phase 0: Prerequisites

`make test-all` (Phase 1.4) launches Playwright projects that depend on the
webapp build artifacts and the JupyterLab labextension. **Build first, test
second** — running tests before the build guarantees timeouts and false
failures.

Confirm the dev environment is set up:
```bash
which wasm-pack maturin uv jupyter   # all four must resolve
node --version                        # 22+
```
If anything is missing, run the **dev-setup** skill first.

If this is a fresh checkout (no `node_modules/`, no `crates/megane-wasm/pkg/`):
```bash
npm install
npm run build:wasm           # required before any other build/test
uv sync --extra dev          # installs Playwright-host jupyterlab into .venv
```

`uv run` puts `.venv/bin` on PATH so subprocesses see the project `jupyter`.
When invoking Playwright directly (e.g. `npx playwright test ...` for a
re-baseline), prefix the command with `PATH="$(pwd)/.venv/bin:$PATH"` or the
`jupyterlab-doc` / `widget-jupyterlab` projects fail with `spawn jupyter
ENOENT`.

## Phase 1: Build & Tests

### 1.1 Full build
```bash
npm run build
```
Must complete without errors. This covers WASM → TypeScript → Vite app →
widget → lib → JupyterLab labextension. Confirms
`python/megane/static/app/index.html` and
`wheel-share/data/share/jupyter/labextensions/megane-jupyterlab/` exist —
both are required by the E2E suites in Phase 1.3.

### 1.2 Python wheel build
```bash
maturin build --release
```
Must produce a wheel without errors.

### 1.3 Run all tests
```bash
uv run make test-all
```
All of Python, TypeScript, Rust, E2E, notebook, and integration tests must
pass.

**E2E baseline drift.** Per `CLAUDE.md`, E2E is local-only and font /
fontconfig differences across machines can cause baseline diffs. If E2E fails
only with `full-page diff X.XX% > 2%` style errors (not timeouts or app
errors), re-baseline the affected projects and commit the new PNGs:
```bash
PATH="$(pwd)/.venv/bin:$PATH" MEGANE_E2E_UPDATE=1 \
  npx playwright test --project=<failing-project> [--project=<...>]
```
Then `git add tests/e2e/baselines/<project>/` and commit as a separate
`test(e2e): re-baseline ...` commit *before* the release commit. If failures
are timeouts or runtime errors, fix the underlying cause — do not paper over
with a re-baseline.

## Phase 2: Version Consistency

### 2.1 Run bump-my-version
Install if not already available:
```bash
uv tool install bump-my-version
```
Choose the appropriate bump level:
```bash
uv tool run bump-my-version bump patch   # bug fixes
uv tool run bump-my-version bump minor   # new features
uv tool run bump-my-version bump major   # breaking changes
```

### 2.2 Verify all 9 files are updated
The bumpversion config in `pyproject.toml` updates these files:
- `pyproject.toml`
- `package.json`, `package-lock.json`
- `crates/megane-core/Cargo.toml`
- `crates/megane-python/Cargo.toml`
- `crates/megane-wasm/Cargo.toml`
- `python/megane/__init__.py`
- `vscode-megane/package.json`, `vscode-megane/package-lock.json`

Sanity-check no stale references remain (replace `0.6.2` with the previous
version — output should be empty):
```bash
grep -rn "0\.6\.2" pyproject.toml package.json package-lock.json \
  crates/megane-core/Cargo.toml \
  crates/megane-python/Cargo.toml \
  crates/megane-wasm/Cargo.toml \
  python/megane/__init__.py \
  vscode-megane/package.json vscode-megane/package-lock.json
```
`docs/scripts/prepare-notebooks.py` reads the version dynamically from
`pyproject.toml`, so no manual update is required.

### 2.3 Update Cargo.lock
```bash
cargo check
```
Ensures `Cargo.lock` is in sync with the bumped Cargo.toml versions.

## Phase 3: CHANGELOG

### 3.0 Pre-condition check
Confirm that `CHANGELOG.md` has an `[Unreleased]` section at the top:
```bash
head -10 CHANGELOG.md
```
If `[Unreleased]` is missing or empty, populate it from
`git log --no-merges <last-tag>..HEAD` before proceeding. An empty
`[Unreleased]` is a sign there are no user-facing changes to release —
double-check before continuing.

### 3.1 Verify CHANGELOG.md has a new entry
- The `[Unreleased]` section must be renamed to `[X.Y.Z] - YYYY-MM-DD` with today's date.
- A fresh empty `[Unreleased]` section should remain at the top.
- Format follows [Keep a Changelog](https://keepachangelog.com/).

Example:
```markdown
## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD
### Added
- ...
### Fixed
- ...
```

## Phase 4: Documentation & Content

### 4.1 README code examples
Manually verify that install commands and code snippets in `README.md` reflect the current API.
Check at minimum:
- Installation section (pip, npm, vscode)
- Quick-start Python snippet (`megane.view()` / `megane.view_traj()` are 0.6.0+)
- Quick-start React snippet (imports from `megane-viewer/lib`)
- Supported file formats table

### 4.2 Docs site builds
Docs build is verified by the `release-dry-run.yml` workflow (the "Dry run: Docs" job).
No manual step needed here — Phase 6 covers this.

### 4.3 Feature table alignment
Confirm the README feature table ("Runs Everywhere" section) matches what is actually supported:
- Supported environments (Jupyter, browser, React, VSCode)
- Supported file formats (PDB, GRO, XYZ, MOL/SDF, MOL2, CIF, LAMMPS data, XTC, LAMMPS dump, ASE .traj)
- Cross-host parity per `docs/docs/platform-support.md`

## Phase 5: Visual Verification

### 5.1 Capture screenshots
```bash
node scripts/capture-screenshots.mjs
```
Requires WASM to be built (covered by Phase 1.1 `npm run build`).
The script opens the full app (3D viewport + pipeline editor + timeline) and saves
`docs/public/screenshots/hero.png`. Review it visually for rendering regressions.

### 5.2 Live demo (AWS S3 + CloudFront) — health check and visual verification

The demo deploy workflow is `.github/workflows/deploy.yml` ("Deploy demo to
AWS S3 + CloudFront"). It runs on every push to `main` and on workflow
dispatch.

**Step 1**: Confirm the latest deploy succeeded and retrieve the URL:
```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
RUN_ID=$(gh run list --workflow=deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
gh run view "$RUN_ID" --log | grep -E "URL:|cloudfront\.net|distribution_domain"
git remote set-url origin "$ORIG_REMOTE"
```
Note the CloudFront URL.

**Step 2**: Take a screenshot of the live demo with Playwright and verify rendering:
```bash
node -e "
const { createRequire } = require('module');
const require2 = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require2('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('LIVE_DEMO_URL', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'dev-preview/live-demo.png', fullPage: false });
  await browser.close();
  console.log('Screenshot saved to dev-preview/live-demo.png');
})();
"
```
Replace `LIVE_DEMO_URL` with the URL from Step 1.

**Step 3**: Review the screenshot `dev-preview/live-demo.png` and confirm:
- The viewer loads without blank screen or error messages
- A molecule is rendered (atoms/bonds visible)
- The UI controls (toolbar, sidebar) are present

## Phase 6: Dry Run

### 6.1 Trigger release-dry-run workflow
```bash
gh workflow run release-dry-run.yml
```
Wait for it to complete:
```bash
gh run list --workflow=release-dry-run.yml --limit 1
```
All three publish jobs (PyPI, npm, VSCode) must pass in dry-run mode.

## Phase 7: Release Commit

Only proceed here after all phases above are green.

### 7.1 Verify clean git state
```bash
git status
```
Expected modifications: bump-my-version files (`pyproject.toml`,
`package.json`, `package-lock.json`, the three `Cargo.toml`s,
`python/megane/__init__.py`, both `vscode-megane/package*.json`),
`Cargo.lock`, `CHANGELOG.md`. `python/megane/static/widget.js` may also
appear because `npm run build` re-bundles it; include it in the release
commit. Any other unrelated modifications should already have been split
into separate commits (e.g. E2E baselines from Phase 1.3).

### 7.2 Create release commit
```bash
git add pyproject.toml package.json package-lock.json \
  crates/megane-core/Cargo.toml \
  crates/megane-python/Cargo.toml \
  crates/megane-wasm/Cargo.toml \
  Cargo.lock \
  python/megane/__init__.py \
  python/megane/static/widget.js \
  vscode-megane/package.json vscode-megane/package-lock.json \
  CHANGELOG.md
git commit -m "chore: release vX.Y.Z"
```

Then push. The push target depends on workflow:
- **Direct main flow**: `git push origin main`
- **Branch + PR flow** (default in Claude Code on web): push to the working
  branch (e.g. `claude/release-vX.Y.Z-...`), open a PR, merge after CI
  passes. The tag must point at the merge commit on `main`.

### 7.3 Hand off to user
After the release commit is on `main`, hand off to the user to create and push the tag manually:

```
# Run these commands yourself to trigger the publish workflows:
git tag vX.Y.Z
git push origin vX.Y.Z
```

Pushing the tag triggers all publish workflows automatically:
`publish-pypi.yml`, `publish-npm.yml`, `publish-vscode.yml`, `release.yml`, `docs.yml`.

## Next Step

After the user pushes the tag, follow the **post-release** skill to verify the release landed correctly.

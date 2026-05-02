---
description: Pre-release checklist for megane. Run before tagging and publishing a new version. Covers tests, build, versioning, docs, and dry-run validation.
---

# Pre-Release Checklist

Run this skill before creating a release tag. Complete every phase in order.

## Phase 1: Tests & Build

### 1.1 Run all tests
```bash
uv sync --extra dev   # ensures jupyterlab is installed for E2E widget tests
uv run make test-all
```
All of TypeScript, Rust, Python, E2E widget render, and E2E snapshot tests must pass.
`uv run` adds `.venv/bin` to PATH so `python` and `jupyter` resolve to the venv.

### 1.2 Full build
```bash
npm run build
```
Must complete without errors. This covers WASM → TypeScript → Vite app → widget.

### 1.3 Python wheel build
```bash
maturin build --release
```
Must produce a wheel without errors.

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

### 2.2 Verify all 8 files are updated
Check that the new version appears in every file:
```bash
grep -r "0\.4\.0" pyproject.toml package.json \
  crates/megane-core/Cargo.toml \
  crates/megane-python/Cargo.toml \
  crates/megane-wasm/Cargo.toml \
  python/megane/__init__.py \
  docs/scripts/prepare-notebooks.py \
  vscode-megane/package.json
```
Replace `0.4.0` with the old version — output should be empty (no stale references).

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
If `[Unreleased]` is missing, **stop here** — there are no staged changes to release.
Create the section and populate it with changes before proceeding.

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
- Quick-start Python snippet
- Quick-start JS/React snippet
- Supported file formats table

### 4.2 Docs site builds
Docs build is verified by the `release-dry-run.yml` workflow (the "Dry run: Docs" job).
No manual step needed here — Phase 6 covers this.

### 4.4 Feature table alignment
Confirm the README feature table ("Runs Everywhere" section) matches what is actually supported:
- Supported environments (Jupyter, browser, React, VSCode)
- Supported file formats (PDB, GRO, XYZ, MOL, CIF, LAMMPS, XTC, .traj)

## Phase 5: Visual Verification

### 5.1 Capture screenshots
```bash
node scripts/capture-screenshots.mjs
```
Requires WASM to be built (covered by Phase 1.2 `npm run build`).
The script opens the full app (3D viewport + pipeline editor + timeline) and saves
`docs/public/screenshots/hero.png`. Review it visually for rendering regressions.

### 5.2 Live demo (AWS ECS) — health check and visual verification

**Step 1**: Confirm the latest deploy succeeded and retrieve the URL:
```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
RUN_ID=$(gh run list --workflow=deploy.yml --limit 1 --json databaseId -q '.[0].databaseId')
gh run view "$RUN_ID" --log | grep "URL:"
git remote set-url origin "$ORIG_REMOTE"
```
Note the URL (e.g., `https://XXXX.example.com`).

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
Only bump-my-version and CHANGELOG changes should be present (no unrelated modifications).

### 7.2 Create release commit
```bash
git add pyproject.toml package.json \
  crates/megane-core/Cargo.toml \
  crates/megane-python/Cargo.toml \
  crates/megane-wasm/Cargo.toml \
  Cargo.lock \
  python/megane/__init__.py \
  docs/scripts/prepare-notebooks.py \
  vscode-megane/package.json \
  CHANGELOG.md
git commit -m "chore: release vX.Y.Z"
git push origin main
```

### 7.3 Hand off to user
At this point, hand off to the user to create and push the tag manually:

```
# Run these commands yourself to trigger the publish workflows:
git tag vX.Y.Z
git push origin vX.Y.Z
```

Pushing the tag triggers all publish workflows automatically:
`publish-pypi.yml`, `publish-npm.yml`, `publish-vscode.yml`, `release.yml`, `docs.yml`.

## Next Step

After the user pushes the tag, follow the **post-release** skill to verify the release landed correctly.

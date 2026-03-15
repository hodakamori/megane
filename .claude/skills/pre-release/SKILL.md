---
description: Pre-release checklist for megane. Run before tagging and publishing a new version. Covers tests, build, versioning, docs, and dry-run validation.
---

# Pre-Release Checklist

Run this skill before creating a release tag. Complete every phase in order.

## Phase 1: Tests & Build

### 1.1 Run all tests
```bash
make test-all
```
All of TypeScript, Rust, Python, and E2E snapshot tests must pass.

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

### 2.1 Run bumpversion
Choose the appropriate bump level:
```bash
bump-my-version bump patch   # bug fixes
bump-my-version bump minor   # new features
bump-my-version bump major   # breaking changes
```

### 2.2 Verify all 7 files are updated
Check that the new version appears in every file:
```bash
grep -r "0\.4\.0" pyproject.toml package.json \
  crates/megane-core/Cargo.toml \
  crates/megane-python/Cargo.toml \
  crates/megane-wasm/Cargo.toml \
  python/megane/__init__.py \
  docs/scripts/prepare-notebooks.py
```
Replace `0.4.0` with the old version — output should be empty (no stale references).

### 2.3 Update Cargo.lock
```bash
cargo check
```
Ensures `Cargo.lock` is in sync with the bumped Cargo.toml versions.

## Phase 3: CHANGELOG

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
```bash
npm run build:docs 2>/dev/null || npx vitepress build docs
```
Must complete without errors.

### 4.3 API docs generate
```bash
npx typedoc --out docs/api/ts src/index.ts 2>/dev/null || true
pdoc python/megane -o docs/api/python 2>/dev/null || true
```
Check for unexpected errors (missing exports, broken references).

### 4.4 Feature table alignment
Confirm the README feature table ("Runs Everywhere" section) matches what is actually supported:
- Supported environments (Jupyter, browser, React, VSCode)
- Supported file formats (PDB, GRO, XYZ, MOL, CIF, LAMMPS, XTC, .traj)

## Phase 5: Visual Verification

### 5.1 Capture screenshots
```bash
node scripts/capture-screenshots.mjs
```
Review generated screenshots visually for rendering regressions.

### 5.2 Live demo (AWS ECS) health
Check that the latest deploy workflow succeeded:
```bash
gh run list --workflow=deploy.yml --limit 1
```
Confirm status is `success`. If not, investigate before releasing.

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

## Phase 7: Release Commit & Tag

Only proceed here after all phases above are green.

### 7.1 Verify clean git state
```bash
git status
```
Only bumpversion and CHANGELOG changes should be present (no unrelated modifications).

### 7.2 Create release commit
```bash
git add pyproject.toml package.json \
  crates/megane-core/Cargo.toml \
  crates/megane-python/Cargo.toml \
  crates/megane-wasm/Cargo.toml \
  Cargo.lock \
  python/megane/__init__.py \
  docs/scripts/prepare-notebooks.py \
  CHANGELOG.md
git commit -m "chore: release vX.Y.Z"
```

### 7.3 Create and push tag
```bash
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
```

Pushing the tag triggers all publish workflows automatically:
`publish-pypi.yml`, `publish-npm.yml`, `publish-vscode.yml`, `release.yml`, `docs.yml`.

## Next Step

After pushing the tag, follow the **post-release** skill to verify the release landed correctly.

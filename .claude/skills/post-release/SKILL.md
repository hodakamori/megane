---
description: Post-release checklist for megane. Run after pushing a release tag to verify all publish workflows succeeded and packages are live.
---

# Post-Release Checklist

Run this skill after pushing a release tag (`vX.Y.Z`). Verify every item before declaring the release complete.

> **Note on `gh` commands:** The git remote points to a local proxy, not GitHub directly. Wrap all `gh` commands that reference the repository with the remote URL swap from the `github-cli` skill:
> ```bash
> ORIG_REMOTE=$(git remote get-url origin)
> git remote set-url origin https://github.com/hodakamori/megane.git
> gh <command>
> git remote set-url origin "$ORIG_REMOTE"
> ```

## Phase 1: CI Workflow Status

### 1.1 Monitor all publish workflows
```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
gh run list --limit 10
git remote set-url origin "$ORIG_REMOTE"
```
Wait for all tag-triggered workflows to finish. Expected workflows:
- `publish-pypi.yml` — Python wheels to PyPI
- `publish-npm.yml` — Widget bundle to npm
- `publish-vscode.yml` — Extension to VS Code Marketplace
- `release.yml` — GitHub Release (draft)
- `docs.yml` — Documentation to GitHub Pages

To inspect a failing workflow:
```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
gh run view <run-id> --log-failed
git remote set-url origin "$ORIG_REMOTE"
```

All workflows must show `success` before proceeding.

## Phase 2: Package Availability

### 2.1 PyPI
Verify the new version is installable:
```bash
pip index versions megane 2>/dev/null | head -1
```
Or check directly: https://pypi.org/project/megane/

Test install in a fresh virtualenv:
```bash
python -m venv /tmp/megane-test && \
  /tmp/megane-test/bin/pip install megane==X.Y.Z && \
  /tmp/megane-test/bin/python -c "import megane; print(megane.__version__)"
```
Expected output: `X.Y.Z`

### 2.2 npm
```bash
npm view megane-viewer@X.Y.Z version
```
Expected output: `X.Y.Z`

### 2.3 VS Code Marketplace
```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
gh run view --workflow=publish-vscode.yml --limit 1
git remote set-url origin "$ORIG_REMOTE"
```
Confirm the extension version matches `X.Y.Z`.

## Phase 3: Clean Environment Rendering Verification

Verify that the published packages actually work in a clean environment — not just that they exist, but that molecular structures render correctly.

### 3.1 Python + npm: widget rendering in fresh virtualenv

Install from PyPI into an isolated virtualenv (no local source files), then run the existing E2E widget test against it. This covers both the Python package (PyO3 native extension, parsers) and the npm package (megane-viewer WASM loaded by anywidget in the browser).

```bash
# Create isolated virtualenv and install from PyPI only
VENV=/tmp/megane-verify-X.Y.Z
python -m venv $VENV
$VENV/bin/pip install megane==X.Y.Z jupyterlab

# Run the widget E2E test using the PyPI-installed megane
# PATH override ensures local dev installation is NOT used
PATH=$VENV/bin:$PATH node tests/e2e/test_widget_render.mjs
```

Expected: all assertions pass — canvas created, non-white pixels rendered (atoms visible), no critical JS errors. Screenshots saved to `tests/e2e/screenshot_1crn.png` and `tests/e2e/screenshot_water_100k.png`.

This test verifies:
- PyPI install succeeds and PyO3 native extension loads
- megane-viewer (npm) WASM is bundled correctly and loads in browser
- Molecule rendering pipeline works end-to-end

### 3.2 VS Code extension: rendering via code-server

Download the VSIX from the VS Code Marketplace (the same artifact users install), run it in code-server, and verify the megane custom editor renders a molecule.

```bash
# Run the VS Code rendering E2E test
# Downloads VSIX from Marketplace, installs in code-server, verifies canvas render
node tests/e2e/test_vscode_render.mjs X.Y.Z
```

Expected: `PASS` for all assertions — canvas created in webview, non-white pixels rendered, no critical JS errors. Screenshot saved to `tests/e2e/screenshot_vscode_render.png`.

If code-server is not installed, the script installs it automatically via `npm install -g code-server`.

This test verifies:
- VSIX is available on VS Code Marketplace at version X.Y.Z
- Extension installs and activates correctly in code-server
- Webview loads WASM and renders the molecular structure

## Phase 4: GitHub Release Notes & Publishing

All `gh release` commands in this phase require the remote URL workaround.

```bash
# Set once and restore after all release commands
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
```

### 4.1 Find the previous release tag
```bash
git tag --sort=-version:refname | grep '^v' | head -5
```
Identify the previous tag (e.g., `vX.Y.Z-1`).

### 4.2 Generate release notes from diff
Collect all commits between the previous tag and the new tag:
```bash
git log vPREV..vX.Y.Z --oneline --no-merges
```

Also read the CHANGELOG entry for the new version:
```bash
awk '/^## \[X\.Y\.Z\]/,/^## \[/' CHANGELOG.md | head -50
```

Use these two sources to write human-readable release notes. Structure them as:

```markdown
## What's Changed

### Added
- ...

### Changed
- ...

### Fixed
- ...

## Install

### Python
pip install megane==X.Y.Z

### npm
npm install megane-viewer@X.Y.Z

### VS Code
Search for "megane" in the VS Code Extensions panel

**Full Changelog**: https://github.com/hodakamori/megane/compare/vPREV...vX.Y.Z
```

### 4.3 Update the draft release with generated notes
```bash
gh release edit vX.Y.Z --notes "$(cat <<'EOF'
## What's Changed

### Added
- ...

### Changed
- ...

### Fixed
- ...

## Install

### Python
pip install megane==X.Y.Z

### npm
npm install megane-viewer@X.Y.Z

### VS Code
Search for "megane" in the VS Code Extensions panel

**Full Changelog**: https://github.com/hodakamori/megane/compare/vPREV...vX.Y.Z
EOF
)"
```

### 4.4 Upload rendering verification screenshots

Attach the screenshots captured in Phase 3 to the release as visual proof that rendering works correctly after install.

```bash
gh release upload vX.Y.Z \
  tests/e2e/screenshot_1crn.png \
  tests/e2e/screenshot_water_100k.png \
  tests/e2e/screenshot_vscode_render.png
```

### 4.5 Confirm the draft is ready
```bash
gh release view vX.Y.Z

# Restore remote
git remote set-url origin "$ORIG_REMOTE"
```
Verify the notes look correct and the three screenshots are listed as assets. The release remains as a **draft** — hand off to the user to review and publish it manually.

> **CRITICAL: Never publish the release.** Publishing (making the draft public) is a manual step performed exclusively by the user. Do NOT run `gh release edit vX.Y.Z --draft=false` or any equivalent command. Stop after confirming the draft looks correct.

## Phase 5: Documentation

### 5.1 GitHub Pages deployment
```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
gh run list --workflow=docs.yml --limit 1
git remote set-url origin "$ORIG_REMOTE"
```

Visit the docs site and verify the version shown matches `X.Y.Z`:
- Check the version badge or footer
- Verify new features/APIs mentioned in the release are documented

## Phase 6: Live Demo

### 6.1 AWS ECS demo health
```bash
ORIG_REMOTE=$(git remote get-url origin)
git remote set-url origin https://github.com/hodakamori/megane.git
gh run list --workflow=deploy.yml --limit 1
git remote set-url origin "$ORIG_REMOTE"
```
If the demo was updated, verify it loads correctly in the browser.

## Phase 7: Announcement Checklist (manual)

These items require manual action outside of automated workflows:

- [ ] Update any pinned version references in example repositories
- [ ] Post release notes to relevant community channels if applicable
- [ ] Close any GitHub issues resolved in this release
- [ ] Open a new milestone for the next version if needed

## Summary

Once all phases are complete, the release is done. Key verification:

| Item | Command |
|---|---|
| All CI workflows | `gh run list --limit 10` (with remote swap) |
| PyPI version | `pip index versions megane` |
| npm version | `npm view megane-viewer@X.Y.Z version` |
| Python + npm rendering (clean venv) | Phase 3.1: install from PyPI → `node tests/e2e/test_widget_render.mjs` |
| VS Code rendering (code-server) | `node tests/e2e/test_vscode_render.mjs X.Y.Z` |
| Release notes + screenshots uploaded | `gh release view vX.Y.Z` (with remote swap) |
| Docs site updated | `gh run list --workflow=docs.yml` (with remote swap) |

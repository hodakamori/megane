---
description: Post-release checklist for megane. Run after pushing a release tag to verify all publish workflows succeeded and packages are live.
---

# Post-Release Checklist

Run this skill after pushing a release tag (`vX.Y.Z`). Verify every item before declaring the release complete.

## Phase 1: CI Workflow Status

### 1.1 Monitor all publish workflows
```bash
gh run list --limit 10
```
Wait for all tag-triggered workflows to finish. Expected workflows:
- `publish-pypi.yml` — Python wheels to PyPI
- `publish-npm.yml` — Widget bundle to npm
- `publish-vscode.yml` — Extension to VS Code Marketplace
- `release.yml` — GitHub Release (draft)
- `docs.yml` — Documentation to GitHub Pages

To inspect a failing workflow:
```bash
gh run view <run-id> --log-failed
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
Check the extension page on the marketplace, or verify via:
```bash
gh run view --workflow=publish-vscode.yml --limit 1
```
Confirm the extension version matches `X.Y.Z`.

## Phase 3: GitHub Release Notes & Publishing

### 3.1 Find the previous release tag
```bash
git tag --sort=-version:refname | grep '^v' | head -5
```
Identify the previous tag (e.g., `vX.Y.Z-1`).

### 3.2 Generate release notes from diff
Collect all commits between the previous tag and the new tag:
```bash
git log vPREV..vX.Y.Z --oneline --no-merges
```

Also read the CHANGELOG entry for the new version:
```bash
# Extract the section for vX.Y.Z from CHANGELOG.md
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

### 3.3 Update the draft release with generated notes
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

### 3.4 Confirm the draft is ready
```bash
gh release view vX.Y.Z
```
Verify the notes look correct. The release remains as a **draft** — hand off to the user to review and publish it manually.

## Phase 4: Documentation

### 4.1 GitHub Pages deployment
Confirm `docs.yml` workflow succeeded:
```bash
gh run list --workflow=docs.yml --limit 1
```

Visit the docs site and verify the version shown matches `X.Y.Z`:
- Check the version badge or footer
- Verify new features/APIs mentioned in the release are documented

## Phase 5: Live Demo

### 5.1 AWS ECS demo health
After a release, the `deploy.yml` workflow may re-deploy. Check:
```bash
gh run list --workflow=deploy.yml --limit 1
```
If the demo was updated, verify it loads correctly in the browser.

## Phase 6: Announcement Checklist (manual)

These items require manual action outside of automated workflows:

- [ ] Update any pinned version references in example repositories
- [ ] Post release notes to relevant community channels if applicable
- [ ] Close any GitHub issues resolved in this release
- [ ] Open a new milestone for the next version if needed

## Summary

Once all phases are complete, the release is done. Key verification:

| Item | Command |
|---|---|
| All CI workflows | `gh run list --limit 10` |
| PyPI version | `pip index versions megane` |
| npm version | `npm view megane-viewer version` |
| GitHub release draft with notes ready | `gh release view vX.Y.Z` |
| Docs site updated | `gh run list --workflow=docs.yml` |

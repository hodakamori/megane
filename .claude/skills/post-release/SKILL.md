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

## Phase 3: GitHub Release

### 3.1 Publish the draft release
The `release.yml` workflow creates a draft. Review and publish it:
```bash
gh release view vX.Y.Z
gh release edit vX.Y.Z --draft=false
```
Verify the release notes are correct (auto-generated from git log).

### 3.2 Confirm release page
```bash
gh release view vX.Y.Z --web
```

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
| GitHub release published | `gh release view vX.Y.Z` |
| Docs site updated | `gh run list --workflow=docs.yml` |

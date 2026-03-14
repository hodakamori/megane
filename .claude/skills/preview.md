---
description: Capture screenshots and videos of the megane viewer for visual review. Use when asked to take screenshots, capture previews, or verify visual output.
---

# Screenshot & Preview Capture

## IMPORTANT: These scripts use Playwright, NOT Puppeteer

All scripts resolve Playwright from `/opt/node22/lib/node_modules/`.

## Dev Preview (screenshots + video for visual review)

### Screenshots only
```
node scripts/dev-preview.mjs --screenshot
```
or: `make preview-screenshot`

### Video with interaction (rotates molecule)
```
node scripts/dev-preview.mjs --video --interact
```
or: `make preview-video`

### Both screenshots and video
```
node scripts/dev-preview.mjs --interact
```
or: `make preview`

Output goes to `dev-preview/` directory with a `latest.md` markdown summary.

### Options
- `--desktop-only` / `--mobile-only` — limit viewports
- `--duration <ms>` — video duration (default 5000)
- `--clean` — remove previous captures first

## Hero Screenshot (for docs/README)
```
node scripts/capture-screenshots.mjs
```
Captures a high-quality 1280x720 DPR=2 screenshot of caffeine_water molecule.
Output: `docs/public/screenshots/hero.png`.
This script does NOT require WASM (uses pre-parsed JSON data).

## Prerequisites

- WASM must be built for dev-preview.mjs (it auto-builds if missing)
- capture-screenshots.mjs does NOT need WASM
- Both scripts auto-start and auto-stop a Vite dev server

## Cleaning Up
```
make preview-clean
```
Removes the `dev-preview/` directory.

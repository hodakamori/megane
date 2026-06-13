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

Output goes to `dev-preview/` directory.

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

## Scripted Zoom Demo Video (storyboard-as-code)

Produces a single continuous webm that walks the live app through a scripted
flow while zooming into UI regions:
**full screen → zoom Chat panel + type a prompt → (live AI generate) → rotate
the molecule → zoom the pipeline graph.**

```
npm run demo:video                                   # no key → prompt typed, generate skipped
ANTHROPIC_API_KEY=sk-ant-... npm run demo:video      # live AI generation (local BYOK)
npm run demo:video -- --no-generate                  # force skip the AI call

# Record the deployed demo site (its built-in LLM proxy runs generation, no key):
npm run demo:video -- --url https://<demo-site>/megane/app/
```

- **Storyboard ("台本"):** `scripts/demo-script.mjs` — a declarative `scenes`
  array (id / zoom / action / hold). Edit it to change the demo; no need to
  touch the engine.
- **Director (engine):** `scripts/demo-video.mjs` — starts Vite, records a webm
  via Playwright `recordVideo`, and zooms by tweening a CSS `transform` on
  `#root`. Verbs: `askChat` (type + submit), `waitGenerate` (dwell on the chat
  messages while the reply streams), `rotate`, `showAndScrollPipeline`
  (Editor-tab fitView shows the whole pipeline, then a linear top→bottom scroll —
  tune via `config.pipelineScrollScale` / `pipelineScrollMs`).
- **Zoom control:** scene `zoom` is `"full"`, `"keep"`, or
  `{ sel, scale?, pad?, anchorX?, anchorY? }`. Use `scale` for full-height targets
  like the side panel (fit-to-bbox there is ~1×); `anchorY` (0..1) biases the
  framing (e.g. 0.72 toward the lower, streaming part of the chat). Per-scene
  `transitionMs` overrides the tween speed.
- **Output:** `demo/out/megane-demo-<timestamp>.webm` (gitignored).
- **Options:** `--out <path>`, `--prompt "<text>"`, `--width/--height`, `--dpr`,
  `--no-generate`, `--clean`.
- **Notes:** `deviceScaleFactor: 2` keeps CSS-zoomed pixels reasonably crisp.
  The pipeline panel defaults to the **Chat** tab, so `.react-flow` mounts
  hidden until the Editor tab is selected (the `pipeline` scene handles this via
  `actionFirst`). Live generation needs `ANTHROPIC_API_KEY` + network; without
  them the run still completes (prompt typed, generation skipped).

## Prerequisites

- WASM must be built for dev-preview.mjs (it auto-builds if missing)
- capture-screenshots.mjs does NOT need WASM
- Both scripts auto-start and auto-stop a Vite dev server

## Cleaning Up
```
make preview-clean
```
Removes the `dev-preview/` directory.

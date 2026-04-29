# megane E2E coverage roadmap

A working list of E2E gaps and the order in which they should be filled.
The goal is to graduate the suite from "viewer mounts and parses files on
five hosts" (current state, ~41 tests) to "every user-facing feature of
megane has at least one cross-host regression test."

Refer to this file when picking up follow-up work; check items off as
they land. Items are grouped by phase — earlier phases unblock later
ones.

---

## Phase 0 — current state (done in PR #307)

- 5 distribution targets exercised end-to-end (webapp / jupyterlab-doc /
  widget-jupyterlab / vscode / widget-vscode).
- 5 file formats (PDB / GRO / XYZ / MOL / SDF) on every host that uses
  the WASM parser path; multiple PDB fixtures on the legacy
  `MolecularViewer.load()` hosts.
- Sidebar collapse, frame seek, playback toggle, fps dropdown,
  pipeline-editor mount, render-modal open, drag-and-drop pipeline
  file (webapp).
- 54 committed pixel baselines.

Everything below is **not** in PR #307.

---

## Phase 1 — easy wins (no source changes required)

Pure spec / fixture additions. Should be doable as a single follow-up
PR per host.

### 1.1 Pipeline graph editing (`pipeline-editor` project, webapp)
- [ ] Drag a node from the palette onto the canvas.
- [ ] Connect two nodes by dragging an edge between their handles.
- [ ] Delete a node via keyboard shortcut.
- [ ] Edit a node's `fileName` parameter and confirm the renderer
      re-runs.
- New testids needed in `src/components/PipelineEditor*` and
  `src/components/nodes/*`. The shell already exposes
  `pipeline-node-${nodeType}` (see `NodeShell.tsx:25`); extend with
  `pipeline-node-handle-${id}-{in,out}` and a palette item testid.
- Acceptance: each test ends with `waitForReady` and a viewer-region
  baseline showing the post-edit render.

### 1.2 Trajectory frame coverage (`playback` project)
- [ ] Sweep all five frames of `caffeine_water` and capture a baseline
      at each. Catches "renderer caches frame 0 buffers" regressions.
- [ ] FPS=1 vs FPS=15 visual baselines after a fixed elapsed time.
- [ ] Loop wrap-around (frame N → frame 0).

### 1.3 Crystal / cell rendering (`format-loading` project)
- [ ] Add a CIF fixture with a small cubic cell (e.g. NaCl is already
      committed). Capture a baseline showing the cell box edges.
- [ ] Add a fixture with a triclinic cell.
- [ ] Toggle cell-axes visibility (needs new testid in
      `CellAxesRenderer` exposure).
- [ ] PBC unwrapping toggle.

### 1.4 Multi-format on widget hosts
Currently widget-jupyterlab / widget-vscode are PDB-only because
`MolecularViewer.load()` is hard-wired. Two paths:
- [ ] Use `viewer.set_pipeline(megane.Pipeline.load(json))` for
      non-PDB formats (programmatic, no API change).
- [ ] Or extend `MolecularViewer.load()` to dispatch on extension
      (small Python change in `python/megane/widget.py:86`).

### 1.5 Pipeline file format on remaining hosts
- [ ] `.megane.json` open in **vscode pipelineViewer** (a custom editor
      view-type already exists; see `vscode-megane/src/extension.ts:18`).
- [ ] `.megane.json` open in **jupyterlab-doc** (DocWidget supports it).

### 1.6 Render-modal output (without FFmpeg)
- [ ] Click "Save PNG" and assert the download triggers (use
      `page.waitForEvent('download')`). FFmpeg-gated GIF/MP4 stays
      skipped; PNG export is pure-canvas and runs on every machine.
- [ ] Verify the resolution / background-color inputs round-trip
      through the renderer.

### 1.7 Widget API quick fixes
- [ ] Fix `widget-api.spec.ts:103` failure. The `jupyterapp` global
      isn't on `window` in modern JupyterLab; expose it via
      `addInitScript` or use `Jupyter.notebook` shim. Reuse the
      kernel-discovery pattern from
      `tests/e2e/lib/hosts/jupyterlab.ts:openLabNotebook`.
- [ ] Add coverage for `viewer.set_pipeline(...)` programmatic
      assignment.

---

## Phase 2 — needs small source changes

These require modest changes in the React/renderer code so the test
runner can observe state. None of them are user-visible.

### 2.1 AppearancePanel coverage
Source state:
- 6 testids already exist (`appearance-{atom,bond}-{opacity,scale}`,
  `appearance-vdw-scale`, `appearance-vector-scale`).
- The panel does **not** mount in the webapp shell currently.

Plan:
- [ ] Mount `AppearancePanel` inside the webapp's right sidebar (under
      a CollapsiblePanel). Already mounted in widget hosts.
- [ ] Add `appearance` Playwright project + spec: drag each slider,
      confirm `data-megane-context="webapp"`,
      `expectViewerRegionMatch` baselines per slider end-position.
- [ ] Cross-host: same spec runs under `jupyterlab-doc` and
      `widget-jupyterlab` via `MEGANE_HOST` env var (host-fixture
      mechanism described below).

### 2.2 Modify-node sliders
- 2 testids already in `src/components/nodes/ModifyNode.tsx`
  (`modify-node-opacity`, `modify-node-scale`).
- [ ] Insert a Modify node into the default pipeline graph (extends
      Phase 1.1).
- [ ] Slide each, assert renderEpoch advances, capture baseline.

### 2.3 Camera operations
The OrbitControls drag path is non-deterministic. Either:
- [ ] Add a `viewer.setCameraMode(...)` and
      `viewer.resetCamera()` programmatic API on the renderer (already
      partially in place, just not exposed) and drive it from the test.
- [ ] Or add `data-camera-state` attribute on `viewer-root` so the test
      can poll position / target rather than driving the mouse.
- Tests:
  - perspective ↔ ortho switch baseline parity
  - pivot animation (smooth lerp) renderEpoch increments
  - frustum-inset baseline (camera respects sidebar width)

### 2.4 Atom selection / measurement
Per `e2e-coverage` skill notes, this was pulled from the previous PR
because the renderer does not expose projected atom positions. Plan:
- [ ] Add `viewer.getProjectedAtomPositions()` to the renderer, gated on
      `_testMode` (already used by other hooks).
- [ ] Expose it on `window.__megane_test` (alongside
      `__megane_test_ready`).
- [ ] Spec: query positions, click on the atom whose projected (x,y)
      matches, assert `[data-testid="measurement-panel"]` shows
      `data-selection-count="1"`.
- [ ] Coverage for `measurement-clear`, multi-atom selection (count=2,3).

### 2.5 Vector / arrow / label / polyhedron rendering
Each of these is a separate Renderer subsystem. They mount when the
pipeline contains a corresponding node.
- [ ] Add fixture pipelines that include each kind of node + matching
      data file.
- [ ] Cross-host viewer-region baselines.
- [ ] Toggle visibility via the AppearancePanel slider for each subsystem.

---

## Phase 3 — coverage breadth

These are nice-to-haves that take time but no architectural work.

### 3.1 Cross-host fixture
Currently each spec hard-codes its host. The `e2e-coverage` skill
mentions a `tests/e2e/lib/host-fixture.ts` that *should* exist but
doesn't. Plan:
- [ ] Implement `hostFixture()` that reads `MEGANE_HOST` and returns
      `{ scope, project, context }` (see skill snippet).
- [ ] Migrate **every feature spec** (`format-loading`, `playback`,
      `sidebar`, `pipeline-editor`, `pipeline-file`, `render-modal`,
      `appearance`, `measurement`) to use it.
- [ ] Run each one against all 5 hosts via `for host in ...; do
      MEGANE_HOST=$host npm run test:e2e:<feature>; done`.

This explodes the matrix from ~41 tests to ~150 tests but each new
combination is a free regression-detection seat.

### 3.2 More fixture diversity
- [ ] Large protein (>50k atoms) — performance regression marker.
- [ ] Long trajectory (>1000 frames) — frame-cache regression marker.
- [ ] Mixed-element fixture (>10 distinct atomic numbers) — palette
      regression marker.
- [ ] PDB with HETATM ligands that need bond-perception — bond
      generation regression marker.

### 3.3 Save / dirty-state
- [ ] DocWidget: edit pipeline → Ctrl+S → dirty indicator clears →
      reopen file → state preserved.
- [ ] VSCode pipelineViewer: same.
- [ ] Widget-* hosts: `viewer.save_pipeline(path)` round-trip.

### 3.4 Error / edge cases
- [ ] Malformed PDB → error banner mounts (testid exists?
      `defaultViewerContract` should add one).
- [ ] Empty trajectory → Timeline does not mount.
- [ ] WASM load failure → fallback message visible.

---

## Phase 4 — out-of-scope for E2E

Recorded here so we don't lose track:
- Rust core unit tests live in `cargo test -p megane-core`.
- TS unit tests live in `vitest`.
- Python tests live in `pytest`.
- `megane server` / CLI is exercised by integration tests, not E2E.

---

## Helpers to write before Phase 2

These are "hot-path" utilities. Doing them once unblocks many tests.

- [ ] `tests/e2e/lib/host-fixture.ts` — `MEGANE_HOST`-driven fixture.
- [ ] `tests/e2e/lib/pipeline.ts` — programmatic pipeline editing
      helpers (insertNode, connectEdge, setNodeParam).
- [ ] `tests/e2e/lib/widget-api.ts` — wrapper around the
      `viewer.frame_index = N` / `viewer.selected_atoms = ...`
      patterns, hiding the `executePython` plumbing.
- [ ] `tests/e2e/lib/render-utils.ts` — shared helpers for camera
      reset, frame swap, screenshot wait.

---

## Source-side checklist (what needs adding to ship Phase 2)

Single-PR-sized changes that unblock multiple test categories at once.

- [ ] **Mount `AppearancePanel` in the webapp shell.** (Phase 2.1)
- [ ] **Renderer hooks** behind `_testMode`:
  - [ ] `getProjectedAtomPositions()`
  - [ ] `getCameraState()`
  - [ ] `getVisibleSubsystems()` (atoms / bonds / cell / vectors / labels / polyhedra)
- [ ] **`__megane_test` namespaced object** exposing the above, attached
      next to `__megane_test_ready` so tests have one canonical entry
      point.
- [ ] **`MolecularViewer.load()` extension dispatch** in
      `python/megane/widget.py:86` to enable Phase 1.4.
- [ ] **`jupyterapp` global shim** in
      `tests/e2e/lib/hosts/jupyterlab.ts:openLabNotebook` for Phase 1.7.

---

## How to measure progress

```sh
# total test cases
npx playwright test --list | tail -1

# committed baselines
find tests/e2e/baselines -name '*.png' \
  ! -name '*.current.png' ! -name '*.new.png' ! -name '*.diff.png' | wc -l

# per-host coverage
for d in tests/e2e/baselines/*/; do
  printf '%-25s %s\n' "$(basename $d)" \
    "$(find "$d" -maxdepth 1 -name '*.png' \
      ! -name '*.current.png' ! -name '*.new.png' ! -name '*.diff.png' | wc -l)"
done
```

When this file's checkboxes are all green, the suite covers every
user-facing megane feature on every host. Treat unchecked items as
known regressions waiting to happen.

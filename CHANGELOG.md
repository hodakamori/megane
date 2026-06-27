# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [0.9.1] - 2026-06-28

### Fixed

- **Blank VSCode webview (and other Vite-built hosts).** v0.9.0 bumped Vite to 8 (rolldown), whose CI-built bundle crashed at runtime, leaving a blank panel. Reverted to the known-good Vite 6 / `@vitejs/plugin-react` 4 toolchain in both the root project and `vscode-megane`.
- Hardened WebGL2 context creation with a clear, actionable error message.

### Added

- **Top-level React error boundary** on every host (VSCode webview, webapp, anywidget widget, JupyterLab structure + pipeline doc widgets) so a render/effect failure shows an actionable message instead of a blank screen.
- **`render-smoke` CI job** (`npm run smoke:render`) that builds each Vite bundle with the locked toolchain and asserts the viewer mounts and the WebGL canvas draws — closing the gap that let the v0.9.0 blank bundle ship.

### Changed

- `vsce package`/`publish` now always rebuild via a `vscode:prepublish` script, so the extension can never ship stale `out/` + `media/` artifacts.

## [0.9.0] - 2026-06-18

### Added

#### Representations / rendering

- **Licorice representation** with seamless, ray-cast bond impostors so spheres cap the tube ends cleanly
- **Line display mode** (VMD/PyMOL-style thin wireframe)
- **Per-atom representation** overrides, letting individual atoms use a different style than the global representation

#### AI chat / LLM pipeline

- **Assistant prose in chat**, with the **Chat tab as the default** pipeline panel view
- **Free demo LLM chat** backed by a Cloudflare Worker proxy, including a "use my own API key" toggle, request logging, and multi-model fallback routing to survive free-tier rate limits
- **LLM pipeline-generation benchmark harness** (`bench/llm/`) and a label-gated `llm-eval` CI workflow that scores the PR branch against its base via OpenRouter
- Documented the remaining pipeline node types in the LLM system prompt

#### Pipeline / UI

- **`molecule_id` selection field** for atom and bond pipeline queries

### Changed

- Improved LLM molecular-selection accuracy so prompts select species correctly
- Generated pipelines are now validated and repaired via a JSON round-trip before being applied
- The AI-generated pipeline is applied mid-stream to cut perceived latency
- Skills use OpenAI tool-calling on OpenAI/OpenRouter providers, with pipeline-skill templates inlined for OpenAI-compatible endpoints
- Pipeline chat input box defaults to five rows tall

### Fixed

- Orthographic wheel zoom is now reversible
- Perspective near/far planes are tracked on zoom so wheeling out restores atoms instead of clipping them
- Resname labels are resolved from the structure by default
- GROMACS topology bonds are replicated across molecule instances, and cross-boundary bonds render correctly after the Replicate node
- The VSCode webview CSP nonce now uses a cryptographically secure RNG
- GIF rendering no longer freezes at 80% (gif.js worker is loaded via a blob URL)
- AI chat no longer gets stuck or flickers, and the loaded structure is preserved with raw JSON hidden
- LLM error messages are sanitized and a pipeline action summary is shown

### Performance

- Removed per-atom/per-line allocations in GRO and LAMMPS parsing
- Deferred the existing-bond lookup until after the distance test during bond inference
- Faster LAMMPS data and GRO/`.top` loading

## [0.8.0] - 2026-06-07

### Added

#### Parsers / formats

- **DCD trajectory parser** (CHARMM/NAMD/X-PLOR) registered across all hosts (#386)
- **AMBER NetCDF trajectory parser** (`.nc`) (#394)
- **mmCIF (PDBx) parser** with auto-detection and full host registration (#431)
- **PSF (CHARMM/NAMD) topology parser** (#423)
- **AMBER prmtop topology parser** (#428)
- **SDF V3000 (CTfile)** support added to the MOL parser (#421)
- **Nested `#include` resolution** in the GROMACS `.top` parser (#433)
- Sibling `.top` file is auto-loaded when opening a `.gro` in VSCode and JupyterLab (#490)

#### Representations / rendering

- **Cartoon/ribbon representation** for proteins, rewritten for Mol*-quality output (#362, #400, #411)
- **Solvent-Accessible Surface (SAS) representation** (#406)
- **OVITO-style surface mesh** pipeline node (alpha-shape envelope) and template (#412, #432)
- **Isosurface representation** for volumetric data (#364, #443)
- **VESTA-style polyhedra** auto-detection with opt-out checkboxes (#453)
- **Atom color schemes**: `byResidue`, `byChain`, `byBFactor`, `byProperty` in addition to `byElement` and uniform hex (#365, #382)
- **Dark mode / theme support** (#375, #396)

#### Pipeline / UI

- **Replicate (supercell) node** for unit-cell replication, plus automatic CIF crystallographic symmetry expansion on load (#460, #486)
- **Adjustable VDW bond threshold.** The AddBond node's distance (VDW) mode now exposes a "Threshold" slider that scales the bonding cutoff `(vdw_i + vdw_j) * scale`. Loosen it to capture longer bonds or tighten it to drop spurious ones, per system. Defaults to 0.6, so existing pipelines render identically unless adjusted (#459)
- **URL-shareable pipeline permalinks** (#395)
- **Camera state persistence** across sessions (#374, #392)
- **Protein** and **Surface Mesh** pipeline templates (#410, #432)
- **Multi-measurement list management UI** (#366, #435)
- **Timeline controls**: step buttons, speed multiplier, and loop range (#426)
- Pipeline editor splits the editor and chat into tabs (#436)
- **Render/export**: glTF and OBJ 3D-model export from the render modal (#434); SVG export from the snapshot modal (#372, #437)

#### Python / JS API

- Python structure parsers: `load_gro`, `load_mol`, `load_sdf`, `load_mol2` (#418); MOL2/CIF dispatch in `LoadStructure` (#399)
- Python trajectory parsers: `load_dcd`, `load_netcdf`, `load_lammpstrj` (#417)
- Programmatic frame seek in JupyterLab and VSCode (#416)
- `onSelectionChange` / `onMeasurementChange` props on `MeganeViewer`, with `selection_change` / `measurement` events wired on JupyterLab and VSCode (#413, #414)
- `frame_change` callback and frame counter in the JupyterLab status bar (#405)

### Changed

- **Atom coloring moved out of the Viewport node and into the Modify node.** The Viewport "Color scheme" dropdown is gone; coloring is now a pipeline-edge concern. The Modify node has a new `Color` toggle plus a mode selector (uniform hex, byElement, byResidue, byChain, byBFactor, byProperty), and the chosen palette applies **only** to the upstream selection — so "color residues on chain A only" is now expressible by chaining Filter → Modify. A Modify node wired without a Filter still colors the whole structure (the previous single-mode workflow). Legacy serialized pipelines carrying `viewport.colorScheme` are silently stripped on load; they render in CPK until a Modify color rule is added.
- Representation and Color were split into dedicated pipeline nodes (#409)
- The Supercell node was dropped in favor of the Replicate node; CIF symmetry expansion now happens automatically on load
- Bonds are rendered split-colored by each endpoint atom (#487)

### Fixed

- Cross-boundary bonds now render correctly after Replicate (#493)
- Replicated copies animate during trajectory playback (#491)
- CIF parser tolerates blank/comment lines inside `loop_` blocks (#458, #464)
- Share button surfaces failures via a visible dialog instead of a silent toast, and `buildShareUrl` no longer blocks on `CompressionStream` (#401, #420, #422)
- Renderer replays bonds when `updateBondsExt` precedes `loadSnapshot`, and composes bond visibility with pipeline bond availability
- Stale renderer state is reset when switching pipeline templates (#424, #425)
- Pipeline editor keeps the pipeline visible across tab switches and stops the toolbar row from eating canvas height (#444, #445)
- `ViewportParams.colorScheme` made optional to preserve backward compatibility

### Packaging

- Bumped `pyo3` and `numpy` to 0.28 and added Python 3.14 wheels; ship `wheel-share` in the sdist (#463)

### Documentation

- Numerous docs/source reconciliations across format tables, parser lists, the architecture diagram, and the React API examples; documented the Codecov merge gate and the E2E verification requirement for UI-affecting changes (#385, #393, #398, #427, and others)

## [0.7.0] - 2026-05-02

### Added

- **Tripos MOL2 parser** — load `.mol2` files across all hosts (#355, #379)
- **First-time user tour** — driver.js-powered onboarding with welcome step, viewport highlight, and a dedicated pipeline assembly walk-through, launchable from the toolbar Tutorial button
- Cross-host platform-support gaps closed — every supported format now registers on webapp, JupyterLab DocWidget, JupyterLab widget, VSCode custom editor, and VSCode notebook widget (#377)
- Auto-open extended to all megane primary structure formats
- Pipeline toolbar split into Pipeline / I/O / Others rows for clearer categorization
- AddBond node picks its default Source by file format on open
- `usePipelineStore.openFile` becomes the single ingestion entry; webapp, JupyterLab, and VSCode webview all route through it
- `setup-local.sh` one-shot installer for VSCode and JupyterLab extensions
- LICENSE file shipped in the VSCode extension package

### Changed

- MeganeViewer is now driven entirely from the pipeline + playback stores; per-document store isolation in JupyterLab/VSCode prevents cross-tab contamination
- Demo deployment migrated to Cloudflare Pages
- Dropped the redundant LoadTrajectory node — multi-frame structure files load directly via the structure node
- Removed legacy `AppearancePanel` and `WidgetViewerSimple` components

### Fixed

- Per-frame GPU leak on bonds — InstancedBufferAttributes are reused instead of recreated each frame
- Plotly notebook dihedral plot and frame numbering
- Blank multi-viewport in widgets — pipeline store is now per-instance and pipeline JSON applies atomically with per-node snapshots
- AddBond Source default now applies in single-file viewers
- Deserialized pipeline graphs are normalized and viewport guides are preserved
- Timeline renders in all hosts via a playback-store fallback
- VSCode supported-formats documentation drift

### Performance

- PBC `inferBondsVdwJS` precomputes per-cell shifts (hot-path rewrite with typed arrays)
- JupyterLab tab state is cached and `MeganeViewer` is decoupled from `viewportState`

### Documentation

- Local-run instructions for the VSCode and JupyterLab extensions
- Test coverage roadmap and E2E `COVERAGE_PLAN.md`
- README and skills aligned with the current implementation

## [0.6.2] - 2026-03-25

No user-facing changes in this version.
## [0.6.1] - 2026-03-25

### Fixed

- VSCode extension blank screen when opening .gro files
- MDX brace escaping in generated API documentation
- Migrate `onBrokenMarkdownLinks` config from VitePress to Docusaurus
- Remove old VitePress documentation remnants

## [0.6.0] - 2026-03-24

### Added

- `view()` and `view_traj()` convenience wrappers for quick visualization
- `megane-viewer/lib` export for React component library usage
- Visual pipeline architecture guide in documentation

### Fixed

- README import paths updated to `megane-viewer/lib`
- Documentation inconsistencies between docs and implementation
- `.sdf` and `.lammps` extensions added to Python parser dispatch

## [0.5.0] - 2026-03-17

### Added

- **Bond selection** — Filter node now accepts a `bond_query` for selecting bonds by index or connected atoms. Supports `bond_index`, `atom_index`, and `element` fields with a `both` modifier for requiring both endpoints to match. Example: `both atom_index >= 24` selects bonds where both atoms are solvent.
- **Per-bond opacity** — Modify node applies per-bond opacity when bonds are filtered, enabling selective transparency (e.g., semi-transparent solvent bonds)
- Default caffeine-water pipeline now renders solvent bonds semi-transparent to match solvent atom opacity

### Fixed

- Wrong atoms rendered when switching from solid to streaming template
- Trajectory controls broken on streaming template
- `loadText` return type now uses `StructureParseResult` for improved type safety

## [0.4.0] - 2026-03-14

### Added

- **CIF format** — Crystallographic Information File (`.cif`) parser
- **LAMMPS data format** — LAMMPS data file (`.data`, `.lammps`) parser with auto-detection of atom_style
- **ASE .traj format** — ASE trajectory (`.traj`) parser for ULM binary format
- **LAMMPS dump trajectory** — LAMMPS dump (`.lammpstrj`) parser
- **Streaming node** — dedicated `Streaming` node for WebSocket-based real-time data delivery with bond output support
- AI pipeline generator — describe visualizations in natural language and the node graph is built automatically
- Pipeline error display with node-level error icons and tooltips
- Multiple structure loading with layer-based rendering
- Render export button on pipeline editor
- Python `Pipeline` class — NetworkX-style graph builder API for constructing pipelines programmatically
- VSCode extension auto-setup: opening a PDB file creates a LoadStructure + AddBond + Viewport pipeline
- Test coverage measurement for TypeScript, Python, and Rust
- Tests for pipeline graph/validate/types, protocol, server, and CLI modules

### Changed

- Removed unused `puppeteer` dependency (all E2E tests use Playwright)
- Added metadata (description, authors, license, repository) to all Rust crates

### Fixed

- React error #185 — infinite re-render loop
- LoadStructure node now supports CIF and LAMMPS file uploads
- Frontend fallback route when static files are not built
- API key no longer persisted in localStorage

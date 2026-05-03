# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Changed

- **Atom coloring moved out of the Viewport node and into the Modify node.** The Viewport "Color scheme" dropdown is gone; coloring is now a pipeline-edge concern. The Modify node has a new `Color` toggle plus a mode selector (uniform hex, byElement, byResidue, byChain, byBFactor, byProperty), and the chosen palette applies **only** to the upstream selection — so "color residues on chain A only" is now expressible by chaining Filter → Modify. A Modify node wired without a Filter still colors the whole structure (the previous single-mode workflow). Legacy serialized pipelines carrying `viewport.colorScheme` are silently stripped on load; they render in CPK until a Modify color rule is added.

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

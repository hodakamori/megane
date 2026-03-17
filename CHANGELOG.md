# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

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

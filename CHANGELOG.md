# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

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

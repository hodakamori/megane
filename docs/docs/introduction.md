# Introduction

**megane** is a high-performance molecular viewer that works wherever you do — as a Jupyter widget, a standalone web app, an embeddable React component, and a VS Code extension.

## What can megane do?

- **Render 1M+ atoms at 60 fps** in the browser using billboard impostor rendering
- **Load 15 file formats**: PDB, GRO, XYZ, MOL, SDF, MOL2, CIF, mmCIF, LAMMPS data, AMBER topology, XTC, DCD, ASE `.traj`, LAMMPS dump, AMBER NetCDF
- **Stream XTC trajectories from the `megane serve` CLI** over WebSocket — scrub multi-GB files without loading every frame into memory (browser/Jupyter without the CLI load full trajectories)
- **Build visual pipelines** with a drag-and-drop node editor, or write them as Python/TypeScript code
- **Integrate with Plotly**, MDX/Next.js, ipywidgets, and any framework via the framework-agnostic renderer
- **Light, dark, and auto themes** — cycle through Light / Dark / Auto (follows OS preference) via the Theme button in the Pipeline panel; persisted across sessions

## Choose your distribution

megane ships in six distributions, grouped by what you want to do — **view** your data interactively, **embed** the viewer in your own app, or **parse** files programmatically.

| Category | Distribution | Install | Start here |
|----------|--------------|---------|------------|
| **View** | Standalone web app | `pip install megane`, then `megane serve` | [Standalone web app](./guide/cli) |
| **View** | Jupyter widget | `pip install megane` | [Jupyter widget](./guide/jupyter) |
| **View** | JupyterLab extension | `pip install megane` | [JupyterLab extension](./guide/jupyterlab) |
| **View** | VS Code extension | Install the megane extension | [VS Code extension](./guide/vscode) |
| **Embed** | React component | `npm install megane-viewer` | [React component](./guide/web) |
| **Parse** | Python package | `pip install megane` | [Python Pipeline API](./guide/pipeline/python) |

For a side-by-side comparison of which formats and UI features each distribution supports — including known gaps — see [Platform Support](./platform-support).

## Supported file formats

| Format | Extension |
|--------|-----------|
| Protein Data Bank | `.pdb` |
| GROMACS structure | `.gro` |
| XYZ | `.xyz` |
| MDL Molfile (V2000) | `.mol` |
| MDL SDfile (parsed via the V2000 Molfile reader) | `.sdf` |
| Tripos MOL2 | `.mol2` |
| Crystallographic Information File | `.cif` |
| Macromolecular CIF (mmCIF/PDBx) | `.mmcif` |
| LAMMPS data | `.data`, `.lammps` |
| AMBER topology | `.prmtop` |
| GROMACS trajectory | `.xtc` |
| CHARMM/NAMD DCD trajectory | `.dcd` |
| ASE trajectory | `.traj` |
| LAMMPS dump | `.lammpstrj`, `.dump` |
| AMBER NetCDF trajectory | `.nc` |

Per-host coverage (which formats each platform's UI can open vs. parser-only access) is enumerated in [Platform Support](./platform-support).

## Architecture at a glance

megane is a Rust core compiled to both WebAssembly (browser) and a Python extension (PyO3), with a TypeScript/React frontend built on Three.js.

```
┌────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Rust core │────▶│  WASM (browser)    │────▶│  React / Three.js│
│ megane-core│     └────────────────────┘     └──────────────────┘
│            │     ┌────────────────────┐     ┌──────────────────┐
│            │────▶│  PyO3 (Python)     │────▶│  Jupyter widget  │
└────────────┘     └────────────────────┘     └──────────────────┘
```

All environments share the same parser and pipeline execution engine — a pipeline defined in Python produces identical output to the same pipeline in the browser.

## Next steps

- [Installation & Quick Start](./getting-started) — get megane running in 2 minutes
- [Gallery](/gallery) — live 3D examples with copy-paste code
- [Live Demo](https://hodakamori.github.io/megane/app/) — interactive viewer in the browser

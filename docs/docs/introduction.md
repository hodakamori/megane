---
sidebar_position: 1
---

# Introduction

**megane** is a high-performance molecular viewer that works wherever you do — Jupyter notebooks, React web apps, the command line, and VSCode.

## What can megane do?

- **Render 1M+ atoms at 60 fps** in the browser using billboard impostor rendering
- **Load 11 file formats**: PDB, GRO, XYZ, MOL, SDF, MOL2, CIF, LAMMPS data, XTC, ASE `.traj`, LAMMPS dump
- **Stream XTC trajectories from the `megane serve` CLI** over WebSocket — scrub multi-GB files without loading every frame into memory (browser/Jupyter without the CLI load full trajectories)
- **Build visual pipelines** with a drag-and-drop node editor, or write them as Python/TypeScript code
- **Integrate with Plotly**, MDX/Next.js, ipywidgets, and any framework via the framework-agnostic renderer

## Choose your environment

| Environment | Install | Start here |
|-------------|---------|------------|
| **Jupyter / Python** | `pip install megane` | [Jupyter Guide](./guide/jupyter) |
| **Web / React** | `npm install megane-viewer` | [Web Guide](./guide/web) |
| **CLI (Docker)** | `docker build -t megane .` | [CLI Guide](./guide/cli) |
| **VSCode** | Install the megane extension | [Pipeline Editor](./guide/pipeline/index) |

For a side-by-side comparison of which formats and UI features each environment supports — including known gaps — see [Platform Support](./platform-support).

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
| LAMMPS data | `.data`, `.lammps` |
| GROMACS trajectory | `.xtc` |
| ASE trajectory | `.traj` |
| LAMMPS dump | `.lammpstrj`, `.dump` |

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
- [Live Demo](/demo) — interactive viewer in the browser

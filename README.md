<h1 align="center">
  <img src="docs/public/logo.png" alt="" width="32" />
  megane
</h1>

<p align="center">Spectacles for atomistic data.</p>
<p align="center"><em>1M+ atoms at 60fps. Visual pipelines. Jupyter, browser, React, VSCode.</em></p>

<p align="center">
  <a href="https://github.com/hodakamori/megane/actions/workflows/ci.yml"><img src="https://github.com/hodakamori/megane/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://pypi.org/project/megane/"><img src="https://img.shields.io/pypi/v/megane" alt="PyPI" /></a>
  <a href="https://www.npmjs.com/package/megane-viewer"><img src="https://img.shields.io/npm/v/megane-viewer" alt="npm" /></a>
  <a href="https://github.com/hodakamori/megane/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
</p>

<p align="center">
  <a href="https://hodakamori.github.io/megane/">Docs</a> &middot;
  <a href="https://hodakamori.github.io/megane/getting-started">Getting Started</a> &middot;
  <a href="https://pypi.org/project/megane/">PyPI</a> &middot;
  <a href="https://www.npmjs.com/package/megane-viewer">npm</a>
</p>

<p align="center">
  <img src="docs/public/screenshots/hero.png" alt="megane screenshot" width="640" />
</p>

---

## Features

- **1M+ Atoms at 60fps** — Billboard impostor rendering scales from small molecules to massive complexes in real time. InstancedMesh for small systems auto-switches to GPU-accelerated billboard impostors for large systems. Stream XTC trajectories over WebSocket.
- **Runs Everywhere** — Jupyter widget, CLI server, React component, and VSCode extension. Rust-based PDB, GRO, XYZ, MOL, and XTC parsers shared between Python (PyO3) and browser (WASM) — parse once, run anywhere.
- **Visual Pipeline Editor** — Build visualization workflows by wiring nodes. 8 node types (load, bond, filter, modify, labels, polyhedra, viewport) with 6 typed data channels (particle, bond, cell, label, mesh, trajectory) flowing through color-coded edges.
- **Embed & Integrate** — Control the viewer from Plotly via ipywidgets events. Embed in MDX / Next.js docs. React to `frame_change`, `selection_change`, and `measurement` events. Use the framework-agnostic renderer from Vue, Svelte, or vanilla JS.

## Installation

### Python

```bash
pip install megane
```

### npm (for React embedding)

```bash
npm install megane-viewer
```

## Quick Start

### Jupyter Notebook

```python
import megane

viewer = megane.MolecularViewer()
viewer.load("protein.pdb")
viewer  # display in cell

# With trajectory
viewer.load("protein.pdb", xtc="trajectory.xtc")
viewer.frame_index = 50
```

### CLI

```bash
megane serve protein.pdb
megane serve protein.pdb --xtc trajectory.xtc
megane serve  # upload from browser
```

### React

```tsx
import { MeganeViewer, parseStructureFile } from "megane-viewer";

function App() {
  const [snapshot, setSnapshot] = useState(null);

  const handleUpload = async (file: File) => {
    const result = await parseStructureFile(file);
    setSnapshot(result.snapshot);
  };

  return <MeganeViewer snapshot={snapshot} mode="local" /* ... */ />;
}
```

## Supported File Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| PDB | `.pdb` | Protein Data Bank |
| GRO | `.gro` | GROMACS structure file |
| XYZ | `.xyz` | Cartesian coordinate format |
| MOL/SDF | `.mol`, `.sdf` | MDL Molfile (V2000) |
| XTC | `.xtc` | GROMACS compressed trajectory |

## Development

### Prerequisites

- Python 3.10+
- Node.js 18+
- Rust (for building the parser)
- [uv](https://docs.astral.sh/uv/)

### Setup

```bash
git clone https://github.com/hodakamori/megane.git
cd megane

# Python
uv sync --extra dev

# Node.js
npm install
npm run build
```

### Development Mode

```bash
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: Python backend
uv run megane serve protein.pdb --dev --no-browser
```

### Tests

```bash
uv run pytest              # Python tests
npm test                   # TypeScript unit tests
cargo test -p megane-core  # Rust tests
make test-all              # All tests
```

## Project Structure

```
src/                     TypeScript frontend
  renderer/              Three.js rendering (impostor, mesh, shaders)
  protocol/              Binary protocol decoder + web workers
  parsers/               WASM-based file parsers (PDB, GRO, XYZ, MOL, XTC)
  logic/                 Bond / label / vector source logic
  components/            React UI components
  hooks/                 Custom React hooks
  stream/                WebSocket client
crates/                  Rust workspace
  megane-core/           Core parsers and bond inference
  megane-python/         PyO3 Python extension
  megane-wasm/           WASM bindings (wasm-bindgen)
python/megane/           Python backend
  parsers/               PDB / XTC parsers
  protocol.py            Binary protocol encoder
  server.py              FastAPI WebSocket server
  widget.py              anywidget Jupyter widget
tests/                   Tests (Python, TypeScript, E2E)
```

## License

[MIT](LICENSE)

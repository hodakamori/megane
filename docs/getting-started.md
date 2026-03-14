# Getting Started

## Prerequisites

- Python 3.10 or later
- Node.js 22+ (for web development)

## Installation

### Python (PyPI)

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

# Build a pipeline
pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
bonds = pipe.add_node(megane.AddBonds(source="distance"))
pipe.add_edge(s, bonds)

# Display in notebook
viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

With a trajectory:

```python
pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
t = pipe.add_node(megane.LoadTrajectory(xtc="trajectory.xtc"))
pipe.add_edge(s, t)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer.frame_index = 50  # Jump to frame 50
```

### CLI Server (Docker)

The easiest way to run `megane serve` locally is with Docker:

```bash
docker build -t megane .
docker run --rm -p 8080:8080 megane
```

Open http://localhost:8080 in your browser.

To view your own files, mount them into the container:

```bash
docker run --rm -p 8080:8080 -v ./mydata:/data megane \
  megane serve /data/protein.pdb --port 8080 --no-browser
```

For running from source, see the [CLI Guide](/guide/cli).

### React Component

```tsx
import { MeganeViewer } from "megane-viewer";

function App() {
  return (
    <MeganeViewer
      snapshot={snapshot}
      mode="local"
      // ... see Web/React guide for full example
    />
  );
}
```

## Supported File Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| PDB | `.pdb` | Protein Data Bank — most common molecular structure format |
| GRO | `.gro` | GROMACS structure file |
| XYZ | `.xyz` | Simple cartesian coordinate format |
| MOL | `.mol` | MDL Molfile (V2000) — small molecules with bond information |
| XTC | `.xtc` | GROMACS compressed trajectory |
| CIF | `.cif` | Crystallographic Information File |
| LAMMPS data | `.data`, `.lammps` | LAMMPS data file |
| ASE .traj | `.traj` | ASE trajectory (ULM binary format) |
| LAMMPS dump | `.lammpstrj` | LAMMPS dump trajectory |

## Next Steps

- [Jupyter Widget Guide](/guide/jupyter) — Detailed widget usage, event handling, and Plotly integration
- [CLI Guide](/guide/cli) — All CLI options and development mode
- [Web / React Guide](/guide/web) — Embedding in React applications, imperative renderer API
- [Python API Reference](/api/python/) — Full Python API documentation
- [TypeScript API Reference](/api/typescript/) — Full TypeScript API documentation

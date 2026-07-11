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

### Jupyter widget

```python
import megane

viewer = megane.view("protein.pdb")
viewer  # displays in notebook
```

With a trajectory:

```python
import megane

viewer = megane.view_traj("protein.pdb", xtc="trajectory.xtc")
viewer.frame_index = 50  # jump to frame 50
```

For advanced usage (filtering, multi-layer rendering, custom pipelines), see [Python Pipeline API](/guide/pipeline/python).

### Standalone web app (`megane serve`)

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

For running from source, see the [Standalone web app guide](/guide/cli).

### React component (npm)

The `MeganeViewer` React component is pipeline-store-driven — it manages its own snapshot, bonds,
trajectory, etc. internally. Host apps just supply the file-ingestion callback
that pushes the chosen file into the global pipeline store:

```tsx
import { useCallback } from "react";
import { MeganeViewer, usePipelineStore } from "megane-viewer/lib";

function App() {
  const handleUpload = useCallback((file: File) => {
    usePipelineStore.getState().openFile(file);
  }, []);

  return (
    <MeganeViewer
      onUploadStructure={handleUpload}
      width="100%"
      height="600px"
    />
  );
}
```

For multiple independent viewers per page (e.g. embedding in MDX docs), use
`PipelineViewer` instead — see the [React component (npm) guide](/guide/web).

## Supported File Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| PDB | `.pdb` | Protein Data Bank — most common molecular structure format |
| GRO | `.gro` | GROMACS structure file |
| XYZ | `.xyz` | Simple cartesian coordinate format (single- or multi-frame) |
| MOL | `.mol` | MDL Molfile (V2000) — small molecules with bond information |
| SDF | `.sdf` | MDL SDfile — uses the MOL V2000 parser |
| MOL2 | `.mol2` | Tripos MOL2 |
| CIF | `.cif` | Crystallographic Information File |
| mmCIF | `.mmcif` | Macromolecular CIF (PDBx/mmCIF) — large structure databases |
| LAMMPS data | `.data`, `.lammps` | LAMMPS data file |
| AMBER topology | `.prmtop` | AMBER parameter/topology file (no coordinates) |
| XTC | `.xtc` | GROMACS compressed trajectory |
| DCD | `.dcd` | CHARMM/NAMD binary trajectory |
| ASE .traj | `.traj` | ASE trajectory (ULM binary format) |
| LAMMPS dump | `.lammpstrj`, `.dump` | LAMMPS dump trajectory |
| AMBER NetCDF | `.nc` | AMBER compressed trajectory (NetCDF format) |

Not every host opens every extension from its native file picker — see
[Platform Support](./platform-support) for the per-host matrix.

## Next Steps

- [Jupyter widget guide](/guide/jupyter) — Detailed widget usage, event handling, and Plotly integration
- [Standalone web app guide](/guide/cli) — All `megane serve` options and development mode
- [React component (npm) guide](/guide/web) — Embedding in React applications, imperative renderer API
- [Python Pipeline API](/guide/pipeline/python) — Full Python API documentation
- [TypeScript Pipeline API](/guide/pipeline/typescript) — Full TypeScript API documentation

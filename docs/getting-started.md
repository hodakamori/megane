# Getting Started

## Prerequisites

- Python 3.10 or later
- Node.js 18+ (for web development)

## Installation

### Python (PyPI)

```bash
pip install megane
```

### npm (for React embedding)

```bash
npm install megane
```

## Quick Start

### Jupyter Notebook

```python
import megane

# Create a viewer widget
viewer = megane.MolecularViewer()

# Load a PDB file
viewer.load("protein.pdb")

# Display in notebook
viewer
```

With a trajectory:

```python
viewer.load("protein.pdb", xtc="trajectory.xtc")
viewer.frame_index = 50  # Jump to frame 50
```

### CLI Server

Start a local viewer server:

```bash
megane serve protein.pdb --port 8765
```

With a trajectory:

```bash
megane serve protein.pdb --xtc trajectory.xtc
```

This opens a browser window with the interactive viewer at `http://localhost:8765`.

You can also start the server without a file and upload from the browser:

```bash
megane serve
```

## Next Steps

- [Jupyter Widget Guide](/guide/jupyter) — Detailed widget usage and event handling
- [CLI Guide](/guide/cli) — All CLI options and development mode
- [Web / React Guide](/guide/web) — Embedding in React applications
- [Python API Reference](/api/python/) — Full Python API documentation
- [TypeScript API Reference](/api/typescript/) — Full TypeScript API documentation

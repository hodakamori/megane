---
sidebar_position: 1
---

# API Reference

megane provides APIs for both Python and TypeScript/JavaScript.

## Python

The Python API is used for:

- **Jupyter notebooks** — Interactive widget for molecular visualization
- **CLI server** — Serve structures via WebSocket
- **Data loading** — Parse PDB files and read XTC trajectories

```python
import megane

# Quick start
viewer = megane.view("protein.pdb")

# With trajectory
viewer = megane.view_traj("protein.pdb", xtc="trajectory.xtc")
```

See the [Python Pipeline API guide](/guide/pipeline/python) for full documentation of the Pipeline class and all node types.

## TypeScript / JavaScript

The TypeScript API is used for:

- **React components** — Embed the viewer in web applications
- **Core renderer** — Framework-agnostic Three.js rendering
- **Protocol decoding** — Parse binary WebSocket messages

```ts
import { MeganeViewer, MoleculeRenderer } from "megane-viewer/lib";
```

See the [TypeScript Pipeline guide](/guide/pipeline/typescript) for full documentation of the TypeScript pipeline API and React component props.

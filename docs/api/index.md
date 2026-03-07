# API Reference

megane provides APIs for both Python and TypeScript/JavaScript.

## Python

The Python API is used for:

- **Jupyter notebooks** — Interactive widget for molecular visualization
- **CLI server** — Serve structures via WebSocket
- **Data loading** — Parse PDB files and read XTC trajectories

```python
import megane

viewer = megane.MolecularViewer()
structure = megane.load_pdb("protein.pdb")
trajectory = megane.load_trajectory("protein.pdb", "trajectory.xtc")
```

[Python API Reference →](/api/python/)

## TypeScript / JavaScript

The TypeScript API is used for:

- **React components** — Embed the viewer in web applications
- **Core renderer** — Framework-agnostic Three.js rendering
- **Protocol decoding** — Parse binary WebSocket messages

```ts
import { MeganeViewer, MoleculeRenderer } from "megane";
```

[TypeScript API Reference →](/api/typescript/)

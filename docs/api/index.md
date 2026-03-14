# API Reference

megane provides APIs for both Python and TypeScript/JavaScript.

## Python

The Python API is used for:

- **Jupyter notebooks** — Interactive widget for molecular visualization
- **CLI server** — Serve structures via WebSocket
- **Data loading** — Parse PDB files and read XTC trajectories

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
t = pipe.add_node(megane.LoadTrajectory(xtc="trajectory.xtc"))
pipe.add_edge(s, t)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
```

[Python API Reference →](/api/python/)

## TypeScript / JavaScript

The TypeScript API is used for:

- **React components** — Embed the viewer in web applications
- **Core renderer** — Framework-agnostic Three.js rendering
- **Protocol decoding** — Parse binary WebSocket messages

```ts
import { MeganeViewer, MoleculeRenderer } from "megane-viewer";
```

[TypeScript API Reference →](/api/typescript/)

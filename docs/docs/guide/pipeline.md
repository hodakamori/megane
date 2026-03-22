---
sidebar_position: 1
---

# Visual Pipeline Editor

megane's pipeline editor lets you build visualization workflows by wiring nodes — no code required. Open the pipeline panel from the sidebar to start building.

Pipelines can also be built programmatically in Python using the `Pipeline` API (see [Python Pipeline API](#python-pipeline-api) below).

## Concept

A pipeline is a directed graph of **nodes** connected by **edges**. Data flows from source nodes (like Load Structure) through processing nodes (like Filter or Modify) and into a Viewport node for rendering.

Each edge carries a specific **data type** — particle, bond, cell, label, mesh, trajectory, or vector — and only matching types can connect.

When a node encounters an error — for example, a parse failure in LoadStructure — an error icon appears on the node with a tooltip showing the details.

## AI Pipeline Generator

Describe the visualization you want in natural language, and megane builds the node graph for you. Open the AI chat panel from the pipeline editor toolbar and type a prompt like:

> Load protein.pdb with bonds and make water translucent

The generator creates the appropriate LoadStructure, AddBond, Filter, Modify, and Viewport nodes, wires them together, and places them in the editor. You can then adjust parameters or add more nodes manually.

## VSCode Extension Auto-Setup

When you open a supported molecular file (`.pdb`, `.gro`, `.xyz`, `.mol`, `.sdf`, `.cif`) in the megane VSCode extension, it automatically creates a default pipeline consisting of `LoadStructure → AddBond → Viewport`. This gives you an immediate 3D view of the structure with bonds, without needing to build a pipeline manually. You can then modify the auto-generated pipeline in the editor as needed.

## Getting Started

The simplest pipeline loads a structure and displays it:

```
LoadStructure → Viewport
```

To add bonds inferred from atomic distances:

```
LoadStructure → AddBond → Viewport
                       ↘
              LoadStructure → Viewport (particle + cell)
```

Use the **Templates** dropdown to load pre-built pipelines:

- **Molecule** — Caffeine (`caffeine_water.pdb`) with structure-based bonds and a vibration trajectory (`caffeine_water_vibration.xtc`). Nodes: `LoadStructure → AddBond → Viewport`, `LoadTrajectory → Viewport`.
- **Solid** — Perovskite SrTiO₃ 3×3×3 supercell with distance-based bonds and TiO₆ coordination polyhedra. Nodes: `LoadStructure → AddBond → Viewport`, `PolyhedronGenerator → Viewport`. Center = Ti (22), Ligand = O (8), max distance = 2.5 Å.

## Node Reference

### Data Loading

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Load Structure** | Load a molecular structure file (PDB, GRO, XYZ, MOL, LAMMPS data) | — | particle, trajectory, cell |
| **Load Trajectory** | Load an XTC or ASE .traj trajectory file | particle | trajectory |
| **Streaming** | WebSocket-based real-time data delivery | — | particle, bond, trajectory, cell |
| **Load Vector** | Load per-atom vector data from a file | — | vector |

### Processing

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Filter** | Select atoms using a query expression | particle (in) | particle (out) |
| **Modify** | Override scale and opacity for a group of atoms | particle (in) | particle (out) |

### Overlay

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Add Bond** | Detect bonds from structure or by distance | particle | bond |
| **Label Generator** | Generate text labels at atom positions | particle | label |
| **Polyhedron Generator** | Render coordination polyhedra (convex hulls) | particle | mesh |
| **Vector Overlay** | Configure per-atom vector visualization (e.g. forces) | vector | vector |

### Output

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Viewport** | 3D rendering output | particle, bond, cell, trajectory, label, mesh, vector | — |

## Node Parameters

### Load Structure

| Parameter | Type | Description |
|-----------|------|-------------|
| File path | string | Path to molecular structure file. Supported: `.pdb`, `.gro`, `.xyz`, `.mol`, `.data` (LAMMPS) |

### Load Trajectory

| Parameter | Type | Description |
|-----------|------|-------------|
| xtc | string | Path to XTC trajectory file |
| traj | string | Path to ASE .traj trajectory file |

Requires a connection from a LoadStructure node. Frames are loaded lazily when `frame_index` changes.

### Load Vector

| Parameter | Type | Description |
|-----------|------|-------------|
| File path | string | Path to vector data file (JSON with per-atom 3D vectors) |

### Add Bond

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| Bond source | `structure` | — | Read bonds from the structure file (CONECT records in PDB, etc.) |
| | `distance` | ✓ | Infer bonds from van der Waals radii |

### Filter

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Query | string | `""` (all) | Atom selection query expression (see [Filter DSL](#filter-dsl)) |
| Bond query | string | `""` (all) | Bond selection query expression (see [Bond Selection DSL](#bond-selection-dsl)) |

Both input fields validate your query in real time — invalid syntax is highlighted in red.

The **Query** field filters which atoms pass through when the Filter node is connected to a particle stream (particle input/output). The **Bond query** field filters which bonds are selected when the Filter node is connected to a bond stream; this selection is used by downstream nodes (for example, Modify) to apply per-bond opacity overrides — it does not remove bonds from the scene. Because a Filter node has a single generic `in → out` port and only one data type flows through it at a time, using both atom and bond queries in the same workflow typically means adding two Filter nodes: one on the particle edge and one on the bond edge.

### Modify

| Parameter | Range | Default | Description |
|-----------|-------|---------|-------------|
| Scale | 0.1 – 2.0 | 1.0 | Atom sphere radius multiplier |
| Opacity | 0 – 1.0 | 1.0 | Transparency (0 = invisible, 1 = opaque) |

### Label Generator

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| Source | `element` | ✓ | Chemical element symbol (C, O, Fe, ...) |
| | `resname` | — | Residue name (ALA, HOH, ...) |
| | `index` | — | Atom index (0, 1, 2, ...) |

### Polyhedron Generator

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Center elements | number[] | — | Atomic numbers of center atoms (e.g., Ti=22, Si=14) |
| Ligand elements | number[] | O (8) | Atomic numbers of ligand atoms |
| Max distance | number | 2.5 Å | Maximum center–ligand distance |
| Opacity | number | 0.5 | Face transparency (0–1) |
| Show edges | boolean | off | Display wireframe edges |
| Edge color | string | `#dddddd` | Wireframe edge color (hex) |
| Edge width | number | 3.0 | Wireframe edge width (px) |

### Vector Overlay

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Scale | number | 1.0 | Vector arrow length multiplier |

### Viewport

| Parameter | Default | Description |
|-----------|---------|-------------|
| Perspective | off | Toggle perspective / orthographic projection |
| Cell axes visible | on | Show simulation cell axes with labels |
| Pivot marker visible | on | Show the rotation pivot marker at the camera target |

A **Render Export** button is available in the pipeline editor toolbar. Click it to export the current viewport as a PNG image (or other formats such as EPS, GIF, and MP4 via the render modal).

## Data Types

Seven typed data channels flow through color-coded edges:

| Type | Color | Description |
|------|-------|-------------|
| **particle** | Blue | Atom positions, elements, and optional indices/overrides |
| **bond** | Amber | Bond pairs and orders |
| **cell** | Emerald | Simulation cell (3×3 matrix) |
| **label** | Violet | Text labels positioned at atoms |
| **mesh** | Gray | Triangle mesh for polyhedra rendering |
| **trajectory** | Pink | Multi-frame coordinate data |
| **vector** | Teal | Per-atom 3D vector data (forces, velocities, etc.) |

## Filter DSL

The Filter node accepts Python-like query expressions to select atoms.

### Available Fields

| Field | Type | Description |
|-------|------|-------------|
| `element` | string | Element symbol (e.g., `"C"`, `"O"`, `"Fe"`) |
| `index` | number | Atom index (0-based) |
| `x`, `y`, `z` | number | Cartesian coordinates |
| `resname` | string | Residue name (e.g., `"ALA"`, `"HOH"`) |
| `mass` | number | Atomic mass |

### Operators

`==`, `!=`, `>`, `<`, `>=`, `<=`

### Logical Operators

`and`, `or`, `not`, parentheses `()`

### Special Keywords

`all` — select all atoms, `none` — select no atoms

### Examples

```
element == "C"                         # All carbon atoms
index > 10 and index < 20             # Atoms 10–19
resname == "HOH"                       # Water molecules
not element == "H"                     # Non-hydrogen atoms
element == "O" or element == "N"       # Oxygen or nitrogen
(x > 0 and x < 10) and element == "C" # Carbons in x range
mass > 32                              # Atoms heavier than sulfur
```

## Bond Selection DSL

The **Bond query** field in the Filter node accepts expressions to select bonds.

### Available Fields

| Field | Type | Description |
|-------|------|-------------|
| `bond_index` | number | 0-based sequential bond index |
| `atom_index` | number | Atom endpoint index |
| `element` | string | Element symbol of an atom endpoint (e.g., `"C"`, `"O"`) |

### Operators

`==`, `!=`, `>`, `<`, `>=`, `<=`

### Logical Operators

`and`, `or`, `not`, parentheses `()`

### Special Keywords

- `all` — select all bonds (default when query is empty)
- `none` — select no bonds
- `both` — prefix on a comparison involving `atom_index` or `element` to require **both** atoms of the bond to satisfy the condition (default: either atom, OR semantics). Has no effect on `bond_index` comparisons.

### Examples

```
element == "C"                         # Bonds where either atom is carbon
both element != "H"                    # Bonds where neither atom is hydrogen
atom_index >= 24                       # Bonds involving atom 24 or higher
bond_index < 10                        # First 10 bonds only
both atom_index >= 0 and bond_index < 50  # First 50 bonds (all-atom filter)
```

The bond query selects which bonds a downstream **Modify** node applies opacity overrides to. This lets you selectively fade specific bonds without removing them from the scene.

## Example: TiO₆ Octahedra in SrTiO₃

1. Load a perovskite structure (`LoadStructure`)
2. Add a `PolyhedronGenerator` node
3. Set center = Ti (22), ligand = O (8), max distance = 2.5 Å
4. Connect `LoadStructure.particle → PolyhedronGenerator.particle`
5. Connect `PolyhedronGenerator.mesh → Viewport.mesh`

Or use the **Solid** template which sets this up automatically.

## Example: Make Solvent Translucent

Use Filter + Modify nodes to fade out water molecules while keeping the protein fully visible.

1. Add a `LoadStructure` node and load your PDB file
2. Add a `Filter` node with query: `resname == "HOH"`
3. Add a `Modify` node and set opacity to 0.2, scale to 0.5
4. Connect: `LoadStructure.particle → Filter.in → Modify.in → Viewport.particle`
5. Connect the original `LoadStructure.particle → Viewport.particle` as well (for the protein)

The viewport renders both streams — the protein at full opacity, and the water as translucent small spheres.

## Multiple Structure Layers

You can load multiple structure files simultaneously, with each file rendered as a separate layer in the viewport. Each `LoadStructure` node connected to a `Viewport` creates an independent rendering layer, allowing you to combine different molecules in a single view.

For example, to display a protein and a ligand loaded from separate files:

```
LoadStructure (protein.pdb) → AddBond → Viewport
LoadStructure (ligand.mol)  → AddBond ↗
```

In Python:

```python
from megane import Pipeline, LoadStructure, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
protein = pipe.add_node(LoadStructure("protein.pdb"))
ligand = pipe.add_node(LoadStructure("ligand.mol"))
bonds_p = pipe.add_node(AddBonds(source="distance"))
bonds_l = pipe.add_node(AddBonds(source="structure"))
v = pipe.add_node(Viewport())

pipe.add_edge(protein.out.particle, bonds_p.inp.particle)
pipe.add_edge(ligand.out.particle, bonds_l.inp.particle)
pipe.add_edge(protein.out.particle, v.inp.particle)
pipe.add_edge(bonds_p.out.bond, v.inp.bond)
pipe.add_edge(ligand.out.particle, v.inp.particle)
pipe.add_edge(bonds_l.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

Each layer is processed independently through its own chain of Filter, Modify, and overlay nodes before reaching the Viewport.

## Serialization

Pipelines serialize to JSON (v3 format) and can be saved, loaded, and version-controlled. The serialization format includes node types, parameters, positions, edge connections, and an optional `enabled` flag per node.

Each node entry can include `"enabled": false` to bypass that node (equivalent to deleting it from the execution graph while keeping it in the editor). Omitting `enabled` or setting it to `true` is the default active state.

## JavaScript/TypeScript Pipeline API

Pipelines can be built programmatically in JavaScript/TypeScript using the `Pipeline` builder in `@/pipeline/builder`. The API mirrors the Python interface exactly, making it straightforward to port pipelines between languages.

### Overview

```typescript
import { Pipeline, LoadStructure, AddBonds, Viewport } from '@/pipeline/builder'

const pipe = new Pipeline()
const s = pipe.addNode(new LoadStructure('protein.pdb'))
const b = pipe.addNode(new AddBonds())
const v = pipe.addNode(new Viewport())

pipe.addEdge(s.out.particle, b.inp.particle)
pipe.addEdge(s.out.particle, v.inp.particle)
pipe.addEdge(b.out.bond,     v.inp.bond)

// Serialize to SerializedPipeline v3 JSON
const json = pipe.toJSON()
const obj  = pipe.toObject()  // plain object version
```

After `addNode()`, each node exposes `.out` and `.inp` accessors for its ports. Pass these `NodePort` objects to `addEdge()` to wire nodes together. The pipeline serializes to the same `SerializedPipeline` v3 format used by the TypeScript engine — `toObject()` output can be passed directly to `deserializePipeline()`.

### Pipeline class

| Method | Description |
|--------|-------------|
| `addNode(node)` | Add a node to the pipeline. Returns the same node (with `.out`/`.inp` ports) for use in `addEdge()` |
| `addEdge(sourcePort, targetPort)` | Connect `node.out.<name>` → `node.inp.<name>` |
| `toObject()` | Serialize to v3 plain object (`SerializedPipeline`) |
| `toJSON(indent?)` | Serialize to a JSON string (default indent = 2) |

### Node classes

All node classes are importable from `@/pipeline/builder`:

```typescript
import {
  LoadStructure,
  LoadTrajectory,
  Streaming,
  LoadVector,
  Filter,
  Modify,
  AddBonds,
  AddLabels,
  AddPolyhedra,
  VectorOverlay,
  Viewport,
  Pipeline,
} from '@/pipeline/builder'
```

Constructor parameters mirror the Python API (using an options object instead of keyword args):

| Python | JavaScript/TypeScript |
|--------|----------------------|
| `LoadStructure("path")` | `new LoadStructure('path')` |
| `Filter(query="element == 'C'")` | `new Filter({ query: "element == 'C'" })` |
| `Modify(scale=1.3, opacity=0.8)` | `new Modify({ scale: 1.3, opacity: 0.8 })` |
| `AddBonds(source="distance")` | `new AddBonds({ source: 'distance' })` |
| `AddLabels(source="element")` | `new AddLabels({ source: 'element' })` |
| `AddPolyhedra(center_elements=[22])` | `new AddPolyhedra({ centerElements: [22] })` |
| `VectorOverlay(scale=2.0)` | `new VectorOverlay({ scale: 2.0 })` |
| `LoadTrajectory(xtc="traj.xtc")` | `new LoadTrajectory({ xtc: 'traj.xtc' })` |
| `Viewport(perspective=True)` | `new Viewport({ perspective: true })` |

### Ports

After `addNode()`, each node exposes two port accessors:

- `node.out.<name>` — output port (first arg to `addEdge`)
- `node.inp.<name>` — input port (second arg to `addEdge`)

Port names are identical to Python. The `.traj` port maps to the `"trajectory"` wire handle internally. Accessing an undefined port throws an `Error` with a message listing available ports.

### Example: Basic Structure with Bonds

```typescript
import { Pipeline, LoadStructure, AddBonds, Viewport } from '@/pipeline/builder'

const pipe = new Pipeline()
const s = pipe.addNode(new LoadStructure('protein.pdb'))
const b = pipe.addNode(new AddBonds({ source: 'distance' }))
const v = pipe.addNode(new Viewport())

pipe.addEdge(s.out.particle, b.inp.particle)
pipe.addEdge(s.out.particle, v.inp.particle)
pipe.addEdge(b.out.bond,     v.inp.bond)

const json = pipe.toJSON()
```

### Example: Filter and Modify

```typescript
import { Pipeline, LoadStructure, Filter, Modify, AddBonds, Viewport } from '@/pipeline/builder'

const pipe = new Pipeline()
const s      = pipe.addNode(new LoadStructure('protein.pdb'))
const carbons = pipe.addNode(new Filter({ query: "element == 'C'" }))
const big    = pipe.addNode(new Modify({ scale: 1.5, opacity: 0.8 }))
const bonds  = pipe.addNode(new AddBonds())
const v      = pipe.addNode(new Viewport())

pipe.addEdge(s.out.particle,       carbons.inp.particle)
pipe.addEdge(carbons.out.particle, big.inp.particle)
pipe.addEdge(s.out.particle,       bonds.inp.particle)
pipe.addEdge(big.out.particle,     v.inp.particle)
pipe.addEdge(bonds.out.bond,       v.inp.bond)
```

### Example: Trajectory Playback

```typescript
import { Pipeline, LoadStructure, LoadTrajectory, AddBonds, Viewport } from '@/pipeline/builder'

const pipe = new Pipeline()
const s     = pipe.addNode(new LoadStructure('protein.pdb'))
const traj  = pipe.addNode(new LoadTrajectory({ xtc: 'trajectory.xtc' }))
const bonds = pipe.addNode(new AddBonds({ source: 'structure' }))
const v     = pipe.addNode(new Viewport())

pipe.addEdge(s.out.particle, traj.inp.particle)
pipe.addEdge(s.out.particle, bonds.inp.particle)
pipe.addEdge(s.out.particle, v.inp.particle)
pipe.addEdge(traj.out.traj,  v.inp.traj)
pipe.addEdge(bonds.out.bond, v.inp.bond)
```

### Example: TiO₆ Coordination Polyhedra

```typescript
import { Pipeline, LoadStructure, AddBonds, AddPolyhedra, Viewport } from '@/pipeline/builder'

const pipe      = new Pipeline()
const s         = pipe.addNode(new LoadStructure('SrTiO3_supercell.pdb'))
const bonds     = pipe.addNode(new AddBonds())
const polyhedra = pipe.addNode(new AddPolyhedra({
  centerElements: [22],  // Ti
  ligandElements: [8],   // O
  maxDistance: 2.5,
  opacity: 0.5,
  showEdges: true,
}))
const v = pipe.addNode(new Viewport())

pipe.addEdge(s.out.particle,       bonds.inp.particle)
pipe.addEdge(s.out.particle,       polyhedra.inp.particle)
pipe.addEdge(s.out.particle,       v.inp.particle)
pipe.addEdge(bonds.out.bond,       v.inp.bond)
pipe.addEdge(polyhedra.out.mesh,   v.inp.mesh)
```

### Example: DAG Branching (Multiple Filters)

```typescript
import { Pipeline, LoadStructure, Filter, AddLabels, AddBonds, Viewport } from '@/pipeline/builder'

const pipe     = new Pipeline()
const s        = pipe.addNode(new LoadStructure('protein.pdb'))
const carbon   = pipe.addNode(new Filter({ query: "element == 'C'" }))
const nitrogen = pipe.addNode(new Filter({ query: "element == 'N'" }))
const labels   = pipe.addNode(new AddLabels({ source: 'element' }))
const bonds    = pipe.addNode(new AddBonds())
const v        = pipe.addNode(new Viewport())

pipe.addEdge(s.out.particle,        carbon.inp.particle)
pipe.addEdge(s.out.particle,        nitrogen.inp.particle)
pipe.addEdge(s.out.particle,        labels.inp.particle)
pipe.addEdge(s.out.particle,        bonds.inp.particle)
pipe.addEdge(carbon.out.particle,   v.inp.particle)
pipe.addEdge(nitrogen.out.particle, v.inp.particle)
pipe.addEdge(labels.out.label,      v.inp.label)
pipe.addEdge(bonds.out.bond,        v.inp.bond)
```

---

## Python Pipeline API

Pipelines can be built programmatically in Python using the `Pipeline` class. This is the recommended way to use megane in Jupyter notebooks and scripts.

### Overview

```python
from megane import Pipeline, LoadStructure, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("protein.pdb"))  # returns node with .out/.inp
v = pipe.add_node(Viewport())
pipe.add_edge(s.out.particle, v.inp.particle)    # connect explicit ports

viewer = MolecularViewer()
viewer.set_pipeline(pipe)   # apply to viewer
viewer                      # display in notebook
```

After `add_node()`, each node exposes `.out` and `.inp` namespaces for its ports. Pass these port objects to `add_edge()` to wire nodes together explicitly. The pipeline serializes to the `SerializedPipeline` v3 JSON format. A `Viewport` node must be explicitly added and connected for data to be rendered.

### Pipeline class

| Method | Description |
|--------|-------------|
| `add_node(node)` | Add a node to the pipeline. Returns the node (with `.out`/`.inp` ports) for use in `add_edge()` |
| `add_edge(source_port, target_port)` | Connect `source.out.<name>` → `target.inp.<name>` |
| `to_dict()` | Serialize to v3 JSON dict |

### Node classes

All node classes are importable from `megane`:

```python
from megane import (
    LoadStructure,
    LoadTrajectory,
    Streaming,
    LoadVector,
    Filter,
    Modify,
    AddBonds,
    AddLabels,
    AddPolyhedra,
    VectorOverlay,
    Viewport,
    Pipeline,
)
```

#### LoadStructure

Load a molecular structure file.

```python
LoadStructure(path: str)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `str` | File path. Supported: `.pdb`, `.gro`, `.xyz`, `.mol`, `.data` (LAMMPS) |

**Ports:** `out.particle`, `out.traj`, `out.cell`

#### LoadTrajectory

Load an external trajectory file. Requires connection from a `LoadStructure` node.

```python
LoadTrajectory(*, xtc: str | None = None, traj: str | None = None)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `xtc` | `str \| None` | `None` | Path to XTC trajectory file |
| `traj` | `str \| None` | `None` | Path to ASE .traj trajectory file |

**Ports:** `inp.particle`, `out.traj`

#### Streaming

WebSocket-based real-time data delivery.

```python
Streaming()
```

No parameters. **Ports:** `out.particle`, `out.bond`, `out.traj`, `out.cell`

#### LoadVector

Load per-atom vector data from a file.

```python
LoadVector(path: str)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `str` | Path to vector data file |

**Ports:** `out.vector`

#### Filter

Select atoms by a query expression.

```python
Filter(*, query: str)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `str` | Selection expression (see [Filter DSL](#filter-dsl)) |

**Ports:** `inp.particle`, `out.particle`

#### Modify

Override per-atom visual properties.

```python
Modify(*, scale: float = 1.0, opacity: float = 1.0)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scale` | `float` | `1.0` | Atom sphere radius multiplier (0.1–2.0) |
| `opacity` | `float` | `1.0` | Transparency (0 = invisible, 1 = opaque) |

**Ports:** `inp.particle`, `out.particle`

#### AddBonds

Compute and display bonds.

```python
AddBonds(*, source: Literal["distance", "structure"] = "distance")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `source` | `str` | `"distance"` | `"distance"` for VDW-based inference, `"structure"` for file-based bonds |

**Ports:** `inp.particle`, `out.bond`

#### AddLabels

Generate text labels at atom positions.

```python
AddLabels(*, source: Literal["element", "resname", "index"] = "element")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `source` | `str` | `"element"` | Label source: `"element"`, `"resname"`, or `"index"` |

**Ports:** `inp.particle`, `out.label`

#### AddPolyhedra

Generate coordination polyhedra mesh.

```python
AddPolyhedra(
    *,
    center_elements: list[int],
    ligand_elements: list[int] | None = None,
    max_distance: float = 2.5,
    opacity: float = 0.5,
    show_edges: bool = False,
    edge_color: str = "#dddddd",
    edge_width: float = 3.0,
)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `center_elements` | `list[int]` | *(required)* | Atomic numbers of center atoms (e.g., Ti=22) |
| `ligand_elements` | `list[int] \| None` | `[8]` (oxygen) | Atomic numbers of ligand atoms |
| `max_distance` | `float` | `2.5` | Maximum center–ligand distance (Å) |
| `opacity` | `float` | `0.5` | Face transparency (0–1) |
| `show_edges` | `bool` | `False` | Display wireframe edges |
| `edge_color` | `str` | `"#dddddd"` | Wireframe edge color (hex) |
| `edge_width` | `float` | `3.0` | Wireframe edge width (px) |

**Ports:** `inp.particle`, `out.mesh`

#### VectorOverlay

Configure per-atom vector visualization (e.g. forces, velocities).

```python
VectorOverlay(*, scale: float = 1.0)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scale` | `float` | `1.0` | Vector arrow length multiplier |

**Ports:** `inp.vector`, `out.vector`

#### Viewport

3D rendering output node. All data to be rendered must be explicitly connected to this node.

```python
Viewport(*, perspective: bool = False, cell_axes_visible: bool = True)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `perspective` | `bool` | `False` | Toggle perspective / orthographic projection |
| `cell_axes_visible` | `bool` | `True` | Show simulation cell axes with labels |

**Ports:** `inp.particle`, `inp.bond`, `inp.cell`, `inp.traj`, `inp.label`, `inp.mesh`, `inp.vector`

### Ports

After `add_node()`, each node exposes two port namespaces:

- `node.out.<name>` — output port (pass as first arg to `add_edge`)
- `node.inp.<name>` — input port (pass as second arg to `add_edge`)

The port name `.traj` maps to the `"trajectory"` wire handle internally. Accessing an undefined port raises `AttributeError` with a helpful message listing available ports.

### Example: Basic Structure with Bonds

```python
from megane import Pipeline, LoadStructure, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("protein.pdb"))
bonds = pipe.add_node(AddBonds(source="distance"))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(bonds.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: Filter and Modify

```python
from megane import Pipeline, LoadStructure, Filter, Modify, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("protein.pdb"))
carbons = pipe.add_node(Filter(query="element == 'C'"))
big = pipe.add_node(Modify(scale=1.5, opacity=0.8))
bonds = pipe.add_node(AddBonds(source="distance"))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, carbons.inp.particle)
pipe.add_edge(carbons.out.particle, big.inp.particle)
pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(big.out.particle, v.inp.particle)
pipe.add_edge(bonds.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: Trajectory Playback

```python
from megane import Pipeline, LoadStructure, LoadTrajectory, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("protein.pdb"))
t = pipe.add_node(LoadTrajectory(xtc="trajectory.xtc"))
bonds = pipe.add_node(AddBonds(source="structure"))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, t.inp.particle)
pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(t.out.traj, v.inp.traj)
pipe.add_edge(bonds.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer.frame_index = 50  # jump to frame 50
```

### Example: Make Solvent Translucent

```python
from megane import Pipeline, LoadStructure, Filter, Modify, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("protein.pdb"))

# Filter water molecules and make them translucent
water = pipe.add_node(Filter(query='resname == "HOH"'))
transparent = pipe.add_node(Modify(scale=0.5, opacity=0.2))

bonds = pipe.add_node(AddBonds(source="distance"))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, water.inp.particle)
pipe.add_edge(water.out.particle, transparent.inp.particle)
pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)       # protein particle + cell
pipe.add_edge(transparent.out.particle, v.inp.particle)  # translucent water
pipe.add_edge(bonds.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: TiO₆ Coordination Polyhedra

```python
from megane import Pipeline, LoadStructure, AddBonds, AddPolyhedra, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("SrTiO3_supercell.pdb"))
bonds = pipe.add_node(AddBonds(source="distance"))
polyhedra = pipe.add_node(AddPolyhedra(
    center_elements=[22],     # Ti
    ligand_elements=[8],      # O
    max_distance=2.5,
    opacity=0.5,
    show_edges=True,
))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(s.out.particle, polyhedra.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(bonds.out.bond, v.inp.bond)
pipe.add_edge(polyhedra.out.mesh, v.inp.mesh)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: DAG Branching (Multiple Filters)

```python
from megane import Pipeline, LoadStructure, Filter, AddLabels, AddBonds, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("protein.pdb"))

# Two independent filters from the same source
carbon = pipe.add_node(Filter(query="element == 'C'"))
nitrogen = pipe.add_node(Filter(query="element == 'N'"))
labels = pipe.add_node(AddLabels(source="element"))
bonds = pipe.add_node(AddBonds(source="distance"))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, carbon.inp.particle)
pipe.add_edge(s.out.particle, nitrogen.inp.particle)
pipe.add_edge(s.out.particle, labels.inp.particle)
pipe.add_edge(s.out.particle, bonds.inp.particle)
pipe.add_edge(carbon.out.particle, v.inp.particle)
pipe.add_edge(nitrogen.out.particle, v.inp.particle)
pipe.add_edge(labels.out.label, v.inp.label)
pipe.add_edge(bonds.out.bond, v.inp.bond)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: ASE .traj Trajectory

```python
from megane import Pipeline, LoadStructure, LoadTrajectory, Viewport, MolecularViewer

pipe = Pipeline()
s = pipe.add_node(LoadStructure("structure.pdb"))
t = pipe.add_node(LoadTrajectory(traj="simulation.traj"))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, t.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(t.out.traj, v.inp.traj)

viewer = MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

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
| Query | string | `""` (all) | Selection query expression (see [Filter DSL](#filter-dsl)) |

The input field validates your query in real time — invalid syntax is highlighted in red.

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
import megane

pipe = megane.Pipeline()
protein = pipe.add_node(megane.LoadStructure("protein.pdb"))
ligand = pipe.add_node(megane.LoadStructure("ligand.mol"))
bonds_p = pipe.add_node(megane.AddBonds(source="distance"))
bonds_l = pipe.add_node(megane.AddBonds(source="structure"))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(protein, bonds_p)
pipe.add_edge(ligand, bonds_l)
pipe.add_edge(protein, v)
pipe.add_edge(bonds_p, v)
pipe.add_edge(ligand, v)
pipe.add_edge(bonds_l, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

Each layer is processed independently through its own chain of Filter, Modify, and overlay nodes before reaching the Viewport.

## Serialization

Pipelines serialize to JSON (v3 format) and can be saved, loaded, and version-controlled. The serialization format includes node types, parameters, positions, and edge connections.

## Python Pipeline API

Pipelines can be built programmatically in Python using the `Pipeline` class. This is the recommended way to use megane in Jupyter notebooks and scripts.

### Overview

```python
import megane

pipe = megane.Pipeline()
node = pipe.add_node(...)       # add a node
v = pipe.add_node(megane.Viewport())  # add viewport
pipe.add_edge(src, tgt)         # connect nodes
pipe.add_edge(node, v)          # connect to viewport

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)       # apply to viewer
viewer                          # display in notebook
```

The pipeline serializes to the `SerializedPipeline` v3 JSON format. A `Viewport` node must be explicitly added and connected for data to be rendered.

### Pipeline class

| Method | Description |
|--------|-------------|
| `add_node(node)` | Add a node to the pipeline. Returns the node for use in `add_edge()` |
| `add_edge(source, target)` | Connect source → target. Port handles are auto-resolved |
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
megane.LoadStructure(path: str)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `str` | File path. Supported: `.pdb`, `.gro`, `.xyz`, `.mol`, `.data` (LAMMPS) |

**Outputs:** `particle`, `trajectory`, `cell`

#### LoadTrajectory

Load an external trajectory file. Requires connection from a `LoadStructure` node.

```python
megane.LoadTrajectory(*, xtc: str | None = None, traj: str | None = None)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `xtc` | `str \| None` | `None` | Path to XTC trajectory file |
| `traj` | `str \| None` | `None` | Path to ASE .traj trajectory file |

**Inputs:** `particle`
**Outputs:** `trajectory`

#### Streaming

WebSocket-based real-time data delivery.

```python
megane.Streaming()
```

No parameters. **Outputs:** `particle`, `bond`, `trajectory`, `cell`

#### LoadVector

Load per-atom vector data from a file.

```python
megane.LoadVector(path: str)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `path` | `str` | Path to vector data file |

**Outputs:** `vector`

#### Filter

Select atoms by a query expression.

```python
megane.Filter(*, query: str)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `query` | `str` | Selection expression (see [Filter DSL](#filter-dsl)) |

**Inputs:** `particle` (as "in" handle)
**Outputs:** `particle` (as "out" handle)

#### Modify

Override per-atom visual properties.

```python
megane.Modify(*, scale: float = 1.0, opacity: float = 1.0)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scale` | `float` | `1.0` | Atom sphere radius multiplier (0.1–2.0) |
| `opacity` | `float` | `1.0` | Transparency (0 = invisible, 1 = opaque) |

**Inputs:** `particle` (as "in" handle)
**Outputs:** `particle` (as "out" handle)

#### AddBonds

Compute and display bonds.

```python
megane.AddBonds(*, source: Literal["distance", "structure"] = "distance")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `source` | `str` | `"distance"` | `"distance"` for VDW-based inference, `"structure"` for file-based bonds |

**Inputs:** `particle`
**Outputs:** `bond`

#### AddLabels

Generate text labels at atom positions.

```python
megane.AddLabels(*, source: Literal["element", "resname", "index"] = "element")
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `source` | `str` | `"element"` | Label source: `"element"`, `"resname"`, or `"index"` |

**Inputs:** `particle`
**Outputs:** `label`

#### AddPolyhedra

Generate coordination polyhedra mesh.

```python
megane.AddPolyhedra(
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

**Inputs:** `particle`
**Outputs:** `mesh`

#### VectorOverlay

Configure per-atom vector visualization (e.g. forces, velocities).

```python
megane.VectorOverlay(*, scale: float = 1.0)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scale` | `float` | `1.0` | Vector arrow length multiplier |

**Inputs:** `vector`
**Outputs:** `vector`

#### Viewport

3D rendering output node. All data to be rendered must be explicitly connected to this node.

```python
megane.Viewport(*, perspective: bool = False, cell_axes_visible: bool = True)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `perspective` | `bool` | `False` | Toggle perspective / orthographic projection |
| `cell_axes_visible` | `bool` | `True` | Show simulation cell axes with labels |

**Inputs:** `particle`, `bond`, `cell`, `trajectory`, `label`, `mesh`, `vector`
**Outputs:** —

### Port Resolution

Edges are auto-resolved: `add_edge(source, target)` automatically picks the correct port handles based on node types. For example:

- `LoadStructure → Filter` connects `particle → in`
- `Filter → Modify` connects `out → in`
- `LoadStructure → AddBonds` connects `particle → particle`
- `AddBonds → Viewport` connects `bond → bond`

### Example: Basic Structure with Bonds

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
bonds = pipe.add_node(megane.AddBonds(source="distance"))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(s, bonds)
pipe.add_edge(s, v)
pipe.add_edge(bonds, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: Filter and Modify

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
carbons = pipe.add_node(megane.Filter(query="element == 'C'"))
big = pipe.add_node(megane.Modify(scale=1.5, opacity=0.8))
bonds = pipe.add_node(megane.AddBonds(source="distance"))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(s, carbons)
pipe.add_edge(carbons, big)
pipe.add_edge(s, bonds)
pipe.add_edge(big, v)
pipe.add_edge(bonds, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: Trajectory Playback

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))
t = pipe.add_node(megane.LoadTrajectory(xtc="trajectory.xtc"))
bonds = pipe.add_node(megane.AddBonds(source="structure"))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(s, t)
pipe.add_edge(s, bonds)
pipe.add_edge(s, v)
pipe.add_edge(t, v)
pipe.add_edge(bonds, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer.frame_index = 50  # jump to frame 50
```

### Example: Make Solvent Translucent

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))

# Filter water molecules and make them translucent
water = pipe.add_node(megane.Filter(query='resname == "HOH"'))
transparent = pipe.add_node(megane.Modify(scale=0.5, opacity=0.2))

bonds = pipe.add_node(megane.AddBonds(source="distance"))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(s, water)
pipe.add_edge(water, transparent)
pipe.add_edge(s, bonds)
pipe.add_edge(s, v)           # protein particle + cell
pipe.add_edge(transparent, v) # translucent water
pipe.add_edge(bonds, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: TiO₆ Coordination Polyhedra

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("SrTiO3_supercell.pdb"))
bonds = pipe.add_node(megane.AddBonds(source="distance"))
polyhedra = pipe.add_node(megane.AddPolyhedra(
    center_elements=[22],     # Ti
    ligand_elements=[8],      # O
    max_distance=2.5,
    opacity=0.5,
    show_edges=True,
))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(s, bonds)
pipe.add_edge(s, polyhedra)
pipe.add_edge(s, v)
pipe.add_edge(bonds, v)
pipe.add_edge(polyhedra, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: DAG Branching (Multiple Filters)

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("protein.pdb"))

# Two independent filters from the same source
carbon = pipe.add_node(megane.Filter(query="element == 'C'"))
nitrogen = pipe.add_node(megane.Filter(query="element == 'N'"))
labels = pipe.add_node(megane.AddLabels(source="element"))
bonds = pipe.add_node(megane.AddBonds(source="distance"))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(s, carbon)
pipe.add_edge(s, nitrogen)
pipe.add_edge(s, labels)
pipe.add_edge(s, bonds)
pipe.add_edge(carbon, v)
pipe.add_edge(nitrogen, v)
pipe.add_edge(labels, v)
pipe.add_edge(bonds, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

### Example: ASE .traj Trajectory

```python
import megane

pipe = megane.Pipeline()
s = pipe.add_node(megane.LoadStructure("structure.pdb"))
t = pipe.add_node(megane.LoadTrajectory(traj="simulation.traj"))
v = pipe.add_node(megane.Viewport())

pipe.add_edge(s, t)
pipe.add_edge(s, v)
pipe.add_edge(t, v)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer
```

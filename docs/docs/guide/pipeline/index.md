---
sidebar_position: 1
sidebar_label: Visual Pipeline Editor
---

# Visual Pipeline Editor

megane's pipeline editor lets you build visualization workflows by wiring nodes — no code required. Open the pipeline panel from the sidebar to start building.

Pipelines can also be built programmatically in [Python](./python.md), [TypeScript](./typescript.md), or written directly as [JSON](./json.md).

For real-world examples, see the [Gallery](/gallery).

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

## Editor Examples

### TiO₆ Octahedra in SrTiO₃

1. Load a perovskite structure (`LoadStructure`)
2. Add a `PolyhedronGenerator` node
3. Set center = Ti (22), ligand = O (8), max distance = 2.5 Å
4. Connect `LoadStructure.particle → PolyhedronGenerator.particle`
5. Connect `PolyhedronGenerator.mesh → Viewport.mesh`

Or use the **Solid** template which sets this up automatically.

### Make Solvent Translucent

Use Filter + Modify nodes to fade out water molecules while keeping the protein fully visible.

1. Add a `LoadStructure` node and load your PDB file
2. Add a `Filter` node with query: `resname == "HOH"`
3. Add a `Modify` node and set opacity to 0.2, scale to 0.5
4. Connect: `LoadStructure.particle → Filter.in → Modify.in → Viewport.particle`
5. Connect the original `LoadStructure.particle → Viewport.particle` as well (for the protein)

The viewport renders both streams — the protein at full opacity, and the water as translucent small spheres.

### Multiple Structure Layers

You can load multiple structure files simultaneously, with each file rendered as a separate layer in the viewport. Each `LoadStructure` node connected to a `Viewport` creates an independent rendering layer, allowing you to combine different molecules in a single view.

For example, to display a protein and a ligand loaded from separate files:

```
LoadStructure (protein.pdb) → AddBond → Viewport
LoadStructure (ligand.mol)  → AddBond ↗
```

Each layer is processed independently through its own chain of Filter, Modify, and overlay nodes before reaching the Viewport.

---

For more examples with code, see the [Gallery](/gallery).

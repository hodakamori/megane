# Visual Pipeline Editor

megane's pipeline editor lets you build visualization workflows by wiring nodes — no code required. Open the pipeline panel from the sidebar to start building.

## Concept

A pipeline is a directed graph of **nodes** connected by **edges**. Data flows from source nodes (like Load Structure) through processing nodes (like Filter or Modify) and into a Viewport node for rendering.

Each edge carries a specific **data type** — particle, bond, cell, label, mesh, or trajectory — and only matching types can connect.

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
| **Load Structure** | Load a molecular structure file (PDB, GRO, XYZ, MOL) | — | particle, trajectory, cell |
| **Load Trajectory** | Load an XTC trajectory file | particle | trajectory |

### Processing

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Add Bond** | Detect bonds from structure or by distance | particle | bond |
| **Filter** | Select atoms using a query expression | particle, bond | particle, bond |
| **Modify** | Override scale and opacity for a group of atoms | particle, bond | particle, bond |

::: info Generic Ports
Filter and Modify accept both **particle** and **bond** inputs. The output type matches the input type automatically.
:::

### Overlay

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Label Generator** | Generate text labels at atom positions | particle | label |
| **Polyhedron Generator** | Render coordination polyhedra (convex hulls) | particle | mesh |

### Output

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Viewport** | 3D rendering output | particle, bond, cell, trajectory, label, mesh | — |

## Node Parameters

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

### Viewport

| Parameter | Default | Description |
|-----------|---------|-------------|
| Perspective | off | Toggle perspective / orthographic projection |
| Cell axes visible | on | Show simulation cell axes with labels |

## Data Types

Six typed data channels flow through color-coded edges:

| Type | Color | Description |
|------|-------|-------------|
| **particle** | Blue | Atom positions, elements, and optional indices/overrides |
| **bond** | Amber | Bond pairs and orders |
| **cell** | Emerald | Simulation cell (3×3 matrix) |
| **label** | Violet | Text labels positioned at atoms |
| **mesh** | Gray | Triangle mesh for polyhedra rendering |
| **trajectory** | Pink | Multi-frame coordinate data |

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
4. Connect: `LoadStructure.particle → Filter.particle → Modify.particle → Viewport.particle`
5. Connect the original `LoadStructure.particle → Viewport.particle` as well (for the protein)

The viewport renders both streams — the protein at full opacity, and the water as translucent small spheres.

## Serialization

Pipelines serialize to JSON and can be saved, loaded, and version-controlled. The serialization format includes node types, parameters, positions, and edge connections.

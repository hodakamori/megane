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

- **Molecule** — Caffeine with bonds and trajectory (`LoadStructure → AddBond → Viewport`, plus `LoadTrajectory → Viewport`)
- **Solid** — Perovskite SrTiO₃ with coordination polyhedra (`LoadStructure → AddBond → Viewport`, plus `PolyhedronGenerator → Viewport`)

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
| **Filter** | Select atoms using a query expression | particle | particle |
| **Modify** | Override scale and opacity for a group of atoms | particle | particle |

### Overlay

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Labels** | Generate text labels at atom positions | particle | label |
| **Polyhedra** | Render coordination polyhedra (convex hulls) | particle | mesh |

### Output

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Viewport** | 3D rendering output | particle, bond, cell, trajectory, label, mesh | — |

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

## Polyhedra

The Polyhedron Generator node creates coordination polyhedra — convex hulls around center atoms defined by their neighboring ligand atoms.

**Parameters:**

| Parameter | Description | Default |
|-----------|-------------|---------|
| Center elements | Atomic numbers of center atoms (e.g., Si, Ti, Fe) | — |
| Ligand elements | Atomic numbers of ligand atoms (e.g., O, F, Cl) | O (8) |
| Max distance | Maximum center–ligand distance (Å) | 2.5 |
| Opacity | Face transparency (0–1) | 0.5 |
| Show edges | Display wireframe edges | off |

### Example: TiO₆ Octahedra in SrTiO₃

1. Load a perovskite structure (`LoadStructure`)
2. Add a `PolyhedronGenerator` node
3. Set center = Ti (22), ligand = O (8), max distance = 2.5 Å
4. Connect `LoadStructure.particle → PolyhedronGenerator.particle`
5. Connect `PolyhedronGenerator.mesh → Viewport.mesh`

Or use the **Solid** template which sets this up automatically.

## Serialization

Pipelines serialize to JSON and can be saved, loaded, and version-controlled. The serialization format includes node types, parameters, positions, and edge connections.

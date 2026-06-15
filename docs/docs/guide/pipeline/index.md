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

Each edge carries a specific **data type** — particle, bond, cell, label, mesh, trajectory, vector, or volumetric — and only matching types can connect.

When a node encounters an error — for example, a parse failure in LoadStructure — an error icon appears on the node with a tooltip showing the details.

## AI Pipeline Generator

Describe the visualization you want in natural language, and megane builds the node graph for you. Open the AI chat panel from the pipeline editor toolbar and type a prompt like:

> Load protein.pdb with bonds and make water translucent

The generator creates the appropriate LoadStructure, AddBond, Filter, Modify, and Viewport nodes, wires them together, and places them in the editor. You can then adjust parameters or add more nodes manually.

## VSCode Extension Auto-Setup

When you open a supported molecular file (`.pdb`, `.gro`, `.xyz`, `.mol`, `.sdf`, `.mol2`, `.cif`, `.mmcif`, `.data`, `.lammps`, `.prmtop`, `.traj`, `.xtc`, `.dcd`, `.lammpstrj`, `.dump`, `.nc`) in the megane VSCode extension, it automatically creates a default pipeline consisting of `LoadStructure → AddBond → Viewport`. This gives you an immediate 3D view of the structure with bonds, without needing to build a pipeline manually. You can then modify the auto-generated pipeline in the editor as needed.

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
- **Solid** — Perovskite SrTiO₃ 3×3×3 supercell with distance-based bonds and TiO₆ coordination polyhedra. Nodes: `LoadStructure → AddBond → Viewport`, `PolyhedronGenerator → Viewport`. Auto-detects metal centers and anion-former ligands (VESTA-style); Sr is excluded from centers so only TiO₆ polyhedra are shown.

## Node Reference

### Data Loading

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Load Structure** | Load a molecular structure file (PDB, GRO, XYZ, MOL, SDF, MOL2, CIF, mmCIF, LAMMPS data, AMBER topology `.prmtop`, ASE `.traj`) | — | particle, trajectory, cell |
| **Load Trajectory** | Load a separate trajectory file (XTC, DCD, LAMMPS `.lammpstrj` / `.dump`, AMBER NetCDF `.nc`) | particle | trajectory |
| **Streaming** | WebSocket-based real-time data delivery (only available on the standalone `megane serve` host) | — | particle, bond, trajectory, cell |
| **Load Vector** | Load per-atom vector data from a file | — | vector |
| **Load Volumetric** | Load a Gaussian CUBE file for volumetric (isosurface) rendering | — | volumetric |

### Processing

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Filter** | Select atoms using a query expression | particle (in) | particle (out) |
| **Modify** | Override scale and opacity for a group of atoms | particle (in) | particle (out) |
| **Color** | Recolor the upstream particle stream by a chosen scheme | particle (in) | particle (out) |
| **Representation** | Tag the particle stream with a visual representation override for the Viewport | particle (in) | particle (out) |

### Overlay

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Add Bond** | Detect bonds from structure or by distance | particle | bond |
| **Label Generator** | Generate text labels at atom positions | particle | label |
| **Polyhedron Generator** | Render coordination polyhedra (convex hulls) | particle | mesh |
| **Surface Mesh** | Generate an alpha-shape surface envelope around atoms | particle | mesh |
| **Isosurface** | Extract an isosurface from volumetric data using marching cubes | volumetric | mesh |
| **Vector Overlay** | Configure per-atom vector visualization (e.g. forces) | vector | vector |

### Output

| Node | Description | Inputs | Outputs |
|------|-------------|--------|---------|
| **Viewport** | 3D rendering output | particle, bond, cell, trajectory, label, mesh, vector | — |

## Node Parameters

### Load Structure

| Parameter | Type | Description |
|-----------|------|-------------|
| File path | string | Path to molecular structure file. Supported: `.pdb`, `.gro`, `.xyz`, `.mol`, `.sdf`, `.mol2`, `.cif`, `.mmcif`, `.data` / `.lammps`, `.prmtop`, `.traj` (ASE) |

### Load Trajectory

| Parameter | Type | Description |
|-----------|------|-------------|
| File path | string | Path to a trajectory file. Supported: `.xtc`, `.dcd`, `.lammpstrj` / `.dump`, `.nc` |

Requires a connection from a LoadStructure node. Frames are loaded lazily when `frame_index` changes.

### Load Vector

| Parameter | Type | Description |
|-----------|------|-------------|
| File path | string | Path to vector data file (JSON with per-atom 3D vectors) |

### Load Volumetric

| Parameter | Type | Description |
|-----------|------|-------------|
| File path | string | Path to a Gaussian CUBE file (`.cube`). The file is parsed in the browser; frames are not streamed. |

**Outputs:** `volumetric` — connects to an Isosurface node.

### Isosurface

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Iso level | number | 0.05 | Contour value for the positive isosurface |
| Color (+) | string | `#4488ff` | Hex color for the positive isosurface |
| Opacity | number | 0.7 | Surface transparency (0–1) |
| Show negative lobe | boolean | off | Show a second isosurface at −isoLevel (dual-contour for ESP maps) |
| Color (−) | string | `#ff4444` | Hex color for the negative isosurface (visible when "Show negative lobe" is on) |

### Color

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| Mode | `uniform` | ✓ | Single solid color |
| | `byElement` | — | CPK element coloring |
| | `byResidue` | — | Color by residue name |
| | `byChain` | — | Color by chain ID |
| | `byBFactor` | — | Color by B-factor (temperature factor) |
| | `byProperty` | — | Color by a numeric atom property |
| Color | string | `#ff8800` | Hex color used when mode is `uniform` |
| Range | [number, number]? | — | Optional explicit [min, max] for `byBFactor` / `byProperty` |

### Representation

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| Mode | `atoms` | ✓ | Space-filling atom spheres |
| | `cartoon` | — | Cartoon ribbon for proteins/nucleic acids |
| | `both` | — | Atoms + cartoon simultaneously |
| | `surface` | — | Solvent-accessible surface |
| | `line` | — | Thin wireframe lines (VMD/PyMOL "lines" style) |

### Add Bond

| Parameter | Values | Default | Description |
|-----------|--------|---------|-------------|
| Bond source | `structure` | — | Read bonds from the structure file (CONECT records in PDB, etc.) |
| | `distance` | ✓ | Infer bonds from van der Waals radii |
| | `file` | — | Read bonds from a topology file (GROMACS `.top` or CHARMM/NAMD `.psf`). Click **Load .top / .psf…** to select the file. |

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

Polyhedra are auto-detected using VESTA-style heuristics: a polyhedron is drawn for every metal/metalloid center coordinated to every typical anion-former ligand present in the structure. Use the exclusion lists to opt out specific elements.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Excluded centers | number[] | `[]` | Atomic numbers to exclude from the auto-detected center set (e.g., 38 to skip Sr) |
| Excluded ligands | number[] | `[]` | Atomic numbers to exclude from the auto-detected ligand set |
| Cutoff tolerance | number | 1.15 | Multiplier on `r_cov[center] + r_cov[ligand]` used to determine contacts (~1.0 = ideal contact, VESTA default ~1.15) |
| Opacity | number | 0.5 | Face transparency (0–1) |
| Show edges | boolean | off | Display wireframe edges |
| Edge color | string | `#dddddd` | Wireframe edge color (hex) |
| Edge width | number | 3.0 | Wireframe edge width (px) |

### Surface Mesh

:::note
Surface Mesh is available in the visual pipeline editor (standalone app, JupyterLab, VSCode) but does not have a corresponding Python class in the `megane` package. Build pipelines that use this node as JSON files or by editing them in the visual editor.
:::

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| Alpha radius | number | 3.0 Å | Probe sphere radius (alpha value). Larger = smoother surface, smaller = more detail |
| Color | string | `#4488ff` | Surface color (hex) |
| Opacity | number | 0.5 | Surface transparency (0–1) |

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
| `molecule_id` | number | 0-based connected-component (molecule) ID, derived from bond connectivity. Atoms with no bonds form their own single-atom molecule |

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
molecule_id == 0                       # Atoms belonging to the first molecule
not molecule_id == 0                   # Everything except the first molecule
```

## Bond Selection DSL

The **Bond query** field in the Filter node accepts expressions to select bonds.

### Available Fields

| Field | Type | Description |
|-------|------|-------------|
| `bond_index` | number | 0-based sequential bond index |
| `atom_index` | number | Atom endpoint index |
| `element` | string | Element symbol of an atom endpoint (e.g., `"C"`, `"O"`) |
| `molecule_id` | number | 0-based molecule ID of the bond's endpoints (both endpoints always share the same ID) |

### Operators

`==`, `!=`, `>`, `<`, `>=`, `<=`

### Logical Operators

`and`, `or`, `not`, parentheses `()`

### Special Keywords

- `all` — select all bonds (default when query is empty)
- `none` — select no bonds
- `both` — prefix on a comparison involving `atom_index` or `element` to require **both** atoms of the bond to satisfy the condition (default: either atom, OR semantics). Has no effect on `bond_index` comparisons, and is redundant (but harmless) for `molecule_id`, since both endpoints of a bond always share the same molecule ID.

### Examples

```
element == "C"                         # Bonds where either atom is carbon
both element != "H"                    # Bonds where neither atom is hydrogen
atom_index >= 24                       # Bonds involving atom 24 or higher
bond_index < 10                        # First 10 bonds only
both atom_index >= 0 and bond_index < 50  # First 50 bonds (all-atom filter)
molecule_id == 0                       # Bonds within the first molecule
```

The bond query selects which bonds a downstream **Modify** node applies opacity overrides to. This lets you selectively fade specific bonds without removing them from the scene.

## Editor Examples

### TiO₆ Octahedra in SrTiO₃

1. Load a perovskite structure (`LoadStructure`)
2. Add a `PolyhedronGenerator` node
3. In "Excluded centers", add Sr (38) so only TiO₆ polyhedra are shown (Ti and O are auto-detected)
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

### Modify a Single Molecule (Atoms + Bonds Together)

`molecule_id` lets you target one molecule (a connected component of the bond
graph) and fade its atoms and bonds together, using the same query on both
streams.

1. Add a `LoadStructure` node and load a structure with multiple molecules (e.g. `caffeine_water.pdb`)
2. Add an `AddBond` node and connect `LoadStructure.particle → AddBond.particle` to produce a bond stream
3. Add two `Filter` nodes:
   - Filter A (atoms): query `not molecule_id == 0`
   - Filter B (bonds): bond query `not molecule_id == 0`
4. Add two `Modify` nodes and set opacity to 0.15 on each
5. Connect:
   - `LoadStructure.particle → FilterA.in → ModifyA.in → Viewport.particle`
   - `AddBond.bond → FilterB.in → ModifyB.in → Viewport.bond`
   - `LoadStructure.particle → Viewport.particle` and `AddBond.bond → Viewport.bond` (original full-opacity streams)

Molecule 0 (the component containing atom 0) stays fully opaque, while every
other molecule's atoms and bonds fade together — both Filter nodes derive
`molecule_id` from the same underlying bond connectivity.

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

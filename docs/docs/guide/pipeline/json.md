---
sidebar_position: 4
sidebar_label: JSON
---

# JSON Pipeline Format

Pipelines serialize to the **SerializedPipeline v3** JSON format. This format is used by:

- The **VSCode extension** (`megane.json` files)
- The **pipeline editor** (import/export)
- The TypeScript `pipe.toObject()` / `pipe.toJSON()` methods
- The Python `pipe.to_dict()` method

JSON pipelines can be saved, shared, and version-controlled. You can write them by hand or generate them from [Python](./python.md) or [TypeScript](./typescript.md).

For real-world examples, see the [Gallery](/gallery).

## Format

```json
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 0, "y": 0 },
      "fileName": "protein.pdb",
      "fileUrl": "protein.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "ab1",
      "type": "add_bond",
      "position": { "x": 0, "y": 150 },
      "bondSource": "distance"
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 0, "y": 300 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1", "target": "ab1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1", "target": "v1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1", "target": "v1", "sourceHandle": "bond", "targetHandle": "bond" }
  ]
}
```

## Top-level Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | `number` | Always `3` for the current format |
| `nodes` | `array` | Array of node objects |
| `edges` | `array` | Array of edge objects connecting nodes |

## Node Fields

Every node has the following common fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique node identifier |
| `type` | `string` | Node type (see below) |
| `position` | `{ x, y }` | Position in the pipeline editor canvas |
| `enabled` | `boolean?` | Optional. Set to `false` to bypass this node (default: `true`) |

### Node Types and Parameters

#### `load_structure`

| Field | Type | Description |
|-------|------|-------------|
| `fileName` | `string` | Display name of the file |
| `fileUrl` | `string` | Path or URL to the structure file |
| `hasTrajectory` | `boolean` | Whether the file contains trajectory data |
| `hasCell` | `boolean` | Whether the file contains unit cell data |

#### `load_trajectory`

| Field | Type | Description |
|-------|------|-------------|
| `fileName` | `string` | Display name of the trajectory file |
| `fileUrl` | `string` | Path or URL to the trajectory file |

#### `streaming`

No additional parameters.

#### `load_vector`

| Field | Type | Description |
|-------|------|-------------|
| `fileName` | `string` | Path to vector data file |

#### `filter`

| Field | Type | Description |
|-------|------|-------------|
| `query` | `string` | Atom selection query |
| `bondQuery` | `string?` | Bond selection query |

#### `modify`

| Field | Type | Description |
|-------|------|-------------|
| `scale` | `number` | Atom sphere radius multiplier (0.1–2.0) |
| `opacity` | `number` | Transparency (0–1) |

#### `add_bond`

| Field | Type | Description |
|-------|------|-------------|
| `bondSource` | `string` | `"distance"` or `"structure"` |

#### `label_generator`

| Field | Type | Description |
|-------|------|-------------|
| `source` | `string` | `"element"`, `"resname"`, or `"index"` |

#### `polyhedron_generator`

| Field | Type | Description |
|-------|------|-------------|
| `centerElements` | `number[]` | Atomic numbers of center atoms |
| `ligandElements` | `number[]` | Atomic numbers of ligand atoms |
| `maxDistance` | `number` | Maximum center–ligand distance (Å) |
| `opacity` | `number` | Face transparency (0–1) |
| `showEdges` | `boolean` | Display wireframe edges |
| `edgeColor` | `string` | Wireframe edge color (hex) |
| `edgeWidth` | `number` | Wireframe edge width (px) |

#### `vector_overlay`

| Field | Type | Description |
|-------|------|-------------|
| `scale` | `number` | Vector arrow length multiplier |

#### `viewport`

| Field | Type | Description |
|-------|------|-------------|
| `perspective` | `boolean` | Perspective / orthographic projection |
| `cellAxesVisible` | `boolean` | Show unit cell axes |
| `pivotMarkerVisible` | `boolean` | Show rotation pivot marker |

## Edge Fields

| Field | Type | Description |
|-------|------|-------------|
| `source` | `string` | Source node `id` |
| `target` | `string` | Target node `id` |
| `sourceHandle` | `string` | Output port name (e.g., `"particle"`, `"bond"`, `"mesh"`) |
| `targetHandle` | `string` | Input port name (e.g., `"particle"`, `"bond"`, `"in"`) |

## Example: Crystal with Polyhedra

```json
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 0, "y": 0 },
      "fileName": "perovskite_srtio3_3x3x3.xyz",
      "fileUrl": "perovskite_srtio3_3x3x3.xyz",
      "hasTrajectory": false,
      "hasCell": true
    },
    {
      "id": "ab1",
      "type": "add_bond",
      "position": { "x": -170, "y": 310 },
      "bondSource": "distance"
    },
    {
      "id": "poly1",
      "type": "polyhedron_generator",
      "position": { "x": 170, "y": 310 },
      "centerElements": [22],
      "ligandElements": [8],
      "maxDistance": 2.5,
      "opacity": 0.5,
      "showEdges": true,
      "edgeColor": "#dddddd",
      "edgeWidth": 2
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 0, "y": 615 },
      "perspective": false,
      "cellAxesVisible": true,
      "pivotMarkerVisible": true
    }
  ],
  "edges": [
    { "source": "s1", "target": "ab1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1", "target": "poly1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1", "target": "v1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1", "target": "v1", "sourceHandle": "cell", "targetHandle": "cell" },
    { "source": "ab1", "target": "v1", "sourceHandle": "bond", "targetHandle": "bond" },
    { "source": "poly1", "target": "v1", "sourceHandle": "mesh", "targetHandle": "mesh" }
  ]
}
```

## Example: Atom Filter with Branching

```json
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 170, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "fc1",
      "type": "filter",
      "position": { "x": 0, "y": 150 },
      "query": "index < 24"
    },
    {
      "id": "mc1",
      "type": "modify",
      "position": { "x": 0, "y": 300 },
      "scale": 3.0,
      "opacity": 1.0
    },
    {
      "id": "fw1",
      "type": "filter",
      "position": { "x": 340, "y": 150 },
      "query": "index >= 24"
    },
    {
      "id": "mw1",
      "type": "modify",
      "position": { "x": 340, "y": 300 },
      "scale": 1.0,
      "opacity": 0.15
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 170, "y": 450 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1", "target": "fc1", "sourceHandle": "particle", "targetHandle": "in" },
    { "source": "fc1", "target": "mc1", "sourceHandle": "out", "targetHandle": "in" },
    { "source": "mc1", "target": "v1", "sourceHandle": "out", "targetHandle": "particle" },
    { "source": "s1", "target": "fw1", "sourceHandle": "particle", "targetHandle": "in" },
    { "source": "fw1", "target": "mw1", "sourceHandle": "out", "targetHandle": "in" },
    { "source": "mw1", "target": "v1", "sourceHandle": "out", "targetHandle": "particle" }
  ]
}
```

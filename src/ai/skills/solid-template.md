---
name: get-solid-template
description: Get a base pipeline template for crystalline solid visualization with coordination polyhedra. Use when the user wants to visualize a crystal structure, perovskite, oxide, or show coordination polyhedra around specific atoms.
---

# Solid / Crystal Pipeline Template

A pipeline for crystalline solid visualization with distance-based bonds and coordination polyhedra.

Structure: LoadStructure -> AddBond (distance) -> Viewport, plus PolyhedronGenerator -> Viewport.

```json
{
  "version": 3,
  "nodes": [
    {
      "id": "loader-1",
      "type": "load_structure",
      "position": { "x": 425, "y": 0 },
      "fileName": null,
      "hasTrajectory": false,
      "hasCell": true,
      "enabled": true
    },
    {
      "id": "addbond-1",
      "type": "add_bond",
      "position": { "x": 170, "y": 310 },
      "bondSource": "distance",
      "enabled": true
    },
    {
      "id": "polyhedron-1",
      "type": "polyhedron_generator",
      "position": { "x": 680, "y": 310 },
      "centerElements": [22],
      "ligandElements": [8],
      "maxDistance": 2.5,
      "opacity": 0.5,
      "showEdges": false,
      "edgeColor": "#dddddd",
      "edgeWidth": 3,
      "enabled": true
    },
    {
      "id": "viewport-1",
      "type": "viewport",
      "position": { "x": 425, "y": 615 },
      "perspective": false,
      "cellAxesVisible": true,
      "enabled": true
    }
  ],
  "edges": [
    { "source": "loader-1", "target": "addbond-1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "loader-1", "target": "polyhedron-1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "loader-1", "target": "viewport-1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "loader-1", "target": "viewport-1", "sourceHandle": "cell", "targetHandle": "cell" },
    { "source": "addbond-1", "target": "viewport-1", "sourceHandle": "bond", "targetHandle": "bond" },
    { "source": "polyhedron-1", "target": "viewport-1", "sourceHandle": "mesh", "targetHandle": "mesh" }
  ]
}
```

## Customization Notes

- Adjust `centerElements` and `ligandElements` to match the target material.
- Common atomic numbers: Ti=22, O=8, Sr=38, Fe=26, Al=13, Si=14, Mg=12, Ca=20, Zn=30.
- Adjust `maxDistance` based on the expected bond length for the center-ligand pair.
- Use `bondSource: "distance"` for crystal structures (XYZ, GRO) that lack explicit bond info.
- Set `hasCell: true` and `cellAxesVisible: true` to show the unit cell.

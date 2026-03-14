---
name: get-molecule-template
description: Get a base pipeline template for molecular visualization with bonds and trajectory animation. Use when the user wants to visualize a molecule, show chemical bonds, or animate a trajectory.
---

# Molecule Pipeline Template

A standard pipeline for molecular visualization with bonds and optional trajectory playback.

Structure: LoadStructure -> AddBond -> Viewport, with optional LoadTrajectory.

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
      "id": "traj-1",
      "type": "load_trajectory",
      "position": { "x": 85, "y": 310 },
      "fileName": null,
      "enabled": true
    },
    {
      "id": "addbond-1",
      "type": "add_bond",
      "position": { "x": 425, "y": 310 },
      "bondSource": "structure",
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
    {
      "source": "loader-1",
      "target": "addbond-1",
      "sourceHandle": "particle",
      "targetHandle": "particle"
    },
    {
      "source": "loader-1",
      "target": "traj-1",
      "sourceHandle": "particle",
      "targetHandle": "particle"
    },
    {
      "source": "loader-1",
      "target": "viewport-1",
      "sourceHandle": "particle",
      "targetHandle": "particle"
    },
    {
      "source": "loader-1",
      "target": "viewport-1",
      "sourceHandle": "cell",
      "targetHandle": "cell"
    },
    {
      "source": "addbond-1",
      "target": "viewport-1",
      "sourceHandle": "bond",
      "targetHandle": "bond"
    },
    {
      "source": "traj-1",
      "target": "viewport-1",
      "sourceHandle": "trajectory",
      "targetHandle": "trajectory"
    }
  ]
}
```

## Customization Notes

- Set `fileName` to `null` (the user loads files separately).
- Use `bondSource: "structure"` for PDB/MOL files that contain bond information.
- Use `bondSource: "distance"` for XYZ/GRO files without explicit bonds.
- Remove the `traj-1` node and its edges if no trajectory is needed.
- Add `filter` and `modify` nodes between `loader-1` and `viewport-1` for selective visualization.

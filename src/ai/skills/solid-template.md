---
name: get-solid-template
description: Get a base pipeline template for crystalline solid visualization with coordination polyhedra. Use when the user wants to visualize a crystal structure, perovskite, oxide, or show coordination polyhedra around specific atoms.
---

# Solid / Crystal Pipeline Template

A pipeline for crystalline solid visualization with periodic images in a fractional-coordinate drawing range and coordination polyhedra.

Structure: LoadStructure -> DrawingBoundary -> Coordination -> PolyhedronGenerator -> Viewport.

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
      "id": "drawing-boundary-1",
      "type": "drawing_boundary",
      "position": { "x": 425, "y": 180 },
      "xMin": 0,
      "xMax": 1,
      "yMin": 0,
      "yMax": 1,
      "zMin": 0,
      "zMax": 1,
      "enabled": true
    },
    {
      "id": "coordination-1",
      "type": "coordination_generator",
      "position": { "x": 425, "y": 360 },
      "excludedCenters": [],
      "excludedLigands": [],
      "cutoffTolerance": 1.15,
      "boundaryMode": "complete",
      "enabled": true
    },
    {
      "id": "polyhedron-1",
      "type": "polyhedron_generator",
      "position": { "x": 680, "y": 535 },
      "opacity": 0.5,
      "showEdges": false,
      "edgeColor": "#dddddd",
      "edgeWidth": 3,
      "enabled": true
    },
    {
      "id": "viewport-1",
      "type": "viewport",
      "position": { "x": 425, "y": 750 },
      "perspective": false,
      "cellAxesVisible": true,
      "enabled": true
    }
  ],
  "edges": [
    {
      "source": "loader-1",
      "target": "drawing-boundary-1",
      "sourceHandle": "particle",
      "targetHandle": "particle"
    },
    {
      "source": "drawing-boundary-1",
      "target": "coordination-1",
      "sourceHandle": "particle",
      "targetHandle": "particle"
    },
    {
      "source": "drawing-boundary-1",
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
      "source": "coordination-1",
      "target": "viewport-1",
      "sourceHandle": "bond",
      "targetHandle": "bond"
    },
    {
      "source": "coordination-1",
      "target": "polyhedron-1",
      "sourceHandle": "coordination",
      "targetHandle": "coordination"
    },
    {
      "source": "polyhedron-1",
      "target": "viewport-1",
      "sourceHandle": "mesh",
      "targetHandle": "mesh"
    }
  ]
}
```

## Customization Notes

- Drawing Boundary owns periodic display copies and accepts arbitrary inclusive fractional bounds.
- Coordination auto-detects metal/metalloid centers and neighboring anion-former atoms. Use `excludedCenters` / `excludedLigands` to opt out specific atomic numbers.
- Common atomic numbers: Ti=22, O=8, Sr=38, Fe=26, Al=13, Si=14, Mg=12, Ca=20, Zn=30.
- Adjust Coordination's `cutoffTolerance` to widen or narrow the center-neighbor contact criterion. With `boundaryMode: "complete"`, periodic neighbors just outside the drawing range are included when needed to complete visible centers.
- PolyhedronGenerator owns mesh appearance only.
- Set `hasCell: true` and `cellAxesVisible: true` to show the unit cell.

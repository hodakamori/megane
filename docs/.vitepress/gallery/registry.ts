/**
 * Gallery registry — the single source of truth for all gallery examples.
 *
 * ─────────────────────────────────────────────────
 * HOW TO ADD A NEW EXAMPLE
 * ─────────────────────────────────────────────────
 * 1. Add a snapshot JSON to docs/public/data/  (or reuse an existing one).
 *    Snapshots are JSON-serialized atom/bond data (see existing files in docs/public/data/).
 *    To create a new snapshot, copy a similar JSON file in that directory and adapt it,
 *    or follow the same SerializedPipeline schema used by the viewer.
 *
 * 2. Add a new GalleryExample object to the `galleryExamples` array below.
 *    Fill in:
 *      - id          : unique kebab-case string (used as HTML anchor)
 *      - title       : short display name
 *      - description : one-sentence description
 *      - tags        : array of lowercase tag strings
 *      - snapshotUrl : "/megane/data/<filename>.json"
 *      - code.jupyter: Python code snippet
 *      - code.react  : TSX snippet using PipelineViewer
 *      - code.vscode : megane.json (SerializedPipeline JSON)
 *
 * That's it — the gallery page renders all entries automatically.
 * ─────────────────────────────────────────────────
 */

import type { GalleryExample } from "./types";

export const galleryExamples: GalleryExample[] = [
  // ──────────────────────────────────────────────
  // 1. Small molecule system (Caffeine + Water)
  // ──────────────────────────────────────────────
  {
    id: "small-molecule",
    title: "Small Molecule System",
    description:
      "Visualize a solvated small molecule system with distance-based bond detection.",
    tags: ["small-molecule", "pdb", "basic"],
    snapshotUrl: "/megane/data/caffeine_water.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import Pipeline, LoadStructure, AddBonds, Viewport

pipe = Pipeline()
s = pipe.add_node(LoadStructure("caffeine_water.pdb"))
ab = pipe.add_node(AddBonds(source="distance"))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, ab.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(ab.out.bond, v.inp.bond)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 0, y: 0 },
      fileName: "caffeine_water.pdb",
      fileUrl: "/path/to/caffeine_water.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: 0, y: 150 },
      bondSource: "distance",
    },
    {
      id: "v1", type: "viewport",
      position: { x: 0, y: 300 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    { source: "s1",  target: "ab1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1",  target: "v1",  sourceHandle: "particle", targetHandle: "particle" },
    { source: "ab1", target: "v1",  sourceHandle: "bond",     targetHandle: "bond"     },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 0, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
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
    { "source": "s1",  "target": "ab1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1",  "target": "v1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1", "target": "v1",  "sourceHandle": "bond",     "targetHandle": "bond"     }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 2. Crystal structure with coordination polyhedra (SrTiO3 perovskite)
  // ──────────────────────────────────────────────
  {
    id: "crystal-polyhedra",
    title: "Crystal with Coordination Polyhedra",
    description:
      "Render TiO\u2086 coordination polyhedra on a perovskite crystal structure with periodic cell axes.",
    tags: ["crystal", "xyz", "polyhedra", "periodic"],
    snapshotUrl: "/megane/data/perovskite_srtio3.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import (
    Pipeline, LoadStructure, AddBonds, AddPolyhedra, Viewport,
)

pipe = Pipeline()
s = pipe.add_node(LoadStructure("perovskite_srtio3_3x3x3.xyz"))
ab = pipe.add_node(AddBonds(source="distance"))
# TiO6 octahedra: center = Ti (22), ligand = O (8)
poly = pipe.add_node(AddPolyhedra(
    center_elements=[22],
    ligand_elements=[8],
    max_distance=2.5,
    opacity=0.5,
    show_edges=True,
))
v = pipe.add_node(Viewport(cell_axes_visible=True))

pipe.add_edge(s.out.particle, ab.inp.particle)
pipe.add_edge(s.out.particle, poly.inp.particle)
pipe.add_edge(s.out.particle, v.inp.particle)
pipe.add_edge(s.out.cell,     v.inp.cell)
pipe.add_edge(ab.out.bond,    v.inp.bond)
pipe.add_edge(poly.out.mesh,  v.inp.mesh)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 0, y: 0 },
      fileName: "perovskite_srtio3_3x3x3.xyz",
      fileUrl: "/path/to/perovskite_srtio3_3x3x3.xyz",
      hasTrajectory: false, hasCell: true,
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: -170, y: 310 },
      bondSource: "distance",
    },
    {
      // TiO6 octahedra: center = Ti (22), ligand = O (8)
      id: "poly1", type: "polyhedron_generator",
      position: { x: 170, y: 310 },
      centerElements: [22],
      ligandElements: [8],
      maxDistance: 2.5,
      opacity: 0.5,
      showEdges: true,
      edgeColor: "#dddddd",
      edgeWidth: 2,
    },
    {
      id: "v1", type: "viewport",
      position: { x: 0, y: 615 },
      perspective: false,
      cellAxesVisible: true,
      pivotMarkerVisible: true,
    },
  ],
  edges: [
    { source: "s1",   target: "ab1",  sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1",   target: "poly1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1",   target: "v1",   sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1",   target: "v1",   sourceHandle: "cell",     targetHandle: "cell"     },
    { source: "ab1",  target: "v1",   sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "poly1", target: "v1",  sourceHandle: "mesh",     targetHandle: "mesh"     },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
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
    { "source": "s1",    "target": "ab1",   "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1",    "target": "poly1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1",    "target": "v1",    "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1",    "target": "v1",    "sourceHandle": "cell",     "targetHandle": "cell"     },
    { "source": "ab1",   "target": "v1",    "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "poly1", "target": "v1",    "sourceHandle": "mesh",     "targetHandle": "mesh"     }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 3. Atom filter + modify (select subset of atoms)
  // ──────────────────────────────────────────────
  {
    id: "atom-filter",
    title: "Atom Filter",
    description:
      "Select a subset of atoms using a query expression, then enlarge them with a modify node.",
    tags: ["filter", "small-molecule", "selection"],
    snapshotUrl: "/megane/data/caffeine_water.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import Pipeline, LoadStructure, Filter, Modify, Viewport

pipe = Pipeline()
s = pipe.add_node(LoadStructure("caffeine_water.pdb"))
# Select only the solute molecule (first 24 atoms = caffeine)
f = pipe.add_node(Filter(query="index < 24"))
m = pipe.add_node(Modify(scale=1.5, opacity=1.0))
v = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle, f.inp.particle)
pipe.add_edge(f.out.particle, m.inp.particle)
pipe.add_edge(m.out.particle, v.inp.particle)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 0, y: 0 },
      fileName: "caffeine_water.pdb",
      fileUrl: "/path/to/caffeine_water.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      // Select only the solute molecule (first 24 atoms = caffeine)
      id: "f1", type: "filter",
      position: { x: 0, y: 150 },
      query: "index < 24",
    },
    {
      // Enlarge the selected atoms
      id: "m1", type: "modify",
      position: { x: 0, y: 300 },
      scale: 1.5, opacity: 1.0,
    },
    {
      id: "v1", type: "viewport",
      position: { x: 0, y: 450 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    { source: "s1", target: "f1", sourceHandle: "particle", targetHandle: "in"       },
    { source: "f1", target: "m1", sourceHandle: "out",      targetHandle: "in"       },
    { source: "m1", target: "v1", sourceHandle: "out",      targetHandle: "particle" },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 0, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "f1",
      "type": "filter",
      "position": { "x": 0, "y": 150 },
      "query": "index < 24"
    },
    {
      "id": "m1",
      "type": "modify",
      "position": { "x": 0, "y": 300 },
      "scale": 1.5,
      "opacity": 1.0
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 0, "y": 450 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1", "target": "f1", "sourceHandle": "particle", "targetHandle": "in"       },
    { "source": "f1", "target": "m1", "sourceHandle": "out",      "targetHandle": "in"       },
    { "source": "m1", "target": "v1", "sourceHandle": "out",      "targetHandle": "particle" }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 4. Dual representation (solute + transparent solvent)
  // ──────────────────────────────────────────────
  {
    id: "dual-representation",
    title: "Dual Representation",
    description:
      "Fan out the pipeline to render the solute in full detail while the solvent is dimmed and semi-transparent.",
    tags: ["filter", "modify", "small-molecule", "selection"],
    snapshotUrl: "/megane/data/caffeine_water.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import (
    Pipeline, LoadStructure, AddBonds, Filter, Modify, Viewport,
)

pipe = Pipeline()
s  = pipe.add_node(LoadStructure("caffeine_water.pdb"))
ab = pipe.add_node(AddBonds(source="distance"))

# Branch 1: caffeine (index < 24) — full size
f_solute  = pipe.add_node(Filter(query="index < 24"))
m_solute  = pipe.add_node(Modify(scale=1.3, opacity=1.0))

# Branch 2: water (index >= 24) — small and transparent
f_solvent = pipe.add_node(Filter(query="index >= 24"))
m_solvent = pipe.add_node(Modify(scale=0.8, opacity=0.15))

v = pipe.add_node(Viewport())

# Bonds
pipe.add_edge(s.out.particle, ab.inp.particle)
pipe.add_edge(ab.out.bond, v.inp.bond)

# Solute branch
pipe.add_edge(s.out.particle,    f_solute.inp.particle)
pipe.add_edge(f_solute.out.particle, m_solute.inp.particle)
pipe.add_edge(m_solute.out.particle, v.inp.particle)

# Solvent branch
pipe.add_edge(s.out.particle,     f_solvent.inp.particle)
pipe.add_edge(f_solvent.out.particle, m_solvent.inp.particle)
pipe.add_edge(m_solvent.out.particle, v.inp.particle)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 340, y: 0 },
      fileName: "caffeine_water.pdb",
      fileUrl: "/path/to/caffeine_water.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: 340, y: 150 },
      bondSource: "distance",
    },
    // Branch 1: solute (caffeine)
    {
      id: "f_solute", type: "filter",
      position: { x: 0, y: 300 },
      query: "index < 24",
    },
    {
      id: "m_solute", type: "modify",
      position: { x: 0, y: 450 },
      scale: 1.3, opacity: 1.0,
    },
    // Branch 2: solvent (water)
    {
      id: "f_solvent", type: "filter",
      position: { x: 680, y: 300 },
      query: "index >= 24",
    },
    {
      id: "m_solvent", type: "modify",
      position: { x: 680, y: 450 },
      scale: 0.8, opacity: 0.15,
    },
    {
      id: "v1", type: "viewport",
      position: { x: 340, y: 615 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    // Bonds
    { source: "s1",       target: "ab1",      sourceHandle: "particle", targetHandle: "particle" },
    { source: "ab1",      target: "v1",        sourceHandle: "bond",     targetHandle: "bond"     },
    // Solute branch
    { source: "s1",       target: "f_solute",  sourceHandle: "particle", targetHandle: "in"       },
    { source: "f_solute", target: "m_solute",  sourceHandle: "out",      targetHandle: "in"       },
    { source: "m_solute", target: "v1",        sourceHandle: "out",      targetHandle: "particle" },
    // Solvent branch
    { source: "s1",        target: "f_solvent", sourceHandle: "particle", targetHandle: "in"       },
    { source: "f_solvent", target: "m_solvent", sourceHandle: "out",      targetHandle: "in"       },
    { source: "m_solvent", target: "v1",        sourceHandle: "out",      targetHandle: "particle" },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 340, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "ab1",
      "type": "add_bond",
      "position": { "x": 340, "y": 150 },
      "bondSource": "distance"
    },
    {
      "id": "f_solute",
      "type": "filter",
      "position": { "x": 0, "y": 300 },
      "query": "index < 24"
    },
    {
      "id": "m_solute",
      "type": "modify",
      "position": { "x": 0, "y": 450 },
      "scale": 1.3,
      "opacity": 1.0
    },
    {
      "id": "f_solvent",
      "type": "filter",
      "position": { "x": 680, "y": 300 },
      "query": "index >= 24"
    },
    {
      "id": "m_solvent",
      "type": "modify",
      "position": { "x": 680, "y": 450 },
      "scale": 0.8,
      "opacity": 0.15
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 340, "y": 615 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1",        "target": "ab1",       "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1",       "target": "v1",        "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "s1",        "target": "f_solute",  "sourceHandle": "particle", "targetHandle": "in"       },
    { "source": "f_solute",  "target": "m_solute",  "sourceHandle": "out",      "targetHandle": "in"       },
    { "source": "m_solute",  "target": "v1",        "sourceHandle": "out",      "targetHandle": "particle" },
    { "source": "s1",        "target": "f_solvent", "sourceHandle": "particle", "targetHandle": "in"       },
    { "source": "f_solvent", "target": "m_solvent", "sourceHandle": "out",      "targetHandle": "in"       },
    { "source": "m_solvent", "target": "v1",        "sourceHandle": "out",      "targetHandle": "particle" }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 5. Atom labels
  // ──────────────────────────────────────────────
  {
    id: "atom-labels",
    title: "Atom Labels",
    description:
      "Generate per-atom text labels (element symbols) on a filtered subset of atoms.",
    tags: ["labels", "filter", "small-molecule"],
    snapshotUrl: "/megane/data/caffeine_water.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import Pipeline, LoadStructure, Filter, AddLabels, Viewport

pipe = Pipeline()
s   = pipe.add_node(LoadStructure("caffeine_water.pdb"))
# Focus on the solute molecule only
f   = pipe.add_node(Filter(query="index < 24"))
lbl = pipe.add_node(AddLabels(source="element"))
v   = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle,   f.inp.particle)
pipe.add_edge(f.out.particle,   v.inp.particle)
pipe.add_edge(f.out.particle,   lbl.inp.particle)
pipe.add_edge(lbl.out.label,    v.inp.label)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 0, y: 0 },
      fileName: "caffeine_water.pdb",
      fileUrl: "/path/to/caffeine_water.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      // Select only the solute (first 24 atoms)
      id: "f1", type: "filter",
      position: { x: 0, y: 150 },
      query: "index < 24",
    },
    {
      // Generate element-symbol labels for the filtered atoms
      id: "lbl1", type: "label_generator",
      position: { x: -170, y: 300 },
      source: "element",
    },
    {
      id: "v1", type: "viewport",
      position: { x: 0, y: 450 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    { source: "s1",  target: "f1",   sourceHandle: "particle", targetHandle: "in"       },
    { source: "f1",  target: "v1",   sourceHandle: "out",      targetHandle: "particle" },
    { source: "f1",  target: "lbl1", sourceHandle: "out",      targetHandle: "particle" },
    { source: "lbl1", target: "v1",  sourceHandle: "label",    targetHandle: "label"    },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 0, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "f1",
      "type": "filter",
      "position": { "x": 0, "y": 150 },
      "query": "index < 24"
    },
    {
      "id": "lbl1",
      "type": "label_generator",
      "position": { "x": -170, "y": 300 },
      "source": "element"
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 0, "y": 450 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1",   "target": "f1",   "sourceHandle": "particle", "targetHandle": "in"       },
    { "source": "f1",   "target": "v1",   "sourceHandle": "out",      "targetHandle": "particle" },
    { "source": "f1",   "target": "lbl1", "sourceHandle": "out",      "targetHandle": "particle" },
    { "source": "lbl1", "target": "v1",   "sourceHandle": "label",    "targetHandle": "label"    }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 6. Bond filter (hide solvent bonds via bond_query)
  // ──────────────────────────────────────────────
  {
    id: "bond-filter",
    title: "Bond Filter",
    description:
      "Use a bond query to show only intramolecular solute bonds while keeping all atoms visible.",
    tags: ["filter", "bond", "small-molecule", "selection"],
    snapshotUrl: "/megane/data/caffeine_water.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import Pipeline, LoadStructure, AddBonds, Filter, Viewport

pipe = Pipeline()
s  = pipe.add_node(LoadStructure("caffeine_water.pdb"))
ab = pipe.add_node(AddBonds(source="distance"))

# Keep only bonds where BOTH atoms belong to the solute (index < 24)
fb = pipe.add_node(Filter(bond_query="both atom_index < 24"))

v  = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle,   ab.inp.particle)
pipe.add_edge(ab.out.bond,      fb.inp.particle)   # bond → generic "in"
pipe.add_edge(fb.out.particle,  v.inp.bond)         # generic "out" → bond

pipe.add_edge(s.out.particle,   v.inp.particle)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 0, y: 0 },
      fileName: "caffeine_water.pdb",
      fileUrl: "/path/to/caffeine_water.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: 0, y: 150 },
      bondSource: "distance",
    },
    {
      // "both atom_index < 24" keeps bonds where both endpoints are in the solute
      id: "fb1", type: "filter",
      position: { x: 0, y: 300 },
      query: "",
      bond_query: "both atom_index < 24",
    },
    {
      id: "v1", type: "viewport",
      position: { x: 0, y: 450 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    { source: "s1",  target: "ab1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1",  target: "v1",  sourceHandle: "particle", targetHandle: "particle" },
    // Bond path: add_bond → bond filter → viewport
    { source: "ab1", target: "fb1", sourceHandle: "bond",     targetHandle: "in"       },
    { source: "fb1", target: "v1",  sourceHandle: "out",      targetHandle: "bond"     },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 0, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
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
      "id": "fb1",
      "type": "filter",
      "position": { "x": 0, "y": 300 },
      "query": "",
      "bond_query": "both atom_index < 24"
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 0, "y": 450 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1",  "target": "ab1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1",  "target": "v1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1", "target": "fb1", "sourceHandle": "bond",     "targetHandle": "in"       },
    { "source": "fb1", "target": "v1",  "sourceHandle": "out",      "targetHandle": "bond"     }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 7. Trajectory animation (XTC vibration)
  // ──────────────────────────────────────────────
  {
    id: "trajectory-animation",
    title: "Trajectory Animation",
    description:
      "Load an XTC trajectory file alongside the structure to animate molecular vibrations frame by frame.",
    tags: ["trajectory", "animation", "small-molecule", "xtc"],
    snapshotUrl: "/megane/data/caffeine_water.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import (
    Pipeline, LoadStructure, LoadTrajectory, AddBonds, Viewport,
)

pipe = Pipeline()
s    = pipe.add_node(LoadStructure("caffeine_water.pdb"))
traj = pipe.add_node(LoadTrajectory(xtc="caffeine_water_vibration.xtc"))
ab   = pipe.add_node(AddBonds(source="structure"))
v    = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle,    ab.inp.particle)
pipe.add_edge(s.out.particle,    traj.inp.particle)   # topology for XTC
pipe.add_edge(s.out.particle,    v.inp.particle)
pipe.add_edge(ab.out.bond,       v.inp.bond)
pipe.add_edge(traj.out.traj,     v.inp.traj)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

// Note: PipelineViewer auto-fetches load_structure files via fileUrl.
// For load_trajectory, provide trajectory data via a custom wrapper or
// use the Jupyter / VSCode integration which handles file I/O natively.
const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 340, y: 0 },
      fileName: "caffeine_water.pdb",
      fileUrl: "/path/to/caffeine_water.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      id: "traj1", type: "load_trajectory",
      position: { x: 0, y: 310 },
      fileName: "caffeine_water_vibration.xtc",
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: 340, y: 310 },
      bondSource: "structure",
    },
    {
      id: "v1", type: "viewport",
      position: { x: 340, y: 615 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    { source: "s1",    target: "traj1", sourceHandle: "particle",   targetHandle: "particle"   },
    { source: "s1",    target: "ab1",   sourceHandle: "particle",   targetHandle: "particle"   },
    { source: "s1",    target: "v1",    sourceHandle: "particle",   targetHandle: "particle"   },
    { source: "ab1",   target: "v1",    sourceHandle: "bond",       targetHandle: "bond"       },
    { source: "traj1", target: "v1",    sourceHandle: "trajectory", targetHandle: "trajectory" },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 340, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "traj1",
      "type": "load_trajectory",
      "position": { "x": 0, "y": 310 },
      "fileName": "caffeine_water_vibration.xtc"
    },
    {
      "id": "ab1",
      "type": "add_bond",
      "position": { "x": 340, "y": 310 },
      "bondSource": "structure"
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 340, "y": 615 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1",    "target": "traj1", "sourceHandle": "particle",   "targetHandle": "particle"   },
    { "source": "s1",    "target": "ab1",   "sourceHandle": "particle",   "targetHandle": "particle"   },
    { "source": "s1",    "target": "v1",    "sourceHandle": "particle",   "targetHandle": "particle"   },
    { "source": "ab1",   "target": "v1",    "sourceHandle": "bond",       "targetHandle": "bond"       },
    { "source": "traj1", "target": "v1",    "sourceHandle": "trajectory", "targetHandle": "trajectory" }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 8. Per-atom vector visualization (forces / velocities)
  // ──────────────────────────────────────────────
  {
    id: "vector-arrows",
    title: "Vector Arrows",
    description:
      "Overlay per-atom vector data (forces or velocities) as arrows using load_vector and vector_overlay nodes.",
    tags: ["vector", "forces", "small-molecule"],
    snapshotUrl: "/megane/data/caffeine_water.json",
    code: {
      jupyter: `\
import megane
from megane.pipeline import (
    Pipeline, LoadStructure, AddBonds, LoadVector, VectorOverlay, Viewport,
)

pipe = Pipeline()
s      = pipe.add_node(LoadStructure("caffeine_water.pdb"))
ab     = pipe.add_node(AddBonds(source="distance"))
vec    = pipe.add_node(LoadVector("demo_vectors.vec"))
# Scale arrows to a visible length
overlay = pipe.add_node(VectorOverlay(scale=1.5))
v      = pipe.add_node(Viewport())

pipe.add_edge(s.out.particle,      ab.inp.particle)
pipe.add_edge(s.out.particle,      v.inp.particle)
pipe.add_edge(ab.out.bond,         v.inp.bond)
pipe.add_edge(vec.out.vector,      overlay.inp.vector)
pipe.add_edge(overlay.out.vector,  v.inp.vector)

viewer = megane.MolecularViewer()
viewer.set_pipeline(pipe)
viewer`,

      react: `\
import { PipelineViewer } from "megane-viewer";
import type { SerializedPipeline } from "megane-viewer";

// Note: load_vector reads per-atom vector data (JSON or .vec format).
// File loading is handled natively in Jupyter and VSCode;
// for React embedding, inject pre-loaded VectorFrame[] data via a custom hook.
const pipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "s1", type: "load_structure",
      position: { x: 340, y: 0 },
      fileName: "caffeine_water.pdb",
      fileUrl: "/path/to/caffeine_water.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: 170, y: 310 },
      bondSource: "distance",
    },
    {
      id: "vec1", type: "load_vector",
      position: { x: 510, y: 0 },
      fileName: "demo_vectors.vec",
    },
    {
      // Scale factor controls arrow length
      id: "ov1", type: "vector_overlay",
      position: { x: 510, y: 310 },
      scale: 1.5,
    },
    {
      id: "v1", type: "viewport",
      position: { x: 340, y: 615 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    { source: "s1",  target: "ab1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1",  target: "v1",  sourceHandle: "particle", targetHandle: "particle" },
    { source: "ab1", target: "v1",  sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "vec1", target: "ov1", sourceHandle: "vector",  targetHandle: "vector"   },
    { source: "ov1", target: "v1",  sourceHandle: "vector",   targetHandle: "vector"   },
  ],
};

export default function App() {
  return <PipelineViewer pipeline={pipeline} width="100%" height={500} />;
}`,

      vscode: `\
{
  "version": 3,
  "nodes": [
    {
      "id": "s1",
      "type": "load_structure",
      "position": { "x": 340, "y": 0 },
      "fileName": "caffeine_water.pdb",
      "fileUrl": "caffeine_water.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "ab1",
      "type": "add_bond",
      "position": { "x": 170, "y": 310 },
      "bondSource": "distance"
    },
    {
      "id": "vec1",
      "type": "load_vector",
      "position": { "x": 510, "y": 0 },
      "fileName": "demo_vectors.vec"
    },
    {
      "id": "ov1",
      "type": "vector_overlay",
      "position": { "x": 510, "y": 310 },
      "scale": 1.5
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 340, "y": 615 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1",   "target": "ab1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1",   "target": "v1",   "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1",  "target": "v1",   "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "vec1", "target": "ov1",  "sourceHandle": "vector",   "targetHandle": "vector"   },
    { "source": "ov1",  "target": "v1",   "sourceHandle": "vector",   "targetHandle": "vector"   }
  ]
}`,
    },
  },
];

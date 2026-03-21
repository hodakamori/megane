/**
 * Gallery registry — the single source of truth for all gallery examples.
 *
 * ─────────────────────────────────────────────────
 * HOW TO ADD A NEW EXAMPLE
 * ─────────────────────────────────────────────────
 * 1. Add a snapshot JSON to docs/public/data/  (or reuse an existing one).
 *    A snapshot can be generated with:
 *      python -c "import megane, json; v = megane.MolecularViewer(); v.load('your.pdb'); print(json.dumps(v._snapshot()))" > docs/public/data/your.json
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
  // 1. Protein structure (Crambin, 1CRN)
  // ──────────────────────────────────────────────
  {
    id: "protein-structure",
    title: "Protein Structure",
    description:
      "Load and visualize a protein from a PDB file with bond detection.",
    tags: ["protein", "pdb", "basic"],
    snapshotUrl: "/megane/data/1crn.json",
    code: {
      jupyter: `\
import megane

viewer = megane.MolecularViewer()
viewer.load("1crn.pdb")
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
      fileName: "1crn.pdb",
      fileUrl: "/path/to/1crn.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: 0, y: 150 },
      mode: "structure", distanceFactor: 1.2,
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
    { source: "s1", target: "ab1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1", target: "ab1", sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "ab1", target: "v1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "ab1", target: "v1", sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "s1",  target: "v1", sourceHandle: "cell",     targetHandle: "cell"     },
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
      "fileName": "1crn.pdb",
      "fileUrl": "1crn.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "ab1",
      "type": "add_bond",
      "position": { "x": 0, "y": 150 },
      "mode": "structure",
      "distanceFactor": 1.2
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
    { "source": "s1",  "target": "ab1", "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "ab1", "target": "v1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1", "target": "v1",  "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "s1",  "target": "v1",  "sourceHandle": "cell",     "targetHandle": "cell"     }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 2. Small molecule system (Caffeine + Water)
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

viewer = megane.MolecularViewer()
viewer.load("caffeine_water.pdb")
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
      mode: "distance", distanceFactor: 1.2,
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
    { source: "s1", target: "ab1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1", target: "ab1", sourceHandle: "cell",     targetHandle: "cell"     },
    { source: "ab1", target: "v1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "ab1", target: "v1", sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "s1",  target: "v1", sourceHandle: "cell",     targetHandle: "cell"     },
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
      "mode": "distance",
      "distanceFactor": 1.2
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
    { "source": "s1",  "target": "ab1", "sourceHandle": "cell",     "targetHandle": "cell"     },
    { "source": "ab1", "target": "v1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1", "target": "v1",  "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "s1",  "target": "v1",  "sourceHandle": "cell",     "targetHandle": "cell"     }
  ]
}`,
    },
  },

  // ──────────────────────────────────────────────
  // 3. Atom filtering (select residue subset)
  // ──────────────────────────────────────────────
  {
    id: "atom-filter",
    title: "Atom Filter",
    description:
      "Select a subset of atoms using a query expression and highlight them with a modify node.",
    tags: ["filter", "protein", "selection"],
    snapshotUrl: "/megane/data/1crn.json",
    code: {
      jupyter: `\
import megane

viewer = megane.MolecularViewer()
viewer.load("1crn.pdb")

# Select residues 1–10 via the pipeline API
viewer.pipeline.add_filter(query="resid 1-10")
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
      fileName: "1crn.pdb",
      fileUrl: "/path/to/1crn.pdb",
      hasTrajectory: false, hasCell: false,
    },
    {
      id: "ab1", type: "add_bond",
      position: { x: 0, y: 150 },
      mode: "structure", distanceFactor: 1.2,
    },
    {
      // Select residues 1–10 only
      id: "f1", type: "filter",
      position: { x: 0, y: 300 },
      query: "resid 1-10",
    },
    {
      // Make the selection stand out
      id: "m1", type: "modify",
      position: { x: 0, y: 450 },
      scale: 1.5, opacity: 1.0,
    },
    {
      id: "v1", type: "viewport",
      position: { x: 0, y: 600 },
      perspective: false,
      cellAxesVisible: false,
      pivotMarkerVisible: false,
    },
  ],
  edges: [
    { source: "s1",  target: "ab1", sourceHandle: "particle", targetHandle: "particle" },
    { source: "s1",  target: "ab1", sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "ab1", target: "f1",  sourceHandle: "particle", targetHandle: "particle" },
    { source: "ab1", target: "f1",  sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "f1",  target: "m1",  sourceHandle: "particle", targetHandle: "particle" },
    { source: "f1",  target: "m1",  sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "m1",  target: "v1",  sourceHandle: "particle", targetHandle: "particle" },
    { source: "m1",  target: "v1",  sourceHandle: "bond",     targetHandle: "bond"     },
    { source: "s1",  target: "v1",  sourceHandle: "cell",     targetHandle: "cell"     },
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
      "fileName": "1crn.pdb",
      "fileUrl": "1crn.pdb",
      "hasTrajectory": false,
      "hasCell": false
    },
    {
      "id": "ab1",
      "type": "add_bond",
      "position": { "x": 0, "y": 150 },
      "mode": "structure",
      "distanceFactor": 1.2
    },
    {
      "id": "f1",
      "type": "filter",
      "position": { "x": 0, "y": 300 },
      "query": "resid 1-10"
    },
    {
      "id": "m1",
      "type": "modify",
      "position": { "x": 0, "y": 450 },
      "scale": 1.5,
      "opacity": 1.0
    },
    {
      "id": "v1",
      "type": "viewport",
      "position": { "x": 0, "y": 600 },
      "perspective": false,
      "cellAxesVisible": false,
      "pivotMarkerVisible": false
    }
  ],
  "edges": [
    { "source": "s1",  "target": "ab1", "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "s1",  "target": "ab1", "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "ab1", "target": "f1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "ab1", "target": "f1",  "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "f1",  "target": "m1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "f1",  "target": "m1",  "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "m1",  "target": "v1",  "sourceHandle": "particle", "targetHandle": "particle" },
    { "source": "m1",  "target": "v1",  "sourceHandle": "bond",     "targetHandle": "bond"     },
    { "source": "s1",  "target": "v1",  "sourceHandle": "cell",     "targetHandle": "cell"     }
  ]
}`,
    },
  },
];

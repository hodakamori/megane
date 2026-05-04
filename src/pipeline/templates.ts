/**
 * Pipeline template definitions.
 * Each template provides a predefined pipeline configuration
 * that users can load from the Templates dropdown.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";

export interface PipelineTemplate {
  id: string;
  label: string;
  description: string;
  create: () => { nodes: Node<PipelineNodeData>[]; edges: Edge[] };
}

/**
 * Molecule template: simplified caffeine visualization.
 * LoadStructure → AddBond → Viewport
 *              → LoadTrajectory → Viewport
 */
function createMoleculeTemplate(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      {
        id: "loader-1",
        type: "load_structure",
        position: { x: 425, y: 0 },
        data: {
          params: {
            type: "load_structure",
            fileName: "caffeine_water.pdb",
            hasTrajectory: false,
            hasCell: true,
          },
          enabled: true,
        },
      },
      {
        id: "traj-1",
        type: "load_trajectory",
        position: { x: 85, y: 310 },
        data: {
          params: {
            type: "load_trajectory",
            fileName: "caffeine_water_vibration.xtc",
          },
          enabled: true,
        },
      },
      {
        id: "addbond-1",
        type: "add_bond",
        position: { x: 425, y: 310 },
        data: {
          params: {
            type: "add_bond",
            bondSource: "structure",
          },
          enabled: true,
        },
      },
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 425, y: 615 },
        data: {
          params: {
            type: "viewport",
            perspective: false,
            cellAxesVisible: true,
            pivotMarkerVisible: true,
          },
          enabled: true,
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "loader-1",
        target: "addbond-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e2",
        source: "loader-1",
        target: "traj-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e3",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e4",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "cell",
        targetHandle: "cell",
      },
      {
        id: "e5",
        source: "addbond-1",
        target: "viewport-1",
        sourceHandle: "bond",
        targetHandle: "bond",
      },
      {
        id: "e6",
        source: "traj-1",
        target: "viewport-1",
        sourceHandle: "trajectory",
        targetHandle: "trajectory",
      },
    ],
  };
}

/**
 * Solid template: perovskite SrTiO3 with coordination polyhedra.
 * LoadStructure → AddBond → Viewport
 *              → PolyhedronGenerator → Viewport
 */
function createSolidTemplate(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      {
        id: "loader-1",
        type: "load_structure",
        position: { x: 425, y: 0 },
        data: {
          params: {
            type: "load_structure",
            fileName: "perovskite_srtio3_3x3x3.xyz",
            hasTrajectory: false,
            hasCell: true,
          },
          enabled: true,
        },
      },
      {
        id: "addbond-1",
        type: "add_bond",
        position: { x: 170, y: 310 },
        data: {
          params: {
            type: "add_bond",
            bondSource: "distance",
          },
          enabled: true,
        },
      },
      {
        id: "polyhedron-1",
        type: "polyhedron_generator",
        position: { x: 680, y: 310 },
        data: {
          params: {
            type: "polyhedron_generator",
            centerElements: [22], // Ti
            ligandElements: [8], // O
            maxDistance: 2.5,
            opacity: 0.5,
            showEdges: false,
            edgeColor: "#dddddd",
            edgeWidth: 3,
          },
          enabled: true,
        },
      },
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 425, y: 615 },
        data: {
          params: {
            type: "viewport",
            perspective: false,
            cellAxesVisible: true,
            pivotMarkerVisible: true,
          },
          enabled: true,
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "loader-1",
        target: "addbond-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e2",
        source: "loader-1",
        target: "polyhedron-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e3",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e4",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "cell",
        targetHandle: "cell",
      },
      {
        id: "e5",
        source: "addbond-1",
        target: "viewport-1",
        sourceHandle: "bond",
        targetHandle: "bond",
      },
      {
        id: "e6",
        source: "polyhedron-1",
        target: "viewport-1",
        sourceHandle: "mesh",
        targetHandle: "mesh",
      },
    ],
  };
}

/**
 * Streaming template: WebSocket streaming with bonds and trajectory.
 * Streaming → Viewport (particle, bond, trajectory, cell)
 */
function createStreamingTemplate(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      {
        id: "streaming-1",
        type: "streaming",
        position: { x: 425, y: 0 },
        data: {
          params: {
            type: "streaming",
            connected: false,
          },
          enabled: true,
        },
      },
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 425, y: 310 },
        data: {
          params: {
            type: "viewport",
            perspective: false,
            cellAxesVisible: true,
            pivotMarkerVisible: true,
          },
          enabled: true,
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "streaming-1",
        target: "viewport-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e2",
        source: "streaming-1",
        target: "viewport-1",
        sourceHandle: "bond",
        targetHandle: "bond",
      },
      {
        id: "e3",
        source: "streaming-1",
        target: "viewport-1",
        sourceHandle: "trajectory",
        targetHandle: "trajectory",
      },
      {
        id: "e4",
        source: "streaming-1",
        target: "viewport-1",
        sourceHandle: "cell",
        targetHandle: "cell",
      },
    ],
  };
}

/**
 * Protein template: ubiquitin (1UBQ) as a ribbon with semi-transparent
 * all-atom water.
 *
 *   LoadStructure ─┬─ Filter(resname != "HOH") → Modify(opacity 0)   → Representation(both) ─┐
 *                  ├─ Filter(resname == "HOH") → Modify(opacity 0.5) ───────────────────────┤
 *                  └────────────────────────── cell ─────────────────────────────────────────┴─→ Viewport
 *
 * Protein atoms are hidden (opacity 0) so only the cartoon ribbon shows;
 * water atoms render as translucent spheres because they have no Cα and
 * therefore inherit no ribbon. Representation "both" makes the global
 * viewport mode draw atoms + cartoon, which is what each branch needs.
 */
function createProteinTemplate(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      {
        id: "loader-1",
        type: "load_structure",
        position: { x: 425, y: 0 },
        data: {
          params: {
            type: "load_structure",
            fileName: "1ubq.pdb",
            hasTrajectory: false,
            hasCell: true,
          },
          enabled: true,
        },
      },
      {
        id: "protein-filter",
        type: "filter",
        position: { x: 170, y: 200 },
        data: {
          params: {
            type: "filter",
            query: 'resname != "HOH"',
          },
          enabled: true,
        },
      },
      {
        id: "protein-modify",
        type: "modify",
        position: { x: 170, y: 360 },
        data: {
          params: {
            type: "modify",
            scale: 1,
            opacity: 0,
          },
          enabled: true,
        },
      },
      {
        id: "protein-rep",
        type: "representation",
        position: { x: 170, y: 520 },
        data: {
          params: {
            type: "representation",
            mode: "both",
          },
          enabled: true,
        },
      },
      {
        id: "water-filter",
        type: "filter",
        position: { x: 680, y: 200 },
        data: {
          params: {
            type: "filter",
            query: 'resname == "HOH"',
          },
          enabled: true,
        },
      },
      {
        id: "water-modify",
        type: "modify",
        position: { x: 680, y: 360 },
        data: {
          params: {
            type: "modify",
            scale: 1,
            opacity: 0.5,
          },
          enabled: true,
        },
      },
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 425, y: 700 },
        data: {
          params: {
            type: "viewport",
            perspective: false,
            cellAxesVisible: true,
            pivotMarkerVisible: true,
          },
          enabled: true,
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "loader-1",
        target: "protein-filter",
        sourceHandle: "particle",
        targetHandle: "in",
      },
      {
        id: "e2",
        source: "protein-filter",
        target: "protein-modify",
        sourceHandle: "out",
        targetHandle: "in",
      },
      {
        id: "e3",
        source: "protein-modify",
        target: "protein-rep",
        sourceHandle: "out",
        targetHandle: "in",
      },
      {
        id: "e4",
        source: "protein-rep",
        target: "viewport-1",
        sourceHandle: "out",
        targetHandle: "particle",
      },
      {
        id: "e5",
        source: "loader-1",
        target: "water-filter",
        sourceHandle: "particle",
        targetHandle: "in",
      },
      {
        id: "e6",
        source: "water-filter",
        target: "water-modify",
        sourceHandle: "out",
        targetHandle: "in",
      },
      {
        id: "e7",
        source: "water-modify",
        target: "viewport-1",
        sourceHandle: "out",
        targetHandle: "particle",
      },
      {
        id: "e8",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "cell",
        targetHandle: "cell",
      },
    ],
  };
}

export const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  {
    id: "molecule",
    label: "Molecule",
    description: "Caffeine with bonds and trajectory",
    create: createMoleculeTemplate,
  },
  {
    id: "solid",
    label: "Solid",
    description: "Perovskite with coordination polyhedra",
    create: createSolidTemplate,
  },
  {
    id: "protein",
    label: "Protein",
    description: "Ubiquitin ribbon with semi-transparent water",
    create: createProteinTemplate,
  },
  {
    id: "streaming",
    label: "Streaming",
    description: "WebSocket streaming with bonds",
    create: createStreamingTemplate,
  },
];

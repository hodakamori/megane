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
          },
          enabled: true,
        },
      },
    ],
    edges: [
      { id: "e1", source: "loader-1", target: "addbond-1", sourceHandle: "particle", targetHandle: "particle" },
      { id: "e2", source: "loader-1", target: "traj-1", sourceHandle: "particle", targetHandle: "particle" },
      { id: "e3", source: "loader-1", target: "viewport-1", sourceHandle: "particle", targetHandle: "particle" },
      { id: "e4", source: "loader-1", target: "viewport-1", sourceHandle: "cell", targetHandle: "cell" },
      { id: "e5", source: "addbond-1", target: "viewport-1", sourceHandle: "bond", targetHandle: "bond" },
      { id: "e6", source: "traj-1", target: "viewport-1", sourceHandle: "trajectory", targetHandle: "trajectory" },
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
            centerElements: [22],   // Ti
            ligandElements: [8],    // O
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
          },
          enabled: true,
        },
      },
    ],
    edges: [
      { id: "e1", source: "loader-1", target: "addbond-1", sourceHandle: "particle", targetHandle: "particle" },
      { id: "e2", source: "loader-1", target: "polyhedron-1", sourceHandle: "particle", targetHandle: "particle" },
      { id: "e3", source: "loader-1", target: "viewport-1", sourceHandle: "particle", targetHandle: "particle" },
      { id: "e4", source: "loader-1", target: "viewport-1", sourceHandle: "cell", targetHandle: "cell" },
      { id: "e5", source: "addbond-1", target: "viewport-1", sourceHandle: "bond", targetHandle: "bond" },
      { id: "e6", source: "polyhedron-1", target: "viewport-1", sourceHandle: "mesh", targetHandle: "mesh" },
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
          },
          enabled: true,
        },
      },
    ],
    edges: [
      { id: "e1", source: "streaming-1", target: "viewport-1", sourceHandle: "particle", targetHandle: "particle" },
      { id: "e2", source: "streaming-1", target: "viewport-1", sourceHandle: "bond", targetHandle: "bond" },
      { id: "e3", source: "streaming-1", target: "viewport-1", sourceHandle: "trajectory", targetHandle: "trajectory" },
      { id: "e4", source: "streaming-1", target: "viewport-1", sourceHandle: "cell", targetHandle: "cell" },
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
    id: "streaming",
    label: "Streaming",
    description: "WebSocket streaming with bonds",
    create: createStreamingTemplate,
  },
];

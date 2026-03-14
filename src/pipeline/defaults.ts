/**
 * Default pipeline configuration.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";

/**
 * Create the default pipeline: caffeine + semi-transparent water solvent.
 * LoadStructure → Filter(caffeine) → Modify(scale) → Viewport
 *              → Filter(water) → Modify(opacity) → Viewport
 *              → AddBond → Viewport
 *              → LoadTrajectory → Viewport
 * Filter(caffeine) → LabelGenerator(element) → Viewport
 */
export function createDefaultPipeline(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      // Row 0: Source
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
      // Row 1: Data loading & filtering
      {
        id: "traj-1",
        type: "load_trajectory",
        position: { x: -85, y: 310 },
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
        position: { x: 255, y: 310 },
        data: {
          params: {
            type: "add_bond",
            bondSource: "structure",
          },
          enabled: true,
        },
      },
      {
        id: "filter-caf",
        type: "filter",
        position: { x: 595, y: 310 },
        data: {
          params: {
            type: "filter",
            query: "index < 24",
          },
          enabled: true,
        },
      },
      {
        id: "filter-sol",
        type: "filter",
        position: { x: 935, y: 310 },
        data: {
          params: {
            type: "filter",
            query: "index >= 24",
          },
          enabled: true,
        },
      },
      // Row 2: Processing (labels, modify)
      {
        id: "labels-1",
        type: "label_generator",
        position: { x: 425, y: 615 },
        data: {
          params: {
            type: "label_generator",
            source: "element",
          },
          enabled: true,
        },
      },
      {
        id: "modify-caf",
        type: "modify",
        position: { x: 680, y: 615 },
        data: {
          params: {
            type: "modify",
            scale: 1.3,
            opacity: 1.0,
          },
          enabled: true,
        },
      },
      {
        id: "modify-sol",
        type: "modify",
        position: { x: 970, y: 615 },
        data: {
          params: {
            type: "modify",
            scale: 1.0,
            opacity: 0.15,
          },
          enabled: true,
        },
      },
      // Row 3: Sink
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 510, y: 920 },
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
      {
        id: "e1",
        source: "loader-1",
        target: "filter-caf",
        sourceHandle: "particle",
        targetHandle: "in",
      },
      {
        id: "e2",
        source: "loader-1",
        target: "filter-sol",
        sourceHandle: "particle",
        targetHandle: "in",
      },
      {
        id: "e3",
        source: "filter-caf",
        target: "modify-caf",
        sourceHandle: "out",
        targetHandle: "in",
      },
      {
        id: "e4",
        source: "filter-sol",
        target: "modify-sol",
        sourceHandle: "out",
        targetHandle: "in",
      },
      {
        id: "e5",
        source: "modify-sol",
        target: "viewport-1",
        sourceHandle: "out",
        targetHandle: "particle",
      },
      {
        id: "e6",
        source: "loader-1",
        target: "addbond-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e7",
        source: "addbond-1",
        target: "viewport-1",
        sourceHandle: "bond",
        targetHandle: "bond",
      },
      {
        id: "e8",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "cell",
        targetHandle: "cell",
      },
      {
        id: "e9",
        source: "loader-1",
        target: "traj-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e10",
        source: "traj-1",
        target: "viewport-1",
        sourceHandle: "trajectory",
        targetHandle: "trajectory",
      },
      {
        id: "e11",
        source: "modify-caf",
        target: "viewport-1",
        sourceHandle: "out",
        targetHandle: "particle",
      },
      {
        id: "e12",
        source: "filter-caf",
        target: "labels-1",
        sourceHandle: "out",
        targetHandle: "particle",
      },
      {
        id: "e13",
        source: "labels-1",
        target: "viewport-1",
        sourceHandle: "label",
        targetHandle: "label",
      },
    ],
  };
}

/**
 * Create a basic pipeline with LoadStructure → AddBond → Viewport.
 * Used as the default in the VSCode extension where files are loaded externally.
 * The LoadStructure node reads from the pipeline store's snapshot (set by the
 * webview after parsing), so the molecule renders with bonds automatically.
 */
export function createEmptyPipeline(): {
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
            fileName: "",
            hasTrajectory: false,
            hasCell: false,
          },
          enabled: true,
        },
      },
      {
        id: "addbond-1",
        type: "add_bond",
        position: { x: 425, y: 255 },
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
        position: { x: 425, y: 510 },
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
      {
        id: "e1",
        source: "loader-1",
        target: "addbond-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e2",
        source: "addbond-1",
        target: "viewport-1",
        sourceHandle: "bond",
        targetHandle: "bond",
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
    ],
  };
}

/**
 * Create a demo pipeline showcasing filter and modify nodes.
 */
export function createDemoPipeline(): {
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
            fileName: "protein.pdb",
            hasTrajectory: false,
            hasCell: false,
          },
          enabled: true,
        },
      },
      {
        id: "addbond-1",
        type: "add_bond",
        position: { x: 425, y: 255 },
        data: {
          params: {
            type: "add_bond",
            bondSource: "structure",
          },
          enabled: true,
        },
      },
      {
        id: "filter-1",
        type: "filter",
        position: { x: 85, y: 425 },
        data: {
          params: {
            type: "filter",
            query: 'element == "C"',
          },
          enabled: true,
        },
      },
      {
        id: "modify-1",
        type: "modify",
        position: { x: 85, y: 765 },
        data: {
          params: {
            type: "modify",
            scale: 1.5,
            opacity: 0.8,
          },
          enabled: true,
        },
      },
      {
        id: "filter-2",
        type: "filter",
        position: { x: 765, y: 425 },
        data: {
          params: {
            type: "filter",
            query: 'element == "N"',
          },
          enabled: true,
        },
      },
      {
        id: "modify-2",
        type: "modify",
        position: { x: 765, y: 765 },
        data: {
          params: {
            type: "modify",
            scale: 0.5,
            opacity: 0.6,
          },
          enabled: true,
        },
      },
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 425, y: 1190 },
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
      {
        id: "e1",
        source: "loader-1",
        target: "filter-1",
        sourceHandle: "particle",
        targetHandle: "in",
      },
      { id: "e2", source: "filter-1", target: "modify-1", sourceHandle: "out", targetHandle: "in" },
      {
        id: "e3",
        source: "loader-1",
        target: "filter-2",
        sourceHandle: "particle",
        targetHandle: "in",
      },
      { id: "e4", source: "filter-2", target: "modify-2", sourceHandle: "out", targetHandle: "in" },
      {
        id: "e5",
        source: "modify-1",
        target: "viewport-1",
        sourceHandle: "out",
        targetHandle: "particle",
      },
      {
        id: "e6",
        source: "modify-2",
        target: "viewport-1",
        sourceHandle: "out",
        targetHandle: "particle",
      },
      {
        id: "e7",
        source: "loader-1",
        target: "addbond-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e8",
        source: "addbond-1",
        target: "viewport-1",
        sourceHandle: "bond",
        targetHandle: "bond",
      },
    ],
  };
}

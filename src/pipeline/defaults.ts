/**
 * Default pipeline configuration.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";

/** Create the default pipeline: DataLoader → Viewport with typed edges. */
export function createDefaultPipeline(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      {
        id: "loader-1",
        type: "data_loader",
        position: { x: 250, y: 50 },
        data: {
          params: {
            type: "data_loader",
            fileName: null,
            bondSource: "structure",
          },
          enabled: true,
        },
      },
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 250, y: 400 },
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
        id: "e-loader-1-particle-viewport-1-particle",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "particle",
        targetHandle: "particle",
      },
      {
        id: "e-loader-1-bond-viewport-1-bond",
        source: "loader-1",
        target: "viewport-1",
        sourceHandle: "bond",
        targetHandle: "bond",
      },
      {
        id: "e-loader-1-cell-viewport-1-cell",
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
        type: "data_loader",
        position: { x: 250, y: 0 },
        data: {
          params: {
            type: "data_loader",
            fileName: "protein.pdb",
            bondSource: "structure",
          },
          enabled: true,
        },
      },
      {
        id: "filter-1",
        type: "filter",
        position: { x: 50, y: 250 },
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
        position: { x: 50, y: 450 },
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
        position: { x: 450, y: 250 },
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
        position: { x: 450, y: 450 },
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
        position: { x: 250, y: 700 },
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
      { id: "e1", source: "loader-1", target: "filter-1", sourceHandle: "particle", targetHandle: "in" },
      { id: "e2", source: "filter-1", target: "modify-1", sourceHandle: "out", targetHandle: "in" },
      { id: "e3", source: "loader-1", target: "filter-2", sourceHandle: "particle", targetHandle: "in" },
      { id: "e4", source: "filter-2", target: "modify-2", sourceHandle: "out", targetHandle: "in" },
      { id: "e5", source: "modify-1", target: "viewport-1", sourceHandle: "out", targetHandle: "particle" },
      { id: "e6", source: "modify-2", target: "viewport-1", sourceHandle: "out", targetHandle: "particle" },
      { id: "e7", source: "loader-1", target: "viewport-1", sourceHandle: "bond", targetHandle: "bond" },
      { id: "e8", source: "loader-1", target: "viewport-1", sourceHandle: "cell", targetHandle: "cell" },
    ],
  };
}

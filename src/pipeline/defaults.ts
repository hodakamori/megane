/**
 * Default pipeline configuration.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";

/**
 * Create the default pipeline: caffeine + semi-transparent water solvent.
 * DataLoader → Filter(caffeine) + Filter(water) → Modify(opacity) → Viewport
 */
export function createDefaultPipeline(): {
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
            fileName: "caffeine_water.pdb",
            bondSource: "structure",
          },
          enabled: true,
        },
      },
      {
        id: "filter-caf",
        type: "filter",
        position: { x: 50, y: 180 },
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
        position: { x: 450, y: 180 },
        data: {
          params: {
            type: "filter",
            query: "index >= 24",
          },
          enabled: true,
        },
      },
      {
        id: "modify-sol",
        type: "modify",
        position: { x: 450, y: 340 },
        data: {
          params: {
            type: "modify",
            scale: 1.0,
            opacity: 0.15,
          },
          enabled: true,
        },
      },
      {
        id: "viewport-1",
        type: "viewport",
        position: { x: 250, y: 500 },
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
      { id: "e1", source: "loader-1", target: "filter-caf", sourceHandle: "particle", targetHandle: "in" },
      { id: "e2", source: "loader-1", target: "filter-sol", sourceHandle: "particle", targetHandle: "in" },
      { id: "e3", source: "filter-caf", target: "viewport-1", sourceHandle: "out", targetHandle: "particle" },
      { id: "e4", source: "filter-sol", target: "modify-sol", sourceHandle: "out", targetHandle: "in" },
      { id: "e5", source: "modify-sol", target: "viewport-1", sourceHandle: "out", targetHandle: "particle" },
      { id: "e6", source: "loader-1", target: "viewport-1", sourceHandle: "bond", targetHandle: "bond" },
      { id: "e7", source: "loader-1", target: "viewport-1", sourceHandle: "cell", targetHandle: "cell" },
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

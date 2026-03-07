/**
 * Default pipeline configuration.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";

/** Create the default pipeline with a single LoadStructure node. */
export function createDefaultPipeline(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      {
        id: "load-1",
        type: "load_structure",
        position: { x: 250, y: 50 },
        data: {
          params: {
            type: "load_structure",
            fileName: null,
            bondSource: "structure",
            trajectorySource: "structure",
          },
          enabled: true,
        },
      },
    ],
    edges: [],
  };
}

/**
 * Create a demo pipeline showcasing selection and atom modifications.
 * Used for screenshots and documentation.
 */
export function createDemoPipeline(): {
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
} {
  return {
    nodes: [
      {
        id: "load-1",
        type: "load_structure",
        position: { x: 250, y: 0 },
        data: {
          params: {
            type: "load_structure",
            fileName: "protein.pdb",
            bondSource: "structure",
            trajectorySource: "structure",
          },
          enabled: true,
        },
      },
      {
        id: "sel-1",
        type: "selection",
        position: { x: 50, y: 250 },
        data: {
          params: {
            type: "selection",
            query: 'element == "C"',
          },
          enabled: true,
        },
      },
      {
        id: "atom-1",
        type: "set_atom",
        position: { x: 50, y: 450 },
        data: {
          params: {
            type: "set_atom",
            scale: 1.5,
            opacity: 0.8,
          },
          enabled: true,
        },
      },
      {
        id: "sel-2",
        type: "selection",
        position: { x: 450, y: 250 },
        data: {
          params: {
            type: "selection",
            query: 'element == "N"',
          },
          enabled: true,
        },
      },
      {
        id: "atom-2",
        type: "set_atom",
        position: { x: 450, y: 450 },
        data: {
          params: {
            type: "set_atom",
            scale: 0.5,
            opacity: 0.6,
          },
          enabled: true,
        },
      },
      {
        id: "bond-1",
        type: "set_bond",
        position: { x: 250, y: 650 },
        data: {
          params: {
            type: "set_bond",
            scale: 1.2,
            opacity: 1.0,
          },
          enabled: true,
        },
      },
      {
        id: "display-1",
        type: "set_display",
        position: { x: 250, y: 850 },
        data: {
          params: {
            type: "set_display",
            perspective: false,
            cellAxesVisible: true,
          },
          enabled: true,
        },
      },
    ],
    edges: [
      { id: "e-load-1-sel-1", source: "load-1", target: "sel-1" },
      { id: "e-sel-1-atom-1", source: "sel-1", target: "atom-1" },
      { id: "e-load-1-sel-2", source: "load-1", target: "sel-2" },
      { id: "e-sel-2-atom-2", source: "sel-2", target: "atom-2" },
      { id: "e-atom-1-bond-1", source: "atom-1", target: "bond-1" },
      { id: "e-atom-2-bond-1", source: "atom-2", target: "bond-1" },
      { id: "e-bond-1-display-1", source: "bond-1", target: "display-1" },
    ],
  };
}

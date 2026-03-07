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

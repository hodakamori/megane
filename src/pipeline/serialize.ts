/**
 * Pipeline serialization / deserialization.
 * Converts between xyflow nodes/edges and the JSON format (version 2).
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";
import type { SerializedPipeline, PipelineNodeType } from "./types";
import { defaultParams } from "./types";

const VALID_NODE_TYPES: Set<string> = new Set([
  "load_structure",
  "load_trajectory",
  "add_bond",
  "viewport",
  "filter",
  "modify",
  "label_generator",
  "polyhedron_generator",
]);

/**
 * Serialize xyflow nodes and edges into the portable JSON format.
 */
export function serializePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
): SerializedPipeline {
  return {
    version: 3,
    nodes: nodes.map((n) => ({
      ...n.data.params,
      id: n.id,
      position: n.position,
      enabled: n.data.enabled,
    })),
    edges: edges.map((e) => ({
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle ?? "",
      targetHandle: e.targetHandle ?? "",
    })),
  };
}

/**
 * Deserialize the portable JSON format into xyflow nodes and edges.
 */
export function deserializePipeline(
  json: SerializedPipeline,
): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  if (json.version !== 3) {
    throw new Error(`Unsupported pipeline version: ${json.version}`);
  }

  const nodes: Node<PipelineNodeData>[] = json.nodes.map((serialized) => {
    if (!VALID_NODE_TYPES.has(serialized.type)) {
      throw new Error(`Unknown node type: ${serialized.type}`);
    }
    const nodeType = serialized.type as PipelineNodeType;
    const defaults = defaultParams(nodeType);
    const { id, position, enabled, ...paramFields } = serialized;
    const params = { ...defaults, ...paramFields, type: nodeType } as typeof defaults;

    return {
      id,
      type: nodeType,
      position: position ?? { x: 0, y: 0 },
      data: {
        params,
        enabled: enabled !== false,
      },
    };
  });

  const edges: Edge[] = (json.edges ?? []).map((e, i) => ({
    id: `e-${e.source}-${e.sourceHandle}-${e.target}-${e.targetHandle}-${i}`,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle || null,
    targetHandle: e.targetHandle || null,
  }));

  return { nodes, edges };
}

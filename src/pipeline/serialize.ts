/**
 * Pipeline serialization / deserialization.
 * Converts between xyflow nodes/edges and the JSON format used for
 * LLM generation and import/export.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";
import type { SerializedPipeline, PipelineNodeType } from "./types";
import { defaultParams } from "./types";

const VALID_NODE_TYPES: Set<string> = new Set([
  "load_structure",
  "set_atom_scale",
  "set_atom_opacity",
  "set_bond_source",
  "set_bond_scale",
  "set_bond_opacity",
  "set_labels",
  "set_vectors",
  "set_display",
  "set_cell_visibility",
]);

/**
 * Serialize xyflow nodes and edges into the portable JSON format.
 */
export function serializePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
): SerializedPipeline {
  return {
    version: 1,
    nodes: nodes.map((n) => ({
      ...n.data.params,
      id: n.id,
      position: n.position,
      enabled: n.data.enabled,
    })),
    edges: edges.map((e) => ({
      source: e.source,
      target: e.target,
    })),
  };
}

/**
 * Deserialize the portable JSON format into xyflow nodes and edges.
 * Validates node types and fills in missing parameters with defaults.
 */
export function deserializePipeline(
  json: SerializedPipeline,
): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  if (json.version !== 1) {
    throw new Error(`Unsupported pipeline version: ${json.version}`);
  }

  const nodes: Node<PipelineNodeData>[] = json.nodes.map((serialized) => {
    if (!VALID_NODE_TYPES.has(serialized.type)) {
      throw new Error(`Unknown node type: ${serialized.type}`);
    }
    const nodeType = serialized.type as PipelineNodeType;
    const defaults = defaultParams(nodeType);
    // Merge serialized params over defaults (excluding id/position/enabled)
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
    id: `e-${e.source}-${e.target}-${i}`,
    source: e.source,
    target: e.target,
  }));

  return { nodes, edges };
}

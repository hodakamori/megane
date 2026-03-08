/**
 * Graph utilities for the pipeline execution engine.
 * Topological sort and input collection.
 */

import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";
import type { PipelineData } from "./types";

// ─── Topological Sort ─────────────────────────────────────────────────

export function topologicalSort(nodes: Node<PipelineNodeData>[], edges: Edge[]): string[] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    const prev = inDegree.get(edge.target) ?? 0;
    inDegree.set(edge.target, prev + 1);
    adjacency.get(edge.source)?.push(edge.target);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const next of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(next) ?? 1) - 1;
      inDegree.set(next, newDeg);
      if (newDeg === 0) queue.push(next);
    }
  }

  return sorted;
}

// ─── Edge Data Map ────────────────────────────────────────────────────

/**
 * edgeOutputs[sourceNodeId][sourceHandle] = PipelineData
 * Multiple data can arrive at the same target port from different sources.
 */
export type EdgeOutputs = Map<string, Map<string, PipelineData>>;

export function collectInputs(
  nodeId: string,
  edges: Edge[],
  edgeOutputs: EdgeOutputs,
): Map<string, PipelineData[]> {
  const inputs = new Map<string, PipelineData[]>();
  for (const edge of edges) {
    if (edge.target !== nodeId) continue;
    const sourceHandle = edge.sourceHandle;
    const targetHandle = edge.targetHandle;
    if (!sourceHandle || !targetHandle) continue;

    const sourceOutputs = edgeOutputs.get(edge.source);
    if (!sourceOutputs) continue;
    const data = sourceOutputs.get(sourceHandle);
    if (!data) continue;

    if (!inputs.has(targetHandle)) {
      inputs.set(targetHandle, []);
    }
    inputs.get(targetHandle)!.push(data);
  }
  return inputs;
}

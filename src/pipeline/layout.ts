/**
 * Auto-layout utility for pipeline DAG using dagre (Sugiyama algorithm).
 * Computes layered node positions optimized for top-to-bottom data flow.
 * Constrains layout to at most MAX_COLS nodes per rank row for a narrow,
 * vertically-oriented result that fits the pipeline panel.
 */

import type { Node, Edge } from "@xyflow/react";
import Dagre from "@dagrejs/dagre";

const NODE_WIDTH = 380;
const NODE_HEIGHT = 280;
const HORIZONTAL_GAP = 30;
const VERTICAL_GAP = 80;
const MAX_COLS = 2;

export function getLayoutedElements<T extends Node>(
  nodes: T[],
  edges: Edge[],
): { nodes: T[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes, edges };

  // Use dagre to assign ranks (layers) based on DAG topology
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 30, ranksep: 80 });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  Dagre.layout(g);

  // Group nodes by dagre-assigned rank (y coordinate rounded to avoid float drift)
  const rankMap = new Map<number, string[]>();
  for (const node of nodes) {
    const dagreNode = g.node(node.id);
    const rankKey = Math.round(dagreNode.y);
    if (!rankMap.has(rankKey)) rankMap.set(rankKey, []);
    rankMap.get(rankKey)!.push(node.id);
  }

  // Sort ranks top-to-bottom, then within each rank keep dagre's x order
  const sortedRanks = [...rankMap.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, ids]) =>
      ids.sort((a, b) => g.node(a).x - g.node(b).x),
    );

  // Place nodes row by row, wrapping ranks wider than MAX_COLS into sub-rows
  const positionMap = new Map<string, { x: number; y: number }>();
  let currentY = 0;

  for (const rankIds of sortedRanks) {
    // Split into chunks of MAX_COLS
    for (let i = 0; i < rankIds.length; i += MAX_COLS) {
      const chunk = rankIds.slice(i, i + MAX_COLS);
      const totalWidth =
        chunk.length * NODE_WIDTH + (chunk.length - 1) * HORIZONTAL_GAP;
      const startX = -totalWidth / 2;

      for (let j = 0; j < chunk.length; j++) {
        positionMap.set(chunk[j], {
          x: startX + j * (NODE_WIDTH + HORIZONTAL_GAP),
          y: currentY,
        });
      }

      currentY += NODE_HEIGHT + VERTICAL_GAP;
    }
  }

  const layoutedNodes: T[] = nodes.map((node) => ({
    ...node,
    position: positionMap.get(node.id) ?? node.position,
  }));

  return { nodes: layoutedNodes, edges };
}

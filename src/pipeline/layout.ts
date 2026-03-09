/**
 * Auto-layout utility for pipeline DAG using dagre (Sugiyama algorithm).
 * Computes layered node positions optimized for top-to-bottom data flow.
 */

import type { Node, Edge } from "@xyflow/react";
import Dagre from "@dagrejs/dagre";

const NODE_WIDTH = 380;
const NODE_HEIGHT = 280;

export function getLayoutedElements<T extends Node>(
  nodes: T[],
  edges: Edge[],
): { nodes: T[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes, edges };

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "TB",
    nodesep: 30,
    ranksep: 120,
    marginx: 40,
    marginy: 40,
  });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  Dagre.layout(g);

  const layoutedNodes: T[] = nodes.map((node) => ({
    ...node,
    position: {
      x: g.node(node.id).x - NODE_WIDTH / 2,
      y: g.node(node.id).y - NODE_HEIGHT / 2,
    },
  }));

  return { nodes: layoutedNodes, edges };
}

import { describe, it, expect } from "vitest";
import { getLayoutedElements } from "@/pipeline/layout";
import type { Node, Edge } from "@xyflow/react";

function makeNode(id: string): Node {
  return { id, type: "default", position: { x: 0, y: 0 }, data: {} };
}

function makeEdge(source: string, target: string): Edge {
  return { id: `e-${source}-${target}`, source, target };
}

describe("getLayoutedElements", () => {
  it("returns empty arrays for empty input", () => {
    const { nodes, edges } = getLayoutedElements([], []);
    expect(nodes).toEqual([]);
    expect(edges).toEqual([]);
  });

  it("positions a single node", () => {
    const nodes = [makeNode("a")];
    const result = getLayoutedElements(nodes, []);
    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0].position).toBeDefined();
    expect(typeof result.nodes[0].position.x).toBe("number");
    expect(typeof result.nodes[0].position.y).toBe("number");
  });

  it("lays out a linear chain top-to-bottom", () => {
    const nodes = [makeNode("a"), makeNode("b"), makeNode("c")];
    const edges = [makeEdge("a", "b"), makeEdge("b", "c")];
    const result = getLayoutedElements(nodes, edges);

    const posA = result.nodes.find((n) => n.id === "a")!.position;
    const posB = result.nodes.find((n) => n.id === "b")!.position;
    const posC = result.nodes.find((n) => n.id === "c")!.position;

    // Each subsequent node should be below the previous
    expect(posB.y).toBeGreaterThan(posA.y);
    expect(posC.y).toBeGreaterThan(posB.y);
  });

  it("places branching nodes side by side", () => {
    const nodes = [makeNode("root"), makeNode("left"), makeNode("right")];
    const edges = [makeEdge("root", "left"), makeEdge("root", "right")];
    const result = getLayoutedElements(nodes, edges);

    const posLeft = result.nodes.find((n) => n.id === "left")!.position;
    const posRight = result.nodes.find((n) => n.id === "right")!.position;

    // Both children at same y level, different x
    expect(posLeft.y).toBe(posRight.y);
    expect(posLeft.x).not.toBe(posRight.x);
  });

  it("preserves edges unchanged", () => {
    const nodes = [makeNode("a"), makeNode("b")];
    const edges = [makeEdge("a", "b")];
    const result = getLayoutedElements(nodes, edges);
    expect(result.edges).toEqual(edges);
  });

  it("no two nodes overlap", () => {
    const nodes = [makeNode("a"), makeNode("b"), makeNode("c"), makeNode("d")];
    const edges = [makeEdge("a", "b"), makeEdge("a", "c"), makeEdge("b", "d")];
    const result = getLayoutedElements(nodes, edges);

    for (let i = 0; i < result.nodes.length; i++) {
      for (let j = i + 1; j < result.nodes.length; j++) {
        const a = result.nodes[i].position;
        const b = result.nodes[j].position;
        const samePosition = a.x === b.x && a.y === b.y;
        expect(samePosition, `nodes ${result.nodes[i].id} and ${result.nodes[j].id} overlap`).toBe(false);
      }
    }
  });
});

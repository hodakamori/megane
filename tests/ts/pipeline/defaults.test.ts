import { describe, it, expect } from "vitest";
import {
  createDefaultPipeline,
  createEmptyPipeline,
  createDemoPipeline,
} from "@/pipeline/defaults";

// ─── Helpers ─────────────────────────────────────────────────────────

/** Check that every edge references existing node IDs. */
function assertEdgesValid(
  nodes: { id: string }[],
  edges: { source: string; target: string }[],
) {
  const ids = new Set(nodes.map((n) => n.id));
  for (const e of edges) {
    expect(ids.has(e.source), `edge source "${e.source}" not in nodes`).toBe(true);
    expect(ids.has(e.target), `edge target "${e.target}" not in nodes`).toBe(true);
  }
}

// ─── Tests ───────────────────────────────────────────────────────────

describe("createDefaultPipeline", () => {
  it("returns nodes and edges", () => {
    const { nodes, edges } = createDefaultPipeline();
    expect(nodes.length).toBeGreaterThan(0);
    expect(edges.length).toBeGreaterThan(0);
  });

  it("contains a load_structure and viewport node", () => {
    const { nodes } = createDefaultPipeline();
    expect(nodes.some((n) => n.type === "load_structure")).toBe(true);
    expect(nodes.some((n) => n.type === "viewport")).toBe(true);
  });

  it("all edges reference valid node IDs", () => {
    const { nodes, edges } = createDefaultPipeline();
    assertEdgesValid(nodes, edges);
  });

  it("has no duplicate node IDs", () => {
    const { nodes } = createDefaultPipeline();
    const ids = nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("createEmptyPipeline", () => {
  it("returns 3 nodes: LoadStructure, AddBond, Viewport", () => {
    const { nodes } = createEmptyPipeline();
    expect(nodes.length).toBe(3);
    expect(nodes[0].type).toBe("load_structure");
    expect(nodes[1].type).toBe("add_bond");
    expect(nodes[2].type).toBe("viewport");
  });

  it("all edges reference valid node IDs", () => {
    const { nodes, edges } = createEmptyPipeline();
    assertEdgesValid(nodes, edges);
  });

  it("has edges connecting the chain", () => {
    const { edges } = createEmptyPipeline();
    expect(edges.length).toBeGreaterThanOrEqual(2);
  });
});

describe("createDemoPipeline", () => {
  it("contains filter and modify nodes", () => {
    const { nodes } = createDemoPipeline();
    expect(nodes.some((n) => n.type === "filter")).toBe(true);
    expect(nodes.some((n) => n.type === "modify")).toBe(true);
  });

  it("all edges reference valid node IDs", () => {
    const { nodes, edges } = createDemoPipeline();
    assertEdgesValid(nodes, edges);
  });

  it("all nodes are enabled", () => {
    const { nodes } = createDemoPipeline();
    for (const node of nodes) {
      expect(node.data.enabled).toBe(true);
    }
  });
});

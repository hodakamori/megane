import { describe, it, expect } from "vitest";
import { topologicalSort, collectInputs } from "@/pipeline/graph";
import type { EdgeOutputs } from "@/pipeline/graph";
import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "@/pipeline/execute";
import type { ParticleData } from "@/pipeline/types";

// ─── Helpers ─────────────────────────────────────────────────────────

function makeNode(id: string): Node<PipelineNodeData> {
  return {
    id,
    type: "filter",
    position: { x: 0, y: 0 },
    data: {
      params: { type: "filter", query: "" } as any,
      enabled: true,
    },
  };
}

function makeEdge(
  source: string,
  target: string,
  sourceHandle = "out",
  targetHandle = "in",
): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    sourceHandle,
    targetHandle,
  };
}

// ─── topologicalSort ─────────────────────────────────────────────────

describe("topologicalSort", () => {
  it("returns single node", () => {
    const nodes = [makeNode("a")];
    const result = topologicalSort(nodes, []);
    expect(result).toEqual(["a"]);
  });

  it("sorts a linear chain A→B→C", () => {
    const nodes = [makeNode("a"), makeNode("b"), makeNode("c")];
    const edges = [makeEdge("a", "b"), makeEdge("b", "c")];
    const result = topologicalSort(nodes, edges);
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("sorts a diamond DAG", () => {
    // A → B, A → C, B → D, C → D
    const nodes = [makeNode("a"), makeNode("b"), makeNode("c"), makeNode("d")];
    const edges = [
      makeEdge("a", "b"),
      makeEdge("a", "c"),
      makeEdge("b", "d"),
      makeEdge("c", "d"),
    ];
    const result = topologicalSort(nodes, edges);
    expect(result).toHaveLength(4);
    expect(result.indexOf("a")).toBeLessThan(result.indexOf("b"));
    expect(result.indexOf("a")).toBeLessThan(result.indexOf("c"));
    expect(result.indexOf("b")).toBeLessThan(result.indexOf("d"));
    expect(result.indexOf("c")).toBeLessThan(result.indexOf("d"));
  });

  it("handles multiple roots", () => {
    const nodes = [makeNode("a"), makeNode("b"), makeNode("c")];
    const edges = [makeEdge("a", "c"), makeEdge("b", "c")];
    const result = topologicalSort(nodes, edges);
    expect(result).toHaveLength(3);
    // Both a and b before c
    expect(result.indexOf("a")).toBeLessThan(result.indexOf("c"));
    expect(result.indexOf("b")).toBeLessThan(result.indexOf("c"));
  });

  it("returns partial list on cycle", () => {
    const nodes = [makeNode("a"), makeNode("b")];
    const edges = [makeEdge("a", "b"), makeEdge("b", "a")];
    const result = topologicalSort(nodes, edges);
    // Cycle means some nodes can't be reached; result shorter than nodes
    expect(result.length).toBeLessThan(nodes.length);
  });

  it("handles disconnected nodes", () => {
    const nodes = [makeNode("a"), makeNode("b"), makeNode("c")];
    const result = topologicalSort(nodes, []);
    expect(result).toHaveLength(3);
    expect(new Set(result)).toEqual(new Set(["a", "b", "c"]));
  });

  it("handles empty graph", () => {
    const result = topologicalSort([], []);
    expect(result).toEqual([]);
  });
});

// ─── collectInputs ──────────────────────────────────────────────────

describe("collectInputs", () => {
  const dummyParticle: ParticleData = {
    type: "particle",
    source: {
      nAtoms: 1,
      nBonds: 0,
      nFileBonds: 0,
      positions: new Float32Array([0, 0, 0]),
      elements: new Uint8Array([1]),
      bonds: new Uint32Array([]),
      bondOrders: null,
      box: null,
    },
    sourceNodeId: "n1",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
  };

  it("returns empty map when no edges match", () => {
    const edges: Edge[] = [makeEdge("a", "b", "out", "in")];
    const edgeOutputs: EdgeOutputs = new Map();
    const result = collectInputs("c", edges, edgeOutputs);
    expect(result.size).toBe(0);
  });

  it("collects single input", () => {
    const edges: Edge[] = [makeEdge("a", "b", "out", "in")];
    const edgeOutputs: EdgeOutputs = new Map([
      ["a", new Map([["out", dummyParticle]])],
    ]);
    const result = collectInputs("b", edges, edgeOutputs);
    expect(result.has("in")).toBe(true);
    expect(result.get("in")).toHaveLength(1);
    expect(result.get("in")![0]).toBe(dummyParticle);
  });

  it("collects multiple inputs on same target handle", () => {
    const edges: Edge[] = [
      makeEdge("a", "c", "out", "particle"),
      makeEdge("b", "c", "out", "particle"),
    ];
    const edgeOutputs: EdgeOutputs = new Map([
      ["a", new Map([["out", dummyParticle]])],
      ["b", new Map([["out", dummyParticle]])],
    ]);
    const result = collectInputs("c", edges, edgeOutputs);
    expect(result.get("particle")).toHaveLength(2);
  });

  it("skips edges with missing source output", () => {
    const edges: Edge[] = [makeEdge("a", "b", "out", "in")];
    const edgeOutputs: EdgeOutputs = new Map(); // no outputs registered
    const result = collectInputs("b", edges, edgeOutputs);
    expect(result.size).toBe(0);
  });

  it("skips edges with null source or target handles", () => {
    const edge: Edge = {
      id: "e1",
      source: "a",
      target: "b",
      sourceHandle: null,
      targetHandle: null,
    };
    const edgeOutputs: EdgeOutputs = new Map([
      ["a", new Map([["out", dummyParticle]])],
    ]);
    const result = collectInputs("b", [edge], edgeOutputs);
    expect(result.size).toBe(0);
  });

  it("collects inputs on different target handles separately", () => {
    const edges: Edge[] = [
      makeEdge("a", "vp", "particle", "particle"),
      makeEdge("b", "vp", "bond", "bond"),
    ];
    const bondData = { ...dummyParticle, type: "bond" as const } as any;
    const edgeOutputs: EdgeOutputs = new Map([
      ["a", new Map([["particle", dummyParticle]])],
      ["b", new Map([["bond", bondData]])],
    ]);
    const result = collectInputs("vp", edges, edgeOutputs);
    expect(result.has("particle")).toBe(true);
    expect(result.has("bond")).toBe(true);
    expect(result.get("particle")).toHaveLength(1);
    expect(result.get("bond")).toHaveLength(1);
  });
});

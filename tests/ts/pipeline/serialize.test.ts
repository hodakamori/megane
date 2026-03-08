import { describe, it, expect } from "vitest";
import { serializePipeline, deserializePipeline } from "@/pipeline/serialize";
import type { PipelineNodeData } from "@/pipeline/execute";
import type { Node, Edge } from "@xyflow/react";
import type { SerializedPipeline } from "@/pipeline/types";

function makeNode(
  id: string,
  type: string,
  params: Record<string, unknown>,
  position = { x: 0, y: 0 },
  enabled = true,
): Node<PipelineNodeData> {
  return {
    id,
    type,
    position,
    data: {
      params: { type, ...params } as any,
      enabled,
    },
  };
}

function makeEdge(
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    sourceHandle,
    targetHandle,
  };
}

describe("serializePipeline", () => {
  it("serializes nodes and edges to version 3 format", () => {
    const nodes = [
      makeNode("n1", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
      makeNode("n2", "viewport", { perspective: false, cellAxesVisible: true }, { x: 200, y: 0 }),
    ];
    const edges = [makeEdge("n1", "particle", "n2", "particle")];

    const result = serializePipeline(nodes, edges);

    expect(result.version).toBe(3);
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.nodes[0].id).toBe("n1");
    expect(result.nodes[0].type).toBe("load_structure");
    expect(result.nodes[1].position).toEqual({ x: 200, y: 0 });
    expect(result.edges[0].source).toBe("n1");
    expect(result.edges[0].targetHandle).toBe("particle");
  });

  it("preserves enabled state", () => {
    const nodes = [
      makeNode("n1", "filter", { query: "element == \"C\"" }, { x: 0, y: 0 }, false),
    ];
    const result = serializePipeline(nodes, []);
    expect(result.nodes[0].enabled).toBe(false);
  });
});

describe("deserializePipeline", () => {
  it("throws on unsupported version", () => {
    const json = { version: 1, nodes: [], edges: [] } as any;
    expect(() => deserializePipeline(json)).toThrow("Unsupported pipeline version");
  });

  it("throws on unknown node type", () => {
    const json: any = {
      version: 3,
      nodes: [{ id: "n1", type: "unknown_type", position: { x: 0, y: 0 } }],
      edges: [],
    };
    expect(() => deserializePipeline(json)).toThrow("Unknown node type");
  });

  it("applies default params on deserialize", () => {
    const json: SerializedPipeline = {
      version: 3,
      nodes: [
        { id: "n1", type: "filter", position: { x: 0, y: 0 } } as any,
      ],
      edges: [],
    };
    const { nodes } = deserializePipeline(json);
    expect((nodes[0].data.params as any).query).toBe(""); // default
  });

  it("defaults position to {x:0, y:0} when missing", () => {
    const json: SerializedPipeline = {
      version: 3,
      nodes: [{ id: "n1", type: "viewport" } as any],
      edges: [],
    };
    const { nodes } = deserializePipeline(json);
    expect(nodes[0].position).toEqual({ x: 0, y: 0 });
  });

  it("defaults enabled to true when not specified", () => {
    const json: SerializedPipeline = {
      version: 3,
      nodes: [
        { id: "n1", type: "viewport", position: { x: 0, y: 0 } } as any,
      ],
      edges: [],
    };
    const { nodes } = deserializePipeline(json);
    expect(nodes[0].data.enabled).toBe(true);
  });

  it("generates deterministic edge IDs", () => {
    const json: SerializedPipeline = {
      version: 3,
      nodes: [
        { id: "a", type: "load_structure", position: { x: 0, y: 0 } } as any,
        { id: "b", type: "viewport", position: { x: 200, y: 0 } } as any,
      ],
      edges: [
        { source: "a", target: "b", sourceHandle: "particle", targetHandle: "particle" },
      ],
    };
    const { edges } = deserializePipeline(json);
    expect(edges[0].id).toBe("e-a-particle-b-particle-0");
  });
});

describe("round-trip serialization", () => {
  it("preserves structure through serialize → deserialize", () => {
    const nodes = [
      makeNode("n1", "load_structure", { fileName: "test.pdb", hasTrajectory: false, hasCell: true }, { x: 10, y: 20 }),
      makeNode("n2", "filter", { query: 'element == "C"' }, { x: 100, y: 20 }),
      makeNode("n3", "viewport", { perspective: true, cellAxesVisible: false }, { x: 200, y: 20 }),
    ];
    const edges = [
      makeEdge("n1", "particle", "n2", "in"),
      makeEdge("n2", "out", "n3", "particle"),
    ];

    const serialized = serializePipeline(nodes, edges);
    const { nodes: restored, edges: restoredEdges } = deserializePipeline(serialized);

    expect(restored).toHaveLength(3);
    expect(restoredEdges).toHaveLength(2);

    // Check node params preserved
    expect((restored[0].data.params as any).fileName).toBe("test.pdb");
    expect((restored[1].data.params as any).query).toBe('element == "C"');
    expect((restored[2].data.params as any).perspective).toBe(true);

    // Check positions preserved
    expect(restored[0].position).toEqual({ x: 10, y: 20 });
  });
});

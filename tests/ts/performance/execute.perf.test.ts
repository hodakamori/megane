import { describe, it, expect } from "vitest";
import { executePipeline } from "@/pipeline/execute";
import type { PipelineNodeData } from "@/pipeline/execute";
import type { Node, Edge } from "@xyflow/react";
import type { Snapshot } from "@/types";

function makeSnapshot(nAtoms: number): Snapshot {
  const positions = new Float32Array(nAtoms * 3);
  const elements = new Uint8Array(nAtoms);
  for (let i = 0; i < nAtoms; i++) {
    positions[i * 3] = Math.random() * 100;
    positions[i * 3 + 1] = Math.random() * 100;
    positions[i * 3 + 2] = Math.random() * 100;
    elements[i] = [1, 6, 7, 8][i % 4];
  }
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions,
    elements,
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
  };
}

function makeNode(
  id: string,
  type: string,
  params: Record<string, unknown>,
  enabled = true,
): Node<PipelineNodeData> {
  return {
    id,
    type,
    position: { x: 0, y: 0 },
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
    id: `e-${source}-${sourceHandle}-${target}-${targetHandle}`,
    source,
    target,
    sourceHandle,
    targetHandle,
  };
}

function benchmark(fn: () => void, iterations: number = 5): number {
  const times: number[] = [];
  fn();
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
}

describe("performance: executePipeline", () => {
  it("full pipeline with 100,000 atoms under 3000ms", () => {
    const snapshot = makeSnapshot(100_000);
    const nodes = [
      makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
      makeNode("f1", "filter", { query: 'element == "C" or element == "N"' }),
      makeNode("m1", "modify", { scale: 0.5, opacity: 0.8 }),
      makeNode("ab", "add_bond", { bondSource: "distance" }),
      makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
    ];
    const edges = [
      makeEdge("ls", "particle", "f1", "in"),
      makeEdge("f1", "out", "m1", "in"),
      makeEdge("m1", "out", "vp", "particle"),
      makeEdge("ls", "particle", "ab", "particle"),
      makeEdge("ab", "bond", "vp", "bond"),
    ];

    const time = benchmark(() => {
      executePipeline(nodes, edges, { snapshot });
    }, 3);
    console.log(`  executePipeline full 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(3000);
  });

  it("filter-only pipeline with 100,000 atoms under 500ms", () => {
    const snapshot = makeSnapshot(100_000);
    const nodes = [
      makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
      makeNode("f1", "filter", { query: "x > 50 and element != \"H\"" }),
      makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
    ];
    const edges = [
      makeEdge("ls", "particle", "f1", "in"),
      makeEdge("f1", "out", "vp", "particle"),
    ];

    const time = benchmark(() => {
      executePipeline(nodes, edges, { snapshot });
    });
    console.log(`  executePipeline filter-only 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(500);
  });

  it("label generation with 100,000 atoms under 500ms", () => {
    const snapshot = makeSnapshot(100_000);
    const nodes = [
      makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
      makeNode("lg", "label_generator", { source: "element" }),
      makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
    ];
    const edges = [
      makeEdge("ls", "particle", "lg", "particle"),
      makeEdge("lg", "label", "vp", "label"),
    ];

    const time = benchmark(() => {
      executePipeline(nodes, edges, { snapshot });
    });
    console.log(`  executePipeline labels 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(500);
  });
});

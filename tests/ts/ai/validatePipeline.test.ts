import { describe, it, expect } from "vitest";
import {
  collectQueryErrors,
  collectPipelineErrors,
  buildRepairPrompt,
} from "@/ai/validatePipeline";
import type { SerializedPipeline } from "@/pipeline/types";

function pipeline(nodes: SerializedPipeline["nodes"]): SerializedPipeline {
  return { version: 3, nodes, edges: [] };
}

describe("collectQueryErrors", () => {
  it("returns no errors for valid filter queries", () => {
    const p = pipeline([
      { id: "f1", type: "filter", position: { x: 0, y: 0 }, query: 'element == "C"' },
      { id: "f2", type: "filter", position: { x: 0, y: 0 }, query: "index >= 1 and index <= 9" },
    ] as SerializedPipeline["nodes"]);
    expect(collectQueryErrors(p)).toEqual([]);
  });

  it("treats empty / all / none queries as valid", () => {
    const p = pipeline([
      { id: "f1", type: "filter", position: { x: 0, y: 0 }, query: "" },
      { id: "f2", type: "filter", position: { x: 0, y: 0 }, query: "all" },
      { id: "f3", type: "filter", position: { x: 0, y: 0 }, query: "none" },
    ] as SerializedPipeline["nodes"]);
    expect(collectQueryErrors(p)).toEqual([]);
  });

  it("flags an invalid atom query and names the node", () => {
    const p = pipeline([
      { id: "bad", type: "filter", position: { x: 0, y: 0 }, query: "chain A" },
    ] as SerializedPipeline["nodes"]);
    const errors = collectQueryErrors(p);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('node "bad"');
    expect(errors[0]).toContain("chain A");
  });

  it("flags an invalid bond query", () => {
    const p = pipeline([
      {
        id: "b1",
        type: "filter",
        position: { x: 0, y: 0 },
        query: "all",
        bond_query: "within 5 of foo",
      },
    ] as SerializedPipeline["nodes"]);
    const errors = collectQueryErrors(p);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("bond_query");
  });

  it("ignores non-filter nodes", () => {
    const p = pipeline([
      { id: "v1", type: "viewport", position: { x: 0, y: 0 } },
      { id: "l1", type: "load_structure", position: { x: 0, y: 0 } },
    ] as SerializedPipeline["nodes"]);
    expect(collectQueryErrors(p)).toEqual([]);
  });

  it("collects multiple errors across nodes", () => {
    const p = pipeline([
      { id: "f1", type: "filter", position: { x: 0, y: 0 }, query: "protein" },
      { id: "f2", type: "filter", position: { x: 0, y: 0 }, query: "name CA" },
    ] as SerializedPipeline["nodes"]);
    expect(collectQueryErrors(p)).toHaveLength(2);
  });
});

describe("collectPipelineErrors", () => {
  it("returns no errors for a structurally valid pipeline with valid queries", () => {
    const p = pipeline([
      { id: "f1", type: "filter", position: { x: 0, y: 0 }, query: 'element == "C"' },
      { id: "v1", type: "viewport", position: { x: 0, y: 310 } },
    ] as SerializedPipeline["nodes"]);
    p.edges = [{ source: "f1", target: "v1", sourceHandle: "out", targetHandle: "particle" }];
    expect(collectPipelineErrors(p)).toEqual([]);
  });

  it("combines schema errors and query errors", () => {
    // No viewport (schema error) AND an invalid query (query error).
    const p = pipeline([
      { id: "f1", type: "filter", position: { x: 0, y: 0 }, query: "chain A" },
    ] as SerializedPipeline["nodes"]);
    const errors = collectPipelineErrors(p);
    expect(errors.some((e) => e.includes("viewport"))).toBe(true);
    expect(errors.some((e) => e.includes("chain A"))).toBe(true);
  });
});

describe("buildRepairPrompt", () => {
  const broken = pipeline([
    { id: "f1", type: "filter", position: { x: 0, y: 0 }, query: "protein" },
  ] as SerializedPipeline["nodes"]);

  it("includes the original request, errors, and the broken pipeline JSON", () => {
    const msg = buildRepairPrompt("show the protein", broken, ['node "f1": bad']);
    expect(msg).toContain("show the protein");
    expect(msg).toContain('node "f1": bad');
    expect(msg).toContain(JSON.stringify(broken));
    expect(msg).toContain("```json");
  });
});

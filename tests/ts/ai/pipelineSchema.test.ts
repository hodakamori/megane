import { describe, it, expect } from "vitest";
import { collectSchemaErrors } from "@/ai/pipelineSchema";
import { extractPipelineJSON } from "@/ai/client";
import { getSkills } from "@/ai/skillLoader";
import type { SerializedPipeline } from "@/pipeline/types";

function pipeline(p: Partial<SerializedPipeline>): SerializedPipeline {
  return { version: 3, nodes: [], edges: [], ...p } as SerializedPipeline;
}

/** A minimal well-formed pipeline: one loader → viewport. */
const VALID = pipeline({
  nodes: [
    { id: "l1", type: "load_structure", position: { x: 0, y: 0 } },
    { id: "v1", type: "viewport", position: { x: 0, y: 310 } },
  ],
  edges: [{ source: "l1", target: "v1", sourceHandle: "particle", targetHandle: "particle" }],
} as Partial<SerializedPipeline>);

describe("collectSchemaErrors", () => {
  it("accepts a well-formed pipeline", () => {
    expect(collectSchemaErrors(VALID)).toEqual([]);
  });

  it("accepts a pipeline with only a viewport", () => {
    const p = pipeline({
      nodes: [{ id: "v1", type: "viewport", position: { x: 0, y: 0 } }],
      edges: [],
    } as Partial<SerializedPipeline>);
    expect(collectSchemaErrors(p)).toEqual([]);
  });

  it("flags a wrong version", () => {
    const p = pipeline({ version: 2 as unknown as 3, nodes: VALID.nodes, edges: VALID.edges });
    expect(collectSchemaErrors(p).some((e) => e.includes("version"))).toBe(true);
  });

  it("flags an unknown node type", () => {
    const p = pipeline({
      nodes: [
        { id: "x1", type: "bogus", position: { x: 0, y: 0 } },
        { id: "v1", type: "viewport", position: { x: 0, y: 0 } },
      ],
      edges: [],
    } as Partial<SerializedPipeline>);
    const errors = collectSchemaErrors(p);
    expect(errors.some((e) => e.includes("unknown node type") && e.includes("x1"))).toBe(true);
  });

  it("flags a missing or non-numeric position", () => {
    const p = pipeline({
      nodes: [
        { id: "l1", type: "load_structure" },
        { id: "v1", type: "viewport", position: { x: 0, y: 0 } },
      ] as unknown as SerializedPipeline["nodes"],
      edges: [],
    });
    expect(collectSchemaErrors(p).some((e) => e.includes("position"))).toBe(true);
  });

  it("flags a missing id and duplicate ids", () => {
    const p = pipeline({
      nodes: [
        { id: "dup", type: "load_structure", position: { x: 0, y: 0 } },
        { id: "dup", type: "viewport", position: { x: 0, y: 0 } },
      ],
      edges: [],
    } as Partial<SerializedPipeline>);
    expect(collectSchemaErrors(p).some((e) => e.includes("duplicate"))).toBe(true);
  });

  it("requires exactly one viewport — flags none", () => {
    const p = pipeline({
      nodes: [{ id: "l1", type: "load_structure", position: { x: 0, y: 0 } }],
      edges: [],
    } as Partial<SerializedPipeline>);
    expect(collectSchemaErrors(p).some((e) => e.includes("found none"))).toBe(true);
  });

  it("requires exactly one viewport — flags duplicates", () => {
    const p = pipeline({
      nodes: [
        { id: "v1", type: "viewport", position: { x: 0, y: 0 } },
        { id: "v2", type: "viewport", position: { x: 0, y: 0 } },
      ],
      edges: [],
    } as Partial<SerializedPipeline>);
    expect(collectSchemaErrors(p).some((e) => e.includes("found 2"))).toBe(true);
  });

  it("flags edges with missing handle fields", () => {
    const p = pipeline({
      nodes: VALID.nodes,
      edges: [{ source: "l1", target: "v1" }] as unknown as SerializedPipeline["edges"],
    });
    const errors = collectSchemaErrors(p);
    expect(errors.some((e) => e.includes("sourceHandle"))).toBe(true);
    expect(errors.some((e) => e.includes("targetHandle"))).toBe(true);
  });

  it("flags edges that reference nonexistent nodes", () => {
    const p = pipeline({
      nodes: VALID.nodes,
      edges: [
        { source: "ghost", target: "v1", sourceHandle: "particle", targetHandle: "particle" },
      ],
    } as Partial<SerializedPipeline>);
    expect(collectSchemaErrors(p).some((e) => e.includes('source "ghost"'))).toBe(true);
  });

  it("returns early when nodes/edges are not arrays", () => {
    const p = { version: 3, nodes: null, edges: null } as unknown as SerializedPipeline;
    const errors = collectSchemaErrors(p);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("`nodes` and `edges` arrays");
  });
});

describe("shipped skill templates are schema-valid", () => {
  // The templates the model is told to fetch and customize must themselves
  // pass the schema, otherwise every customized result starts from a broken base.
  const skills = getSkills();

  it("loads at least one skill template", () => {
    expect(skills.length).toBeGreaterThan(0);
  });

  for (const skill of skills) {
    it(`${skill.name} embeds a schema-valid pipeline`, () => {
      const parsed = extractPipelineJSON(skill.content);
      expect(collectSchemaErrors(parsed)).toEqual([]);
    });
  }
});

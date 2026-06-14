import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "@/ai/prompt";
import { collectPipelineErrors } from "@/ai/validatePipeline";
import type { SerializedPipeline } from "@/pipeline/types";

/** Extract the first ```json fenced block that follows a section heading. */
function exampleAfter(prompt: string, heading: string): SerializedPipeline {
  const idx = prompt.indexOf(heading);
  expect(idx).toBeGreaterThan(-1);
  const match = prompt.slice(idx).match(/```json\s*\n([\s\S]*?)```/);
  expect(match).not.toBeNull();
  return JSON.parse(match![1].trim()) as SerializedPipeline;
}

describe("buildSystemPrompt", () => {
  const prompt = buildSystemPrompt();

  it("returns a non-empty string", () => {
    expect(typeof prompt).toBe("string");
    expect(prompt.length).toBeGreaterThan(0);
  });

  it("documents every supported node type", () => {
    const nodeTypes = [
      "load_structure",
      "load_trajectory",
      "load_vector",
      "load_volumetric",
      "add_bond",
      "filter",
      "modify",
      "replicate",
      "color",
      "representation",
      "label_generator",
      "polyhedron_generator",
      "surface_mesh",
      "vector_overlay",
      "isosurface",
      "viewport",
    ];
    for (const t of nodeTypes) {
      expect(prompt).toContain(t);
    }
  });

  it("includes the schema version 3 marker", () => {
    expect(prompt).toContain('"version": 3');
  });

  it("includes a json fenced code block example", () => {
    expect(prompt).toContain("```json");
  });

  it("documents the connection rules section", () => {
    expect(prompt).toContain("Connection Rules");
  });

  it("is deterministic — two calls return identical strings", () => {
    expect(buildSystemPrompt()).toBe(buildSystemPrompt());
  });

  it("documents the atom selection query fields and operators", () => {
    expect(prompt).toContain("Atom & Bond Selection Query Language");
    for (const field of ["element", "index", "resname", "mass"]) {
      expect(prompt).toContain(field);
    }
    // String values must be quoted; warn against the unquoted form.
    expect(prompt).toContain('element == "C"');
  });

  it("documents the bond query `both` semantics", () => {
    expect(prompt).toContain("bond_query");
    expect(prompt).toContain("both");
  });

  it("warns that VMD/PyMOL idioms are unsupported", () => {
    for (const idiom of ["name CA", "chain A", "within 5 of"]) {
      expect(prompt).toContain(idiom);
    }
  });

  it("documents the selective visual property (subset) pattern", () => {
    expect(prompt).toContain("Selective Visual Property");
    // The guideline should steer the model away from double-rendering the
    // same atoms (full structure + filtered copy) into the viewport.
    expect(prompt).toContain("disjoint");
  });

  it("ships a valid selective-property example pipeline", () => {
    const pipeline = exampleAfter(prompt, "## Example: Selective Visual Property");
    // The documented example must itself pass the same schema + query
    // validators the repair round trip uses, so the model has a correct
    // template to follow.
    expect(collectPipelineErrors(pipeline)).toEqual([]);
    // Two disjoint filter branches (water vs. the rest), only one modified.
    const filters = pipeline.nodes.filter((n) => n.type === "filter");
    expect(filters).toHaveLength(2);
    expect(pipeline.nodes.filter((n) => n.type === "modify")).toHaveLength(1);
  });
});

describe("buildSystemPrompt with structure summary", () => {
  const summary = "- Atoms: 10 (index 0..9)\n- Elements present: C (6), H (4)";

  it("omits the structure section when no summary is given", () => {
    expect(buildSystemPrompt()).not.toContain("Currently Loaded Structure");
    expect(buildSystemPrompt(null)).not.toContain("Currently Loaded Structure");
  });

  it("appends the structure section when a summary is given", () => {
    const prompt = buildSystemPrompt(summary);
    expect(prompt).toContain("Currently Loaded Structure");
    expect(prompt).toContain(summary);
  });

  it("keeps the base schema content alongside the structure section", () => {
    const prompt = buildSystemPrompt(summary);
    expect(prompt).toContain("load_structure");
    expect(prompt).toContain('"version": 3');
  });
});

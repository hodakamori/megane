import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "@/ai/prompt";

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
      "add_bond",
      "filter",
      "modify",
      "label_generator",
      "polyhedron_generator",
      "vector_overlay",
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

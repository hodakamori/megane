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
});

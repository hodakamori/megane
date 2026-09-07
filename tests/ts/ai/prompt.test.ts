import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { buildSystemPrompt, renderNodeSchemaSection } from "@/ai/prompt";
import { collectPipelineErrors } from "@/ai/validatePipeline";
import { collectOverlapErrors } from "@/ai/selfCheck";
import type { SerializedPipeline } from "@/pipeline/types";

/** Extract the first ```json fenced block that follows a section heading. */
function exampleAfter(prompt: string, heading: string): SerializedPipeline {
  const idx = prompt.indexOf(heading);
  expect(idx).toBeGreaterThan(-1);
  const match = prompt.slice(idx).match(/```json\s*\n([\s\S]*?)```/);
  expect(match).not.toBeNull();
  return JSON.parse(match![1].trim()) as SerializedPipeline;
}

/** Does `pipeline` carry an edge between these two node types on these handles? */
function hasEdge(
  pipeline: SerializedPipeline,
  sourceType: string,
  targetType: string,
  sourceHandle: string,
  targetHandle: string,
): boolean {
  const typeOf = new Map(pipeline.nodes.map((n) => [n.id, n.type]));
  return pipeline.edges.some(
    (e) =>
      typeOf.get(e.source) === sourceType &&
      typeOf.get(e.target) === targetType &&
      e.sourceHandle === sourceHandle &&
      e.targetHandle === targetHandle,
  );
}

/**
 * The shape every "treat only part of the structure" example must have: the
 * unfiltered base edge stays, exactly one filtered branch changes the drawing,
 * and — because bond branches are appended rather than merged — the bond
 * stream reaches the viewport only through its own filter/modify branch. The
 * Viewport merges particle branches per atom (`mergeParticleOverrides`), so
 * the base edge is the correct construction; it is what the benchmark's
 * reviewed references use, and the self-check must accept it.
 */
function expectBaseEdgePattern(pipeline: SerializedPipeline): void {
  expect(collectPipelineErrors(pipeline)).toEqual([]);
  expect(collectOverlapErrors(pipeline)).toEqual([]);
  expect(hasEdge(pipeline, "load_structure", "viewport", "particle", "particle")).toBe(true);
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
      "coordination_generator",
      "filter",
      "modify",
      "replicate",
      "drawing_boundary",
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

  it("renders the node schema section byte-identically to the frozen fixture", () => {
    // The `## Node Types and Parameters` section is generated from the node
    // catalog (src/pipeline/catalog.ts). This fixture is the exact text that
    // section had when it was hand-written, so this test guarantees the
    // refactor changed nothing the LLM sees. If you intentionally reword a node
    // description/param, regenerate the fixture in the same commit.
    const fixturePath = resolve(process.cwd(), "tests/ts/ai/__fixtures__/node-schema-section.txt");
    const expected = readFileSync(fixturePath, "utf8");
    expect(renderNodeSchemaSection()).toBe(expected);
    // And the generated section must actually be spliced into the full prompt.
    expect(prompt).toContain(expected);
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

  it("stays under the demo-proxy system-message cap (with summary headroom)", () => {
    // The demo Cloudflare Worker proxy rejects any system message longer than
    // MAX_SYSTEM_MESSAGE_LENGTH (48000) with "Missing or invalid 'messages'
    // array" — see workers/llm-proxy/src/proxy.ts. The base prompt is sent as
    // the system message and a loaded-structure summary is appended on top, so
    // the base must leave comfortable headroom. This guard catches prompt
    // growth before it silently breaks the free demo (the proxy cap and this
    // constant must be kept in sync).
    const PROXY_SYSTEM_CAP = 48000;
    const SUMMARY_HEADROOM = 8000;
    expect(buildSystemPrompt().length).toBeLessThan(PROXY_SYSTEM_CAP - SUMMARY_HEADROOM);
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

  it("documents how the viewport combines branches per port", () => {
    // Particle branches merge per atom (a non-default value wins); bond
    // branches are appended. Everything the selective examples say follows
    // from this rule, so it has to be stated where the connection rules are.
    expect(prompt).toContain("MERGED per atom");
    expect(prompt).toContain("APPENDED");
    expect(prompt).not.toContain("renders twice");
    expect(prompt).not.toContain("re-draws the hidden species");
  });

  it("documents the selective visual property (subset) pattern", () => {
    expect(prompt).toContain("Selective Visual Property");
    // The guideline keeps the unfiltered base edge (the merge makes it
    // correct) and only forbids two branches that both change the same atoms.
    expect(prompt).toContain("NOT drawn twice");
    expect(prompt).toContain("disjoint");
  });

  it("ships a valid selective-property example pipeline", () => {
    const pipeline = exampleAfter(prompt, "## Example: Selective Visual Property");
    // The documented example must itself pass the same schema + query
    // validators (and the self-check) the repair round trip uses, so the
    // model has a correct template to follow.
    expectBaseEdgePattern(pipeline);
    // One filtered branch fades the water's atoms ...
    const filters = pipeline.nodes.filter((n) => n.type === "filter") as Array<{
      id: string;
      query?: string;
      bond_query?: string;
    }>;
    const atomFilter = filters.find((f) => (f.query ?? "").includes("HOH"));
    expect(atomFilter).toBeDefined();
    const modifies = pipeline.nodes.filter((n) => n.type === "modify") as Array<{
      id: string;
      opacity?: number;
    }>;
    expect(modifies).toHaveLength(2);
    for (const m of modifies) {
      expect(m.opacity).toBeGreaterThan(0);
      expect(m.opacity).toBeLessThan(1);
    }
    expect(hasEdge(pipeline, "filter", "modify", "out", "in")).toBe(true);
    expect(hasEdge(pipeline, "modify", "viewport", "out", "particle")).toBe(true);
    // ... and a second one fades its bonds, replacing the direct bond edge:
    // bond streams are appended, so `add_bond -> viewport.bond` beside the
    // faded branch would draw every bond again at full opacity.
    const bondFilter = filters.find((f) => (f.bond_query ?? "").length > 0);
    expect(bondFilter).toBeDefined();
    expect(bondFilter!.bond_query).toMatch(/\b(bond_index|atom_index|element|molecule_id)\b/);
    expect(hasEdge(pipeline, "add_bond", "filter", "bond", "in")).toBe(true);
    expect(hasEdge(pipeline, "modify", "viewport", "out", "bond")).toBe(true);
    expect(hasEdge(pipeline, "add_bond", "viewport", "bond", "bond")).toBe(false);
  });

  it("documents the selective representation (style one species) pattern", () => {
    expect(prompt).toContain("Selective Representation");
    // Steer the model to put the representation on a filtered branch, not the
    // whole structure — this is the caffeine-water "show the water as lines"
    // failure mode.
    expect(prompt).toContain("show the water as lines");
  });

  it("ships a valid selective-representation example with line on the water branch", () => {
    const pipeline = exampleAfter(prompt, "## Example: Selective Representation");
    expectBaseEdgePattern(pipeline);
    // The base edge keeps every atom in its default style; one filtered
    // branch restyles only the water.
    const filters = pipeline.nodes.filter((n) => n.type === "filter");
    expect(filters).toHaveLength(1);
    expect((filters[0] as { query?: string }).query).toContain("HOH");
    const reps = pipeline.nodes.filter((n) => n.type === "representation");
    expect(reps).toHaveLength(1);
    expect((reps[0] as { mode?: string }).mode).toBe("line");
    // The representation must sit downstream of a filter (water branch), not on
    // the load_structure directly.
    const repId = reps[0].id;
    const feedsRep = pipeline.edges.find((e) => e.target === repId);
    expect(feedsRep).toBeDefined();
    const upstream = pipeline.nodes.find((n) => n.id === feedsRep!.source);
    expect(upstream?.type).toBe("filter");
  });

  it("documents hiding/removing a species via a modify opacity-0 branch", () => {
    expect(prompt).toContain("Hiding / removing a species");
    // A bare filter does not remove atoms; hiding is done by fading to opacity 0.
    expect(prompt).toContain("does NOT remove");
    expect(prompt).toContain("opacity");
  });

  it("ships a valid hide-species example that fades the target to opacity 0", () => {
    const pipeline = exampleAfter(prompt, "## Example: Hiding / removing a species");
    // The unfiltered base edge stays: the Viewport merges the branch's
    // opacity 0 onto it per atom, so the water disappears and nothing is drawn
    // twice. This is the construction the benchmark's `hide-water` reference
    // uses; a prompt that forbade it was steering the model away from the
    // answer the rubric grades against.
    expectBaseEdgePattern(pipeline);
    const modifies = pipeline.nodes.filter((n) => n.type === "modify") as Array<{
      opacity?: number;
    }>;
    expect(modifies).toHaveLength(2);
    for (const m of modifies) expect(m.opacity).toBe(0);
    const filters = pipeline.nodes.filter((n) => n.type === "filter") as Array<{
      query?: string;
      bond_query?: string;
    }>;
    // The atom branch selects the species to hide ...
    expect(filters[0].query).toContain("HOH");
    expect(hasEdge(pipeline, "filter", "modify", "out", "in")).toBe(true);
    expect(hasEdge(pipeline, "modify", "viewport", "out", "particle")).toBe(true);
    // ... and the bond branch hides its bonds, in place of the direct bond
    // edge (bond streams are appended, so a direct edge would keep the
    // solvent's sticks on screen). `bond_query` has no `resname`, so the
    // selection is spelled on a bond field.
    expect(filters[1].bond_query).toMatch(/\b(bond_index|atom_index|element|molecule_id)\b/);
    expect(hasEdge(pipeline, "add_bond", "filter", "bond", "in")).toBe(true);
    expect(hasEdge(pipeline, "modify", "viewport", "out", "bond")).toBe(true);
    expect(hasEdge(pipeline, "add_bond", "viewport", "bond", "bond")).toBe(false);
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

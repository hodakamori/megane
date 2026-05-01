import { describe, it, expect } from "vitest";
import {
  buildToolDefinitions,
  executeSkill,
  getSkills,
  loadSkills,
  parseFrontmatter,
  type PipelineSkill,
} from "@/ai/skillLoader";

describe("parseFrontmatter", () => {
  it("parses well-formed frontmatter into key-value attrs and trimmed body", () => {
    const raw = `---
name: load-molecule
description: Load a molecule file
---
This is the body content.`;
    const { attrs, content } = parseFrontmatter(raw);
    expect(attrs.name).toBe("load-molecule");
    expect(attrs.description).toBe("Load a molecule file");
    expect(content).toBe("This is the body content.");
  });

  it("returns empty attrs and the raw string when no frontmatter is present", () => {
    const raw = "Just markdown without frontmatter.";
    const { attrs, content } = parseFrontmatter(raw);
    expect(attrs).toEqual({});
    expect(content).toBe(raw);
  });

  it("splits each frontmatter line on the first colon only", () => {
    const raw = `---
description: A title: with: colons
---
body`;
    const { attrs } = parseFrontmatter(raw);
    expect(attrs.description).toBe("A title: with: colons");
  });

  it("ignores frontmatter lines without a colon", () => {
    const raw = `---
name: tool
no-colon-here
description: ok
---
body`;
    const { attrs } = parseFrontmatter(raw);
    expect(attrs.name).toBe("tool");
    expect(attrs.description).toBe("ok");
    expect(attrs["no-colon-here"]).toBeUndefined();
  });

  it("handles an empty body", () => {
    const raw = `---
name: x
description: y
---
`;
    const { attrs, content } = parseFrontmatter(raw);
    expect(attrs.name).toBe("x");
    expect(content).toBe("");
  });
});

describe("buildToolDefinitions", () => {
  it("converts kebab-case skill names to snake_case tool names", () => {
    const skills: PipelineSkill[] = [
      { name: "load-molecule", description: "x", content: "" },
      { name: "add-bond-distance", description: "y", content: "" },
    ];
    const tools = buildToolDefinitions(skills);
    expect(tools).toHaveLength(2);
    expect(tools[0].name).toBe("load_molecule");
    expect(tools[1].name).toBe("add_bond_distance");
  });

  it("each tool has the empty-input schema shape", () => {
    const tools = buildToolDefinitions([
      { name: "x", description: "d", content: "" },
    ]);
    expect(tools[0].input_schema).toEqual({ type: "object", properties: {} });
    expect(tools[0].description).toBe("d");
  });

  it("returns an empty array for no skills", () => {
    expect(buildToolDefinitions([])).toEqual([]);
  });
});

describe("executeSkill", () => {
  const skills: PipelineSkill[] = [
    { name: "load-molecule", description: "", content: "molecule body" },
    { name: "add-bond", description: "", content: "bond body" },
  ];

  it("returns the skill content when a tool name matches", () => {
    expect(executeSkill(skills, "load_molecule")).toBe("molecule body");
    expect(executeSkill(skills, "add_bond")).toBe("bond body");
  });

  it("returns null for an unknown tool name", () => {
    expect(executeSkill(skills, "missing_tool")).toBeNull();
  });

  it("returns null for an empty skills array", () => {
    expect(executeSkill([], "anything")).toBeNull();
  });
});

describe("loadSkills / getSkills", () => {
  it("loadSkills returns an array (currently empty since src/ai/skills/ has no .md files)", () => {
    const skills = loadSkills();
    expect(Array.isArray(skills)).toBe(true);
  });

  it("getSkills caches the result across calls", () => {
    const a = getSkills();
    const b = getSkills();
    expect(a).toBe(b);
  });
});

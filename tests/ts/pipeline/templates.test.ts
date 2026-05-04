import { describe, it, expect } from "vitest";
import { PIPELINE_TEMPLATES } from "@/pipeline/templates";
import type {
  LoadStructureParams,
  FilterParams,
  ModifyParams,
  RepresentationParams,
} from "@/pipeline/types";

describe("PIPELINE_TEMPLATES", () => {
  it("is non-empty", () => {
    expect(PIPELINE_TEMPLATES.length).toBeGreaterThan(0);
  });

  it("each template has required fields", () => {
    for (const t of PIPELINE_TEMPLATES) {
      expect(t.id).toBeTruthy();
      expect(t.label).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(typeof t.create).toBe("function");
    }
  });

  it("each template has unique id", () => {
    const ids = PIPELINE_TEMPLATES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each template creates valid nodes and edges", () => {
    for (const t of PIPELINE_TEMPLATES) {
      const { nodes, edges } = t.create();
      expect(nodes.length).toBeGreaterThan(0);

      // All edges reference existing node IDs
      const ids = new Set(nodes.map((n) => n.id));
      for (const e of edges) {
        expect(ids.has(e.source), `template "${t.id}": edge source "${e.source}" not in nodes`).toBe(true);
        expect(ids.has(e.target), `template "${t.id}": edge target "${e.target}" not in nodes`).toBe(true);
      }
    }
  });

  it("each template has a viewport node", () => {
    for (const t of PIPELINE_TEMPLATES) {
      const { nodes } = t.create();
      expect(
        nodes.some((n) => n.type === "viewport"),
        `template "${t.id}" missing viewport node`,
      ).toBe(true);
    }
  });
});

describe("PIPELINE_TEMPLATES protein", () => {
  const protein = PIPELINE_TEMPLATES.find((t) => t.id === "protein");

  it("is registered", () => {
    expect(protein).toBeDefined();
  });

  it("loads the 1ubq.pdb fixture", () => {
    const { nodes } = protein!.create();
    const loader = nodes.find((n) => n.type === "load_structure");
    expect(loader).toBeDefined();
    expect((loader!.data.params as LoadStructureParams).fileName).toBe("1ubq.pdb");
  });

  it("filters protein and water by residue name", () => {
    const { nodes } = protein!.create();
    const queries = nodes
      .filter((n) => n.type === "filter")
      .map((n) => (n.data.params as FilterParams).query);
    expect(queries).toContain('resname != "HOH"');
    expect(queries).toContain('resname == "HOH"');
  });

  it("hides protein atoms (opacity 0) and shows water semi-transparent (opacity 0.5)", () => {
    const { nodes } = protein!.create();
    const opacities = nodes
      .filter((n) => n.type === "modify")
      .map((n) => (n.data.params as ModifyParams).opacity);
    expect(opacities).toContain(0);
    expect(opacities).toContain(0.5);
  });

  it("requests the cartoon ribbon via a representation node in 'both' mode", () => {
    const { nodes } = protein!.create();
    const rep = nodes.find((n) => n.type === "representation");
    expect(rep).toBeDefined();
    expect((rep!.data.params as RepresentationParams).mode).toBe("both");
  });
});

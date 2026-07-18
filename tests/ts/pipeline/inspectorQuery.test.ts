import { describe, it, expect } from "vitest";
import {
  orGroup,
  buildQueryFromChips,
  quickSelectExpression,
  indicesToExpression,
} from "@/pipeline/inspectorQuery";
import { validateQuery } from "@/pipeline/selection";

describe("orGroup", () => {
  it("returns '' for no values", () => {
    expect(orGroup("element", [])).toBe("");
  });
  it("returns a bare comparison for one value", () => {
    expect(orGroup("element", ["C"])).toBe('element == "C"');
  });
  it("returns a parenthesized OR for several values", () => {
    expect(orGroup("element", ["C", "N"])).toBe('(element == "C" or element == "N")');
  });
});

describe("buildQueryFromChips", () => {
  it("returns '' when nothing is selected", () => {
    expect(buildQueryFromChips({})).toBe("");
  });

  it("ANDs non-empty category groups", () => {
    const q = buildQueryFromChips({ elements: ["C"], resnames: ["ALA", "GLY"] });
    expect(q).toBe('element == "C" and (resname == "ALA" or resname == "GLY")');
    expect(validateQuery(q).valid).toBe(true);
  });

  it("wraps in within when a positive radius is set", () => {
    const q = buildQueryFromChips({ resnames: ["HOH"], withinRadius: 5 });
    expect(q).toBe('within 5 of (resname == "HOH")');
    expect(validateQuery(q).valid).toBe(true);
  });

  it("ignores the radius when the base selection is empty", () => {
    expect(buildQueryFromChips({ withinRadius: 5 })).toBe("");
  });

  it("ignores a non-positive radius", () => {
    expect(buildQueryFromChips({ elements: ["C"], withinRadius: 0 })).toBe('element == "C"');
  });

  it("produces valid queries for chain chips", () => {
    const q = buildQueryFromChips({ chains: ["A", "B"] });
    expect(q).toBe('(chain == "A" or chain == "B")');
    expect(validateQuery(q).valid).toBe(true);
  });
});

describe("quickSelectExpression", () => {
  const atom = { index: 7, element: "Fe", resname: "HEM", chain: "A", moleculeId: 3 };
  it("selects by element", () => {
    expect(quickSelectExpression("element", atom)).toBe('element == "Fe"');
  });
  it("selects by resname", () => {
    expect(quickSelectExpression("resname", atom)).toBe('resname == "HEM"');
  });
  it("selects by chain", () => {
    expect(quickSelectExpression("chain", atom)).toBe('chain == "A"');
  });
  it("selects by molecule", () => {
    expect(quickSelectExpression("molecule", atom)).toBe("molecule_id == 3");
  });
  it("selects by index", () => {
    expect(quickSelectExpression("index", atom)).toBe("index == 7");
  });
  it("returns '' when a property is missing", () => {
    expect(quickSelectExpression("resname", { index: 1, element: "C" })).toBe("");
    expect(quickSelectExpression("molecule", { index: 1, element: "C" })).toBe("");
  });
});

describe("indicesToExpression", () => {
  it("returns 'none' for an empty set", () => {
    expect(indicesToExpression([])).toBe("none");
  });
  it("dedups and sorts indices", () => {
    expect(indicesToExpression([3, 1, 1, 2])).toBe("index == 1 or index == 2 or index == 3");
  });
});

import { describe, it, expect } from "vitest";
import { evaluateSelection, validateQuery } from "@/pipeline/selection";
import type { Snapshot } from "@/types";

/** Helper to build a small Snapshot for testing. */
function makeSnapshot(opts: {
  nAtoms: number;
  positions: number[];
  elements: number[];
  bonds?: number[];
  bondOrders?: number[];
  box?: number[];
}): Snapshot {
  return {
    nAtoms: opts.nAtoms,
    nBonds: (opts.bonds?.length ?? 0) / 2,
    nFileBonds: (opts.bonds?.length ?? 0) / 2,
    positions: new Float32Array(opts.positions),
    elements: new Uint8Array(opts.elements),
    bonds: new Uint32Array(opts.bonds ?? []),
    bondOrders: opts.bondOrders ? new Uint8Array(opts.bondOrders) : null,
    box: opts.box ? new Float32Array(opts.box) : null,
  };
}

// A small system: C(0), N(1), O(2), H(3), H(4)
// Positions: each at (index, 0, 0) for easy coordinate testing
const testSnapshot = makeSnapshot({
  nAtoms: 5,
  positions: [0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0],
  elements: [6, 7, 8, 1, 1], // C, N, O, H, H
});

const testLabels = ["ALA1", "ALA1", "GLY2", "GLY2", "GLY2"];

describe("evaluateSelection", () => {
  it("returns null for empty query", () => {
    expect(evaluateSelection("", testSnapshot, null)).toBeNull();
  });

  it("returns null for 'all'", () => {
    expect(evaluateSelection("all", testSnapshot, null)).toBeNull();
  });

  it("returns empty set for 'none'", () => {
    const result = evaluateSelection("none", testSnapshot, null);
    expect(result).toBeInstanceOf(Set);
    expect(result!.size).toBe(0);
  });

  it("filters by element == 'C'", () => {
    const result = evaluateSelection('element == "C"', testSnapshot, null);
    expect(result).toEqual(new Set([0]));
  });

  it("filters by element != 'H'", () => {
    const result = evaluateSelection('element != "H"', testSnapshot, null);
    expect(result).toEqual(new Set([0, 1, 2]));
  });

  it("filters by index > 2", () => {
    const result = evaluateSelection("index > 2", testSnapshot, null);
    expect(result).toEqual(new Set([3, 4]));
  });

  it("filters by index <= 1", () => {
    const result = evaluateSelection("index <= 1", testSnapshot, null);
    expect(result).toEqual(new Set([0, 1]));
  });

  it("filters by x coordinate", () => {
    const result = evaluateSelection("x >= 3", testSnapshot, null);
    expect(result).toEqual(new Set([3, 4]));
  });

  it("filters by mass > 14 (oxygen=16, nitrogen=14.007)", () => {
    const result = evaluateSelection("mass > 14.5", testSnapshot, null);
    expect(result).toEqual(new Set([2])); // only oxygen (mass 15.999)
  });

  it("filters by resname", () => {
    const result = evaluateSelection('resname == "ALA"', testSnapshot, testLabels);
    expect(result).toEqual(new Set([0, 1]));
  });

  it("handles 'and' operator", () => {
    const result = evaluateSelection('element == "H" and index > 3', testSnapshot, null);
    expect(result).toEqual(new Set([4]));
  });

  it("handles 'or' operator", () => {
    const result = evaluateSelection('element == "C" or element == "N"', testSnapshot, null);
    expect(result).toEqual(new Set([0, 1]));
  });

  it("handles 'not' operator", () => {
    const result = evaluateSelection('not element == "H"', testSnapshot, null);
    expect(result).toEqual(new Set([0, 1, 2]));
  });

  it("handles parenthesized grouping", () => {
    const result = evaluateSelection(
      '(element == "C" or element == "N") and x < 2',
      testSnapshot,
      null,
    );
    expect(result).toEqual(new Set([0, 1]));
  });

  it("handles nested not/and/or", () => {
    const result = evaluateSelection(
      'not (element == "H" or element == "O")',
      testSnapshot,
      null,
    );
    expect(result).toEqual(new Set([0, 1])); // C, N
  });

  it("returns null for whitespace-only query", () => {
    expect(evaluateSelection("   ", testSnapshot, null)).toBeNull();
  });
});

describe("validateQuery", () => {
  it("returns valid for empty query", () => {
    expect(validateQuery("")).toEqual({ valid: true });
  });

  it("returns valid for 'all'", () => {
    expect(validateQuery("all")).toEqual({ valid: true });
  });

  it("returns valid for 'none'", () => {
    expect(validateQuery("none")).toEqual({ valid: true });
  });

  it("returns valid for well-formed query", () => {
    expect(validateQuery('element == "C" and index > 5')).toEqual({ valid: true });
  });

  it("returns invalid for unknown identifier", () => {
    const result = validateQuery("foo == 1");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unknown identifier");
  });

  it("returns invalid for unterminated string", () => {
    const result = validateQuery('element == "C');
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unterminated string");
  });

  it("returns invalid for missing value", () => {
    const result = validateQuery("element ==");
    expect(result.valid).toBe(false);
  });

  it("returns invalid for unexpected character", () => {
    const result = validateQuery("element == @");
    expect(result.valid).toBe(false);
  });
});

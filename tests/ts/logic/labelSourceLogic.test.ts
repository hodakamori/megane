import { describe, it, expect, vi } from "vitest";

// Mock the WASM-dependent parsers/structure module
vi.mock("@/parsers/structure", () => ({
  extractLabelsFromFile: vi.fn().mockResolvedValue([]),
}));

import { computeLabelsForSource } from "@/logic/labelSourceLogic";
import type { LabelSourceRefs } from "@/logic/labelSourceLogic";

function makeRefs(overrides: Partial<LabelSourceRefs> = {}): LabelSourceRefs {
  return {
    structureLabels: null,
    fileLabels: null,
    ...overrides,
  };
}

describe("computeLabelsForSource", () => {
  it('returns null for "none"', () => {
    const result = computeLabelsForSource("none", makeRefs(), 5);
    expect(result).toBeNull();
  });

  it('returns structure labels when available for "structure"', () => {
    const labels = ["CA", "CB", "N", "O"];
    const refs = makeRefs({ structureLabels: labels });
    const result = computeLabelsForSource("structure", refs, 4);
    expect(result).toEqual(labels);
  });

  it('returns 1-based indices as fallback for "structure" when no labels', () => {
    const result = computeLabelsForSource("structure", makeRefs(), 3);
    expect(result).toEqual(["1", "2", "3"]);
  });

  it('returns file labels for "file"', () => {
    const labels = ["L1", "L2"];
    const refs = makeRefs({ fileLabels: labels });
    const result = computeLabelsForSource("file", refs, 2);
    expect(result).toEqual(labels);
  });

  it('returns null for "file" when no file labels loaded', () => {
    const result = computeLabelsForSource("file", makeRefs(), 2);
    expect(result).toBeNull();
  });

  it("fallback generates correct length array", () => {
    const result = computeLabelsForSource("structure", makeRefs(), 100);
    expect(result).toHaveLength(100);
    expect(result![0]).toBe("1");
    expect(result![99]).toBe("100");
  });
});

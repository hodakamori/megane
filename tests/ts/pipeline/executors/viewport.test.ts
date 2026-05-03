import { describe, it, expect } from "vitest";
import { executeViewport } from "@/pipeline/executors/viewport";
import type { ViewportParams } from "@/pipeline/types";

const baseParams: ViewportParams = {
  type: "viewport",
  perspective: false,
  cellAxesVisible: true,
  pivotMarkerVisible: true,
};

describe("executeViewport — colorScheme", () => {
  it("defaults to byElement when params.colorScheme is undefined", () => {
    const state = executeViewport(baseParams, new Map());
    expect(state.colorScheme).toBe("byElement");
  });

  it("propagates an explicit colorScheme through to ViewportState", () => {
    const state = executeViewport(
      { ...baseParams, colorScheme: "byChain" },
      new Map(),
    );
    expect(state.colorScheme).toBe("byChain");
  });

  it("supports every documented scheme", () => {
    const schemes = ["byElement", "byResidue", "byChain", "byBFactor", "byProperty"] as const;
    for (const scheme of schemes) {
      const state = executeViewport({ ...baseParams, colorScheme: scheme }, new Map());
      expect(state.colorScheme).toBe(scheme);
    }
  });
});

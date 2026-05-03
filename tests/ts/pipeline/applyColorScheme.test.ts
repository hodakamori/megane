import { describe, it, expect, vi } from "vitest";
import { applyViewportState } from "@/pipeline/apply";
import { DEFAULT_VIEWPORT_STATE, type ViewportState } from "@/pipeline/types";
import type { MoleculeRenderer } from "@/renderer/MoleculeRenderer";

function makeRendererStub() {
  return {
    setAtomsVisible: vi.fn(),
    setCellVisible: vi.fn(),
    setBondsVisible: vi.fn(),
    getOrCreateLayer: vi.fn(),
    removeInactiveLayers: vi.fn(),
    setPerspective: vi.fn(),
    setCellAxesVisible: vi.fn(),
    setPivotMarkerVisible: vi.fn(),
    setColorScheme: vi.fn(),
    setLabels: vi.fn(),
    loadPolyhedra: vi.fn(),
    clearPolyhedra: vi.fn(),
    setVectors: vi.fn(),
    clearAtomOverrides: vi.fn(),
    setAtomScale: vi.fn(),
    setAtomOpacity: vi.fn(),
    setAtomScaleOverrides: vi.fn(),
    setAtomOpacityOverrides: vi.fn(),
    updateBondsExt: vi.fn(),
    setBondScale: vi.fn(),
    setBondOpacity: vi.fn(),
    setBondOpacityOverrides: vi.fn(),
    clearBondOpacityOverrides: vi.fn(),
  };
}

describe("applyViewportState — colorScheme", () => {
  it("calls setColorScheme on initial apply (previous = null)", () => {
    const renderer = makeRendererStub();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      DEFAULT_VIEWPORT_STATE,
      null,
    );
    expect(renderer.setColorScheme).toHaveBeenCalledTimes(1);
    expect(renderer.setColorScheme).toHaveBeenCalledWith("byElement", null);
  });

  it("forwards atomLabels through to the renderer", () => {
    const renderer = makeRendererStub();
    const labels = ["ALA1", "GLY2"];
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE, colorScheme: "byResidue" },
      null,
      undefined,
      labels,
    );
    expect(renderer.setColorScheme).toHaveBeenCalledWith("byResidue", labels);
  });

  it("does not re-invoke setColorScheme when the scheme is unchanged", () => {
    const renderer = makeRendererStub();
    const prev: ViewportState = { ...DEFAULT_VIEWPORT_STATE, colorScheme: "byChain" };
    const next: ViewportState = { ...DEFAULT_VIEWPORT_STATE, colorScheme: "byChain" };
    applyViewportState(renderer as unknown as MoleculeRenderer, next, prev);
    expect(renderer.setColorScheme).not.toHaveBeenCalled();
  });

  it("re-invokes setColorScheme when the scheme transitions", () => {
    const renderer = makeRendererStub();
    const prev: ViewportState = { ...DEFAULT_VIEWPORT_STATE, colorScheme: "byElement" };
    const next: ViewportState = { ...DEFAULT_VIEWPORT_STATE, colorScheme: "byBFactor" };
    applyViewportState(renderer as unknown as MoleculeRenderer, next, prev);
    expect(renderer.setColorScheme).toHaveBeenCalledTimes(1);
    expect(renderer.setColorScheme).toHaveBeenCalledWith("byBFactor", null);
  });

  it("treats a missing colorScheme on previous state as byElement", () => {
    const renderer = makeRendererStub();
    const prev = { ...DEFAULT_VIEWPORT_STATE } as ViewportState;
    delete (prev as Partial<ViewportState>).colorScheme;
    const next: ViewportState = { ...DEFAULT_VIEWPORT_STATE, colorScheme: "byElement" };
    applyViewportState(renderer as unknown as MoleculeRenderer, next, prev);
    expect(renderer.setColorScheme).not.toHaveBeenCalled();
  });
});

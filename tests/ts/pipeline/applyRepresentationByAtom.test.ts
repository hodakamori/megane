import { describe, it, expect, vi } from "vitest";
import { applyViewportState } from "@/pipeline/apply";
import { DEFAULT_VIEWPORT_STATE, type ViewportState, type RepresentationMode } from "@/pipeline/types";
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
    setRepresentationType: vi.fn(),
    setRepresentationByAtom: vi.fn(),
    setLabels: vi.fn(),
    loadPolyhedra: vi.fn(),
    clearPolyhedra: vi.fn(),
    setVectors: vi.fn(),
    clearAtomOverrides: vi.fn(),
    setAtomScale: vi.fn(),
    setAtomOpacity: vi.fn(),
    setAtomScaleOverrides: vi.fn(),
    setAtomOpacityOverrides: vi.fn(),
    applyAtomColorOverrides: vi.fn(),
    updateBondsExt: vi.fn(),
    setBondScale: vi.fn(),
    setBondOpacity: vi.fn(),
    setBondOpacityOverrides: vi.fn(),
    clearBondOpacityOverrides: vi.fn(),
  };
}

function stateWith(byAtom: RepresentationMode[] | null, mode: RepresentationMode): ViewportState {
  return { ...DEFAULT_VIEWPORT_STATE, representationMode: mode, representationByAtom: byAtom };
}

describe("applyViewportState — per-atom representation wiring", () => {
  it("forwards representationByAtom to the renderer on first apply", () => {
    const renderer = makeRendererStub();
    const byAtom: RepresentationMode[] = ["line", "atoms"];
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      stateWith(byAtom, "atoms"),
      null,
    );
    expect(renderer.setRepresentationByAtom).toHaveBeenCalledWith(byAtom);
  });

  it("re-applies when the per-atom array changes between frames", () => {
    const renderer = makeRendererStub();
    const prev = stateWith(["line", "atoms"], "atoms");
    const next = stateWith(["atoms", "line"], "atoms");
    applyViewportState(renderer as unknown as MoleculeRenderer, next, prev);
    expect(renderer.setRepresentationByAtom).toHaveBeenCalledWith(["atoms", "line"]);
  });

  it("skips the call when the per-atom array is unchanged (value-equal)", () => {
    const renderer = makeRendererStub();
    const prev = stateWith(["line", "atoms"], "atoms");
    const next = stateWith(["line", "atoms"], "atoms"); // equal by value, different ref
    applyViewportState(renderer as unknown as MoleculeRenderer, next, prev);
    expect(renderer.setRepresentationByAtom).not.toHaveBeenCalled();
  });

  it("re-applies when the global mode changes even if the array is stable", () => {
    const renderer = makeRendererStub();
    const arr: RepresentationMode[] = ["line", "atoms"];
    const prev = stateWith(arr, "atoms");
    const next = stateWith(arr, "licorice");
    applyViewportState(renderer as unknown as MoleculeRenderer, next, prev);
    expect(renderer.setRepresentationByAtom).toHaveBeenCalledWith(arr);
  });

  it("passes null through for the uniform fast path", () => {
    const renderer = makeRendererStub();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      stateWith(null, "line"),
      null,
    );
    expect(renderer.setRepresentationByAtom).toHaveBeenCalledWith(null);
  });
});

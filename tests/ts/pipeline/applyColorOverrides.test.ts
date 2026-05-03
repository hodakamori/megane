import { describe, it, expect, vi } from "vitest";
import { applyViewportState } from "@/pipeline/apply";
import { DEFAULT_VIEWPORT_STATE, type ParticleData } from "@/pipeline/types";
import { NO_OVERRIDE } from "@/pipeline/colorWriter";
import type { MoleculeRenderer } from "@/renderer/MoleculeRenderer";
import type { Snapshot } from "@/types";

function makeSnapshot(nAtoms: number): Snapshot {
  return {
    nAtoms,
    nBonds: 0,
    positions: new Float32Array(nAtoms * 3),
    elements: new Uint8Array(nAtoms),
    bonds: new Uint32Array(),
    bondOrders: null,
  } as Snapshot;
}

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

function makeParticle(
  sourceNodeId: string,
  nAtoms: number,
  colorOverrides: Float32Array | null,
): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(nAtoms),
    sourceNodeId,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides,
  };
}

describe("applyViewportState — colorOverrides merge", () => {
  it("forwards the colorOverrides from a single particle stream verbatim", () => {
    const renderer = makeRendererStub();
    const overrides = new Float32Array(6);
    overrides.fill(NO_OVERRIDE);
    overrides[0] = 1;
    overrides[1] = 0;
    overrides[2] = 0;

    const particle = makeParticle("loader", 2, overrides);
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE, particles: [particle] },
      null,
    );

    expect(renderer.applyAtomColorOverrides).toHaveBeenCalledTimes(1);
    const arg = renderer.applyAtomColorOverrides.mock.calls[0][0] as Float32Array;
    expect(arg[0]).toBe(1);
    expect(arg[1]).toBe(0);
    expect(arg[2]).toBe(0);
    // Identity must be a copy, not the original buffer (immutability guarantee).
    expect(arg).not.toBe(overrides);
  });

  it("passes null when no particle stream carries colorOverrides", () => {
    const renderer = makeRendererStub();
    const particle = makeParticle("loader", 2, null);
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE, particles: [particle] },
      null,
    );
    expect(renderer.applyAtomColorOverrides).toHaveBeenCalledWith(null);
  });

  it("merges two streams with last-write semantics on non-NaN entries", () => {
    const renderer = makeRendererStub();
    const a = new Float32Array(6);
    a.fill(NO_OVERRIDE);
    a[0] = 1;
    a[1] = 0;
    a[2] = 0;

    const b = new Float32Array(6);
    b.fill(NO_OVERRIDE);
    b[3] = 0;
    b[4] = 0;
    b[5] = 1;

    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      {
        ...DEFAULT_VIEWPORT_STATE,
        particles: [makeParticle("loader", 2, a), makeParticle("loader", 2, b)],
      },
      null,
    );
    const arg = renderer.applyAtomColorOverrides.mock.calls[0][0] as Float32Array;
    // atom 0 from stream a, atom 1 from stream b
    expect(arg[0]).toBe(1);
    expect(arg[5]).toBe(1);
  });

  it("the second stream wins on overlapping (non-NaN) atoms", () => {
    const renderer = makeRendererStub();
    const a = new Float32Array(3);
    a.fill(NO_OVERRIDE);
    a[0] = 1;
    a[1] = 0;
    a[2] = 0;

    const b = new Float32Array(3);
    b.fill(NO_OVERRIDE);
    b[0] = 0;
    b[1] = 1;
    b[2] = 0;

    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      {
        ...DEFAULT_VIEWPORT_STATE,
        particles: [makeParticle("loader", 1, a), makeParticle("loader", 1, b)],
      },
      null,
    );
    const arg = renderer.applyAtomColorOverrides.mock.calls[0][0] as Float32Array;
    expect(arg[0]).toBe(0);
    expect(arg[1]).toBe(1);
    expect(arg[2]).toBe(0);
  });

  it("transitions to null when the particle stream count drops to zero", () => {
    const renderer = makeRendererStub();
    const overrides = new Float32Array(3);
    overrides.fill(NO_OVERRIDE);
    overrides[0] = 1;
    overrides[1] = 0.5;
    overrides[2] = 0.25;

    const prev = {
      ...DEFAULT_VIEWPORT_STATE,
      particles: [makeParticle("loader", 1, overrides)],
    };
    const next = { ...DEFAULT_VIEWPORT_STATE, particles: [] };
    applyViewportState(renderer as unknown as MoleculeRenderer, next, prev, "loader");
    expect(renderer.applyAtomColorOverrides).toHaveBeenCalledWith(null);
  });
});

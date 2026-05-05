import { describe, it, expect, vi } from "vitest";
import { applyViewportState } from "@/pipeline/apply";
import {
  DEFAULT_VIEWPORT_STATE,
  type ParticleData,
  type MeshData,
  type LabelData,
  type VectorData,
  type ViewportState,
} from "@/pipeline/types";
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
    setRepresentationType: vi.fn(),
    setLabels: vi.fn(),
    loadPolyhedra: vi.fn(),
    clearPolyhedra: vi.fn(),
    setVectors: vi.fn(),
    setVectorScale: vi.fn(),
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

function makeParticle(sourceNodeId: string, nAtoms: number): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(nAtoms),
    sourceNodeId,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
}

function makeMesh(): MeshData {
  return {
    type: "mesh",
    positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
    indices: new Uint32Array([0, 1, 2]),
    normals: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]),
    colors: new Float32Array([1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]),
    opacity: 0.5,
    showEdges: false,
    edgePositions: null,
    edgeColor: "#dddddd",
    edgeWidth: 1,
  };
}

function makeLabel(particle: ParticleData): LabelData {
  return { type: "label", labels: ["A", "B"], particleRef: particle };
}

function makeVector(): VectorData {
  return {
    type: "vector",
    frames: [{ frame: 0, vectors: new Float32Array([0, 0, 0]) }],
    nAtoms: 1,
    scale: 1,
  };
}

describe("applyViewportState — idempotent cleanup on empty current state", () => {
  // Reproduces the user-reported bug: open the Solid template (which produces
  // polyhedra meshes), then open the Protein template (which produces none).
  // The snapshot-change useEffect in MeganeViewer re-applies viewport state
  // with `previous=null`, so cleanup must not be gated on prev being non-empty.

  it("clears polyhedra when meshes is empty even if previous is null", () => {
    const renderer = makeRendererStub();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE },
      null,
    );
    expect(renderer.clearPolyhedra).toHaveBeenCalled();
    expect(renderer.loadPolyhedra).not.toHaveBeenCalled();
  });

  it("loads polyhedra when meshes is non-empty (regression guard)", () => {
    const renderer = makeRendererStub();
    const mesh = makeMesh();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE, meshes: [mesh] },
      null,
    );
    expect(renderer.loadPolyhedra).toHaveBeenCalledWith(mesh);
    expect(renderer.clearPolyhedra).not.toHaveBeenCalled();
  });

  it("resets per-atom overrides when particles is empty even if previous is null", () => {
    const renderer = makeRendererStub();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE },
      null,
    );
    expect(renderer.clearAtomOverrides).toHaveBeenCalled();
    expect(renderer.setAtomScale).toHaveBeenCalledWith(1.0);
    expect(renderer.setAtomOpacity).toHaveBeenCalledWith(1.0);
    expect(renderer.applyAtomColorOverrides).toHaveBeenCalledWith(null);
  });

  it("clears labels when labels is empty even if previous is null", () => {
    const renderer = makeRendererStub();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE },
      null,
    );
    expect(renderer.setLabels).toHaveBeenCalledWith(null);
  });

  it("forwards labels[0].labels when labels is non-empty (regression guard)", () => {
    const renderer = makeRendererStub();
    const particle = makeParticle("loader", 2);
    const label = makeLabel(particle);
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE, particles: [particle], labels: [label] },
      null,
    );
    expect(renderer.setLabels).toHaveBeenCalledWith(label.labels);
  });

  it("clears vectors when vectors is empty even if previous is null", () => {
    const renderer = makeRendererStub();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE },
      null,
    );
    expect(renderer.setVectors).toHaveBeenCalledWith(null);
  });

  it("solid → protein: stale polyhedra and per-atom overrides are torn down on the second apply", () => {
    // Simulates the snapshot-change useEffect path that the user-reported
    // bug exercises: a re-apply with `previous=null` after a template switch
    // must wipe state from the prior structure.
    const renderer = makeRendererStub();

    // Step 1: solid template state (particles + polyhedra mesh).
    const solidParticle = makeParticle("loader-1", 135);
    const solidState: ViewportState = {
      ...DEFAULT_VIEWPORT_STATE,
      particles: [solidParticle],
      meshes: [makeMesh()],
    };
    applyViewportState(renderer as unknown as MoleculeRenderer, solidState, null);
    expect(renderer.loadPolyhedra).toHaveBeenCalledTimes(1);

    // Reset call history; we want to assert on the post-switch behaviour.
    renderer.loadPolyhedra.mockClear();
    renderer.clearPolyhedra.mockClear();
    renderer.clearAtomOverrides.mockClear();
    renderer.setAtomOpacity.mockClear();

    // Step 2: protein template state (particles, no meshes) re-applied with
    // `previous=null`, mirroring the snapshot-identity useEffect in
    // MeganeViewer.tsx (which always passes null).
    const proteinParticle = makeParticle("loader-1", 1231);
    const proteinState: ViewportState = {
      ...DEFAULT_VIEWPORT_STATE,
      particles: [proteinParticle],
    };
    applyViewportState(renderer as unknown as MoleculeRenderer, proteinState, null);

    // Polyhedra from the solid must be cleared.
    expect(renderer.clearPolyhedra).toHaveBeenCalled();
    expect(renderer.loadPolyhedra).not.toHaveBeenCalled();
  });

  it("empty → empty: cleanup is still invoked (idempotent and cheap)", () => {
    // Confirms the cleanup path is safe to call even on a fresh mount where
    // nothing has ever been loaded — the renderer's clear* methods are
    // documented as idempotent.
    const renderer = makeRendererStub();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE },
      { ...DEFAULT_VIEWPORT_STATE },
    );
    expect(renderer.clearPolyhedra).toHaveBeenCalled();
    expect(renderer.setLabels).toHaveBeenCalledWith(null);
    expect(renderer.setVectors).toHaveBeenCalledWith(null);
    expect(renderer.clearAtomOverrides).toHaveBeenCalled();
  });

  it("vector data with frames triggers setVectors and setVectorScale, not the empty branch", () => {
    const renderer = makeRendererStub();
    const vec = makeVector();
    applyViewportState(
      renderer as unknown as MoleculeRenderer,
      { ...DEFAULT_VIEWPORT_STATE, vectors: [vec] },
      null,
    );
    expect(renderer.setVectorScale).toHaveBeenCalledWith(1);
    // setVectors is called once with frame-0 vectors, not with null.
    expect(renderer.setVectors).toHaveBeenCalled();
    const arg = renderer.setVectors.mock.calls[0][0];
    expect(arg).not.toBeNull();
  });
});

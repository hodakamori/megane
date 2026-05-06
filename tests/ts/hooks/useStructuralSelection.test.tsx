import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStructuralSelection } from "@/hooks/useStructuralSelection";
import type { Snapshot } from "@/types";
import type { MoleculeRenderer } from "@/renderer/MoleculeRenderer";

function makeSnapshot(overrides: Partial<Snapshot> = {}): Snapshot {
  const n = 6;
  return {
    nAtoms: n,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(n * 3),
    elements: new Uint8Array(n).fill(6),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    atomChainIds: new Uint8Array([65, 65, 65, 66, 66, 66]),
    atomBFactors: null,
    atomResNums: new Uint32Array([1, 1, 1, 2, 2, 2]),
    ...overrides,
  };
}

function makeRenderer(overrides: Partial<MoleculeRenderer> = {}) {
  return {
    setStructuralSelection: vi.fn(),
    clearStructuralSelection: vi.fn(),
    ...overrides,
  } as unknown as MoleculeRenderer;
}

describe("useStructuralSelection", () => {
  it("starts with empty structural selection", () => {
    const rendererRef = { current: makeRenderer() };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    expect(result.current.structuralSelection.atoms).toEqual([]);
    expect(result.current.granularity).toBe("atom");
  });

  it("setGranularity updates the granularity", () => {
    const rendererRef = { current: makeRenderer() };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.setGranularity("residue"));
    expect(result.current.granularity).toBe("residue");
  });

  it("handleAtomClick selects an atom in atom mode", () => {
    const renderer = makeRenderer();
    const rendererRef = { current: renderer };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.handleAtomClick(2, false));
    expect(result.current.structuralSelection.atoms).toEqual([2]);
    expect(renderer.setStructuralSelection).toHaveBeenCalledWith([2]);
  });

  it("handleAtomClick expands to residue in residue mode", () => {
    const renderer = makeRenderer();
    const rendererRef = { current: renderer };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.setGranularity("residue"));
    act(() => result.current.handleAtomClick(1, false));
    // Atoms 0,1,2 share residue 1 / chain A
    expect(result.current.structuralSelection.atoms).toEqual([0, 1, 2]);
  });

  it("shift+click adds to selection (additive)", () => {
    const renderer = makeRenderer();
    const rendererRef = { current: renderer };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.handleAtomClick(0, false));
    act(() => result.current.handleAtomClick(3, true));
    expect(result.current.structuralSelection.atoms).toContain(0);
    expect(result.current.structuralSelection.atoms).toContain(3);
  });

  it("clicking same atom again deselects it (non-additive)", () => {
    const renderer = makeRenderer();
    const rendererRef = { current: renderer };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.handleAtomClick(0, false));
    expect(result.current.structuralSelection.atoms).toEqual([0]);
    act(() => result.current.handleAtomClick(0, false));
    expect(result.current.structuralSelection.atoms).toEqual([]);
  });

  it("clearStructuralSelection empties the selection", () => {
    const renderer = makeRenderer();
    const rendererRef = { current: renderer };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.handleAtomClick(2, false));
    act(() => result.current.clearStructuralSelection());
    expect(result.current.structuralSelection.atoms).toEqual([]);
    expect(renderer.setStructuralSelection).toHaveBeenCalledWith([]);
  });

  it("does nothing when renderer is null", () => {
    const rendererRef = { current: null as unknown as MoleculeRenderer };
    const snapshotRef = { current: makeSnapshot() };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.handleAtomClick(0, false));
    expect(result.current.structuralSelection.atoms).toEqual([]);
  });

  it("does nothing when snapshot is null", () => {
    const renderer = makeRenderer();
    const rendererRef = { current: renderer };
    const snapshotRef = { current: null as unknown as Snapshot };
    const { result } = renderHook(() => useStructuralSelection(rendererRef, snapshotRef));
    act(() => result.current.handleAtomClick(0, false));
    expect(result.current.structuralSelection.atoms).toEqual([]);
    expect(renderer.setStructuralSelection).not.toHaveBeenCalled();
  });
});

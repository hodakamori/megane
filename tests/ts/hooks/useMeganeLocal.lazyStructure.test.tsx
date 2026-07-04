/**
 * Tests the lazy multi-frame structure path in useMeganeLocal.loadFile. ONE file
 * read: indexStructureLazy returns the streaming handle AND frame 0 together, so
 * frame 0 renders immediately while the rest stream through the structureProvider
 * channel. Single-frame files render statically (no eager re-parse); only a null
 * index (worker unavailable / failure) falls back to the eager parser.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { StructureParseResult } from "@/parsers/parseCore";

const indexMock = vi.hoisted(() => vi.fn());
const parseFileMock = vi.hoisted(() => vi.fn());
const disposeMock = vi.hoisted(() => vi.fn());

vi.mock("@/parsers/structure", () => ({
  parseStructureFile: parseFileMock,
  parseStructureText: vi.fn(),
  indexStructureLazy: indexMock,
  shouldUseLazyStructure: () => true,
}));

vi.mock("@/parsers/xtc", () => ({
  parseXTCFile: vi.fn(),
  parseLammpstrjFile: vi.fn(),
  parseDCDFile: vi.fn(),
  parseNetCDFFile: vi.fn(),
  indexTrajectoryLazy: vi.fn(),
  // Never resolves → prefetch stays in-flight, no async-frame side effects in the test.
  decodeTrajectoryFrame: vi.fn(() => new Promise<never>(() => {})),
  disposeTrajectoryLazy: disposeMock,
  shouldUseLazyTrajectory: () => false,
}));

import { useMeganeLocal } from "@/hooks/useMeganeLocal";
import { usePipelineStore } from "@/pipeline/store";

function makeFrame0(): StructureParseResult {
  return {
    snapshot: {
      nAtoms: 3,
      positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
      elements: new Uint8Array([6, 1, 1]),
      bonds: new Uint32Array(0),
      box: null,
    },
    frames: [],
    meta: null,
    labels: null,
    vectorChannels: [],
  } as unknown as StructureParseResult;
}

/** Build the `indexStructureLazy` result: { handle, frame0 }. */
function indexed(
  trajectoryId: number,
  kind: "xyz" | "pdb",
  nFrames: number,
  frame0: StructureParseResult,
) {
  return { handle: { trajectoryId, kind, index: { nAtoms: 3, nFrames } }, frame0 };
}

describe("useMeganeLocal — lazy multi-frame structure", () => {
  beforeEach(() => {
    indexMock.mockReset();
    parseFileMock.mockReset();
    disposeMock.mockReset();
    usePipelineStore.getState().reset();
  });

  it("streams extra frames through the structureProvider channel (XYZ)", async () => {
    const f0 = makeFrame0();
    indexMock.mockResolvedValue(indexed(1, "xyz", 5, f0));

    const { result } = renderHook(() => useMeganeLocal());
    await act(async () => {
      await result.current.loadFile(new File(["dummy"], "big.xyz"));
    });

    const store = usePipelineStore.getState();
    expect(store.structureProvider).not.toBeNull();
    // Provider exposes extra frames + the synthetic frame 0.
    expect(store.structureProvider!.meta.nFrames).toBe(6);
    // Eager frame channels stay empty; the provider is the live source.
    expect(store.structureFrames).toBeNull();
    expect(store.fileFrames).toBeNull();
    // Eager full-file parse was never invoked — frame 0 came from the single index read.
    expect(parseFileMock).not.toHaveBeenCalled();
    expect(result.current.snapshot).toBe(f0.snapshot);
    expect(result.current.hasStructureFrames).toBe(true);
    expect(result.current.meta?.nFrames).toBe(6);
    expect(result.current.pdbFileName).toBe("big.xyz");
  });

  it("streams a large multi-MODEL PDB through the structureProvider channel", async () => {
    const f0 = makeFrame0();
    indexMock.mockResolvedValue(indexed(9, "pdb", 2, f0));

    const { result } = renderHook(() => useMeganeLocal());
    await act(async () => {
      await result.current.loadFile(new File(["dummy"], "traj.pdb"));
    });

    const store = usePipelineStore.getState();
    expect(store.structureProvider).not.toBeNull();
    expect(store.structureProvider!.meta.nFrames).toBe(3); // 2 models + frame 0
    expect(parseFileMock).not.toHaveBeenCalled();
    expect(result.current.snapshot).toBe(f0.snapshot);
  });

  it("renders a single-frame file statically without an eager re-parse", async () => {
    const f0 = makeFrame0();
    indexMock.mockResolvedValue(indexed(2, "xyz", 0, f0));

    const { result } = renderHook(() => useMeganeLocal());
    await act(async () => {
      await result.current.loadFile(new File(["dummy"], "single.xyz"));
    });

    // Single frame → frame 0 IS the whole structure: render statically, free the
    // decoder, and DO NOT pay a second full parse.
    expect(disposeMock).toHaveBeenCalledWith(2);
    expect(parseFileMock).not.toHaveBeenCalled();
    expect(usePipelineStore.getState().structureProvider).toBeNull();
    expect(result.current.snapshot).toBe(f0.snapshot);
    expect(result.current.hasStructureFrames).toBe(false);
  });

  it("falls back to eager parse when indexing is unavailable (null)", async () => {
    indexMock.mockResolvedValue(null);
    const eager = makeFrame0();
    parseFileMock.mockResolvedValue(eager);

    const { result } = renderHook(() => useMeganeLocal());
    await act(async () => {
      await result.current.loadFile(new File(["dummy"], "x.xyz"));
    });

    expect(parseFileMock).toHaveBeenCalledTimes(1);
    expect(usePipelineStore.getState().structureProvider).toBeNull();
    expect(result.current.snapshot).toBe(eager.snapshot);
  });
});

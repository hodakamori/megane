/**
 * Tests the lazy multi-frame structure path in useMeganeLocal.loadFile:
 * a large .xyz parses frame 0 eagerly and streams its extra frames through the
 * pipeline's structureProvider channel, falling back to eager parse when the
 * file has no extra frames.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { StructureParseResult } from "@/parsers/parseCore";

const parseFrame0Mock = vi.hoisted(() => vi.fn());
const indexMock = vi.hoisted(() => vi.fn());
const parseFileMock = vi.hoisted(() => vi.fn());
const disposeMock = vi.hoisted(() => vi.fn());

vi.mock("@/parsers/structure", () => ({
  parseStructureFile: parseFileMock,
  parseStructureText: vi.fn(),
  parseStructureFrame0: parseFrame0Mock,
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

describe("useMeganeLocal — lazy multi-frame XYZ", () => {
  beforeEach(() => {
    parseFrame0Mock.mockReset();
    indexMock.mockReset();
    parseFileMock.mockReset();
    disposeMock.mockReset();
    usePipelineStore.getState().reset();
  });

  it("streams extra frames through the structureProvider channel", async () => {
    const f0 = makeFrame0();
    parseFrame0Mock.mockResolvedValue(f0);
    indexMock.mockResolvedValue({ trajectoryId: 1, kind: "xyz", index: { nAtoms: 3, nFrames: 5 } });

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
    // Eager full-file parse was never invoked.
    expect(parseFileMock).not.toHaveBeenCalled();
    expect(result.current.snapshot).toBe(f0.snapshot);
    expect(result.current.hasStructureFrames).toBe(true);
    expect(result.current.meta?.nFrames).toBe(6);
    expect(result.current.pdbFileName).toBe("big.xyz");
  });

  it("streams a large multi-MODEL PDB through the structureProvider channel", async () => {
    const f0 = makeFrame0();
    parseFrame0Mock.mockResolvedValue(f0);
    indexMock.mockResolvedValue({ trajectoryId: 9, kind: "pdb", index: { nAtoms: 3, nFrames: 2 } });

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

  it("falls back to eager parse when the file has no extra frames", async () => {
    parseFrame0Mock.mockResolvedValue(makeFrame0());
    indexMock.mockResolvedValue({ trajectoryId: 2, kind: "xyz", index: { nAtoms: 3, nFrames: 0 } });
    const eager = makeFrame0();
    parseFileMock.mockResolvedValue(eager);

    const { result } = renderHook(() => useMeganeLocal());
    await act(async () => {
      await result.current.loadFile(new File(["dummy"], "single.xyz"));
    });

    // The single-frame index decoder is freed and the eager parser runs.
    expect(disposeMock).toHaveBeenCalledWith(2);
    expect(parseFileMock).toHaveBeenCalledTimes(1);
    expect(usePipelineStore.getState().structureProvider).toBeNull();
    expect(result.current.snapshot).toBe(eager.snapshot);
  });

  it("falls back to eager parse (and frees the decoder) when frame 0 fails", async () => {
    // Index succeeds with extra frames, but the frame-0 parse fails → the
    // decoder is disposed and the eager parser takes over.
    indexMock.mockResolvedValue({ trajectoryId: 7, kind: "xyz", index: { nAtoms: 3, nFrames: 4 } });
    parseFrame0Mock.mockResolvedValue(null);
    const eager = makeFrame0();
    parseFileMock.mockResolvedValue(eager);

    const { result } = renderHook(() => useMeganeLocal());
    await act(async () => {
      await result.current.loadFile(new File(["dummy"], "weird.xyz"));
    });

    expect(disposeMock).toHaveBeenCalledWith(7);
    expect(parseFileMock).toHaveBeenCalledTimes(1);
    expect(usePipelineStore.getState().structureProvider).toBeNull();
    expect(result.current.snapshot).toBe(eager.snapshot);
  });
});

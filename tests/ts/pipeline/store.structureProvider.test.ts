import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePipelineStore } from "@/pipeline/store";
import { LazyFrameProvider } from "@/stream/LazyFrameProvider";
import type { TrajectoryMeta, Frame } from "@/types";

const meta: TrajectoryMeta = { nFrames: 4, timestepPs: 1, nAtoms: 3 };
const eagerFrames: Frame[] = [{ frameId: 0, nAtoms: 3, positions: new Float32Array(9) }];

// A structure-file lazy provider: minimal handle (trajectoryId + nAtoms/nFrames)
// with a basePositions frame 0 — the shape produced by indexStructureLazy.
function makeStructureProvider(dispose: () => void, trajectoryId = 1): LazyFrameProvider {
  return new LazyFrameProvider(
    { trajectoryId, index: { nAtoms: 3, nFrames: 3 } },
    meta,
    {
      decode: () =>
        Promise.resolve({
          positions: new Float32Array(9),
          vectors: new Float32Array(0),
          vectorChannelCount: 0,
        }),
      dispose,
      prefetchAhead: 0,
      basePositions: new Float32Array(9).fill(1),
    },
  );
}

describe("pipeline store — structureProvider channel", () => {
  beforeEach(() => {
    usePipelineStore.getState().reset();
  });

  it("stores the provider and clears the eager structure-frame channel", () => {
    const store = usePipelineStore.getState();
    store.setStructureFrames(eagerFrames, meta);
    expect(usePipelineStore.getState().structureFrames).not.toBeNull();

    const p = makeStructureProvider(vi.fn());
    store.setStructureProvider(p);

    const s = usePipelineStore.getState();
    expect(s.structureProvider).toBe(p);
    expect(s.structureFrames).toBeNull();
    expect(s.structureMeta).toBeNull();
  });

  it("disposes the previous lazy provider when replaced", () => {
    const disposeA = vi.fn();
    usePipelineStore.getState().setStructureProvider(makeStructureProvider(disposeA, 1));
    usePipelineStore.getState().setStructureProvider(makeStructureProvider(vi.fn(), 2));

    expect(disposeA).toHaveBeenCalledExactlyOnceWith(1);
    expect(usePipelineStore.getState().structureProvider).not.toBeNull();
  });

  it("disposes the provider when eager frames replace it", () => {
    const dispose = vi.fn();
    usePipelineStore.getState().setStructureProvider(makeStructureProvider(dispose, 3));
    usePipelineStore.getState().setStructureFrames(eagerFrames, meta);
    expect(dispose).toHaveBeenCalledExactlyOnceWith(3);
    expect(usePipelineStore.getState().structureProvider).toBeNull();
  });

  it("disposes the provider on reset", () => {
    const dispose = vi.fn();
    usePipelineStore.getState().setStructureProvider(makeStructureProvider(dispose, 4));
    usePipelineStore.getState().reset();
    expect(dispose).toHaveBeenCalledExactlyOnceWith(4);
    expect(usePipelineStore.getState().structureProvider).toBeNull();
  });

  it("disposes the provider on deserialize (document swap)", () => {
    const dispose = vi.fn();
    usePipelineStore.getState().setStructureProvider(makeStructureProvider(dispose, 5));
    usePipelineStore.getState().deserialize(usePipelineStore.getState().serialize());
    expect(dispose).toHaveBeenCalledExactlyOnceWith(5);
    expect(usePipelineStore.getState().structureProvider).toBeNull();
  });
});

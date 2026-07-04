import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePipelineStore } from "@/pipeline/store";
import { LazyFrameProvider } from "@/stream/LazyFrameProvider";
import type { XtcLazyHandle } from "@/parsers/parseClient";
import type { TrajectoryMeta, Frame } from "@/types";

const meta: TrajectoryMeta = { nFrames: 5, timestepPs: 1, nAtoms: 2 };
const eagerFrames: Frame[] = [{ frameId: 0, nAtoms: 2, positions: new Float32Array(6) }];

function makeProvider(dispose: () => void, trajectoryId = 1): LazyFrameProvider {
  const handle: XtcLazyHandle = {
    trajectoryId,
    index: {
      nAtoms: 2,
      nFrames: 5,
      timestepPs: 1,
      hasBox: false,
      box: null,
      times: new Float32Array(5),
    },
  };
  return new LazyFrameProvider(handle, meta, {
    decode: () => Promise.resolve(new Float32Array(6)),
    dispose,
    prefetchAhead: 0,
  });
}

describe("pipeline store — fileProvider channel", () => {
  beforeEach(() => {
    usePipelineStore.getState().reset();
  });

  it("stores the provider and clears the eager frame channel", () => {
    const store = usePipelineStore.getState();
    store.setFileFrames(eagerFrames, meta);
    expect(usePipelineStore.getState().fileFrames).not.toBeNull();

    const p = makeProvider(vi.fn());
    store.setFileProvider(p);

    const s = usePipelineStore.getState();
    expect(s.fileProvider).toBe(p);
    expect(s.fileFrames).toBeNull();
    expect(s.fileMeta).toBeNull();
  });

  it("disposes the previous lazy provider when replaced", () => {
    const disposeA = vi.fn();
    const a = makeProvider(disposeA, 1);
    usePipelineStore.getState().setFileProvider(a);

    const b = makeProvider(vi.fn(), 2);
    usePipelineStore.getState().setFileProvider(b);

    expect(disposeA).toHaveBeenCalledExactlyOnceWith(1);
    expect(usePipelineStore.getState().fileProvider).toBe(b);
  });

  it("disposes the provider when eager frames replace it", () => {
    const dispose = vi.fn();
    usePipelineStore.getState().setFileProvider(makeProvider(dispose, 3));
    usePipelineStore.getState().setFileFrames(eagerFrames, meta);
    expect(dispose).toHaveBeenCalledExactlyOnceWith(3);
    expect(usePipelineStore.getState().fileProvider).toBeNull();
  });

  it("disposes the provider on reset", () => {
    const dispose = vi.fn();
    usePipelineStore.getState().setFileProvider(makeProvider(dispose, 4));
    usePipelineStore.getState().reset();
    expect(dispose).toHaveBeenCalledExactlyOnceWith(4);
    expect(usePipelineStore.getState().fileProvider).toBeNull();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { usePlaybackStore } from "@/stores/usePlaybackStore";
import type { FrameProvider } from "@/pipeline/types";
import type { Frame, TrajectoryMeta } from "@/types";

function makeFrame(id: number): Frame {
  return {
    frameId: id,
    nAtoms: 2,
    positions: new Float32Array([id, 0, 0, id + 1, 0, 0]),
  };
}

function makeMeta(nFrames: number): TrajectoryMeta {
  return { nFrames, timestepPs: 1, nAtoms: 2 };
}

function makeProvider(nFrames: number): FrameProvider {
  return {
    kind: "memory",
    meta: makeMeta(nFrames),
    getFrame: (index: number) => makeFrame(index),
  };
}

describe("usePlaybackStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset store state
    const store = usePlaybackStore.getState();
    store._stopInterval();
    usePlaybackStore.setState({
      playing: false,
      fps: 30,
      speedMultiplier: 1,
      currentFrame: 0,
      totalFrames: 0,
      loopStart: 0,
      loopEnd: 0,
      provider: null,
      currentFrameData: null,
      _intervalId: null,
    });
  });

  afterEach(() => {
    const store = usePlaybackStore.getState();
    store._stopInterval();
    vi.useRealTimers();
  });

  it("has correct initial state", () => {
    const state = usePlaybackStore.getState();
    expect(state.playing).toBe(false);
    expect(state.fps).toBe(30);
    expect(state.speedMultiplier).toBe(1);
    expect(state.currentFrame).toBe(0);
    expect(state.totalFrames).toBe(0);
    expect(state.loopStart).toBe(0);
    expect(state.loopEnd).toBe(0);
    expect(state.provider).toBeNull();
    expect(state.currentFrameData).toBeNull();
  });

  describe("setProvider", () => {
    it("sets provider and totalFrames", () => {
      const provider = makeProvider(10);
      usePlaybackStore.getState().setProvider(provider);
      const state = usePlaybackStore.getState();
      expect(state.provider).toBe(provider);
      expect(state.totalFrames).toBe(10);
      expect(state.currentFrame).toBe(0);
      expect(state.currentFrameData).not.toBeNull();
    });

    it("resets loopStart and loopEnd to full range", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      const state = usePlaybackStore.getState();
      expect(state.loopStart).toBe(0);
      expect(state.loopEnd).toBe(9);
    });

    it("clears state when provider is null", () => {
      usePlaybackStore.getState().setProvider(makeProvider(5));
      usePlaybackStore.getState().setProvider(null);
      const state = usePlaybackStore.getState();
      expect(state.totalFrames).toBe(0);
      expect(state.currentFrameData).toBeNull();
    });

    it("stops playback when changing provider", () => {
      const store = usePlaybackStore.getState();
      store.setProvider(makeProvider(10));
      store.play();
      expect(usePlaybackStore.getState().playing).toBe(true);
      store.setProvider(makeProvider(5));
      expect(usePlaybackStore.getState().playing).toBe(false);
    });
  });

  describe("seekFrame", () => {
    it("updates current frame", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().seekFrame(5);
      const state = usePlaybackStore.getState();
      expect(state.currentFrame).toBe(5);
      expect(state.currentFrameData?.frameId).toBe(5);
    });

    it("does nothing without provider", () => {
      usePlaybackStore.getState().seekFrame(5);
      expect(usePlaybackStore.getState().currentFrame).toBe(0);
    });
  });

  describe("play/pause", () => {
    it("play sets playing to true", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().play();
      expect(usePlaybackStore.getState().playing).toBe(true);
    });

    it("play does nothing with <= 1 frame", () => {
      usePlaybackStore.getState().setProvider(makeProvider(1));
      usePlaybackStore.getState().play();
      expect(usePlaybackStore.getState().playing).toBe(false);
    });

    it("pause sets playing to false", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().play();
      usePlaybackStore.getState().pause();
      expect(usePlaybackStore.getState().playing).toBe(false);
    });

    it("togglePlayPause toggles", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().togglePlayPause();
      expect(usePlaybackStore.getState().playing).toBe(true);
      usePlaybackStore.getState().togglePlayPause();
      expect(usePlaybackStore.getState().playing).toBe(false);
    });
  });

  describe("setFps", () => {
    it("updates fps", () => {
      usePlaybackStore.getState().setFps(60);
      expect(usePlaybackStore.getState().fps).toBe(60);
    });
  });

  describe("setSpeedMultiplier", () => {
    it("updates speedMultiplier", () => {
      usePlaybackStore.getState().setSpeedMultiplier(2);
      expect(usePlaybackStore.getState().speedMultiplier).toBe(2);
    });

    it("restarts interval if playing", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().play();
      const idBefore = usePlaybackStore.getState()._intervalId;
      usePlaybackStore.getState().setSpeedMultiplier(2);
      const idAfter = usePlaybackStore.getState()._intervalId;
      expect(idAfter).not.toBe(idBefore);
    });

    it("does not restart interval if not playing", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().setSpeedMultiplier(2);
      expect(usePlaybackStore.getState()._intervalId).toBeNull();
    });
  });

  describe("setLoopRange", () => {
    it("updates loopStart and loopEnd", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().setLoopRange(2, 7);
      const state = usePlaybackStore.getState();
      expect(state.loopStart).toBe(2);
      expect(state.loopEnd).toBe(7);
    });

    it("clamps values to valid range", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().setLoopRange(-5, 50);
      const state = usePlaybackStore.getState();
      expect(state.loopStart).toBe(0);
      expect(state.loopEnd).toBe(9);
    });
  });

  describe("stepForward", () => {
    it("advances by one frame", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().seekFrame(3);
      usePlaybackStore.getState().stepForward();
      expect(usePlaybackStore.getState().currentFrame).toBe(4);
    });

    it("clamps at loopEnd", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().setLoopRange(0, 5);
      usePlaybackStore.getState().seekFrame(5);
      usePlaybackStore.getState().stepForward();
      expect(usePlaybackStore.getState().currentFrame).toBe(5);
    });

    it("does nothing without provider", () => {
      usePlaybackStore.getState().stepForward();
      expect(usePlaybackStore.getState().currentFrame).toBe(0);
    });
  });

  describe("stepBackward", () => {
    it("goes back by one frame", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().seekFrame(5);
      usePlaybackStore.getState().stepBackward();
      expect(usePlaybackStore.getState().currentFrame).toBe(4);
    });

    it("clamps at loopStart", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().setLoopRange(3, 9);
      usePlaybackStore.getState().seekFrame(3);
      usePlaybackStore.getState().stepBackward();
      expect(usePlaybackStore.getState().currentFrame).toBe(3);
    });

    it("does nothing without provider", () => {
      usePlaybackStore.getState().stepBackward();
      expect(usePlaybackStore.getState().currentFrame).toBe(0);
    });
  });

  describe("interval playback", () => {
    it("advances frames on interval tick", () => {
      usePlaybackStore.getState().setProvider(makeProvider(5));
      usePlaybackStore.getState().play();
      expect(usePlaybackStore.getState().currentFrame).toBe(0);

      // Advance one interval (1000 / 30 ≈ 33ms)
      vi.advanceTimersByTime(34);
      expect(usePlaybackStore.getState().currentFrame).toBe(1);
    });

    it("wraps around at loopEnd", () => {
      usePlaybackStore.getState().setProvider(makeProvider(5));
      usePlaybackStore.getState().play();
      const interval = 1000 / 30;

      // 0→1→2→3→4→0 (5 frames, wraps)
      vi.advanceTimersByTime(interval * 5 + 1);
      expect(usePlaybackStore.getState().currentFrame).toBe(0);
    });

    it("respects custom loop range", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().setLoopRange(2, 4);
      usePlaybackStore.getState().seekFrame(2);
      usePlaybackStore.getState().play();
      const interval = 1000 / 30;

      // 2→3→4→2 (loop between 2 and 4)
      vi.advanceTimersByTime(interval * 3 + 1);
      expect(usePlaybackStore.getState().currentFrame).toBe(2);
    });

    it("advances faster with speedMultiplier > 1", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().setSpeedMultiplier(2);
      usePlaybackStore.getState().play();

      // At 2× speed with 30fps, interval = 1000/(30*2) ≈ 16.7ms
      vi.advanceTimersByTime(17);
      expect(usePlaybackStore.getState().currentFrame).toBe(1);
    });
  });

  describe("_onAsyncFrame", () => {
    it("updates frame data when frameId matches", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().seekFrame(3);
      const frame = makeFrame(3);
      usePlaybackStore.getState()._onAsyncFrame(frame);
      expect(usePlaybackStore.getState().currentFrameData).toBe(frame);
    });

    it("ignores frame when frameId does not match", () => {
      usePlaybackStore.getState().setProvider(makeProvider(10));
      usePlaybackStore.getState().seekFrame(3);
      const existing = usePlaybackStore.getState().currentFrameData;
      usePlaybackStore.getState()._onAsyncFrame(makeFrame(5));
      expect(usePlaybackStore.getState().currentFrameData).toBe(existing);
    });
  });
});

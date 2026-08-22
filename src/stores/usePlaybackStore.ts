/**
 * Playback zustand store for trajectory frame delivery.
 * Manages play/pause/seek/fps and frame providers (memory or stream).
 * Replaces the scattered playback state previously in index.tsx and useMeganeLocal.
 */

import { create } from "zustand";
import type { Frame } from "../types";
import type { FrameProvider } from "../pipeline/types";

export interface PlaybackStore {
  // State
  playing: boolean;
  fps: number;
  speedMultiplier: number;
  currentFrame: number;
  totalFrames: number;
  loopStart: number;
  loopEnd: number;

  // Frame delivery
  provider: FrameProvider | null;
  currentFrameData: Frame | null;

  // Ref-like access for setInterval callback
  _currentFrameRef: { current: number };

  // Actions
  setProvider: (p: FrameProvider | null) => void;
  seekFrame: (index: number) => void;
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  setFps: (fps: number) => void;
  setSpeedMultiplier: (speed: number) => void;
  setLoopRange: (start: number, end: number) => void;
  stepForward: () => void;
  stepBackward: () => void;

  // Internal: called by StreamFrameProvider when async frame arrives
  _onAsyncFrame: (frame: Frame) => void;

  // Interval management
  _intervalId: ReturnType<typeof setInterval> | null;
  _startInterval: () => void;
  _stopInterval: () => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  playing: false,
  fps: 30,
  speedMultiplier: 1,
  currentFrame: 0,
  totalFrames: 0,
  loopStart: 0,
  loopEnd: 0,
  provider: null,
  currentFrameData: null,
  _currentFrameRef: { current: 0 },
  _intervalId: null,

  setProvider: (p) => {
    const state = get();
    state._stopInterval();
    const totalFrames = p ? p.meta.nFrames : 0;

    // A provider swap with identical frame/atom counts is a re-mapping of the
    // trajectory already loaded — a modifier node (wrap, replicate) re-ran and
    // wrapped the same underlying frames. Keep the playhead, loop range, and
    // play state so toggling the modifier doesn't yank the user back to frame
    // 0. A different shape means a genuinely new trajectory: start over.
    const isRemap =
      p !== null &&
      state.provider !== null &&
      totalFrames === state.totalFrames &&
      p.meta.nAtoms === state.provider.meta.nAtoms;

    const frameIndex = isRemap ? Math.min(state._currentFrameRef.current, totalFrames - 1) : 0;
    const wasPlaying = isRemap && state.playing;
    set({
      provider: p,
      totalFrames,
      currentFrame: frameIndex,
      currentFrameData: p ? p.getFrame(frameIndex) : null,
      playing: wasPlaying,
      loopStart: isRemap ? state.loopStart : 0,
      loopEnd: isRemap ? state.loopEnd : totalFrames > 0 ? totalFrames - 1 : 0,
    });
    state._currentFrameRef.current = frameIndex;
    if (wasPlaying) get()._startInterval();
  },

  seekFrame: (index) => {
    const { provider, _currentFrameRef } = get();
    if (!provider) return;
    const frame = provider.getFrame(index);
    _currentFrameRef.current = index;
    set({ currentFrame: index, currentFrameData: frame });
  },

  play: () => {
    const { totalFrames } = get();
    if (totalFrames <= 1) return;
    set({ playing: true });
    get()._startInterval();
  },

  pause: () => {
    get()._stopInterval();
    set({ playing: false });
  },

  togglePlayPause: () => {
    if (get().playing) {
      get().pause();
    } else {
      get().play();
    }
  },

  setFps: (fps) => {
    set({ fps });
    if (get().playing) {
      get()._stopInterval();
      get()._startInterval();
    }
  },

  setSpeedMultiplier: (speed) => {
    set({ speedMultiplier: speed });
    if (get().playing) {
      get()._stopInterval();
      get()._startInterval();
    }
  },

  setLoopRange: (start, end) => {
    const { totalFrames } = get();
    const clampedStart = Math.max(0, Math.min(start, totalFrames - 1));
    const clampedEnd = Math.max(0, Math.min(end, totalFrames - 1));
    set({ loopStart: clampedStart, loopEnd: clampedEnd });
  },

  stepForward: () => {
    const { provider, currentFrame, loopEnd, totalFrames, _currentFrameRef } = get();
    if (!provider) return;
    const effectiveEnd = Math.min(loopEnd, totalFrames - 1);
    const next = Math.min(currentFrame + 1, effectiveEnd);
    const frame = provider.getFrame(next);
    _currentFrameRef.current = next;
    set({ currentFrame: next, currentFrameData: frame });
  },

  stepBackward: () => {
    const { provider, currentFrame, loopStart, _currentFrameRef } = get();
    if (!provider) return;
    const effectiveStart = Math.max(loopStart, 0);
    const prev = Math.max(currentFrame - 1, effectiveStart);
    const frame = provider.getFrame(prev);
    _currentFrameRef.current = prev;
    set({ currentFrame: prev, currentFrameData: frame });
  },

  _onAsyncFrame: (frame) => {
    const { currentFrame, provider } = get();
    if (frame.frameId !== currentFrame) return;
    // The async callback is registered on the UNDERLYING decoder (the lazy
    // XTC / stream provider), so `frame` carries raw, un-remapped positions.
    // The store's provider may be a wrapper chain on top of that decoder
    // (wrap node, replicate node) — re-fetch through it so the mapping is
    // applied. The decoded frame is cached by now, so this is synchronous;
    // fall back to the raw frame only if the chain cannot serve it.
    const mapped = provider ? (provider.getFrame(frame.frameId) ?? frame) : frame;
    set({ currentFrameData: mapped });
  },

  _startInterval: () => {
    const state = get();
    if (state._intervalId !== null) return;
    const id = setInterval(
      () => {
        const { totalFrames, loopStart, loopEnd, _currentFrameRef, provider } = get();
        if (!provider || totalFrames <= 1) return;
        const effectiveEnd = Math.min(loopEnd, totalFrames - 1);
        const effectiveStart = Math.max(loopStart, 0);
        let nextFrame = _currentFrameRef.current + 1;
        if (nextFrame > effectiveEnd) nextFrame = effectiveStart;
        const frame = provider.getFrame(nextFrame);
        _currentFrameRef.current = nextFrame;
        set({ currentFrame: nextFrame, currentFrameData: frame });
      },
      1000 / (state.fps * state.speedMultiplier),
    );
    set({ _intervalId: id });
  },

  _stopInterval: () => {
    const { _intervalId } = get();
    if (_intervalId !== null) {
      clearInterval(_intervalId);
      set({ _intervalId: null });
    }
  },
}));

// Expose the playback store for E2E tests that need to drive playback
// without a Timeline UI (e.g., the JupyterLab DocWidget host does not
// mount Timeline). Mirrors the pipeline store hook in src/pipeline/store.ts.
(() => {
  if (typeof window === "undefined") return;
  try {
    const g = globalThis as { __MEGANE_TEST__?: boolean };
    let testMode = g.__MEGANE_TEST__ === true;
    if (!testMode) {
      const params = new URLSearchParams(window.location?.search ?? "");
      if (params.get("test") === "1") testMode = true;
    }
    if (!testMode && window.parent && window.parent !== window) {
      const pg = (window.parent as Window & { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__;
      if (pg) testMode = true;
    }
    if (!testMode) return;
    (
      window as Window & { __megane_test_playback_store?: typeof usePlaybackStore }
    ).__megane_test_playback_store = usePlaybackStore;
  } catch {
    /* noop — same-origin checks may throw inside cross-origin frames */
  }
})();

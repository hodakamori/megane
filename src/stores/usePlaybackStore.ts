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
  currentFrame: number;
  totalFrames: number;

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
  currentFrame: 0,
  totalFrames: 0,
  provider: null,
  currentFrameData: null,
  _currentFrameRef: { current: 0 },
  _intervalId: null,

  setProvider: (p) => {
    const state = get();
    state._stopInterval();
    const totalFrames = p ? p.meta.nFrames : 0;
    const frame0 = p ? p.getFrame(0) : null;
    set({
      provider: p,
      totalFrames,
      currentFrame: 0,
      currentFrameData: frame0,
      playing: false,
    });
    state._currentFrameRef.current = 0;
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
    // Restart interval if playing
    if (get().playing) {
      get()._stopInterval();
      get()._startInterval();
    }
  },

  _onAsyncFrame: (frame) => {
    // Called by StreamFrameProvider when a requested frame arrives
    const { currentFrame } = get();
    if (frame.frameId === currentFrame) {
      set({ currentFrameData: frame });
    }
  },

  _startInterval: () => {
    const state = get();
    if (state._intervalId !== null) return;
    const id = setInterval(() => {
      const { totalFrames, _currentFrameRef, provider } = get();
      if (!provider || totalFrames <= 1) return;
      const nextFrame = (_currentFrameRef.current + 1) % totalFrames;
      const frame = provider.getFrame(nextFrame);
      _currentFrameRef.current = nextFrame;
      set({ currentFrame: nextFrame, currentFrameData: frame });
    }, 1000 / state.fps);
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

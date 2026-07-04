/**
 * Worker-backed frame provider for lazy/streaming trajectory playback.
 *
 * Instead of decoding every frame up-front, the owning code builds a frame
 * index in the parse worker (which keeps the file bytes resident) and hands the
 * resulting handle to this provider. `getFrame(i)` returns a cached frame, or
 * `null` while it asks the worker to decode frame `i` in the background; the
 * decoded frame arrives later via the `onFrameReady` callback (mirroring
 * `StreamFrameProvider`, so the existing async-frame render path is reused
 * verbatim). Frame 0 and a sliding window ahead of the playhead are prefetched
 * so playback rarely stalls.
 */

import type { Frame, TrajectoryMeta } from "../types";
import type { FrameProvider } from "../pipeline/types";
import type { XtcLazyHandle } from "../parsers/parseClient";

const DEFAULT_CACHE_SIZE = 256;
const DEFAULT_PREFETCH_AHEAD = 16;

export interface LazyFrameProviderOptions {
  maxCacheSize?: number;
  prefetchAhead?: number;
  /** Decode one frame (defaults to the worker `decodeXTCFrame`). Injectable for tests. */
  decode?: (trajectoryId: number, frame: number) => Promise<Float32Array>;
  /** Dispose the worker decoder (defaults to `disposeXTCTrajectory`). Injectable for tests. */
  dispose?: (trajectoryId: number) => void;
}

export class LazyFrameProvider implements FrameProvider {
  // Reuse the "stream" kind: nothing in the pipeline branches on it, and it
  // carries the same "getFrame may return null, frames arrive async" contract.
  readonly kind = "stream" as const;
  meta: TrajectoryMeta;

  private readonly trajectoryId: number;
  private readonly nAtoms: number;
  private readonly nFrames: number;
  private cache: Map<number, Frame> = new Map();
  private cacheOrder: number[] = [];
  private inflight: Set<number> = new Set();
  private readonly maxCacheSize: number;
  private readonly prefetchAhead: number;
  private readonly decode: (trajectoryId: number, frame: number) => Promise<Float32Array>;
  private readonly disposeFn: (trajectoryId: number) => void;
  private onFrameReady: ((frame: Frame) => void) | null = null;
  private onProgress: ((decoded: number, total: number) => void) | null = null;
  private decodedCountHW = 0;
  private disposed = false;

  constructor(handle: XtcLazyHandle, meta: TrajectoryMeta, opts: LazyFrameProviderOptions = {}) {
    this.trajectoryId = handle.trajectoryId;
    this.nAtoms = handle.index.nAtoms;
    this.nFrames = handle.index.nFrames;
    this.meta = meta;
    this.maxCacheSize = opts.maxCacheSize ?? DEFAULT_CACHE_SIZE;
    this.prefetchAhead = opts.prefetchAhead ?? DEFAULT_PREFETCH_AHEAD;
    // Injected in tests; the runtime wiring passes the worker client functions.
    this.decode = opts.decode ?? (() => Promise.reject(new Error("no decode fn")));
    this.disposeFn = opts.dispose ?? (() => {});
    // Prime frame 0 (and its window) so first paint is fast.
    this.prefetchWindow(0);
  }

  /** Register a callback for when a background-decoded frame becomes available. */
  setOnFrameReady(callback: (frame: Frame) => void): void {
    this.onFrameReady = callback;
  }

  /** Register a decode-progress callback: (distinct frames decoded, total). */
  setOnProgress(callback: (decoded: number, total: number) => void): void {
    this.onProgress = callback;
  }

  /** Number of distinct frames decoded so far (monotonic high-water mark). */
  decodedCount(): number {
    return this.decodedCountHW;
  }

  /**
   * Get a frame by index. Returns the cached frame, or null while it (and a
   * window ahead) decode in the background — the frame then arrives via
   * `onFrameReady`.
   */
  getFrame(index: number): Frame | null {
    this.prefetchWindow(index);
    return this.cache.get(index) ?? null;
  }

  /** Free the worker decoder and drop the cache. Idempotent. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.disposeFn(this.trajectoryId);
    this.clear();
  }

  clear(): void {
    this.cache.clear();
    this.cacheOrder = [];
    this.inflight.clear();
  }

  /** Request frame `center` and the next `prefetchAhead` frames. */
  private prefetchWindow(center: number): void {
    const end = Math.min(center + this.prefetchAhead, this.nFrames - 1);
    for (let f = center; f <= end; f++) this.request(f);
  }

  private request(index: number): void {
    if (this.disposed) return;
    if (index < 0 || index >= this.nFrames) return;
    if (this.cache.has(index) || this.inflight.has(index)) return;
    this.inflight.add(index);
    this.decode(this.trajectoryId, index)
      .then((positions) => {
        this.inflight.delete(index);
        if (this.disposed) return;
        const frame: Frame = { frameId: index, nAtoms: this.nAtoms, positions };
        const isNew = !this.cache.has(index);
        this.cacheFrame(frame);
        if (isNew) {
          this.decodedCountHW += 1;
          this.onProgress?.(this.decodedCountHW, this.nFrames);
        }
        this.onFrameReady?.(frame);
      })
      .catch(() => {
        // Leave the frame undecoded (getFrame keeps returning null → the viewer
        // holds the last frame). The owner may retry on the next getFrame.
        this.inflight.delete(index);
      });
  }

  private cacheFrame(frame: Frame): void {
    const id = frame.frameId;
    if (this.cache.has(id)) {
      this.cacheOrder = this.cacheOrder.filter((i) => i !== id);
      this.cacheOrder.push(id);
      this.cache.set(id, frame);
      return;
    }
    while (this.cacheOrder.length >= this.maxCacheSize) {
      const evicted = this.cacheOrder.shift();
      if (evicted !== undefined) this.cache.delete(evicted);
    }
    this.cache.set(id, frame);
    this.cacheOrder.push(id);
  }
}

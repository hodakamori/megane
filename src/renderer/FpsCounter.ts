/**
 * Minimal rolling FPS counter.
 *
 * Fed one timestamp per rendered frame (in ms, e.g. from `performance.now()`),
 * it recomputes frames-per-second once every `windowMs` and holds that value
 * until the next window closes. Pure and side-effect free so the timing math is
 * unit-testable without a WebGL context.
 */
export class FpsCounter {
  private readonly windowMs: number;
  private lastSample: number | null = null;
  private frames = 0;
  private _fps = 0;

  constructor(windowMs = 500) {
    this.windowMs = windowMs;
  }

  /** Record one rendered frame at time `nowMs`. */
  tick(nowMs: number): void {
    if (this.lastSample === null) {
      this.lastSample = nowMs;
      return;
    }
    this.frames++;
    const elapsed = nowMs - this.lastSample;
    if (elapsed >= this.windowMs) {
      this._fps = (this.frames * 1000) / elapsed;
      this.frames = 0;
      this.lastSample = nowMs;
    }
  }

  /** Most recently computed FPS (0 until the first window has closed). */
  get fps(): number {
    return this._fps;
  }
}

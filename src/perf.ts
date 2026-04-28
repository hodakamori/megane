/**
 * Minimal performance instrumentation used by E2E tests.
 *
 * All hooks are no-ops unless `window.__MEGANE_PERF__` is true. This keeps
 * production overhead at the cost of a single boolean read per call.
 *
 * Tests set the flag via `setupPerfHooks(context)` (Playwright addInitScript)
 * before navigation, then drain entries with `collectPerf(page)` afterwards.
 */

interface PerfWindow {
  __MEGANE_PERF__?: boolean;
  __meganeFrameTimes?: number[];
  __meganeRendererReady?: boolean;
}

const FRAME_BUFFER_LIMIT = 600;

function perfWindow(): PerfWindow | null {
  if (typeof window === "undefined") return null;
  return window as unknown as PerfWindow;
}

function enabled(): boolean {
  const w = perfWindow();
  return !!(w && w.__MEGANE_PERF__);
}

export function perfMark(name: string): void {
  if (!enabled()) return;
  try {
    performance.mark(name);
  } catch {
    /* mark may fail in shut-down contexts; ignore */
  }
}

export function perfMeasure(name: string, startMark: string, endMark: string): void {
  if (!enabled()) return;
  try {
    performance.measure(name, startMark, endMark);
  } catch {
    /* missing mark or duplicate name; ignore */
  }
}

/** Push a frame timestamp (in ms since timeOrigin) to the rolling buffer. */
export function perfPushFrame(t: number): void {
  if (!enabled()) return;
  const w = perfWindow();
  if (!w) return;
  if (!w.__meganeFrameTimes) w.__meganeFrameTimes = [];
  const buf = w.__meganeFrameTimes;
  buf.push(t);
  if (buf.length > FRAME_BUFFER_LIMIT) buf.splice(0, buf.length - FRAME_BUFFER_LIMIT);
}

/** Mark the renderer ready flag once the first frame has been drawn. */
export function perfRendererReady(): void {
  const w = perfWindow();
  if (!w) return;
  w.__meganeRendererReady = true;
}

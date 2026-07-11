import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { PerfHud } from "@/components/PerfHud";

describe("PerfHud", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders atom and bond counts from props immediately", () => {
    render(<PerfHud atomCount={1234} bondCount={56} getStats={() => null} />);
    expect(screen.getByTestId("perf-hud-atoms")).toHaveTextContent("Atoms 1234");
    expect(screen.getByTestId("perf-hud-bonds")).toHaveTextContent("Bonds 56");
  });

  it("polls getStats immediately and shows rounded fps and draw calls", () => {
    const getStats = vi.fn(() => ({ fps: 59.6, drawCalls: 7 }));
    render(<PerfHud atomCount={10} bondCount={2} getStats={getStats} />);
    // The effect polls once on mount, so values populate without waiting.
    expect(getStats).toHaveBeenCalled();
    expect(screen.getByTestId("perf-hud-fps")).toHaveTextContent("60 FPS");
    expect(screen.getByTestId("perf-hud-draws")).toHaveTextContent("Draws 7");
    // Subsequent interval ticks keep it updated.
    const callsAfterMount = getStats.mock.calls.length;
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(getStats.mock.calls.length).toBeGreaterThan(callsAfterMount);
  });

  it("ignores null stats (renderer not ready)", () => {
    const getStats = vi.fn(() => null);
    render(<PerfHud atomCount={0} bondCount={0} getStats={getStats} />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByTestId("perf-hud-fps")).toHaveTextContent("0 FPS");
  });

  it("renders a fixed fps placeholder when stable", () => {
    const getStats = vi.fn(() => ({ fps: 42, drawCalls: 3 }));
    render(<PerfHud atomCount={5} bondCount={1} getStats={getStats} stable />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    // FPS frozen, but draw calls (deterministic) still update.
    expect(screen.getByTestId("perf-hud-fps")).toHaveTextContent("-- FPS");
    expect(screen.getByTestId("perf-hud-draws")).toHaveTextContent("Draws 3");
  });

  it("stops polling after unmount", () => {
    const getStats = vi.fn(() => ({ fps: 30, drawCalls: 1 }));
    const { unmount } = render(<PerfHud atomCount={1} bondCount={1} getStats={getStats} />);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const callsBefore = getStats.mock.calls.length;
    unmount();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(getStats.mock.calls.length).toBe(callsBefore);
  });
});

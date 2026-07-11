/**
 * Small performance readout shown next to the Reset View button.
 *
 * Displays the loaded atom count, bond count, per-frame draw calls, and render
 * FPS. Atom/bond counts come from React state in the parent; FPS and draw calls
 * are polled from the renderer on an interval (NOT per render frame — the parent
 * deliberately avoids per-frame React renders, see MeganeViewer's snapshot
 * subscription comment).
 */

import { useEffect, useState } from "react";

interface PerfHudProps {
  atomCount: number;
  bondCount: number;
  getStats: () => { fps: number; drawCalls: number } | null;
  /**
   * When true, render a fixed FPS placeholder instead of the live value. Used by
   * E2E so screenshot baselines stay deterministic (FPS digits vary per run).
   */
  stable?: boolean;
}

const POLL_MS = 500;

export function PerfHud({ atomCount, bondCount, getStats, stable = false }: PerfHudProps) {
  const [stats, setStats] = useState<{ fps: number; drawCalls: number }>({
    fps: 0,
    drawCalls: 0,
  });

  useEffect(() => {
    const poll = () => {
      const next = getStats();
      if (next) setStats(next);
    };
    poll(); // populate immediately so draws/fps don't linger at 0
    const id = window.setInterval(poll, POLL_MS);
    return () => window.clearInterval(id);
  }, [getStats]);

  const fpsText = stable ? "--" : String(Math.round(stats.fps));

  return (
    <div
      data-testid="perf-hud"
      style={{
        position: "absolute",
        top: 12,
        left: 92,
        padding: "4px 8px",
        fontSize: 11,
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: 4,
        color: "#374151",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 10,
        userSelect: "none",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span data-testid="perf-hud-atoms">Atoms {atomCount}</span>
      {" · "}
      <span data-testid="perf-hud-bonds">Bonds {bondCount}</span>
      {" · "}
      <span data-testid="perf-hud-draws">Draws {stats.drawCalls}</span>
      {" · "}
      <span data-testid="perf-hud-fps">{fpsText} FPS</span>
    </div>
  );
}

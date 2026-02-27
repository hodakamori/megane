/**
 * Main megane viewer React component.
 * Combines Viewport, Toolbar, and Timeline.
 */

import { useCallback, useRef } from "react";
import { Viewport } from "./Viewport";
import { Toolbar } from "./Toolbar";
import { Timeline } from "./Timeline";
import { MoleculeRenderer } from "../core/MoleculeRenderer";
import type { Snapshot, Frame } from "../core/types";

interface MeganeViewerProps {
  snapshot: Snapshot | null;
  frame?: Frame | null;
  currentFrame?: number;
  totalFrames?: number;
  playing?: boolean;
  fps?: number;
  onSeek?: (frame: number) => void;
  onPlayPause?: () => void;
  onFpsChange?: (fps: number) => void;
  width?: string | number;
  height?: string | number;
}

export function MeganeViewer({
  snapshot,
  frame = null,
  currentFrame = 0,
  totalFrames = 0,
  playing = false,
  fps = 30,
  onSeek,
  onPlayPause,
  onFpsChange,
  width = "100%",
  height = "100%",
}: MeganeViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
  }, []);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetView();
  }, []);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Viewport
        snapshot={snapshot}
        frame={frame}
        onRendererReady={handleRendererReady}
      />
      <Toolbar
        atomCount={snapshot?.nAtoms ?? 0}
        bondCount={snapshot?.nBonds ?? 0}
        onResetView={handleResetView}
      />
      {onSeek && onPlayPause && onFpsChange && (
        <Timeline
          currentFrame={currentFrame}
          totalFrames={totalFrames}
          playing={playing}
          fps={fps}
          onSeek={onSeek}
          onPlayPause={onPlayPause}
          onFpsChange={onFpsChange}
        />
      )}
    </div>
  );
}

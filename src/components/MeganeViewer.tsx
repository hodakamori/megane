/**
 * Main megane viewer React component.
 * Combines Viewport, Toolbar, and Timeline.
 */

import { useCallback, useRef, useState } from "react";
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
  onUpload?: (pdb: File, xtc?: File) => void;
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
  onUpload,
  width = "100%",
  height = "100%",
}: MeganeViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const [cellVisible, setCellVisible] = useState(true);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
  }, []);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetView();
  }, []);

  const handleToggleCell = useCallback(() => {
    setCellVisible((prev) => {
      const next = !prev;
      rendererRef.current?.setCellVisible(next);
      return next;
    });
  }, []);

  // Check if snapshot has a non-zero box
  const hasCell =
    snapshot?.box != null && snapshot.box.some((v) => v !== 0);

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
        onUpload={onUpload}
        hasCell={hasCell}
        cellVisible={cellVisible}
        onToggleCell={handleToggleCell}
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

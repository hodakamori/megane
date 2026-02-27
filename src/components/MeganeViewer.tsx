/**
 * Main megane viewer React component.
 * Combines Viewport, Toolbar, and Timeline.
 */

import { useState, useCallback, useRef } from "react";
import { Viewport } from "./Viewport";
import { Toolbar } from "./Toolbar";
import { Timeline } from "./Timeline";
import { MoleculeRenderer } from "../core/MoleculeRenderer";
import type { Snapshot, Frame } from "../core/types";

interface MeganeViewerProps {
  snapshot: Snapshot | null;
  frame?: Frame | null;
  width?: string | number;
  height?: string | number;
}

export function MeganeViewer({
  snapshot,
  frame = null,
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
      <Timeline />
    </div>
  );
}

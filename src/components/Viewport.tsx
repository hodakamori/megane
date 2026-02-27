/**
 * Three.js canvas wrapper component.
 * Manages the lifecycle of MoleculeRenderer.
 */

import { useEffect, useRef, useCallback } from "react";
import { MoleculeRenderer } from "../core/MoleculeRenderer";
import type { Snapshot, Frame } from "../core/types";

interface ViewportProps {
  snapshot: Snapshot | null;
  frame: Frame | null;
  onRendererReady?: (renderer: MoleculeRenderer) => void;
}

export function Viewport({ snapshot, frame, onRendererReady }: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<MoleculeRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new MoleculeRenderer();
    renderer.mount(containerRef.current);
    rendererRef.current = renderer;
    onRendererReady?.(renderer);

    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (snapshot && rendererRef.current) {
      rendererRef.current.loadSnapshot(snapshot);
    }
  }, [snapshot]);

  useEffect(() => {
    if (frame && rendererRef.current) {
      rendererRef.current.updateFrame(frame);
    }
  }, [frame]);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetView();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)",
      }}
    />
  );
}

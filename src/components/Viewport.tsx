/**
 * Three.js canvas wrapper component.
 * Manages the lifecycle of MoleculeRenderer.
 */

import { useEffect, useRef } from "react";
import { MoleculeRenderer } from "../core/MoleculeRenderer";
import type { Snapshot, Frame, HoverInfo } from "../core/types";

interface ViewportProps {
  snapshot: Snapshot | null;
  frame: Frame | null;
  onRendererReady?: (renderer: MoleculeRenderer) => void;
  onHover?: (info: HoverInfo) => void;
  onAtomRightClick?: (atomIndex: number) => void;
  onFrameUpdated?: () => void;
}

export function Viewport({
  snapshot,
  frame,
  onRendererReady,
  onHover,
  onAtomRightClick,
  onFrameUpdated,
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const onHoverRef = useRef(onHover);
  const onAtomRightClickRef = useRef(onAtomRightClick);
  const onFrameUpdatedRef = useRef(onFrameUpdated);

  // Keep callback refs up to date
  onHoverRef.current = onHover;
  onAtomRightClickRef.current = onAtomRightClick;
  onFrameUpdatedRef.current = onFrameUpdated;

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

  // Mouse event handlers
  useEffect(() => {
    const renderer = rendererRef.current;
    const canvas = renderer?.getCanvas();
    if (!canvas || !renderer) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const info = renderer.raycastAtPixel(e.clientX, e.clientY);
        onHoverRef.current?.(info);
        rafId = null;
      });
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const info = renderer.raycastAtPixel(e.clientX, e.clientY);
      if (info && info.kind === "atom") {
        onAtomRightClickRef.current?.(info.atomIndex);
      }
    };

    const handleMouseLeave = () => {
      onHoverRef.current?.(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
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
      onFrameUpdatedRef.current?.();
    }
  }, [frame]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#f0f2f5",
      }}
    />
  );
}

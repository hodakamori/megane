/**
 * Three.js canvas wrapper component.
 * Manages the lifecycle of MoleculeRenderer.
 */

import { useEffect, useRef } from "react";
import { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import type { Snapshot, Frame, HoverInfo } from "../types";

interface ViewportProps {
  snapshot: Snapshot | null;
  frame: Frame | null;
  atomLabels?: string[] | null;
  atomVectors?: Float32Array | null;
  onRendererReady?: (renderer: MoleculeRenderer) => void;
  onHover?: (info: HoverInfo) => void;
  onAtomRightClick?: (atomIndex: number) => void;
  onFrameUpdated?: () => void;
}

export function Viewport({
  snapshot,
  frame,
  atomLabels,
  atomVectors,
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

    const handleDblClick = (e: MouseEvent) => {
      const info = renderer.raycastAtPixel(e.clientX, e.clientY);
      if (info && info.kind === "atom") {
        const positions = renderer.getCurrentPositionsCopy();
        if (positions) {
          const idx = info.atomIndex;
          renderer.setRotationCenter(
            positions[idx * 3],
            positions[idx * 3 + 1],
            positions[idx * 3 + 2],
          );
        }
      }
    };

    // ── Axes-inset drag handlers (pointer events for mouse+touch) ──

    const containerEl = containerRef.current!;

    const toCSSCoords = (e: PointerEvent | MouseEvent) => {
      const rect = containerEl.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handlePointerDown = (e: PointerEvent) => {
      const { x, y } = toCSSCoords(e);
      if (renderer.hitTestAxesInset(x, y)) {
        e.preventDefault();
        renderer.startAxesDrag(x, y);
        (e.target as Element)?.setPointerCapture?.(e.pointerId);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (renderer.isAxesDragging()) {
        const { x, y } = toCSSCoords(e);
        renderer.moveAxesDrag(x, y);
      }
    };

    const handlePointerUp = (_e: PointerEvent) => {
      renderer.endAxesDrag();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("dblclick", handleDblClick);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("dblclick", handleDblClick);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
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

  useEffect(() => {
    rendererRef.current?.setLabels(atomLabels ?? null);
  }, [atomLabels]);

  useEffect(() => {
    rendererRef.current?.setVectors(atomVectors ?? null);
  }, [atomVectors]);

  return (
    <div
      ref={containerRef}
      data-testid="viewer-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#ffffff",
      }}
    >
      {/* Invisible anchor that frames a representative region of the 3D
          canvas (away from the right-hand Pipeline panel) so the guide tour
          can highlight just the viewport area instead of the whole view. */}
      <div
        data-tour-anchor="viewport"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "18%",
          left: "12%",
          width: "46%",
          height: "60%",
          pointerEvents: "none",
          opacity: 0,
        }}
      />
    </div>
  );
}

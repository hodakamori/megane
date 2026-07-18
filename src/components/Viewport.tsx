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
  /** Atom indices to highlight live as the Inspector's current selection. */
  previewIndices?: number[] | null;
  /** When true, left-drag draws a rubber-band box instead of rotating. */
  boxSelectActive?: boolean;
  /** Called with the atom indices inside a completed box drag. */
  onBoxSelect?: (indices: number[]) => void;
  /** Called when an atom is left-clicked while the Inspector is active. */
  onInspectorPick?: (atomIndex: number) => void;
  /** True while the Selection Inspector tab is the active editing surface. */
  inspectorActive?: boolean;
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
  previewIndices,
  boxSelectActive,
  onBoxSelect,
  onInspectorPick,
  inspectorActive,
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const onHoverRef = useRef(onHover);
  const onAtomRightClickRef = useRef(onAtomRightClick);
  const onFrameUpdatedRef = useRef(onFrameUpdated);
  const boxSelectActiveRef = useRef(boxSelectActive);
  const onBoxSelectRef = useRef(onBoxSelect);
  const onInspectorPickRef = useRef(onInspectorPick);
  const inspectorActiveRef = useRef(inspectorActive);

  // Keep callback refs up to date
  onHoverRef.current = onHover;
  onAtomRightClickRef.current = onAtomRightClick;
  onFrameUpdatedRef.current = onFrameUpdated;
  boxSelectActiveRef.current = boxSelectActive;
  onBoxSelectRef.current = onBoxSelect;
  onInspectorPickRef.current = onInspectorPick;
  inspectorActiveRef.current = inspectorActive;

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

    // Inspector left-click pick: a plain click on an atom while the Inspector
    // is active (and not box-selecting) reports it for a "quick expand".
    const handleClick = (e: MouseEvent) => {
      if (!inspectorActiveRef.current || boxSelectActiveRef.current) return;
      if (e.button !== 0) return;
      const info = renderer.raycastAtPixel(e.clientX, e.clientY);
      if (info && info.kind === "atom") {
        onInspectorPickRef.current?.(info.atomIndex);
      }
    };

    // ── Box (rubber-band) selection ──
    // Active only while `boxSelectActive`; camera rotation is suspended by an
    // effect below so the drag can't also orbit the camera.
    let boxStart: { x: number; y: number } | null = null;
    let boxEl: HTMLDivElement | null = null;

    const clearBoxEl = () => {
      boxEl?.remove();
      boxEl = null;
    };

    const handleBoxDown = (e: PointerEvent) => {
      if (!boxSelectActiveRef.current || e.button !== 0) return;
      boxStart = { x: e.clientX, y: e.clientY };
      boxEl = document.createElement("div");
      boxEl.setAttribute("data-testid", "viewport-box-select");
      Object.assign(boxEl.style, {
        position: "fixed",
        border: "1px dashed #2563eb",
        background: "rgba(37, 99, 235, 0.12)",
        pointerEvents: "none",
        zIndex: "50",
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        width: "0px",
        height: "0px",
      } as CSSStyleDeclaration);
      document.body.appendChild(boxEl);
      (e.target as Element)?.setPointerCapture?.(e.pointerId);
    };

    const handleBoxMove = (e: PointerEvent) => {
      if (!boxStart || !boxEl) return;
      const x = Math.min(boxStart.x, e.clientX);
      const y = Math.min(boxStart.y, e.clientY);
      boxEl.style.left = `${x}px`;
      boxEl.style.top = `${y}px`;
      boxEl.style.width = `${Math.abs(e.clientX - boxStart.x)}px`;
      boxEl.style.height = `${Math.abs(e.clientY - boxStart.y)}px`;
    };

    const handleBoxUp = (e: PointerEvent) => {
      if (!boxStart) return;
      const rect = { x0: boxStart.x, y0: boxStart.y, x1: e.clientX, y1: e.clientY };
      boxStart = null;
      clearBoxEl();
      // Ignore an accidental click (no meaningful drag area).
      if (Math.abs(rect.x1 - rect.x0) < 3 && Math.abs(rect.y1 - rect.y0) < 3) return;
      const indices = renderer.selectAtomsInRect(rect);
      onBoxSelectRef.current?.(indices);
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
        return;
      }
      handleBoxDown(e);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (renderer.isAxesDragging()) {
        const { x, y } = toCSSCoords(e);
        renderer.moveAxesDrag(x, y);
        return;
      }
      handleBoxMove(e);
    };

    const handlePointerUp = (e: PointerEvent) => {
      renderer.endAxesDrag();
      handleBoxUp(e);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("dblclick", handleDblClick);
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("dblclick", handleDblClick);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      clearBoxEl();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Live preview highlight of the Inspector's current selection.
  useEffect(() => {
    rendererRef.current?.setPreviewSelection(previewIndices ?? null);
  }, [previewIndices]);

  // Suspend camera rotation while box-select is armed so a drag draws the box
  // instead of orbiting the camera.
  useEffect(() => {
    rendererRef.current?.setControlsEnabled(!boxSelectActive);
    return () => {
      rendererRef.current?.setControlsEnabled(true);
    };
  }, [boxSelectActive]);

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
    />
  );
}

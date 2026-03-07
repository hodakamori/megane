/**
 * Main megane viewer React component.
 * Combines Viewport, PipelineEditor, Timeline, Tooltip, and MeasurementPanel.
 * The pipeline store drives all appearance settings via ViewportState.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { PipelineEditor } from "./PipelineEditor";
import { Timeline } from "./Timeline";
import { Tooltip } from "./Tooltip";
import { MeasurementPanel } from "./MeasurementPanel";
import { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { inferBondsVdwJS } from "../parsers/inferBondsJS";
import { usePipelineStore } from "../pipeline/store";
import { applyViewportState } from "../pipeline/apply";
import { setStructureLoadHandler } from "./nodes/DataLoaderNode";
import type {
  Snapshot,
  Frame,
  HoverInfo,
  SelectionState,
  Measurement,
} from "../types";
import type { ViewportState } from "../pipeline/types";

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
  onUploadStructure: (file: File) => void;
  onBondSourceChange?: (source: string) => void;
  onLabelSourceChange?: (source: string) => void;
  onLoadLabelFile?: (file: File) => void;
  onVectorSourceChange?: (source: string) => void;
  onLoadVectorFile?: (file: File) => void;
  onLoadDemoVectors?: () => void;
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
  onUploadStructure,
  onBondSourceChange,
  onLabelSourceChange,
  onLoadLabelFile,
  onVectorSourceChange,
  onLoadVectorFile,
  onLoadDemoVectors,
  width = "100%",
  height = "100%",
}: MeganeViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [selection, setSelection] = useState<SelectionState>({ atoms: [] });
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 768;
  const [pipelineCollapsed, setPipelineCollapsed] = useState(isNarrow);
  const pipelineCollapsedRef = useRef(isNarrow);
  const prevViewportStateRef = useRef<ViewportState | null>(null);

  useEffect(() => {
    pipelineCollapsedRef.current = pipelineCollapsed;
  }, [pipelineCollapsed]);

  // Subscribe to pipeline store's viewportState
  const viewportState = usePipelineStore((s) => s.viewportState);
  const setSnapshot = usePipelineStore((s) => s.setSnapshot);

  // Push snapshot to pipeline store for selection queries
  useEffect(() => {
    setSnapshot(snapshot);
    // Viewport's loadSnapshot (child effect) resets per-atom overrides;
    // re-apply pipeline viewport state immediately after execution
    const renderer = rendererRef.current;
    if (renderer) {
      const vs = usePipelineStore.getState().viewportState;
      applyViewportState(renderer, vs, null);
      prevViewportStateRef.current = vs;
    }
  }, [snapshot, setSnapshot]);

  // Wire up node event handlers
  useEffect(() => {
    setStructureLoadHandler((file) => onUploadStructure(file));
    return () => {
      setStructureLoadHandler(null);
    };
  }, [onUploadStructure]);

  // Apply viewportState changes to the renderer
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    applyViewportState(renderer, viewportState, prevViewportStateRef.current);

    // Notify parent about bond source changes from DataLoader params
    const nodes = usePipelineStore.getState().nodes;
    const loaderNode = nodes.find((n) => n.type === "data_loader");
    if (loaderNode) {
      const params = loaderNode.data.params;
      if (params.type === "data_loader") {
        onBondSourceChange?.(params.bondSource);
      }
    }

    prevViewportStateRef.current = viewportState;
  }, [viewportState, onBondSourceChange]);

  // Per-frame bond recalculation for distance mode
  useEffect(() => {
    const nodes = usePipelineStore.getState().nodes;
    const loaderNode = nodes.find((n) => n.type === "data_loader");
    if (!loaderNode) return;
    const params = loaderNode.data.params;
    if (params.type !== "data_loader" || params.bondSource !== "distance") return;
    if (!snapshot || !frame) return;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const newBonds = inferBondsVdwJS(
      frame.positions,
      snapshot.elements,
      snapshot.nAtoms,
      0.6,
    );
    renderer.updateBonds(newBonds, null);
  }, [frame, snapshot]);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
    renderer.setViewInsets(
      pipelineCollapsedRef.current ? 0 : 492,
      0,
    );
    applyViewportState(renderer, usePipelineStore.getState().viewportState, null);
    prevViewportStateRef.current = usePipelineStore.getState().viewportState;
  }, []);

  const handleAtomRightClick = useCallback((atomIndex: number) => {
    if (!rendererRef.current) return;
    const newSelection = rendererRef.current.toggleAtomSelection(atomIndex);
    setSelection(newSelection);
    setMeasurement(rendererRef.current.getMeasurement());
  }, []);

  const handleClearSelection = useCallback(() => {
    rendererRef.current?.clearSelection();
    setSelection({ atoms: [] });
    setMeasurement(null);
  }, []);

  const handleFrameUpdated = useCallback(() => {
    if (!rendererRef.current) return;
    const m = rendererRef.current.getMeasurement();
    if (m) setMeasurement(m);
  }, []);

  const handleTogglePipeline = useCallback(() => {
    setPipelineCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    rendererRef.current?.setViewInsets(
      pipelineCollapsed ? 0 : 492,
      0,
    );
  }, [pipelineCollapsed]);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Viewport
        snapshot={snapshot}
        frame={frame}
        atomLabels={null}
        atomVectors={null}
        onRendererReady={handleRendererReady}
        onHover={setHoverInfo}
        onAtomRightClick={handleAtomRightClick}
        onFrameUpdated={handleFrameUpdated}
      />
      <PipelineEditor
        collapsed={pipelineCollapsed}
        onToggleCollapse={handleTogglePipeline}
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
      <Tooltip info={hoverInfo} />
      <MeasurementPanel
        selection={selection}
        measurement={measurement}
        elements={snapshot?.elements ?? null}
        onClear={handleClearSelection}
      />
    </div>
  );
}

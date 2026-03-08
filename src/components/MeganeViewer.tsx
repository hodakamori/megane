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
import { setStructureLoadHandler } from "./nodes/LoadStructureNode";
import { setTrajectoryLoadHandler } from "./nodes/LoadTrajectoryNode";
import type {
  Snapshot,
  Frame,
  HoverInfo,
  SelectionState,
  Measurement,
} from "../types";
import type { ViewportState, AddBondParams } from "../pipeline/types";

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
  onUploadTrajectory?: (file: File) => void;
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
  onUploadTrajectory,
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
  const pipelineWidthRef = useRef(480);
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

  useEffect(() => {
    if (onUploadTrajectory) {
      setTrajectoryLoadHandler((file) => onUploadTrajectory(file));
    }
    return () => {
      setTrajectoryLoadHandler(null);
    };
  }, [onUploadTrajectory]);

  // Apply viewportState changes to the renderer
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    applyViewportState(renderer, viewportState, prevViewportStateRef.current);
    prevViewportStateRef.current = viewportState;
  }, [viewportState]);

  // Per-frame bond recalculation for distance mode
  useEffect(() => {
    const nodes = usePipelineStore.getState().nodes;
    const bondNode = nodes.find((n) => n.type === "add_bond");
    if (!bondNode) return;
    const params = bondNode.data.params;
    if (params.type !== "add_bond" || (params as AddBondParams).bondSource !== "distance") return;
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
      0,
      pipelineCollapsedRef.current ? 0 : pipelineWidthRef.current + 12,
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

  const handlePipelineWidthChange = useCallback((w: number) => {
    pipelineWidthRef.current = w;
    if (!pipelineCollapsedRef.current) {
      rendererRef.current?.setViewInsets(0, w + 12);
    }
  }, []);

  useEffect(() => {
    rendererRef.current?.setViewInsets(
      0,
      pipelineCollapsed ? 0 : pipelineWidthRef.current + 12,
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
        onWidthChange={handlePipelineWidthChange}
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

/**
 * Main megane viewer React component.
 * Combines Viewport, PipelineEditor, Timeline, Tooltip, and MeasurementPanel.
 * The pipeline store drives all appearance settings via RenderState.
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
import { applyRenderState } from "../pipeline/apply";
import { setStructureLoadHandler } from "./nodes/LoadStructureNode";
import { setLabelFileHandler } from "./nodes/SetLabelsNode";
import { setVectorFileHandler, setDemoVectorsHandler } from "./nodes/SetVectorsNode";
import type {
  Snapshot,
  Frame,
  HoverInfo,
  SelectionState,
  Measurement,
} from "../types";
import type { RenderState } from "../pipeline/types";

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
  const prevRenderStateRef = useRef<RenderState | null>(null);

  useEffect(() => {
    pipelineCollapsedRef.current = pipelineCollapsed;
  }, [pipelineCollapsed]);

  // Subscribe to pipeline store's renderState
  const renderState = usePipelineStore((s) => s.renderState);

  // Wire up node event handlers
  useEffect(() => {
    setStructureLoadHandler((file) => onUploadStructure(file));
    setLabelFileHandler((file) => onLoadLabelFile?.(file));
    setVectorFileHandler((file) => onLoadVectorFile?.(file));
    setDemoVectorsHandler(() => onLoadDemoVectors?.());
    return () => {
      setStructureLoadHandler(null);
      setLabelFileHandler(null);
      setVectorFileHandler(null);
      setDemoVectorsHandler(null);
    };
  }, [onUploadStructure, onLoadLabelFile, onLoadVectorFile, onLoadDemoVectors]);

  // Apply renderState changes to the renderer
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    applyRenderState(renderer, renderState, prevRenderStateRef.current);

    // Notify parent about source changes for data management
    const prev = prevRenderStateRef.current;
    if (!prev || renderState.bondSource !== prev.bondSource) {
      onBondSourceChange?.(renderState.bondSource);
    }
    if (!prev || renderState.labelSource !== prev.labelSource) {
      onLabelSourceChange?.(renderState.labelSource);
    }
    if (!prev || renderState.vectorSource !== prev.vectorSource) {
      onVectorSourceChange?.(renderState.vectorSource);
    }

    prevRenderStateRef.current = renderState;
  }, [renderState, onBondSourceChange, onLabelSourceChange, onVectorSourceChange]);

  // Per-frame bond recalculation for distance mode
  useEffect(() => {
    if (renderState.bondSource !== "distance") return;
    if (!snapshot || !frame) return;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const newBonds = inferBondsVdwJS(
      frame.positions,
      snapshot.elements,
      snapshot.nAtoms,
      renderState.vdwScale,
    );
    renderer.updateBonds(newBonds, null);
  }, [frame, snapshot, renderState.bondSource, renderState.vdwScale]);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
    renderer.setViewInsets(
      pipelineCollapsedRef.current ? 0 : 492, // 12px gap + 480px pipeline panel
      0,
    );
    // Apply initial render state
    applyRenderState(renderer, usePipelineStore.getState().renderState, null);
    prevRenderStateRef.current = usePipelineStore.getState().renderState;
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

  // Update view insets when pipeline panel is toggled
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

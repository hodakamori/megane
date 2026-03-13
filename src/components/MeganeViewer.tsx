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
import { processPbcBonds } from "../pipeline/executors/addBond";
import { usePipelineStore } from "../pipeline/store";
import { applyViewportState, applyVectorsForFrame } from "../pipeline/apply";
import { useAtomSelection } from "../hooks/useAtomSelection";
import { setStructureLoadHandler } from "./nodes/LoadStructureNode";
import { setTrajectoryLoadHandler } from "./nodes/LoadTrajectoryNode";
import { setVectorLoadHandler } from "./nodes/LoadVectorNode";
import { loadVectorFileData } from "../logic/vectorSourceLogic";
import { parseStructureFile } from "../parsers/structure";
import type { NodeSnapshotData } from "../pipeline/execute";
import type {
  Snapshot,
  Frame,
  HoverInfo,
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
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 768;
  const [pipelineCollapsed, setPipelineCollapsed] = useState(isNarrow);
  const pipelineCollapsedRef = useRef(isNarrow);
  const pipelineWidthRef = useRef(480);
  const prevViewportStateRef = useRef<ViewportState | null>(null);

  // Shared atom selection & measurement
  const {
    selection,
    measurement,
    handleAtomRightClick,
    handleClearSelection,
    handleFrameUpdated,
  } = useAtomSelection(rendererRef);

  useEffect(() => {
    pipelineCollapsedRef.current = pipelineCollapsed;
  }, [pipelineCollapsed]);

  // Subscribe to pipeline store's viewportState
  const viewportState = usePipelineStore((s) => s.viewportState);
  const setSnapshot = usePipelineStore((s) => s.setSnapshot);
  const setNodeSnapshot = usePipelineStore((s) => s.setNodeSnapshot);
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const setNodeParseError = usePipelineStore((s) => s.setNodeParseError);
  const clearNodeParseError = usePipelineStore((s) => s.clearNodeParseError);

  // Track the "primary" load_structure node (the first one, for backward compat)
  const primaryNodeIdRef = useRef<string | null>(null);
  useEffect(() => {
    const nodes = usePipelineStore.getState().nodes;
    const primary = nodes.find((n) => n.type === "load_structure");
    primaryNodeIdRef.current = primary?.id ?? null;
  });

  // Push snapshot to pipeline store for selection queries
  useEffect(() => {
    setSnapshot(snapshot);
    // Viewport's loadSnapshot (child effect) resets per-atom overrides;
    // re-apply pipeline viewport state immediately after execution
    const renderer = rendererRef.current;
    if (renderer) {
      const vs = usePipelineStore.getState().viewportState;
      applyViewportState(renderer, vs, null, primaryNodeIdRef.current);
      prevViewportStateRef.current = vs;
    }
  }, [snapshot, setSnapshot]);

  // Wire up node event handlers for per-node structure loading
  useEffect(() => {
    setStructureLoadHandler((nodeId, file) => {
      // Parse file and store per-node snapshot
      parseStructureFile(file).then((result) => {
        clearNodeParseError(nodeId);
        const data: NodeSnapshotData = {
          snapshot: result.snapshot,
          frames: result.frames.length > 0 ? result.frames : null,
          meta: result.meta,
          labels: result.labels,
        };
        setNodeSnapshot(nodeId, data);
        // Update node port availability indicators
        updateNodeParams(nodeId, {
          hasTrajectory: result.frames.length > 0,
          hasCell: !!result.snapshot.box,
        });
      }).catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        setNodeParseError(nodeId, `Failed to parse file: ${message}`);
      });
      // For the primary node, also trigger legacy load path for trajectory/label compat
      if (nodeId === primaryNodeIdRef.current) {
        onUploadStructure(file);
      }
    });
    return () => {
      setStructureLoadHandler(null);
    };
  }, [onUploadStructure, setNodeSnapshot, updateNodeParams, setNodeParseError, clearNodeParseError]);

  useEffect(() => {
    if (onUploadTrajectory) {
      setTrajectoryLoadHandler((file) => onUploadTrajectory(file));
    }
    return () => {
      setTrajectoryLoadHandler(null);
    };
  }, [onUploadTrajectory]);

  // Wire up vector load handler
  const setFileVectors = usePipelineStore((s) => s.setFileVectors);
  useEffect(() => {
    setVectorLoadHandler((file) => {
      const nAtoms = snapshot?.nAtoms ?? 0;
      if (nAtoms === 0) return;
      loadVectorFileData(file, nAtoms).then(({ vectors }) => {
        setFileVectors(vectors);
      });
    });
    return () => {
      setVectorLoadHandler(null);
    };
  }, [snapshot, setFileVectors]);

  // Apply viewportState changes to the renderer
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    applyViewportState(renderer, viewportState, prevViewportStateRef.current, primaryNodeIdRef.current);
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
      snapshot.box,
    );

    const result = processPbcBonds(
      newBonds, null, frame.positions,
      snapshot.elements, snapshot.nAtoms, snapshot.box,
    );
    renderer.updateBondsExt(
      result.bondIndices, result.bondOrders,
      result.positions, result.elements, result.nAtoms,
    );
  }, [frame, snapshot]);

  // Per-frame vector update
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const vs = usePipelineStore.getState().viewportState;
    if (vs.vectors.length > 0) {
      applyVectorsForFrame(renderer, vs.vectors, currentFrame);
    }
  }, [currentFrame]);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
    renderer.setViewInsets(
      0,
      pipelineCollapsedRef.current ? 0 : pipelineWidthRef.current + 12,
    );
    applyViewportState(renderer, usePipelineStore.getState().viewportState, null, primaryNodeIdRef.current);
    prevViewportStateRef.current = usePipelineStore.getState().viewportState;
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

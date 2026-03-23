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
import { usePlaybackStore } from "../stores/usePlaybackStore";
import { applyViewportState, applyVectorsForFrame } from "../pipeline/apply";
import { useAtomSelection } from "../hooks/useAtomSelection";
import { useNodeLoadHandlers } from "../hooks/useNodeLoadHandlers";
import type { Snapshot, Frame, HoverInfo, BondSource, LabelSource, VectorSource } from "../types";
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
  onBondSourceChange?: (source: BondSource) => void;
  onLabelSourceChange?: (source: LabelSource) => void;
  onLoadLabelFile?: (file: File) => void;
  onVectorSourceChange?: (source: VectorSource) => void;
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
  _onBondSourceChange,
  _onLabelSourceChange,
  _onLoadLabelFile,
  _onVectorSourceChange,
  _onLoadVectorFile,
  _onLoadDemoVectors,
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
  const { selection, measurement, handleAtomRightClick, handleClearSelection, handleFrameUpdated } =
    useAtomSelection(rendererRef);

  useEffect(() => {
    pipelineCollapsedRef.current = pipelineCollapsed;
  }, [pipelineCollapsed]);

  // Subscribe to pipeline store's viewportState
  const viewportState = usePipelineStore((s) => s.viewportState);
  const setSnapshot = usePipelineStore((s) => s.setSnapshot);

  // Wire up node load handlers (structure, trajectory, vector) and track primary node
  const primaryNodeIdRef = useNodeLoadHandlers({
    snapshot,
    onUploadStructure,
    onUploadTrajectory,
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

  // Apply viewportState changes to the renderer
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    applyViewportState(
      renderer,
      viewportState,
      prevViewportStateRef.current,
      primaryNodeIdRef.current,
    );
    prevViewportStateRef.current = viewportState;
  }, [viewportState]);

  // Connect pipeline trajectories to the playback store
  const setPlaybackProvider = usePlaybackStore((s) => s.setProvider);
  const prevTrajectoryRef = useRef<unknown>(null);
  useEffect(() => {
    const traj = viewportState.trajectories[0] ?? null;
    // Only update if the trajectory provider actually changed
    const provider = traj?.provider ?? null;
    if (provider !== prevTrajectoryRef.current) {
      prevTrajectoryRef.current = provider;
      setPlaybackProvider(provider);
    }
  }, [viewportState.trajectories, setPlaybackProvider]);

  // Use playback store's frame for rendering (prefer over prop)
  const playbackFrame = usePlaybackStore((s) => s.currentFrameData);
  const playbackCurrentFrame = usePlaybackStore((s) => s.currentFrame);
  const effectiveFrame = playbackFrame ?? frame;
  const effectiveCurrentFrame = playbackFrame ? playbackCurrentFrame : currentFrame;

  // Per-frame bond recalculation for distance mode
  useEffect(() => {
    const nodes = usePipelineStore.getState().nodes;
    const bondNode = nodes.find((n) => n.type === "add_bond");
    if (!bondNode) return;
    const params = bondNode.data.params;
    if (params.type !== "add_bond" || (params as AddBondParams).bondSource !== "distance") return;
    if (!snapshot || !effectiveFrame) return;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const newBonds = inferBondsVdwJS(
      effectiveFrame.positions,
      snapshot.elements,
      snapshot.nAtoms,
      0.6,
      snapshot.box,
    );

    const result = processPbcBonds(
      newBonds,
      null,
      effectiveFrame.positions,
      snapshot.elements,
      snapshot.nAtoms,
      snapshot.box,
    );
    renderer.updateBondsExt(
      result.bondIndices,
      result.bondOrders,
      result.positions,
      result.elements,
      result.nAtoms,
    );
  }, [effectiveFrame, snapshot]);

  // Per-frame vector update
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const vs = usePipelineStore.getState().viewportState;
    if (vs.vectors.length > 0) {
      applyVectorsForFrame(renderer, vs.vectors, effectiveCurrentFrame);
    }
  }, [effectiveCurrentFrame]);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
    renderer.setViewInsets(0, pipelineCollapsedRef.current ? 0 : pipelineWidthRef.current + 12);
    applyViewportState(
      renderer,
      usePipelineStore.getState().viewportState,
      null,
      primaryNodeIdRef.current,
    );
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
    rendererRef.current?.setViewInsets(0, pipelineCollapsed ? 0 : pipelineWidthRef.current + 12);
  }, [pipelineCollapsed]);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Viewport
        snapshot={snapshot}
        frame={effectiveFrame}
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
        rendererRef={rendererRef}
        totalFrames={totalFrames}
        currentFrame={effectiveCurrentFrame}
        onSeek={onSeek}
      />
      {onSeek && onPlayPause && onFpsChange && (
        <Timeline
          currentFrame={effectiveCurrentFrame}
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

/**
 * Main megane viewer React component.
 *
 * Combines Viewport, PipelineEditor, Timeline, Tooltip, and MeasurementPanel.
 * The pipeline store drives all rendering state — snapshot, frames, viewport
 * appearance — so the viewer is fully governed by the pipeline graph that the
 * user sees. Hosts (webapp / VSCode webview / JupyterLab DocWidget) supply
 * only the file-ingestion callbacks; viewer state is derived internally.
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
import type { HoverInfo, BondSource, LabelSource, VectorSource } from "../types";
import type { ViewportState, AddBondParams } from "../pipeline/types";

interface MeganeViewerProps {
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
  /** Host context tag for E2E tests: "webapp" | "jupyterlab-doc" | "vscode". Defaults to "webapp". */
  testContext?: string;
}

export function MeganeViewer({
  playing = false,
  fps = 30,
  onSeek,
  onPlayPause,
  onFpsChange,
  onUploadStructure,
  onUploadTrajectory,
  onBondSourceChange: _onBondSourceChange,
  onLabelSourceChange: _onLabelSourceChange,
  onLoadLabelFile: _onLoadLabelFile,
  onVectorSourceChange: _onVectorSourceChange,
  onLoadVectorFile: _onLoadVectorFile,
  onLoadDemoVectors: _onLoadDemoVectors,
  width = "100%",
  height = "100%",
  testContext = "webapp",
}: MeganeViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [bondCount, setBondCount] = useState<number>(0);
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

  // Subscribe to pipeline store: viewportState drives the renderer, and the
  // primary particle's source carries the canonical snapshot (set by
  // setNodeSnapshot in usePipelineStore.openFile).
  const viewportState = usePipelineStore((s) => s.viewportState);
  const snapshot = usePipelineStore((s) => s.viewportState.particles[0]?.source ?? null);

  // Wire up node load handlers (structure, trajectory, vector) and track primary node
  const primaryNodeIdRef = useNodeLoadHandlers({
    snapshot,
    onUploadStructure,
    onUploadTrajectory,
  });

  // When the snapshot identity changes, the Viewport's child loadSnapshot
  // effect resets per-atom overrides, so we re-apply the pipeline viewport
  // state immediately afterwards.
  useEffect(() => {
    setBondCount(snapshot?.nBonds ?? 0);
    const renderer = rendererRef.current;
    if (renderer) {
      const vs = usePipelineStore.getState().viewportState;
      applyViewportState(renderer, vs, null, primaryNodeIdRef.current);
      prevViewportStateRef.current = vs;
    }
  }, [snapshot]);

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

  // Track pipeline-driven bond updates (initial load, bondSource flips, etc.).
  // Per-frame distance-mode updates skip viewportState and go direct to the
  // renderer, so they update bondCount in the per-frame effect below instead.
  useEffect(() => {
    const total = viewportState.bonds.reduce((sum, b) => sum + b.bondIndices.length / 2, 0);
    setBondCount(total);
  }, [viewportState.bonds]);

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

  // Frame, currentFrame, and totalFrames come straight from the playback store.
  const frame = usePlaybackStore((s) => s.currentFrameData);
  const currentFrame = usePlaybackStore((s) => s.currentFrame);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);

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
      newBonds,
      null,
      frame.positions,
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
    setBondCount(result.bondIndices.length / 2);
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
    <div
      data-testid="megane-viewer"
      data-megane-context={testContext}
      data-atom-count={snapshot?.nAtoms ?? 0}
      data-bond-count={bondCount}
      data-total-frames={totalFrames}
      data-current-frame={currentFrame}
      style={{ width, height, position: "relative", overflow: "hidden" }}
    >
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
        rendererRef={rendererRef}
        totalFrames={totalFrames}
        currentFrame={currentFrame}
        onSeek={onSeek}
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

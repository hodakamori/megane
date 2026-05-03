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
import { useViewStateStore } from "../stores/useViewStateStore";
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
  /**
   * Fired whenever the active trajectory frame changes (user scrub, playback
   * tick, or programmatic seek). Mirrors the Jupyter widget's `frame_change`
   * event so a host React app can stay in sync — useful for Plotly traces
   * keyed on the same frame index.
   */
  onFrameChange?: (frame: number) => void;
  width?: string | number;
  height?: string | number;
  /** Host context tag for E2E tests: "webapp" | "jupyterlab-doc" | "vscode". Defaults to "webapp". */
  testContext?: string;
  /**
   * Override the initial camera state to restore on first snapshot load.
   * When provided, takes precedence over localStorage. Used by hosts (VSCode,
   * JupyterLab) that manage their own persistent storage.
   */
  initialCameraState?: import("../renderer/MoleculeRenderer").MeganeCameraState | null;
  /**
   * Called whenever the camera state changes (after user interaction ends).
   * Allows hosts to persist camera state in their own storage backends.
   * When omitted, the built-in localStorage store is used.
   */
  onCameraStateChange?: (state: import("../renderer/MoleculeRenderer").MeganeCameraState) => void;
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
  onFrameChange,
  width = "100%",
  height = "100%",
  testContext = "webapp",
  initialCameraState,
  onCameraStateChange,
}: MeganeViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [bondCount, setBondCount] = useState<number>(0);
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 768;
  const [pipelineCollapsed, setPipelineCollapsed] = useState(isNarrow);
  const pipelineCollapsedRef = useRef(isNarrow);
  const pipelineWidthRef = useRef(480);
  const prevViewportStateRef = useRef<ViewportState | null>(null);
  const hasRestoredCameraRef = useRef(false);

  // Shared atom selection & measurement
  const { selection, measurement, handleAtomRightClick, handleClearSelection, handleFrameUpdated } =
    useAtomSelection(rendererRef);

  useEffect(() => {
    pipelineCollapsedRef.current = pipelineCollapsed;
  }, [pipelineCollapsed]);

  // Subscribe to pipeline store: viewportState drives the renderer, and the
  // primary particle's source carries the canonical snapshot (set by
  // setNodeSnapshot in usePipelineStore.openFile).
  //
  // We deliberately do NOT subscribe to `viewportState` itself in the React
  // render path — every node-param change (e.g. AddBond bondSource flip)
  // produces a new viewportState reference, and a render-path subscription
  // would cascade into a re-render of every child (PipelineEditor, Timeline,
  // Sidebar, …). Instead, the effect below subscribes via
  // `usePipelineStore.subscribe`, which only fires the callback without
  // triggering a render. The `snapshot` selector still drives the React
  // tree because it changes identity only on file load (snapshots are
  // pinned to the LoadStructure's NodeSnapshotData).
  const snapshot = usePipelineStore((s) => s.viewportState.particles[0]?.source ?? null);

  // Wire up node load handlers (structure, trajectory, vector) and track primary node
  const primaryNodeIdRef = useNodeLoadHandlers({
    snapshot,
    onUploadStructure,
    onUploadTrajectory,
  });

  // When the snapshot identity changes, the Viewport's child loadSnapshot
  // effect resets per-atom overrides, so we re-apply the pipeline viewport
  // state immediately afterwards. Viewport's effect (child) runs before this
  // parent effect, so fitToView has already been called by the time we run.
  useEffect(() => {
    setBondCount(snapshot?.nBonds ?? 0);
    const renderer = rendererRef.current;
    if (renderer) {
      const vs = usePipelineStore.getState().viewportState;
      applyViewportState(renderer, vs, null, primaryNodeIdRef.current);
      prevViewportStateRef.current = vs;

      // On first snapshot load after mount, restore persisted camera state
      // (overrides fitToView). Hosts supply initialCameraState for their own
      // storage; otherwise falls back to the localStorage-backed store.
      if (snapshot && !hasRestoredCameraRef.current) {
        hasRestoredCameraRef.current = true;
        const saved =
          initialCameraState !== undefined
            ? initialCameraState
            : useViewStateStore.getState().camera;
        if (saved) {
          renderer.applyCameraState(saved);
        }
      }
    }
  }, [snapshot, initialCameraState]);

  // Apply viewportState changes to the renderer + drive playback / bond-count
  // updates without triggering a React re-render of MeganeViewer. Subscribing
  // through the vanilla zustand API (instead of `usePipelineStore(selector)`)
  // means a full pipeline execute flushes only effect callbacks here.
  const setPlaybackProvider = usePlaybackStore((s) => s.setProvider);
  useEffect(() => {
    let prevBondsRef: ViewportState["bonds"] | null = null;
    let prevTrajRef: unknown = null;

    const apply = (vs: ViewportState) => {
      const renderer = rendererRef.current;
      if (renderer) {
        applyViewportState(renderer, vs, prevViewportStateRef.current, primaryNodeIdRef.current);
        prevViewportStateRef.current = vs;
      }

      if (vs.bonds !== prevBondsRef) {
        prevBondsRef = vs.bonds;
        const total = vs.bonds.reduce((sum, b) => sum + b.bondIndices.length / 2, 0);
        setBondCount((current) => (current === total ? current : total));
      }

      const traj = vs.trajectories[0] ?? null;
      const provider = traj?.provider ?? null;
      if (provider !== prevTrajRef) {
        prevTrajRef = provider;
        setPlaybackProvider(provider);
      }
    };

    apply(usePipelineStore.getState().viewportState);
    return usePipelineStore.subscribe((state, prev) => {
      if (state.viewportState !== prev.viewportState) apply(state.viewportState);
    });
  }, [setPlaybackProvider]);

  // Frame, currentFrame, and totalFrames come straight from the playback store.
  const frame = usePlaybackStore((s) => s.currentFrameData);
  const currentFrame = usePlaybackStore((s) => s.currentFrame);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);

  // Surface frame changes to host React apps (e.g. Plotly integration). We
  // skip the synthetic 0-on-mount value so consumers only receive transitions
  // they caused, matching the Jupyter widget's `frame_change` semantics.
  const lastFrameRef = useRef<number | null>(null);
  useEffect(() => {
    if (!onFrameChange) return;
    if (lastFrameRef.current === currentFrame) return;
    if (lastFrameRef.current !== null) {
      onFrameChange(currentFrame);
    }
    lastFrameRef.current = currentFrame;
  }, [currentFrame, onFrameChange]);

  const storePlaying = usePlaybackStore((s) => s.playing);
  const storeFps = usePlaybackStore((s) => s.fps);
  const storeSeek = usePlaybackStore((s) => s.seekFrame);
  const storeTogglePlayPause = usePlaybackStore((s) => s.togglePlayPause);
  const storeSetFps = usePlaybackStore((s) => s.setFps);

  // Hosts may forward custom playback callbacks (the webapp wraps them to
  // pause on file uploads). When omitted (VSCode webview, JupyterLab
  // DocWidget), wire Timeline directly to the playback store so the user
  // always gets playback controls for multi-frame structures.
  const effectivePlaying = onPlayPause ? playing : storePlaying;
  const effectiveFps = onFpsChange ? fps : storeFps;
  const effectiveOnSeek = onSeek ?? storeSeek;
  const effectiveOnPlayPause = onPlayPause ?? storeTogglePlayPause;
  const effectiveOnFpsChange = onFpsChange ?? storeSetFps;

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

  const onCameraStateChangeRef = useRef(onCameraStateChange);
  onCameraStateChangeRef.current = onCameraStateChange;

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

    // Register camera change callback for persistence
    renderer.setCameraChangeCallback(() => {
      const state = renderer.getCameraState();
      if (!state) return;
      if (onCameraStateChangeRef.current) {
        onCameraStateChangeRef.current(state);
      } else {
        useViewStateStore.getState().updateCamera(state);
      }
    });
  }, []);

  const handleTogglePipeline = useCallback(() => {
    setPipelineCollapsed((prev) => !prev);
  }, []);

  // Tour anchor — invisible rectangle the guide tour highlights when it
  // points to the Viewport. Sized to fill the visible 3D canvas region,
  // staying clear of the Pipeline panel on the right and the Timeline at
  // the bottom. Updated imperatively (no re-render) when the panel resizes.
  const tourAnchorRef = useRef<HTMLDivElement | null>(null);
  const updateTourAnchor = useCallback(() => {
    const el = tourAnchorRef.current;
    if (!el) return;
    const right = pipelineCollapsedRef.current ? 60 : pipelineWidthRef.current + 24;
    el.style.right = `${right}px`;
  }, []);

  const handlePipelineWidthChange = useCallback(
    (w: number) => {
      pipelineWidthRef.current = w;
      if (!pipelineCollapsedRef.current) {
        rendererRef.current?.setViewInsets(0, w + 12);
      }
      updateTourAnchor();
    },
    [updateTourAnchor],
  );

  useEffect(() => {
    rendererRef.current?.setViewInsets(0, pipelineCollapsed ? 0 : pipelineWidthRef.current + 12);
    updateTourAnchor();
  }, [pipelineCollapsed, updateTourAnchor]);

  const handleResetView = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    renderer.resetCamera();
    useViewStateStore.getState().clearViewState();
  }, []);

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
      <div
        ref={tourAnchorRef}
        data-tour-anchor="viewport"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          right: pipelineCollapsed ? 60 : pipelineWidthRef.current + 24,
          bottom: 80,
          pointerEvents: "none",
          opacity: 0,
        }}
      />
      <button
        data-testid="reset-view-btn"
        title="Reset view (fit to structure)"
        onClick={handleResetView}
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          padding: "4px 8px",
          fontSize: 11,
          lineHeight: 1,
          background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(0,0,0,0.15)",
          borderRadius: 4,
          cursor: "pointer",
          color: "#374151",
          backdropFilter: "blur(4px)",
          zIndex: 10,
          userSelect: "none",
        }}
      >
        Reset View
      </button>
      <PipelineEditor
        collapsed={pipelineCollapsed}
        onToggleCollapse={handleTogglePipeline}
        onWidthChange={handlePipelineWidthChange}
        rendererRef={rendererRef}
        totalFrames={totalFrames}
        currentFrame={currentFrame}
        onSeek={effectiveOnSeek}
      />
      <Timeline
        currentFrame={currentFrame}
        totalFrames={totalFrames}
        playing={effectivePlaying}
        fps={effectiveFps}
        onSeek={effectiveOnSeek}
        onPlayPause={effectiveOnPlayPause}
        onFpsChange={effectiveOnFpsChange}
      />
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

/**
 * Simplified megane viewer for Jupyter widget embedding.
 * Minimal UI: Viewport + Timeline only.
 *
 * When `pipeline` prop is true, drives rendering through the pipeline
 * store using the pipeline JSON and per-node snapshot data from Python.
 * The pipeline editor UI is not shown — pipeline is built in Python.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { Timeline } from "./Timeline";
import { Tooltip } from "./Tooltip";
import { MeasurementPanel } from "./MeasurementPanel";
import { AppearancePanel } from "./AppearancePanel";
import { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { useAtomSelection } from "../hooks/useAtomSelection";
import { useAppearancePanelState } from "../hooks/useAppearancePanelState";
import { inferBondsVdwJS } from "../parsers/inferBondsJS";
import { processPbcBonds } from "../pipeline/executors/addBond";
import { usePipelineStore } from "../pipeline/store";
import { applyViewportState } from "../pipeline/apply";
import { decodeSnapshot, decodeHeader, MSG_SNAPSHOT } from "../protocol/protocol";
import type { ViewportState, AddBondParams } from "../pipeline/types";
import type { Snapshot, Frame, Measurement, HoverInfo } from "../types";

interface WidgetViewerProps {
  snapshot: Snapshot | null;
  frame: Frame | null;
  currentFrame: number;
  totalFrames: number;
  onSeek: (frame: number) => void;
  selectedAtoms?: number[];
  onMeasurementChange?: (measurement: Measurement | null) => void;
  pipeline?: boolean;
  pipelineJson?: string;
  nodeSnapshotsData?: Record<string, DataView>;
  onPipelineChange?: (json: string) => void;
}

export function WidgetViewer(props: WidgetViewerProps) {
  if (props.pipeline) {
    return <WidgetViewerPipeline {...props} />;
  }
  return <WidgetViewerSimple {...props} />;
}

/* ─── Pipeline mode ──────────────────────────────────────────────── */

/** Decode a binary DataView into a Snapshot. */
function decodeNodeSnapshot(data: DataView): Snapshot | null {
  if (!data || data.byteLength === 0) return null;
  const buffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(buffer).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
  const { msgType } = decodeHeader(buffer);
  if (msgType === MSG_SNAPSHOT) {
    return decodeSnapshot(buffer);
  }
  return null;
}

function WidgetViewerPipeline({
  snapshot,
  frame,
  currentFrame,
  totalFrames,
  onSeek,
  selectedAtoms,
  onMeasurementChange,
  pipelineJson,
  nodeSnapshotsData,
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [bondCount, setBondCount] = useState<number>(0);
  const prevViewportStateRef = useRef<ViewportState | null>(null);
  const appearance = useAppearancePanelState(rendererRef, true);

  const {
    selection,
    measurement,
    handleAtomRightClick,
    handleClearSelection,
    handleFrameUpdated,
    setExternalSelection,
  } = useAtomSelection(rendererRef, onMeasurementChange);

  // Keep a ref so handleRendererReady can apply the initial selection
  const selectedAtomsRef = useRef(selectedAtoms);
  selectedAtomsRef.current = selectedAtoms;

  // Sync external atom selection from Python
  useEffect(() => {
    setExternalSelection(selectedAtoms ?? []);
  }, [selectedAtoms, setExternalSelection]);
  const viewportState = usePipelineStore((s) => s.viewportState);
  const storeSnapshot = usePipelineStore((s) => s.snapshot);
  const setSnapshot = usePipelineStore((s) => s.setSnapshot);

  // Push per-node snapshots from Python to the pipeline store
  useEffect(() => {
    if (!nodeSnapshotsData || Object.keys(nodeSnapshotsData).length === 0) {
      // Fall back to the global snapshot (legacy)
      setSnapshot(snapshot);
    } else {
      // Decode each per-node snapshot and populate nodeSnapshots
      const store = usePipelineStore.getState();
      for (const [nodeId, data] of Object.entries(nodeSnapshotsData)) {
        const decoded = decodeNodeSnapshot(data);
        if (decoded) {
          store.setNodeSnapshot(nodeId, {
            snapshot: decoded,
            frames: null,
            meta: null,
            labels: null,
          });
        }
      }
      // Also set the first snapshot as the global one for the renderer
      const firstData = Object.values(nodeSnapshotsData)[0];
      if (firstData) {
        const firstSnapshot = decodeNodeSnapshot(firstData);
        setSnapshot(firstSnapshot);
      }
    }
    const renderer = rendererRef.current;
    if (renderer) {
      const vs = usePipelineStore.getState().viewportState;
      applyViewportState(renderer, vs, null);
      prevViewportStateRef.current = vs;
    }
  }, [snapshot, nodeSnapshotsData, setSnapshot]);

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
    // In pipeline mode the `snapshot` prop is null (set_pipeline only populates
    // `_node_snapshots_data`), so fall back to the store snapshot — same
    // pattern as Viewport and MeasurementPanel below.
    const effectiveSnapshot = storeSnapshot ?? snapshot;
    if (!effectiveSnapshot || !frame) return;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const newBonds = inferBondsVdwJS(
      frame.positions,
      effectiveSnapshot.elements,
      effectiveSnapshot.nAtoms,
      0.6,
      effectiveSnapshot.box,
    );

    const result = processPbcBonds(
      newBonds,
      null,
      frame.positions,
      effectiveSnapshot.elements,
      effectiveSnapshot.nAtoms,
      effectiveSnapshot.box,
    );
    renderer.updateBondsExt(
      result.bondIndices,
      result.bondOrders,
      result.positions,
      result.elements,
      result.nAtoms,
    );
    setBondCount(result.bondIndices.length / 2);
  }, [frame, storeSnapshot, snapshot]);

  // Track pipeline-driven bond updates (initial load, bondSource flips,
  // file-mode bonds). Mirrors MeganeViewer's pattern.
  useEffect(() => {
    const total = viewportState.bonds.reduce(
      (sum, b) => sum + b.bondIndices.length / 2,
      0,
    );
    setBondCount(total);
  }, [viewportState.bonds]);

  // Apply pipeline JSON from Python
  const prevPipelineJsonRef = useRef<string>("");
  useEffect(() => {
    if (!pipelineJson || pipelineJson === prevPipelineJsonRef.current) return;
    prevPipelineJsonRef.current = pipelineJson;
    try {
      const config = JSON.parse(pipelineJson);
      usePipelineStore.getState().deserialize(config);
    } catch {
      // Ignore invalid JSON
    }
  }, [pipelineJson]);

  const handleRendererReady = useCallback(
    (renderer: MoleculeRenderer) => {
      rendererRef.current = renderer;
      applyViewportState(renderer, usePipelineStore.getState().viewportState, null);
      prevViewportStateRef.current = usePipelineStore.getState().viewportState;
      // Apply initial selectedAtoms that may have arrived before the renderer was ready
      setExternalSelection(selectedAtomsRef.current ?? []);
    },
    [setExternalSelection],
  );

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => {
      if (prev) {
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
          playIntervalRef.current = null;
        }
        return false;
      } else {
        playIntervalRef.current = setInterval(() => {
          onSeek(-1);
        }, 1000 / fps);
        return true;
      }
    });
  }, [fps, onSeek]);

  const handleFpsChange = useCallback(
    (newFps: number) => {
      setFps(newFps);
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = setInterval(() => {
          onSeek(-1);
        }, 1000 / newFps);
      }
    },
    [onSeek],
  );

  const handleSeek = useCallback(
    (frame: number) => {
      if (playing) {
        setPlaying(false);
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
          playIntervalRef.current = null;
        }
      }
      onSeek(frame);
    },
    [onSeek, playing],
  );

  const effectiveSnapshot = storeSnapshot ?? snapshot;

  return (
    <div
      data-testid="megane-viewer"
      data-megane-context="widget-pipeline"
      data-atom-count={effectiveSnapshot?.nAtoms ?? 0}
      data-bond-count={bondCount}
      data-total-frames={totalFrames}
      data-current-frame={currentFrame}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Viewport
        snapshot={effectiveSnapshot}
        frame={frame}
        onRendererReady={handleRendererReady}
        onHover={setHoverInfo}
        onAtomRightClick={handleAtomRightClick}
        onFrameUpdated={handleFrameUpdated}
      />

      {totalFrames > 1 && (
        <Timeline
          currentFrame={currentFrame}
          totalFrames={totalFrames}
          playing={playing}
          fps={fps}
          onSeek={handleSeek}
          onPlayPause={handlePlayPause}
          onFpsChange={handleFpsChange}
        />
      )}
      <Tooltip info={hoverInfo} />
      <MeasurementPanel
        selection={selection}
        measurement={measurement}
        elements={effectiveSnapshot?.elements ?? null}
        onClear={handleClearSelection}
      />
      <AppearancePanel
        {...appearance}
        labels={{
          source: "none",
          onSourceChange: () => {},
          onUploadFile: () => {},
          fileName: null,
          hasStructureLabels: false,
        }}
        top={12}
      />
    </div>
  );
}

/* ─── Simple mode (default, no pipeline) ─────────────────────────── */

function WidgetViewerSimple({
  snapshot,
  frame,
  currentFrame,
  totalFrames,
  onSeek,
  selectedAtoms,
  onMeasurementChange,
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const appearance = useAppearancePanelState(rendererRef, true);

  const {
    selection,
    measurement,
    handleAtomRightClick,
    handleClearSelection,
    handleFrameUpdated,
    setExternalSelection,
  } = useAtomSelection(rendererRef, onMeasurementChange);

  // Keep a ref so handleRendererReady can apply the initial selection
  const selectedAtomsRef = useRef(selectedAtoms);
  selectedAtomsRef.current = selectedAtoms;

  useEffect(() => {
    setExternalSelection(selectedAtoms ?? []);
  }, [selectedAtoms, setExternalSelection]);

  const handleRendererReady = useCallback(
    (renderer: MoleculeRenderer) => {
      rendererRef.current = renderer;
      // Apply initial selectedAtoms that may have arrived before the renderer was ready
      setExternalSelection(selectedAtomsRef.current ?? []);
    },
    [setExternalSelection],
  );

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => {
      if (prev) {
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
          playIntervalRef.current = null;
        }
        return false;
      } else {
        playIntervalRef.current = setInterval(() => {
          onSeek(-1);
        }, 1000 / fps);
        return true;
      }
    });
  }, [fps, onSeek]);

  const handleFpsChange = useCallback(
    (newFps: number) => {
      setFps(newFps);
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = setInterval(() => {
          onSeek(-1);
        }, 1000 / newFps);
      }
    },
    [onSeek],
  );

  const handleSeek = useCallback(
    (frame: number) => {
      if (playing) {
        setPlaying(false);
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
          playIntervalRef.current = null;
        }
      }
      onSeek(frame);
    },
    [onSeek, playing],
  );

  return (
    <div
      data-testid="megane-viewer"
      data-megane-context="widget-simple"
      data-atom-count={snapshot?.nAtoms ?? 0}
      data-bond-count={snapshot?.nBonds ?? 0}
      data-total-frames={totalFrames}
      data-current-frame={currentFrame}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Viewport
        snapshot={snapshot}
        frame={frame}
        onRendererReady={handleRendererReady}
        onHover={setHoverInfo}
        onAtomRightClick={handleAtomRightClick}
        onFrameUpdated={handleFrameUpdated}
      />

      {totalFrames > 1 && (
        <Timeline
          currentFrame={currentFrame}
          totalFrames={totalFrames}
          playing={playing}
          fps={fps}
          onSeek={handleSeek}
          onPlayPause={handlePlayPause}
          onFpsChange={handleFpsChange}
        />
      )}
      <Tooltip info={hoverInfo} />
      <MeasurementPanel
        selection={selection}
        measurement={measurement}
        elements={snapshot?.elements ?? null}
        onClear={handleClearSelection}
      />
      <AppearancePanel
        {...appearance}
        labels={{
          source: "none",
          onSourceChange: () => {},
          onUploadFile: () => {},
          fileName: null,
          hasStructureLabels: false,
        }}
        top={12}
      />
    </div>
  );
}

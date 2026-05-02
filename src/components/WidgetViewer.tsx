/**
 * Simplified megane viewer for Jupyter widget embedding.
 * Minimal UI: Viewport + Timeline + Tooltip + MeasurementPanel.
 *
 * Always drives rendering through the pipeline store. When the host has
 * not called `set_pipeline()` (legacy `.load()` path), the component
 * falls back to the global `snapshot` prop and renders it directly via
 * Viewport's `loadSnapshot` while the pipeline store stays at its
 * default (empty) viewport state.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";
import { Viewport } from "./Viewport";
import { Timeline } from "./Timeline";
import { Tooltip } from "./Tooltip";
import { MeasurementPanel } from "./MeasurementPanel";
import { PipelineEditor } from "./PipelineEditor";
import { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { useAtomSelection } from "../hooks/useAtomSelection";
import { inferBondsVdwJS } from "../parsers/inferBondsJS";
import { processPbcBonds } from "../pipeline/executors/addBond";
import { createPipelineStore, type PipelineStore, usePipelineStore } from "../pipeline/store";
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
  pipelineJson?: string;
  nodeSnapshotsData?: Record<string, DataView>;
  onPipelineChange?: (json: string) => void;
  // When true, render the visual pipeline editor inside the widget. Mounting
  // the editor forces the widget onto the global pipeline store so the
  // editor's reactive subscriptions (which use the global hook) and the
  // widget's data-loading effects share one source of truth. The cost: two
  // MolecularViewer instances both opted in to `pipeline=True` in the same
  // notebook will share editor state. The default (`pipelineEnabled=false`)
  // keeps the historical per-mount private store.
  pipelineEnabled?: boolean;
  // Optional pipeline store override. Each Jupyter widget mount creates its
  // own private store so multiple MolecularViewers in the same notebook do
  // not share state. Tests pass their own store to inspect internal state.
  pipelineStore?: StoreApi<PipelineStore>;
}

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

export function WidgetViewer({
  snapshot,
  frame,
  currentFrame,
  totalFrames,
  onSeek,
  selectedAtoms,
  onMeasurementChange,
  pipelineJson,
  nodeSnapshotsData,
  pipelineEnabled = false,
  pipelineStore: pipelineStoreProp,
}: WidgetViewerProps) {
  // Each WidgetViewer instance owns a private pipeline store. The webapp
  // singleton (`usePipelineStore`) is intentionally avoided here so that
  // multiple MolecularViewers in one notebook do not share state — without
  // this, the second viewer's loadPipeline() overwrites the first viewer's
  // pipeline, leaving it blank.
  //
  // Exception: when the user opts into the visual pipeline editor with
  // `pipeline=True`, fall back to the global store. PipelineEditor uses
  // `usePipelineStore` directly, so the editor and the widget's effects must
  // both target the same store or the editor's edits silently do nothing.
  const [defaultStore] = useState(() => createPipelineStore());
  const pipelineStore = pipelineStoreProp ?? (pipelineEnabled ? usePipelineStore : defaultStore);

  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [bondCount, setBondCount] = useState<number>(0);
  const prevViewportStateRef = useRef<ViewportState | null>(null);

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
  const viewportState = useStore(pipelineStore, (s) => s.viewportState);
  const storeSnapshot = useStore(pipelineStore, (s) => s.snapshot);
  const setSnapshot = useStore(pipelineStore, (s) => s.setSnapshot);

  // Apply pipeline + per-node snapshots from Python.
  //
  // Order matters: `deserialize()` clears `nodeSnapshots` (so opening a new
  // .megane.json doesn't bleed state across JupyterLab documents), so a
  // separate effect that calls `setNodeSnapshot` followed by another that
  // calls `deserialize` would race — the deserialize wins, leaves
  // nodeSnapshots empty, and `executeLoadStructure` produces no particles
  // (blank viewport). Using `loadPipeline` performs both updates in a
  // single store transaction so the post-deserialize execute() sees the
  // matching snapshots.
  const prevPipelineJsonRef = useRef<string>("");
  useEffect(() => {
    const store = pipelineStore.getState();
    const decodedSnapshots: Record<string, Parameters<typeof store.setNodeSnapshot>[1]> = {};
    if (nodeSnapshotsData) {
      for (const [nodeId, data] of Object.entries(nodeSnapshotsData)) {
        const decoded = decodeNodeSnapshot(data);
        if (decoded) {
          decodedSnapshots[nodeId] = {
            snapshot: decoded,
            frames: null,
            meta: null,
            labels: null,
          };
        }
      }
    }

    if (pipelineJson && pipelineJson !== prevPipelineJsonRef.current) {
      prevPipelineJsonRef.current = pipelineJson;
      try {
        const config = JSON.parse(pipelineJson);
        store.loadPipeline(config, decodedSnapshots);
      } catch {
        // Ignore invalid JSON
      }
    } else if (Object.keys(decodedSnapshots).length > 0) {
      // Pipeline JSON is unchanged but the per-node snapshots may have
      // refreshed (e.g. trajectory tick or a follow-up `.load()` call).
      for (const [nodeId, data] of Object.entries(decodedSnapshots)) {
        store.setNodeSnapshot(nodeId, data);
      }
      const sortedIds = Object.keys(decodedSnapshots).sort();
      setSnapshot(decodedSnapshots[sortedIds[0]].snapshot);
    } else {
      // Legacy `.load()` path: no pipeline JSON, no per-node snapshots.
      setSnapshot(snapshot);
    }

    const renderer = rendererRef.current;
    if (renderer) {
      const storeState = pipelineStore.getState();
      applyViewportState(
        renderer,
        storeState.viewportState,
        null,
        undefined,
        storeState.atomLabels,
      );
      prevViewportStateRef.current = storeState.viewportState;
    }
  }, [snapshot, nodeSnapshotsData, pipelineJson, setSnapshot, pipelineStore]);

  // Apply viewportState changes to the renderer
  useEffect(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const atomLabels = pipelineStore.getState().atomLabels;
    applyViewportState(
      renderer,
      viewportState,
      prevViewportStateRef.current,
      undefined,
      atomLabels,
    );
    prevViewportStateRef.current = viewportState;
  }, [viewportState, pipelineStore]);

  // Per-frame bond recalculation for distance mode
  useEffect(() => {
    const nodes = pipelineStore.getState().nodes;
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
  }, [frame, storeSnapshot, snapshot, pipelineStore]);

  // Track pipeline-driven bond updates (initial load, bondSource flips,
  // file-mode bonds). Mirrors MeganeViewer's pattern.
  useEffect(() => {
    const total = viewportState.bonds.reduce((sum, b) => sum + b.bondIndices.length / 2, 0);
    setBondCount(total);
  }, [viewportState.bonds]);

  const handleRendererReady = useCallback(
    (renderer: MoleculeRenderer) => {
      rendererRef.current = renderer;
      applyViewportState(renderer, pipelineStore.getState().viewportState, null);
      prevViewportStateRef.current = pipelineStore.getState().viewportState;
      // Apply initial selectedAtoms that may have arrived before the renderer was ready
      setExternalSelection(selectedAtomsRef.current ?? []);
    },
    [setExternalSelection, pipelineStore],
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

      {pipelineEnabled && (
        <PipelineEditor
          collapsed={false}
          onToggleCollapse={() => {}}
          rendererRef={rendererRef}
          totalFrames={totalFrames}
          currentFrame={currentFrame}
          onSeek={handleSeek}
        />
      )}

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
    </div>
  );
}

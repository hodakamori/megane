/**
 * Simplified megane viewer for Jupyter widget embedding.
 * Minimal UI: Viewport + Timeline + Tooltip + MeasurementPanel.
 *
 * The visual pipeline editor is intentionally not mounted here — it is
 * webapp / JupyterLab / VSCode only. Pipeline data still flows in via
 * `pipelineJson` + `nodeSnapshotsData` from `MolecularViewer.set_pipeline()`.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import type { StoreApi } from "zustand";
import { Viewport } from "./Viewport";
import { Timeline } from "./Timeline";
import { Tooltip } from "./Tooltip";
import { MeasurementPanel } from "./MeasurementPanel";
import { MoleculeRenderer, type MeganeCameraState } from "../renderer/MoleculeRenderer";
import { useAtomSelection } from "../hooks/useAtomSelection";
import { inferBondsVdwJS } from "../parsers/inferBondsJS";
import { processPbcBonds } from "../pipeline/executors/addBond";
import { createPipelineStore, type PipelineStore } from "../pipeline/store";
import { applyViewportState } from "../pipeline/apply";
import { decodeSnapshot, decodeHeader, MSG_SNAPSHOT } from "../protocol/protocol";
import type { ViewportState, AddBondParams } from "../pipeline/types";
import type { Snapshot, Frame, Measurement, HoverInfo } from "../types";
import { useThemeStore, themeToHex } from "../stores/useThemeStore";

/** Accepted structure file extensions (no WASM required). */
export const WIDGET_STRUCTURE_ACCEPT = ".pdb,.gro,.xyz,.mol,.sdf,.mol2,.cif,.data,.lammps,.traj";
export const WIDGET_STRUCTURE_EXTS = [
  ".pdb",
  ".gro",
  ".xyz",
  ".mol",
  ".sdf",
  ".mol2",
  ".cif",
  ".data",
  ".lammps",
  ".traj",
];

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
  /** Initial camera state to restore on first snapshot load. */
  initialCameraState?: MeganeCameraState | null;
  /** Called when camera state changes (after user interaction ends). */
  onCameraStateChange?: (state: MeganeCameraState) => void;
  /**
   * Called when the user selects or drops a structure file via the in-widget
   * picker. The parent (widget.ts) is responsible for parsing and updating the
   * snapshot; this async hook should resolve on success or reject with an Error
   * message on failure. When provided, an empty-state overlay with drag-drop
   * support is shown until the first structure is loaded.
   */
  onFilePick?: (file: File) => Promise<void>;
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
  initialCameraState,
  onCameraStateChange,
  onFilePick,
  pipelineStore: pipelineStoreProp,
}: WidgetViewerProps) {
  // Each WidgetViewer instance owns a private pipeline store. The webapp
  // singleton (`usePipelineStore`) is intentionally avoided here so that
  // multiple MolecularViewers in one notebook do not share state — without
  // this, the second viewer's loadPipeline() overwrites the first viewer's
  // pipeline, leaving it blank.
  const [defaultStore] = useState(() => createPipelineStore());
  const pipelineStore = pipelineStoreProp ?? defaultStore;

  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [bondCount, setBondCount] = useState<number>(0);
  const prevViewportStateRef = useRef<ViewportState | null>(null);
  const hasRestoredCameraRef = useRef(false);
  const onCameraStateChangeRef = useRef(onCameraStateChange);
  onCameraStateChangeRef.current = onCameraStateChange;
  const initialCameraStateRef = useRef(initialCameraState);

  // File picker state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [fileLoadError, setFileLoadError] = useState<string | null>(null);
  const onFilePickRef = useRef(onFilePick);
  onFilePickRef.current = onFilePick;

  const {
    selection,
    measurement,
    handleAtomRightClick,
    handleClearSelection,
    handleFrameUpdated,
    setExternalSelection,
  } = useAtomSelection(rendererRef, onMeasurementChange);

  // File picker handlers
  const handleFileSelect = useCallback(async (file: File) => {
    if (!onFilePickRef.current) return;
    const lower = file.name.toLowerCase();
    if (!WIDGET_STRUCTURE_EXTS.some((ext) => lower.endsWith(ext))) {
      setFileLoadError(`Unsupported format: ${file.name}`);
      return;
    }
    setFileLoadError(null);
    setIsLoadingFile(true);
    try {
      await onFilePickRef.current(file);
    } catch (e) {
      setFileLoadError(e instanceof Error ? e.message : "Failed to load file");
    } finally {
      setIsLoadingFile(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = Array.from(e.dataTransfer.files)[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      e.target.value = "";
    },
    [handleFileSelect],
  );

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

      // Restore persisted camera on first load (Viewport's loadSnapshot/fitToView
      // runs before this effect because child effects execute first).
      const effectiveSnap = storeState.snapshot ?? snapshot;
      if (effectiveSnap && !hasRestoredCameraRef.current) {
        hasRestoredCameraRef.current = true;
        const saved = initialCameraStateRef.current;
        if (saved) renderer.applyCameraState(saved);
      }
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

  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  useEffect(() => {
    rendererRef.current?.setBackgroundColor(themeToHex(resolvedTheme));
  }, [resolvedTheme]);

  const handleRendererReady = useCallback(
    (renderer: MoleculeRenderer) => {
      rendererRef.current = renderer;
      renderer.setBackgroundColor(themeToHex(useThemeStore.getState().resolvedTheme));
      applyViewportState(renderer, pipelineStore.getState().viewportState, null);
      prevViewportStateRef.current = pipelineStore.getState().viewportState;
      // Apply initial selectedAtoms that may have arrived before the renderer was ready
      setExternalSelection(selectedAtomsRef.current ?? []);
      // Register camera change callback for host-side persistence
      renderer.setCameraChangeCallback(() => {
        const state = renderer.getCameraState();
        if (state) onCameraStateChangeRef.current?.(state);
      });
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

      {onFilePick && !effectiveSnapshot && !pipelineJson && (
        <div
          data-testid="widget-file-picker"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: isDragOver ? "rgba(99,102,241,0.08)" : "transparent",
            border: `2px dashed ${isDragOver ? "#6366f1" : "#9ca3af"}`,
            borderRadius: "8px",
            cursor: "pointer",
            pointerEvents: isLoadingFile ? "none" : "auto",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {isLoadingFile ? (
            <span style={{ opacity: 0.6, fontSize: "0.875rem" }}>Loading...</span>
          ) : (
            <>
              <span style={{ opacity: 0.5, fontSize: "0.875rem", textAlign: "center" }}>
                Drop a structure file here, or click to browse
              </span>
              <span style={{ opacity: 0.35, fontSize: "0.75rem" }}>
                PDB, GRO, XYZ, MOL/SDF, CIF, LAMMPS, ASE .traj
              </span>
              {fileLoadError && (
                <span
                  data-testid="widget-file-error"
                  style={{ color: "#ef4444", fontSize: "0.75rem" }}
                >
                  {fileLoadError}
                </span>
              )}
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={WIDGET_STRUCTURE_ACCEPT}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
            data-testid="widget-file-input"
          />
        </div>
      )}
    </div>
  );
}

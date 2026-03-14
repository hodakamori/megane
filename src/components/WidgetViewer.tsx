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
import { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { inferBondsVdwJS } from "../parsers/inferBondsJS";
import { processPbcBonds } from "../pipeline/executors/addBond";
import { usePipelineStore } from "../pipeline/store";
import { applyViewportState } from "../pipeline/apply";
import {
  decodeSnapshot,
  decodeHeader,
  MSG_SNAPSHOT,
} from "../protocol/protocol";
import type { ViewportState, AddBondParams } from "../pipeline/types";
import type { NodeSnapshotData } from "../pipeline/execute";
import type {
  Snapshot,
  Frame,
  Measurement,
} from "../types";

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
  new Uint8Array(buffer).set(
    new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
  );
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
  pipelineJson,
  nodeSnapshotsData,
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const prevViewportStateRef = useRef<ViewportState | null>(null);

  // Subscribe to pipeline store
  const viewportState = usePipelineStore((s) => s.viewportState);
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

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
    applyViewportState(renderer, usePipelineStore.getState().viewportState, null);
    prevViewportStateRef.current = usePipelineStore.getState().viewportState;
  }, []);

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
        onHover={() => {}}
        onAtomRightClick={() => {}}
        onFrameUpdated={() => {}}
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
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
  }, []);

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
        onHover={() => {}}
        onAtomRightClick={() => {}}
        onFrameUpdated={() => {}}
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
    </div>
  );
}

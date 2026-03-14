/**
 * Simplified megane viewer for Jupyter widget embedding.
 * Minimal UI: Viewport + Timeline only.
 *
 * When `pipeline` prop is true, shows the PipelineEditor and drives
 * rendering through the pipeline store (like MeganeViewer).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { PipelineEditor } from "./PipelineEditor";
import { Timeline } from "./Timeline";
import { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { inferBondsVdwJS } from "../parsers/inferBondsJS";
import { processPbcBonds } from "../pipeline/executors/addBond";
import { usePipelineStore } from "../pipeline/store";
import { applyViewportState } from "../pipeline/apply";
import type { ViewportState, AddBondParams } from "../pipeline/types";
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
  onPipelineChange?: (json: string) => void;
}

export function WidgetViewer(props: WidgetViewerProps) {
  if (props.pipeline) {
    return <WidgetViewerPipeline {...props} />;
  }
  return <WidgetViewerSimple {...props} />;
}

/* ─── Pipeline mode ──────────────────────────────────────────────── */

function WidgetViewerPipeline({
  snapshot,
  frame,
  currentFrame,
  totalFrames,
  onSeek,
  pipelineJson,
  onPipelineChange,
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const isNarrow = typeof window !== "undefined" && window.innerWidth < 768;
  const [pipelineCollapsed, setPipelineCollapsed] = useState(isNarrow);
  const pipelineCollapsedRef = useRef(isNarrow);
  const pipelineWidthRef = useRef(480);
  const prevViewportStateRef = useRef<ViewportState | null>(null);

  useEffect(() => {
    pipelineCollapsedRef.current = pipelineCollapsed;
  }, [pipelineCollapsed]);

  // Subscribe to pipeline store
  const viewportState = usePipelineStore((s) => s.viewportState);
  const setSnapshot = usePipelineStore((s) => s.setSnapshot);

  // Push snapshot to pipeline store
  useEffect(() => {
    setSnapshot(snapshot);
    const renderer = rendererRef.current;
    if (renderer) {
      const vs = usePipelineStore.getState().viewportState;
      applyViewportState(renderer, vs, null);
      prevViewportStateRef.current = vs;
    }
  }, [snapshot, setSnapshot]);

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

  // Sync pipeline changes back to Python
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!onPipelineChange) return;
    // Debounce pipeline sync to avoid excessive updates
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      const serialized = usePipelineStore.getState().serialize();
      const json = JSON.stringify(serialized);
      if (json !== prevPipelineJsonRef.current) {
        prevPipelineJsonRef.current = json;
        onPipelineChange(json);
      }
    }, 500);
  }, [viewportState, onPipelineChange]);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
    renderer.setViewInsets(
      0,
      pipelineCollapsedRef.current ? 0 : pipelineWidthRef.current + 12,
    );
    applyViewportState(renderer, usePipelineStore.getState().viewportState, null);
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

      <PipelineEditor
        collapsed={pipelineCollapsed}
        onToggleCollapse={handleTogglePipeline}
        onWidthChange={handlePipelineWidthChange}
        rendererRef={rendererRef}
        totalFrames={totalFrames}
        currentFrame={currentFrame}
        onSeek={onSeek}
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

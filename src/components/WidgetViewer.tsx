/**
 * Simplified megane viewer for Jupyter widget embedding.
 * Reuses Viewport, Tooltip, MeasurementPanel, AppearancePanel, and Timeline
 * but omits the Sidebar (file upload, mode toggle, bond source switching).
 *
 * When `pipeline` prop is true, shows the PipelineEditor and drives
 * rendering through the pipeline store (like MeganeViewer).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { AppearancePanel } from "./AppearancePanel";
import { PipelineEditor } from "./PipelineEditor";
import { Timeline } from "./Timeline";
import { Tooltip } from "./Tooltip";
import { MeasurementPanel } from "./MeasurementPanel";
import { TabSelector } from "./ui";
import { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { inferBondsVdwJS } from "../parsers/inferBondsJS";
import { useAtomSelection } from "../hooks/useAtomSelection";
import { usePipelineStore } from "../pipeline/store";
import { applyViewportState } from "../pipeline/apply";
import type { ViewportState, AddBondParams } from "../pipeline/types";
import type {
  Snapshot,
  Frame,
  HoverInfo,
  Measurement,
  BondSource,
  LabelSource,
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
  selectedAtoms: externalSelectedAtoms,
  onMeasurementChange,
  pipelineJson,
  onPipelineChange,
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
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
    setExternalSelection,
  } = useAtomSelection(rendererRef, onMeasurementChange);

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
    );
    renderer.updateBonds(newBonds, null);
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

  // Apply external atom selection
  const prevExternalAtomsRef = useRef<string>("");
  useEffect(() => {
    if (!externalSelectedAtoms || !rendererRef.current) return;
    const key = JSON.stringify(externalSelectedAtoms);
    if (key === prevExternalAtomsRef.current) return;
    prevExternalAtomsRef.current = key;
    setExternalSelection(externalSelectedAtoms);
  }, [externalSelectedAtoms, setExternalSelection]);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetView();
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
        onHover={setHoverInfo}
        onAtomRightClick={handleAtomRightClick}
        onFrameUpdated={handleFrameUpdated}
      />

      <PipelineEditor
        collapsed={pipelineCollapsed}
        onToggleCollapse={handleTogglePipeline}
        onWidthChange={handlePipelineWidthChange}
      />

      {/* Info bar */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 8,
          padding: "4px 12px",
          font: "13px system-ui, -apple-system, sans-serif",
          color: "#495057",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>
          <strong>megane</strong>
          {snapshot && (
            <>
              {" \u00A0 "}
              {snapshot.nAtoms.toLocaleString()} atoms
            </>
          )}
        </span>
        <button
          onClick={handleResetView}
          style={{
            background: "none",
            border: "1px solid #e2e8f0",
            borderRadius: 5,
            padding: "2px 8px",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            color: "#64748b",
          }}
          title="Reset view"
        >
          Reset
        </button>
      </div>

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
  selectedAtoms: externalSelectedAtoms,
  onMeasurementChange,
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [atomScale, setAtomScale] = useState(1.0);
  const [atomOpacity, setAtomOpacity] = useState(1.0);
  const [bondScale, setBondScale] = useState(1.0);
  const [bondOpacity, setBondOpacity] = useState(1.0);
  const [cellAxesVisible, setCellAxesVisible] = useState(true);
  const [perspective, setPerspective] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const [bondSource, setBondSource] = useState<BondSource>("structure");
  const [bondCount, setBondCount] = useState(0);
  const bondSourceRef = useRef<BondSource>("structure");
  const [vdwScale, setVdwScale] = useState(0.6);
  const vdwScaleRef = useRef(0.6);

  // Shared atom selection & measurement
  const {
    selection,
    measurement,
    handleAtomRightClick,
    handleClearSelection,
    handleFrameUpdated,
    setExternalSelection,
  } = useAtomSelection(rendererRef, onMeasurementChange);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
  }, []);

  // Recompute bonds when bond source changes
  const handleBondSourceChange = useCallback(
    (source: BondSource) => {
      setBondSource(source);
      bondSourceRef.current = source;
      const renderer = rendererRef.current;
      if (!renderer || !snapshot) return;

      if (source === "none") {
        renderer.setBondsVisible(false);
        setBondCount(0);
        return;
      }

      renderer.setBondsVisible(true);

      if (source === "structure") {
        renderer.updateBonds(snapshot.bonds, snapshot.bondOrders);
        setBondCount(snapshot.nBonds);
      } else if (source === "distance") {
        const positions = frame?.positions ?? snapshot.positions;
        const bonds = inferBondsVdwJS(positions, snapshot.elements, snapshot.nAtoms, vdwScaleRef.current);
        renderer.updateBonds(bonds, null);
        setBondCount(bonds.length / 2);
      }
    },
    [snapshot, frame],
  );

  // Update bond count when snapshot changes
  useEffect(() => {
    if (snapshot && bondSource === "structure") {
      setBondCount(snapshot.nBonds);
    }
  }, [snapshot, bondSource]);

  // Per-frame bond recalculation for distance mode
  useEffect(() => {
    if (bondSourceRef.current !== "distance") return;
    if (!snapshot || !frame) return;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const bonds = inferBondsVdwJS(frame.positions, snapshot.elements, snapshot.nAtoms, vdwScaleRef.current);
    renderer.updateBonds(bonds, null);
    setBondCount(bonds.length / 2);
  }, [frame, snapshot]);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetView();
  }, []);

  // Apply external atom selection
  const prevExternalAtomsRef = useRef<string>("");
  useEffect(() => {
    if (!externalSelectedAtoms || !rendererRef.current) return;
    const key = JSON.stringify(externalSelectedAtoms);
    if (key === prevExternalAtomsRef.current) return;
    prevExternalAtomsRef.current = key;
    setExternalSelection(externalSelectedAtoms);
  }, [externalSelectedAtoms, setExternalSelection]);

  const handleAtomScaleChange = useCallback((scale: number) => {
    setAtomScale(scale);
    rendererRef.current?.setAtomScale(scale);
  }, []);

  const handleAtomOpacityChange = useCallback((opacity: number) => {
    setAtomOpacity(opacity);
    rendererRef.current?.setAtomOpacity(opacity);
  }, []);

  const handleBondScaleChange = useCallback((scale: number) => {
    setBondScale(scale);
    rendererRef.current?.setBondScale(scale);
  }, []);

  const handleBondOpacityChange = useCallback((opacity: number) => {
    setBondOpacity(opacity);
    rendererRef.current?.setBondOpacity(opacity);
  }, []);

  const handleVdwScaleChange = useCallback((scale: number) => {
    setVdwScale(scale);
    vdwScaleRef.current = scale;
    if (bondSourceRef.current !== "distance") return;
    const renderer = rendererRef.current;
    if (!renderer || !snapshot) return;
    const positions = frame?.positions ?? snapshot.positions;
    const bonds = inferBondsVdwJS(positions, snapshot.elements, snapshot.nAtoms, scale);
    renderer.updateBonds(bonds, null);
    setBondCount(bonds.length / 2);
  }, [snapshot, frame]);

  const handleToggleCellAxes = useCallback(() => {
    setCellAxesVisible((prev) => {
      const next = !prev;
      rendererRef.current?.setCellAxesVisible(next);
      return next;
    });
  }, []);

  const handlePerspectiveChange = useCallback((enabled: boolean) => {
    setPerspective(enabled);
    rendererRef.current?.setPerspective(enabled);
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

  const hasCell =
    snapshot?.box != null && snapshot.box.some((v) => v !== 0);

  const labelConfig = {
    source: "none" as LabelSource,
    onSourceChange: () => {},
    onUploadFile: () => {},
    fileName: null,
    hasStructureLabels: false,
  };

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
        onHover={setHoverInfo}
        onAtomRightClick={handleAtomRightClick}
        onFrameUpdated={handleFrameUpdated}
      />

      {/* Info bar */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: 8,
          padding: "4px 12px",
          font: "13px system-ui, -apple-system, sans-serif",
          color: "#495057",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>
          <strong>megane</strong>
          {snapshot && (
            <>
              {" \u00A0 "}
              {snapshot.nAtoms.toLocaleString()} atoms /{" "}
              {bondCount.toLocaleString()} bonds
            </>
          )}
        </span>
        <button
          onClick={handleResetView}
          style={{
            background: "none",
            border: "1px solid #e2e8f0",
            borderRadius: 5,
            padding: "2px 8px",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 500,
            color: "#64748b",
          }}
          title="Reset view"
        >
          Reset
        </button>
      </div>

      {/* Bond source selector */}
      {snapshot && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 8,
            padding: "4px 8px",
            font: "12px system-ui, -apple-system, sans-serif",
            color: "#495057",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 2 }}>
            Bonds
          </div>
          <TabSelector<BondSource>
            options={[
              { value: "none", label: "None" },
              { value: "structure", label: "Structure" },
              { value: "distance", label: "Distance" },
            ]}
            value={bondSource}
            onChange={handleBondSourceChange}
          />
        </div>
      )}

      <AppearancePanel
        atomScale={atomScale}
        onAtomScaleChange={handleAtomScaleChange}
        atomOpacity={atomOpacity}
        onAtomOpacityChange={handleAtomOpacityChange}
        bondScale={bondScale}
        onBondScaleChange={handleBondScaleChange}
        bondOpacity={bondOpacity}
        onBondOpacityChange={handleBondOpacityChange}
        vdwScale={bondSource === "distance" ? vdwScale : undefined}
        onVdwScaleChange={bondSource === "distance" ? handleVdwScaleChange : undefined}
        labels={labelConfig}
        perspective={perspective}
        onPerspectiveChange={handlePerspectiveChange}
        hasCell={hasCell}
        cellAxesVisible={cellAxesVisible}
        onToggleCellAxes={handleToggleCellAxes}
        collapsed={rightPanelCollapsed}
        onToggleCollapse={() => setRightPanelCollapsed((p) => !p)}
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
    </div>
  );
}

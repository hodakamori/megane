/**
 * Simplified megane viewer for Jupyter widget embedding.
 * Reuses Viewport, Tooltip, MeasurementPanel, AppearancePanel, and Timeline
 * but omits the Sidebar (file upload, mode toggle, bond source switching).
 */

import { useCallback, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { AppearancePanel } from "./AppearancePanel";
import { Timeline } from "./Timeline";
import { Tooltip } from "./Tooltip";
import { MeasurementPanel } from "./MeasurementPanel";
import { MoleculeRenderer } from "../core/MoleculeRenderer";
import type {
  Snapshot,
  Frame,
  HoverInfo,
  SelectionState,
  Measurement,
  LabelSource,
} from "../core/types";

interface WidgetViewerProps {
  snapshot: Snapshot | null;
  frame: Frame | null;
  currentFrame: number;
  totalFrames: number;
  onSeek: (frame: number) => void;
}

export function WidgetViewer({
  snapshot,
  frame,
  currentFrame,
  totalFrames,
  onSeek,
}: WidgetViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [selection, setSelection] = useState<SelectionState>({ atoms: [] });
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [atomScale, setAtomScale] = useState(1.0);
  const [atomOpacity, setAtomOpacity] = useState(1.0);
  const [bondScale, setBondScale] = useState(1.0);
  const [bondOpacity, setBondOpacity] = useState(1.0);
  const [cellAxesVisible, setCellAxesVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
  }, []);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetView();
  }, []);

  const handleAtomRightClick = useCallback((atomIndex: number) => {
    if (!rendererRef.current) return;
    const newSelection = rendererRef.current.toggleAtomSelection(atomIndex);
    setSelection(newSelection);
    setMeasurement(rendererRef.current.getMeasurement());
  }, []);

  const handleClearSelection = useCallback(() => {
    rendererRef.current?.clearSelection();
    setSelection({ atoms: [] });
    setMeasurement(null);
  }, []);

  const handleFrameUpdated = useCallback(() => {
    if (!rendererRef.current) return;
    const m = rendererRef.current.getMeasurement();
    if (m) setMeasurement(m);
  }, []);

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

  const handleToggleCellAxes = useCallback(() => {
    setCellAxesVisible((prev) => {
      const next = !prev;
      rendererRef.current?.setCellAxesVisible(next);
      return next;
    });
  }, []);

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => {
      if (prev) {
        // Stop
        if (playIntervalRef.current) {
          clearInterval(playIntervalRef.current);
          playIntervalRef.current = null;
        }
        return false;
      } else {
        // Start
        playIntervalRef.current = setInterval(() => {
          onSeek(-1); // signal "next frame" - handled by widget.ts
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
        // Stop playback when user manually seeks
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

  // Dummy label config (no label switching in widget for now)
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
              {snapshot.nBonds.toLocaleString()} bonds
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

      <AppearancePanel
        atomScale={atomScale}
        onAtomScaleChange={handleAtomScaleChange}
        atomOpacity={atomOpacity}
        onAtomOpacityChange={handleAtomOpacityChange}
        bondScale={bondScale}
        onBondScaleChange={handleBondScaleChange}
        bondOpacity={bondOpacity}
        onBondOpacityChange={handleBondOpacityChange}
        labels={labelConfig}
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

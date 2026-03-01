/**
 * Main megane viewer React component.
 * Combines Viewport, Sidebar, Timeline, Tooltip, and MeasurementPanel.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { Sidebar } from "./Sidebar";
import type { BondConfig, TrajectoryConfig } from "./Sidebar";
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
  BondSource,
} from "../core/types";

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
  mode: "streaming" | "local";
  onToggleMode: () => void;
  pdbFileName: string | null;
  bonds: BondConfig;
  trajectory: TrajectoryConfig;
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
  mode,
  onToggleMode,
  pdbFileName,
  bonds,
  trajectory,
  width = "100%",
  height = "100%",
}: MeganeViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const [cellVisible, setCellVisible] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [selection, setSelection] = useState<SelectionState>({ atoms: [] });
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleRendererReady = useCallback((renderer: MoleculeRenderer) => {
    rendererRef.current = renderer;
  }, []);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetView();
  }, []);

  const handleToggleCell = useCallback(() => {
    setCellVisible((prev) => {
      const next = !prev;
      rendererRef.current?.setCellVisible(next);
      return next;
    });
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

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Toggle bond visibility when bondSource changes to/from "none"
  useEffect(() => {
    rendererRef.current?.setBondsVisible(bonds.source !== "none");
  }, [bonds.source]);

  // Check if snapshot has a non-zero box
  const hasCell =
    snapshot?.box != null && snapshot.box.some((v) => v !== 0);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Viewport
        snapshot={snapshot}
        frame={frame}
        onRendererReady={handleRendererReady}
        onHover={setHoverInfo}
        onAtomRightClick={handleAtomRightClick}
        onFrameUpdated={handleFrameUpdated}
      />
      <Sidebar
        mode={mode}
        onToggleMode={onToggleMode}
        structure={{
          atomCount: snapshot?.nAtoms ?? 0,
          fileName: pdbFileName,
        }}
        bonds={bonds}
        trajectory={trajectory}
        onUploadStructure={onUploadStructure}
        onResetView={handleResetView}
        hasCell={hasCell}
        cellVisible={cellVisible}
        onToggleCell={handleToggleCell}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
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

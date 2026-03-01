/**
 * Main megane viewer React component.
 * Combines Viewport, Sidebar, Timeline, Tooltip, and MeasurementPanel.
 */

import { useCallback, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { Sidebar } from "./Sidebar";
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
  TrajectorySource,
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
  onUploadPdb: (pdb: File) => void;
  onUploadXtc: (xtc: File) => void;
  mode: "streaming" | "local";
  onToggleMode: () => void;
  pdbFileName: string | null;
  xtcFileName: string | null;
  timestepPs?: number;
  width?: string | number;
  height?: string | number;
  bondSource?: BondSource;
  onBondSourceChange?: (source: BondSource) => void;
  onUploadBondFile?: (file: File) => void;
  bondFileName?: string | null;
  hasStructureBonds?: boolean;
  trajectorySource?: TrajectorySource;
  onTrajectorySourceChange?: (source: TrajectorySource) => void;
  hasStructureFrames?: boolean;
  hasFileFrames?: boolean;
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
  onUploadPdb,
  onUploadXtc,
  mode,
  onToggleMode,
  pdbFileName,
  xtcFileName,
  timestepPs = 0,
  width = "100%",
  height = "100%",
  bondSource = "structure",
  onBondSourceChange,
  onUploadBondFile,
  bondFileName = null,
  hasStructureBonds = false,
  trajectorySource = "structure",
  onTrajectorySourceChange,
  hasStructureFrames = false,
  hasFileFrames = false,
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
        atomCount={snapshot?.nAtoms ?? 0}
        bondCount={snapshot?.nBonds ?? 0}
        pdbFileName={pdbFileName}
        xtcFileName={xtcFileName}
        totalFrames={totalFrames}
        timestepPs={timestepPs}
        onUploadPdb={onUploadPdb}
        onUploadXtc={onUploadXtc}
        onResetView={handleResetView}
        hasCell={hasCell}
        cellVisible={cellVisible}
        onToggleCell={handleToggleCell}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        bondSource={bondSource}
        onBondSourceChange={onBondSourceChange ?? (() => {})}
        onUploadBondFile={onUploadBondFile ?? (() => {})}
        bondFileName={bondFileName}
        hasStructureBonds={hasStructureBonds}
        trajectorySource={trajectorySource}
        onTrajectorySourceChange={onTrajectorySourceChange ?? (() => {})}
        hasStructureFrames={hasStructureFrames}
        hasFileFrames={hasFileFrames}
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

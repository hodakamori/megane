/**
 * Main megane viewer React component.
 * Combines Viewport, Sidebar, Timeline, Tooltip, MeasurementPanel, and AppearancePanel.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Viewport } from "./Viewport";
import { Sidebar } from "./Sidebar";
import type { BondConfig, TrajectoryConfig } from "./Sidebar";
import { AppearancePanel } from "./AppearancePanel";
import type { LabelConfig } from "./AppearancePanel";
import { Timeline } from "./Timeline";
import { Tooltip } from "./Tooltip";
import { MeasurementPanel } from "./MeasurementPanel";
import { MoleculeRenderer } from "../core/MoleculeRenderer";
import { inferBondsVdwJS } from "../core/inferBondsJS";
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
  labels: LabelConfig;
  atomLabels?: string[] | null;
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
  labels,
  atomLabels,
  width = "100%",
  height = "100%",
}: MeganeViewerProps) {
  const rendererRef = useRef<MoleculeRenderer | null>(null);
  const [cellVisible, setCellVisible] = useState(true);
  const [cellAxesVisible, setCellAxesVisible] = useState(true);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>(null);
  const [selection, setSelection] = useState<SelectionState>({ atoms: [] });
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [atomScale, setAtomScale] = useState(1.0);
  const [atomOpacity, setAtomOpacity] = useState(1.0);
  const [bondScale, setBondScale] = useState(1.0);
  const [bondOpacity, setBondOpacity] = useState(1.0);

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

  const handleToggleCellAxes = useCallback(() => {
    setCellAxesVisible((prev) => {
      const next = !prev;
      rendererRef.current?.setCellAxesVisible(next);
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

  const handleToggleRightPanel = useCallback(() => {
    setRightPanelCollapsed((prev) => !prev);
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

  // Toggle bond visibility when bondSource changes to/from "none"
  useEffect(() => {
    rendererRef.current?.setBondsVisible(bonds.source !== "none");
  }, [bonds.source]);

  // Track current bond source for per-frame recalculation
  const bondSourceRef = useRef<BondSource>(bonds.source);
  useEffect(() => {
    bondSourceRef.current = bonds.source;
  }, [bonds.source]);

  // Per-frame bond recalculation for distance mode
  useEffect(() => {
    if (bondSourceRef.current !== "distance") return;
    if (!snapshot || !frame) return;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const newBonds = inferBondsVdwJS(frame.positions, snapshot.elements, snapshot.nAtoms);
    renderer.updateBonds(newBonds, null);
  }, [frame, snapshot]);

  // Check if snapshot has a non-zero box
  const hasCell =
    snapshot?.box != null && snapshot.box.some((v) => v !== 0);

  return (
    <div style={{ width, height, position: "relative", overflow: "hidden" }}>
      <Viewport
        snapshot={snapshot}
        frame={frame}
        atomLabels={atomLabels}
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
      <AppearancePanel
        atomScale={atomScale}
        onAtomScaleChange={handleAtomScaleChange}
        atomOpacity={atomOpacity}
        onAtomOpacityChange={handleAtomOpacityChange}
        bondScale={bondScale}
        onBondScaleChange={handleBondScaleChange}
        bondOpacity={bondOpacity}
        onBondOpacityChange={handleBondOpacityChange}
        labels={labels}
        hasCell={hasCell}
        cellAxesVisible={cellAxesVisible}
        onToggleCellAxes={handleToggleCellAxes}
        collapsed={rightPanelCollapsed}
        onToggleCollapse={handleToggleRightPanel}
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

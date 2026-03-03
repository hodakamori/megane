/**
 * Right-side collapsible panel for atom/bond appearance controls.
 * Contains: Atom Radius, Atom Opacity, Bond Thickness, Bond Opacity, Labels.
 */

import type { LabelSource } from "../core/types";
import {
  sectionLabelStyle,
  smallBtnStyle,
  fileNameStyle,
  TabSelector,
  DropZone,
} from "./ui";

export interface LabelConfig {
  source: LabelSource;
  onSourceChange: (source: LabelSource) => void;
  onUploadFile: (file: File) => void;
  fileName: string | null;
  hasStructureLabels: boolean;
}

interface AppearancePanelProps {
  atomScale: number;
  onAtomScaleChange: (scale: number) => void;
  atomOpacity: number;
  onAtomOpacityChange: (opacity: number) => void;
  bondScale: number;
  onBondScaleChange: (scale: number) => void;
  bondOpacity: number;
  onBondOpacityChange: (opacity: number) => void;
  labels: LabelConfig;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const LABEL_FILE_ACCEPT = ".pdb,.gro,.xyz,.txt";
const LABEL_FILE_EXTS = [".pdb", ".gro", ".xyz", ".txt"];

const sliderTrackStyle: React.CSSProperties = {
  width: "100%",
  height: 4,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  borderRadius: 2,
  outline: "none",
};

const valueDisplayStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "#3b82f6",
  minWidth: 36,
  textAlign: "right",
};

export function AppearancePanel({
  atomScale,
  onAtomScaleChange,
  atomOpacity,
  onAtomOpacityChange,
  bondScale,
  onBondScaleChange,
  bondOpacity,
  onBondOpacityChange,
  labels,
  collapsed,
  onToggleCollapse,
}: AppearancePanelProps) {
  if (collapsed) {
    return (
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 10,
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(226,232,240,0.6)",
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
            boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: "#1e293b",
            letterSpacing: "-0.02em",
          }}
          title="Open appearance panel"
        >
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>
            &#9664;
          </span>
          Appearance
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        bottom: 60,
        width: 220,
        zIndex: 10,
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 12,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        border: "1px solid rgba(226,232,240,0.6)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(226,232,240,0.6)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: 13,
            letterSpacing: "-0.02em",
          }}
        >
          Appearance
        </span>
        <button
          onClick={onToggleCollapse}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#94a3b8",
            padding: "2px 4px",
          }}
          title="Collapse panel"
        >
          &#9654;
        </button>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Atom Radius Section */}
        <div>
          <div style={sectionLabelStyle}>Atom Radius</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.01"
              value={atomScale}
              onChange={(e) => onAtomScaleChange(parseFloat(e.target.value))}
              style={sliderTrackStyle}
            />
            <span style={valueDisplayStyle}>
              {atomScale.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Atom Opacity Section */}
        <div>
          <div style={sectionLabelStyle}>Atom Opacity</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={atomOpacity}
              onChange={(e) => onAtomOpacityChange(parseFloat(e.target.value))}
              style={sliderTrackStyle}
            />
            <span style={valueDisplayStyle}>
              {Math.round(atomOpacity * 100)}%
            </span>
          </div>
        </div>

        {/* Bond Thickness Section */}
        <div>
          <div style={sectionLabelStyle}>Bond Thickness</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.01"
              value={bondScale}
              onChange={(e) => onBondScaleChange(parseFloat(e.target.value))}
              style={sliderTrackStyle}
            />
            <span style={valueDisplayStyle}>
              {bondScale.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Bond Opacity Section */}
        <div>
          <div style={sectionLabelStyle}>Bond Opacity</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={bondOpacity}
              onChange={(e) => onBondOpacityChange(parseFloat(e.target.value))}
              style={sliderTrackStyle}
            />
            <span style={valueDisplayStyle}>
              {Math.round(bondOpacity * 100)}%
            </span>
          </div>
        </div>

        {/* Labels Section */}
        <div>
          <div style={sectionLabelStyle}>Labels</div>
          <TabSelector<LabelSource>
            options={[
              { value: "none", label: "None" },
              { value: "structure", label: "Structure" },
              { value: "file", label: "File" },
            ]}
            value={labels.source}
            onChange={labels.onSourceChange}
            disabledOptions={
              new Set<LabelSource>([
                ...(!labels.hasStructureLabels ? ["structure" as LabelSource] : []),
              ])
            }
          />
          {labels.source === "file" && (
            <DropZone
              accept={LABEL_FILE_ACCEPT}
              exts={LABEL_FILE_EXTS}
              onFile={labels.onUploadFile}
              label="Load labels..."
            >
              {labels.fileName && (
                <div style={fileNameStyle}>{labels.fileName}</div>
              )}
            </DropZone>
          )}
        </div>
      </div>
    </div>
  );
}

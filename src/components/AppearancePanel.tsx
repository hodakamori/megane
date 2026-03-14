/**
 * Right-side collapsible panel for atom/bond appearance controls.
 * Contains: Atom Radius, Atom Opacity, Bond Thickness, Bond Opacity, Labels.
 */

import type { LabelSource, VectorSource } from "../types";
import {
  sectionLabelStyle,
  smallBtnStyle,
  activeBtnStyle,
  fileNameStyle,
  TabSelector,
  DropZone,
} from "./ui";
import { CollapsiblePanel } from "./CollapsiblePanel";

export interface LabelConfig {
  source: LabelSource;
  onSourceChange: (source: LabelSource) => void;
  onUploadFile: (file: File) => void;
  fileName: string | null;
  hasStructureLabels: boolean;
}

export interface VectorConfig {
  source: VectorSource;
  onSourceChange: (source: VectorSource) => void;
  onUploadFile: (file: File) => void;
  fileName: string | null;
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
  vdwScale?: number;
  onVdwScaleChange?: (scale: number) => void;
  labels: LabelConfig;
  vectors?: VectorConfig;
  vectorScale?: number;
  onVectorScaleChange?: (scale: number) => void;
  perspective?: boolean;
  onPerspectiveChange?: (enabled: boolean) => void;
  hasCell?: boolean;
  cellAxesVisible?: boolean;
  onToggleCellAxes?: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const LABEL_FILE_ACCEPT = ".pdb,.gro,.xyz,.txt";
const LABEL_FILE_EXTS = [".pdb", ".gro", ".xyz", ".txt"];
const VECTOR_FILE_ACCEPT = ".vec,.json,.jsonl";
const VECTOR_FILE_EXTS = [".vec", ".json", ".jsonl"];

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
  vdwScale,
  onVdwScaleChange,
  labels,
  vectors,
  vectorScale,
  onVectorScaleChange,
  perspective,
  onPerspectiveChange,
  hasCell,
  cellAxesVisible,
  onToggleCellAxes,
  collapsed,
  onToggleCollapse,
}: AppearancePanelProps) {
  return (
    <CollapsiblePanel title="Appearance" collapsed={collapsed} onToggleCollapse={onToggleCollapse}>
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
            <span style={valueDisplayStyle}>{atomScale.toFixed(2)}</span>
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
            <span style={valueDisplayStyle}>{Math.round(atomOpacity * 100)}%</span>
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
            <span style={valueDisplayStyle}>{bondScale.toFixed(2)}</span>
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
            <span style={valueDisplayStyle}>{Math.round(bondOpacity * 100)}%</span>
          </div>
        </div>

        {/* VDW Scale Section */}
        {vdwScale != null && onVdwScaleChange && (
          <div>
            <div style={sectionLabelStyle}>VDW Scale</div>
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
                max="1.5"
                step="0.01"
                value={vdwScale}
                onChange={(e) => onVdwScaleChange(parseFloat(e.target.value))}
                style={sliderTrackStyle}
              />
              <span style={valueDisplayStyle}>{vdwScale.toFixed(2)}</span>
            </div>
          </div>
        )}

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
              {labels.fileName && <div style={fileNameStyle}>{labels.fileName}</div>}
            </DropZone>
          )}
        </div>

        {/* Vectors Section */}
        {vectors && (
          <div>
            <div style={sectionLabelStyle}>Vectors</div>
            <TabSelector<VectorSource>
              options={[
                { value: "none", label: "None" },
                { value: "demo", label: "Demo" },
                { value: "file", label: "File" },
              ]}
              value={vectors.source}
              onChange={vectors.onSourceChange}
            />
            {vectors.source === "file" && (
              <DropZone
                accept={VECTOR_FILE_ACCEPT}
                exts={VECTOR_FILE_EXTS}
                onFile={vectors.onUploadFile}
                label="Load vectors..."
              >
                {vectors.fileName && <div style={fileNameStyle}>{vectors.fileName}</div>}
              </DropZone>
            )}
            {vectors.source !== "none" && vectorScale != null && onVectorScaleChange && (
              <div style={{ marginTop: 8 }}>
                <div style={sectionLabelStyle}>Arrow Scale</div>
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
                    max="10.0"
                    step="0.1"
                    value={vectorScale}
                    onChange={(e) => onVectorScaleChange(parseFloat(e.target.value))}
                    style={sliderTrackStyle}
                  />
                  <span style={valueDisplayStyle}>{vectorScale.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Display Section */}
        {(onPerspectiveChange || (hasCell && onToggleCellAxes)) && (
          <div>
            <div style={sectionLabelStyle}>Display</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {onPerspectiveChange && (
                <button
                  onClick={() => onPerspectiveChange(!perspective)}
                  style={perspective ? activeBtnStyle : smallBtnStyle}
                  title="Toggle perspective projection"
                >
                  Perspective
                </button>
              )}
              {hasCell && onToggleCellAxes && (
                <button
                  onClick={onToggleCellAxes}
                  style={cellAxesVisible ? activeBtnStyle : smallBtnStyle}
                  title="Toggle cell axes indicator"
                >
                  Cell Axes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </CollapsiblePanel>
  );
}

/**
 * Modify node — changes visual properties (scale, opacity, color) of incoming data.
 * Accepts particle or bond input.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { ColorMode, ModifyParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const sliderStyle: React.CSSProperties = {
  width: "100%",
  height: 7,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  borderRadius: 3,
  outline: "none",
};

const valueStyle: React.CSSProperties = {
  fontSize: 19,
  fontWeight: 500,
  color: "#3b82f6",
  minWidth: 50,
  textAlign: "right",
};

const labelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 3,
};

const selectStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#334155",
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  padding: "3px 6px",
  cursor: "pointer",
  flex: 1,
};

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
};

const colorPickerStyle: React.CSSProperties = {
  width: 36,
  height: 24,
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  cursor: "pointer",
  padding: 0,
  background: "transparent",
};

const COLOR_MODE_LABELS: Record<ColorMode, string> = {
  uniform: "Uniform",
  byElement: "Element",
  byResidue: "Residue",
  byChain: "Chain",
  byBFactor: "B-Factor",
  byProperty: "Property",
};

export function ModifyNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ModifyParams;

  return (
    <NodeShell id={id} nodeType="modify" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={labelStyle}>Scale</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              data-testid="modify-node-scale"
              className="nodrag"
              type="range"
              min={0.1}
              max={2.0}
              step={0.01}
              value={params.scale}
              onChange={(e) => updateNodeParams(id, { scale: parseFloat(e.target.value) })}
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.scale.toFixed(2)}</span>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Opacity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              data-testid="modify-node-opacity"
              className="nodrag"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={params.opacity}
              onChange={(e) => updateNodeParams(id, { opacity: parseFloat(e.target.value) })}
              style={sliderStyle}
            />
            <span style={valueStyle}>{`${Math.round(params.opacity * 100)}%`}</span>
          </div>
        </div>
        <div>
          <label style={checkboxRowStyle}>
            <input
              data-testid="modify-node-color-enabled"
              className="nodrag"
              type="checkbox"
              checked={params.colorEnabled}
              onChange={(e) => updateNodeParams(id, { colorEnabled: e.target.checked })}
            />
            Color
          </label>
          {params.colorEnabled && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <select
                data-testid="modify-node-color-mode"
                className="nodrag"
                value={params.colorMode}
                onChange={(e) => updateNodeParams(id, { colorMode: e.target.value as ColorMode })}
                style={selectStyle}
              >
                {(Object.entries(COLOR_MODE_LABELS) as [ColorMode, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ),
                )}
              </select>
              {params.colorMode === "uniform" && (
                <input
                  data-testid="modify-node-uniform-color"
                  className="nodrag"
                  type="color"
                  value={params.uniformColor}
                  onChange={(e) => updateNodeParams(id, { uniformColor: e.target.value })}
                  style={colorPickerStyle}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </NodeShell>
  );
}

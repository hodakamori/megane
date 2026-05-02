/**
 * Modify node — changes visual properties (scale, opacity, color scheme) of incoming data.
 * Accepts particle or bond input.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { ModifyParams } from "../../pipeline/types";
import { COLOR_SCHEME_LABELS, type ColorScheme } from "../../constants";
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
  width: "100%",
  fontSize: 15,
  padding: "3px 6px",
  borderRadius: 4,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#1e293b",
  cursor: "pointer",
  outline: "none",
};

const COLOR_SCHEMES = Object.entries(COLOR_SCHEME_LABELS) as [ColorScheme, string][];

export function ModifyNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ModifyParams;
  const colorScheme = params.colorScheme ?? "element";

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
          <div style={labelStyle}>Color Scheme</div>
          <select
            data-testid="modify-node-color-scheme"
            className="nodrag"
            value={colorScheme}
            onChange={(e) => updateNodeParams(id, { colorScheme: e.target.value as ColorScheme })}
            style={selectStyle}
          >
            {COLOR_SCHEMES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </NodeShell>
  );
}

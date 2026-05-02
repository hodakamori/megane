/**
 * Modify node — changes visual properties (scale, opacity, color scheme) of incoming data.
 * Accepts particle or bond input.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { ModifyParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { COLOR_SCHEME_LABELS, type ColorScheme } from "../../constants";

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

const colorSchemes = Object.entries(COLOR_SCHEME_LABELS) as [ColorScheme, string][];

export function ModifyNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ModifyParams;
  const currentScheme: ColorScheme = params.colorScheme ?? "element";

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
          <div style={labelStyle}>Color</div>
          <div className="nodrag" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {colorSchemes.map(([scheme, label]) => {
              const active = currentScheme === scheme;
              return (
                <button
                  key={scheme}
                  data-testid={`modify-node-color-${scheme}`}
                  onClick={() => updateNodeParams(id, { colorScheme: scheme })}
                  style={{
                    padding: "3px 8px",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    borderRadius: 4,
                    border: active ? "2px solid #3b82f6" : "1.5px solid #cbd5e1",
                    background: active ? "#eff6ff" : "#ffffff",
                    color: active ? "#1d4ed8" : "#475569",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </NodeShell>
  );
}

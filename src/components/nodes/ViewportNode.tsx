/**
 * Viewport node — terminal sink.
 * Accepts particle, bond, cell, label, mesh inputs.
 * Outputs nothing. Display settings (perspective, axes) are parameters.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { ViewportParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const toggleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 19,
  color: "#475569",
  padding: "3px 0",
};

const toggleStyle: React.CSSProperties = {
  cursor: "pointer",
  accentColor: "#3b82f6",
};

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

const sectionStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginTop: 6,
  marginBottom: 2,
};

export function ViewportNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ViewportParams;

  return (
    <NodeShell id={id} nodeType="viewport" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <label style={toggleRowStyle}>
          Perspective
          <input
            type="checkbox"
            checked={params.perspective}
            onChange={(e) => updateNodeParams(id, { perspective: e.target.checked })}
            style={toggleStyle}
          />
        </label>
        <label style={toggleRowStyle}>
          Cell axes
          <input
            type="checkbox"
            checked={params.cellAxesVisible}
            onChange={(e) => updateNodeParams(id, { cellAxesVisible: e.target.checked })}
            style={toggleStyle}
          />
        </label>

        <div style={sectionStyle}>Rendering</div>

        <div>
          <div style={labelStyle}>Exposure</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0.1}
              max={3.0}
              step={0.05}
              value={params.toneMappingExposure}
              onChange={(e) =>
                updateNodeParams(id, { toneMappingExposure: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.toneMappingExposure.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <div style={labelStyle}>SSAO Radius</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0}
              max={2.0}
              step={0.05}
              value={params.ssaoKernelRadius}
              onChange={(e) =>
                updateNodeParams(id, { ssaoKernelRadius: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.ssaoKernelRadius.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <div style={labelStyle}>Bloom</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0}
              max={1.0}
              step={0.01}
              value={params.bloomStrength}
              onChange={(e) =>
                updateNodeParams(id, { bloomStrength: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.bloomStrength.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <div style={labelStyle}>Bloom Threshold</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0}
              max={1.0}
              step={0.01}
              value={params.bloomThreshold}
              onChange={(e) =>
                updateNodeParams(id, { bloomThreshold: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.bloomThreshold.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </NodeShell>
  );
}

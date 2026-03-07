/**
 * Modify node — changes visual properties (scale, opacity) of incoming data.
 * Accepts particle or bond input.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { ModifyParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const sliderStyle: React.CSSProperties = {
  width: "100%",
  height: 4,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  borderRadius: 2,
  outline: "none",
};

const valueStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "#3b82f6",
  minWidth: 36,
  textAlign: "right",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 2,
};

export function ModifyNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ModifyParams;

  return (
    <NodeShell id={id} nodeType="modify" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div>
          <div style={labelStyle}>Scale</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={0.1}
              max={2.0}
              step={0.01}
              value={params.scale}
              onChange={(e) =>
                updateNodeParams(id, { scale: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.scale.toFixed(2)}</span>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Opacity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={params.opacity}
              onChange={(e) =>
                updateNodeParams(id, { opacity: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{`${Math.round(params.opacity * 100)}%`}</span>
          </div>
        </div>
      </div>
    </NodeShell>
  );
}

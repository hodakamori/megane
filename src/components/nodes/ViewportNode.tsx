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
  fontSize: 11,
  color: "#475569",
  padding: "2px 0",
};

const toggleStyle: React.CSSProperties = {
  cursor: "pointer",
  accentColor: "#3b82f6",
};

export function ViewportNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ViewportParams;

  return (
    <NodeShell id={id} nodeType="viewport" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
      </div>
    </NodeShell>
  );
}

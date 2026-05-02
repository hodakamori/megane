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
import { COLOR_SCHEME_LABELS, type ColorScheme } from "../../colorSchemes";

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

const selectStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#334155",
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  padding: "2px 4px",
  cursor: "pointer",
};

export function ViewportNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ViewportParams;

  return (
    <NodeShell id={id} nodeType="viewport" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <label style={toggleRowStyle}>
          Color scheme
          <select
            value={params.colorScheme ?? "byElement"}
            onChange={(e) => updateNodeParams(id, { colorScheme: e.target.value as ColorScheme })}
            style={selectStyle}
          >
            {(Object.entries(COLOR_SCHEME_LABELS) as [ColorScheme, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </label>
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
        <label style={toggleRowStyle}>
          Pivot marker
          <input
            type="checkbox"
            checked={params.pivotMarkerVisible}
            onChange={(e) => updateNodeParams(id, { pivotMarkerVisible: e.target.checked })}
            style={toggleStyle}
          />
        </label>
      </div>
    </NodeShell>
  );
}

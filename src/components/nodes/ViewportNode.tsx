/**
 * Viewport node — terminal sink.
 * Accepts particle, bond, cell, label, mesh inputs.
 * Outputs nothing. Display settings (perspective, axes, representation) are parameters.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { ViewportParams, RepresentationMode } from "../../pipeline/types";
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

const selectStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#334155",
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  padding: "2px 4px",
  cursor: "pointer",
};

const REPRESENTATION_OPTIONS: { value: RepresentationMode; label: string }[] = [
  { value: "atoms", label: "Atoms" },
  { value: "cartoon", label: "Cartoon" },
  { value: "both", label: "Both" },
  { value: "surface", label: "Surface" },
];

export function ViewportNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ViewportParams;
  const representationMode = params.representationMode ?? "atoms";

  return (
    <NodeShell id={id} nodeType="viewport" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={toggleRowStyle}>
          <span>Representation</span>
          <select
            value={representationMode}
            onChange={(e) =>
              updateNodeParams(id, { representationMode: e.target.value as RepresentationMode })
            }
            style={selectStyle}
            data-testid="viewport-representation-select"
          >
            {REPRESENTATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
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

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { RmsdParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 2,
};

const inputStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#334155",
  background: "#f1f5f9",
  border: "1px solid #cbd5e1",
  borderRadius: 4,
  padding: "3px 6px",
  width: "100%",
  boxSizing: "border-box",
};

const numberInputStyle: React.CSSProperties = {
  ...inputStyle,
  width: 70,
};

export function RmsdNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as RmsdParams;

  return (
    <NodeShell id={id} nodeType="rmsd" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div>
          <div style={labelStyle}>Atom Selection</div>
          <input
            data-testid="rmsd-node-selection"
            className="nodrag"
            type="text"
            value={params.selection}
            placeholder="all atoms"
            onChange={(e) => updateNodeParams(id, { selection: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <div style={labelStyle}>Reference Frame</div>
          <input
            data-testid="rmsd-node-reference-frame"
            className="nodrag"
            type="number"
            min={0}
            value={params.referenceFrame}
            onChange={(e) =>
              updateNodeParams(id, { referenceFrame: Math.max(0, parseInt(e.target.value) || 0) })
            }
            style={numberInputStyle}
          />
        </div>
      </div>
    </NodeShell>
  );
}

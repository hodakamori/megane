import { useCallback } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { RamachandranParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const labelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 3,
};

const rowStyle: React.CSSProperties = {
  marginBottom: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #e2e8f0",
  borderRadius: 7,
  padding: "5px 10px",
  fontSize: 17,
  boxSizing: "border-box",
};

const hintStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#94a3b8",
  marginTop: 4,
};

export function RamachandranNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as RamachandranParams;

  const setFrameIndex = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value, 10);
      if (!isNaN(v) && v >= 0) updateNodeParams(id, { frameIndex: v });
    },
    [id, updateNodeParams],
  );

  return (
    <NodeShell id={id} nodeType="ramachandran" enabled={data.enabled}>
      <div style={rowStyle}>
        <div style={labelStyle}>Frame index</div>
        <input
          type="number"
          min={0}
          step={1}
          value={params.frameIndex}
          onChange={setFrameIndex}
          style={inputStyle}
          data-testid="ramachandran-frame"
        />
        <div style={hintStyle}>Requires backbone N–Cα–C atoms (PDB / GRO / mmCIF)</div>
      </div>
    </NodeShell>
  );
}

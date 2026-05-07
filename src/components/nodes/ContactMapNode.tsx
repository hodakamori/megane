import { useCallback } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { ContactMapParams } from "../../pipeline/types";
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

export function ContactMapNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as ContactMapParams;

  const setDistanceCutoff = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (!isNaN(v) && v > 0) updateNodeParams(id, { distanceCutoff: v });
    },
    [id, updateNodeParams],
  );

  const setFrameIndex = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseInt(e.target.value, 10);
      if (!isNaN(v)) updateNodeParams(id, { frameIndex: v });
    },
    [id, updateNodeParams],
  );

  return (
    <NodeShell id={id} nodeType="contact_map" enabled={data.enabled}>
      <div style={rowStyle}>
        <div style={labelStyle}>Distance cutoff (Å)</div>
        <input
          type="number"
          min={1}
          max={30}
          step={0.5}
          value={params.distanceCutoff}
          onChange={setDistanceCutoff}
          style={inputStyle}
          data-testid="contact-map-cutoff"
        />
      </div>
      <div style={rowStyle}>
        <div style={labelStyle}>Frame index (−1 = average)</div>
        <input
          type="number"
          min={-1}
          step={1}
          value={params.frameIndex}
          onChange={setFrameIndex}
          style={inputStyle}
          data-testid="contact-map-frame"
        />
      </div>
    </NodeShell>
  );
}

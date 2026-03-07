/**
 * Bond Source node — select bond calculation method and VDW scale.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { SetBondSourceParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { TabSelector } from "../ui";
import type { BondSource } from "../../types";

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

export function SetBondSourceNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as SetBondSourceParams;

  return (
    <NodeShell id={id} nodeType="set_bond_source" enabled={data.enabled}>
      <TabSelector<BondSource>
        options={[
          { value: "structure", label: "Struct" },
          { value: "distance", label: "VDW" },
          { value: "none", label: "None" },
        ]}
        value={params.source}
        onChange={(v) => updateNodeParams(id, { source: v })}
      />
      {params.source === "distance" && (
        <div style={{ marginTop: 6 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            VDW Scale
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.01"
              value={params.vdwScale}
              onChange={(e) =>
                updateNodeParams(id, { vdwScale: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.vdwScale.toFixed(2)}</span>
          </div>
        </div>
      )}
    </NodeShell>
  );
}

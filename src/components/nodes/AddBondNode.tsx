/**
 * Add Bond node.
 * Takes particle input and outputs bond data.
 * Supports bond sources: structure (from file), VDW (distance-based), file (topology).
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { AddBondParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { TabSelector } from "../ui";
import type { BondSource } from "../../types";

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 4,
  marginTop: 0,
};

export function AddBondNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as AddBondParams;

  return (
    <NodeShell id={id} nodeType="add_bond" enabled={data.enabled}>
      <div style={sectionLabelStyle}>Source</div>
      <TabSelector<BondSource>
        options={[
          { value: "structure", label: "File" },
          { value: "distance", label: "VDW" },
        ]}
        value={params.bondSource}
        onChange={(v) => updateNodeParams(id, { bondSource: v })}
      />
    </NodeShell>
  );
}

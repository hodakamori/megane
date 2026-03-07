/**
 * Display node — perspective toggle and cell axes toggle.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { SetDisplayParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { smallBtnStyle, activeBtnStyle } from "../ui";

export function SetDisplayNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as SetDisplayParams;

  return (
    <NodeShell id={id} nodeType="set_display" enabled={data.enabled}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <button
          onClick={() => updateNodeParams(id, { perspective: !params.perspective })}
          style={params.perspective ? activeBtnStyle : smallBtnStyle}
        >
          Perspective
        </button>
        <button
          onClick={() => updateNodeParams(id, { cellAxesVisible: !params.cellAxesVisible })}
          style={params.cellAxesVisible ? activeBtnStyle : smallBtnStyle}
        >
          Cell Axes
        </button>
      </div>
    </NodeShell>
  );
}

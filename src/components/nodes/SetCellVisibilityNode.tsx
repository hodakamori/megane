/**
 * Cell Visibility node — toggle simulation cell wireframe.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { SetCellVisibilityParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { smallBtnStyle, activeBtnStyle } from "../ui";

export function SetCellVisibilityNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as SetCellVisibilityParams;

  return (
    <NodeShell id={id} nodeType="set_cell_visibility" enabled={data.enabled}>
      <button
        onClick={() => updateNodeParams(id, { cellVisible: !params.cellVisible })}
        style={params.cellVisible ? activeBtnStyle : smallBtnStyle}
      >
        {params.cellVisible ? "Visible" : "Hidden"}
      </button>
    </NodeShell>
  );
}

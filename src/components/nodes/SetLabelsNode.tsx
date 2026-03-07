/**
 * Labels node — select label source (none/structure/file).
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { SetLabelsParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { TabSelector, DropZone, fileNameStyle } from "../ui";
import type { LabelSource } from "../../types";

const LABEL_FILE_ACCEPT = ".pdb,.gro,.xyz,.txt";
const LABEL_FILE_EXTS = [".pdb", ".gro", ".xyz", ".txt"];

export type LabelFileHandler = (file: File) => void;
let _onLabelFile: LabelFileHandler | null = null;
export function setLabelFileHandler(handler: LabelFileHandler | null) {
  _onLabelFile = handler;
}

export function SetLabelsNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as SetLabelsParams;

  return (
    <NodeShell id={id} nodeType="set_labels" enabled={data.enabled}>
      <TabSelector<LabelSource>
        options={[
          { value: "none", label: "None" },
          { value: "structure", label: "Structure" },
          { value: "file", label: "File" },
        ]}
        value={params.source}
        onChange={(v) => updateNodeParams(id, { source: v })}
      />
      {params.source === "file" && (
        <DropZone
          accept={LABEL_FILE_ACCEPT}
          exts={LABEL_FILE_EXTS}
          onFile={(file) => {
            updateNodeParams(id, { fileName: file.name });
            _onLabelFile?.(file);
          }}
          label="Load labels..."
        >
          {params.fileName && (
            <div style={fileNameStyle}>{params.fileName}</div>
          )}
        </DropZone>
      )}
    </NodeShell>
  );
}

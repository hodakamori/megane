/**
 * Vectors node — select vector source (none/demo/file) and arrow scale.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { SetVectorsParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { TabSelector, DropZone, fileNameStyle } from "../ui";
import type { VectorSource } from "../../types";

const VECTOR_FILE_ACCEPT = ".vec,.json,.jsonl";
const VECTOR_FILE_EXTS = [".vec", ".json", ".jsonl"];

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

export type VectorFileHandler = (file: File) => void;
let _onVectorFile: VectorFileHandler | null = null;
export function setVectorFileHandler(handler: VectorFileHandler | null) {
  _onVectorFile = handler;
}

export type DemoVectorsHandler = () => void;
let _onDemoVectors: DemoVectorsHandler | null = null;
export function setDemoVectorsHandler(handler: DemoVectorsHandler | null) {
  _onDemoVectors = handler;
}

export function SetVectorsNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as SetVectorsParams;

  return (
    <NodeShell id={id} nodeType="set_vectors" enabled={data.enabled}>
      <TabSelector<VectorSource>
        options={[
          { value: "none", label: "None" },
          { value: "demo", label: "Demo" },
          { value: "file", label: "File" },
        ]}
        value={params.source}
        onChange={(v) => {
          updateNodeParams(id, { source: v });
          if (v === "demo") _onDemoVectors?.();
        }}
      />
      {params.source === "file" && (
        <DropZone
          accept={VECTOR_FILE_ACCEPT}
          exts={VECTOR_FILE_EXTS}
          onFile={(file) => {
            updateNodeParams(id, { fileName: file.name });
            _onVectorFile?.(file);
          }}
          label="Load vectors..."
        >
          {params.fileName && (
            <div style={fileNameStyle}>{params.fileName}</div>
          )}
        </DropZone>
      )}
      {params.source !== "none" && (
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
            Arrow Scale
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={params.scale}
              onChange={(e) =>
                updateNodeParams(id, { scale: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.scale.toFixed(1)}</span>
          </div>
        </div>
      )}
    </NodeShell>
  );
}

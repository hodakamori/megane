/**
 * Data Loader node.
 * Source node in the pipeline — file upload, bond source selection.
 * Outputs: particle, bond, cell (via typed handles).
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { DataLoaderParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { smallBtnStyle, fileNameStyle, TabSelector } from "../ui";
import type { BondSource } from "../../types";
import { useRef, useCallback } from "react";

const STRUCTURE_ACCEPT = ".pdb,.gro,.xyz,.mol,.sdf";
const STRUCTURE_EXTS = [".pdb", ".gro", ".xyz", ".mol", ".sdf"];

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 4,
  marginTop: 8,
};

/**
 * Event bus for structure loading.
 * MeganeViewer listens for these events to trigger actual file parsing.
 */
export type StructureLoadHandler = (file: File) => void;
let _onStructureLoad: StructureLoadHandler | null = null;
export function setStructureLoadHandler(handler: StructureLoadHandler | null) {
  _onStructureLoad = handler;
}

export function DataLoaderNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as DataLoaderParams;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const lower = file.name.toLowerCase();
      if (!STRUCTURE_EXTS.some((ext) => lower.endsWith(ext))) return;
      updateNodeParams(id, { fileName: file.name });
      _onStructureLoad?.(file);
    },
    [id, updateNodeParams],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      const match = files.find((f) =>
        STRUCTURE_EXTS.some((ext) => f.name.toLowerCase().endsWith(ext)),
      );
      if (match) handleFile(match);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <NodeShell id={id} nodeType="data_loader" enabled={data.enabled}>
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        {params.fileName ? (
          <div style={fileNameStyle}>{params.fileName}</div>
        ) : (
          <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
            No structure loaded
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          style={{ ...smallBtnStyle, marginTop: 6, width: "100%" }}
        >
          Load structure...
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={STRUCTURE_ACCEPT}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
          style={{ display: "none" }}
        />
      </div>

      <div style={sectionLabelStyle}>Bonds</div>
      <TabSelector<BondSource>
        options={[
          { value: "structure", label: "Struct" },
          { value: "distance", label: "VDW" },
          { value: "none", label: "None" },
        ]}
        value={params.bondSource}
        onChange={(v) => updateNodeParams(id, { bondSource: v })}
      />
    </NodeShell>
  );
}

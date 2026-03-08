/**
 * Load Structure node.
 * Source node in the pipeline — file upload only, no bond selection.
 * Outputs: particle, trajectory (if present), cell (if present).
 * Ports without data are grayed out.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { LoadStructureParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { smallBtnStyle, fileNameStyle } from "../ui";
import { useRef, useCallback } from "react";

const STRUCTURE_ACCEPT = ".pdb,.gro,.xyz,.mol,.sdf";
const STRUCTURE_EXTS = [".pdb", ".gro", ".xyz", ".mol", ".sdf"];

/**
 * Event bus for structure loading.
 * MeganeViewer listens for these events to trigger actual file parsing.
 */
export type StructureLoadHandler = (file: File) => void;
let _onStructureLoad: StructureLoadHandler | null = null;
export function setStructureLoadHandler(handler: StructureLoadHandler | null) {
  _onStructureLoad = handler;
}

export function LoadStructureNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as LoadStructureParams;
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

  // Determine which output ports are disabled (no data available)
  const disabledPorts = new Set<string>();
  if (!params.hasTrajectory) disabledPorts.add("trajectory");
  if (!params.hasCell) disabledPorts.add("cell");

  return (
    <NodeShell id={id} nodeType="load_structure" enabled={data.enabled} disabledPorts={disabledPorts}>
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
    </NodeShell>
  );
}

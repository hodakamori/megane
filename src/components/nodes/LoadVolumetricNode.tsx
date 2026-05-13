/**
 * Load Volumetric node.
 * Loads a Gaussian CUBE file and outputs VolumetricData.
 */

import { useCallback, useRef } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { LoadVolumetricParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { smallBtnStyle, fileNameStyle } from "../ui";
import { parseCube } from "../../pipeline/executors/parseCube";

const CUBE_ACCEPT = ".cube";
const CUBE_EXTS = [".cube"];

export function LoadVolumetricNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as LoadVolumetricParams;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const lower = file.name.toLowerCase();
      if (!CUBE_EXTS.some((ext) => lower.endsWith(ext))) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        try {
          const vol = parseCube(text);
          updateNodeParams(id, { fileName: file.name, volumetricData: vol });
        } catch (err) {
          console.error("Failed to parse CUBE file:", err);
          updateNodeParams(id, { fileName: file.name, volumetricData: null });
        }
      };
      reader.readAsText(file);
    },
    [id, updateNodeParams],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      const match = files.find((f) => CUBE_EXTS.some((ext) => f.name.toLowerCase().endsWith(ext)));
      if (match) handleFile(match);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const hasData = !!params.volumetricData;

  return (
    <NodeShell id={id} nodeType="load_volumetric" enabled={data.enabled}>
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        {params.fileName ? (
          <div style={fileNameStyle}>{params.fileName}</div>
        ) : (
          <div style={{ fontSize: 20, color: "#94a3b8", fontStyle: "italic" }}>
            No CUBE file loaded
          </div>
        )}
        {params.fileName && !hasData && (
          <div style={{ fontSize: 14, color: "#ef4444", marginTop: 4 }}>
            Parse error — check file format
          </div>
        )}
        {hasData && params.volumetricData && (
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            {params.volumetricData.nx}×{params.volumetricData.ny}×{params.volumetricData.nz} voxels
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          style={{ ...smallBtnStyle, marginTop: 6, width: "100%" }}
        >
          Load CUBE file...
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={CUBE_ACCEPT}
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

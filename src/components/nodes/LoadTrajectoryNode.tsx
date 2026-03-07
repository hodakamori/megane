/**
 * Load Trajectory node.
 * Loads an external trajectory file (e.g. XTC).
 * Requires particle input (for nAtoms validation).
 * Outputs: trajectory.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { LoadTrajectoryParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { smallBtnStyle, fileNameStyle } from "../ui";
import { useRef, useCallback } from "react";

const TRAJECTORY_ACCEPT = ".xtc";
const TRAJECTORY_EXTS = [".xtc"];

/**
 * Event bus for trajectory loading.
 * MeganeViewer listens for these events to trigger actual file parsing.
 */
export type TrajectoryLoadHandler = (file: File) => void;
let _onTrajectoryLoad: TrajectoryLoadHandler | null = null;
export function setTrajectoryLoadHandler(handler: TrajectoryLoadHandler | null) {
  _onTrajectoryLoad = handler;
}

export function LoadTrajectoryNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as LoadTrajectoryParams;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const lower = file.name.toLowerCase();
      if (!TRAJECTORY_EXTS.some((ext) => lower.endsWith(ext))) return;
      updateNodeParams(id, { fileName: file.name });
      _onTrajectoryLoad?.(file);
    },
    [id, updateNodeParams],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      const match = files.find((f) =>
        TRAJECTORY_EXTS.some((ext) => f.name.toLowerCase().endsWith(ext)),
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
    <NodeShell id={id} nodeType="load_trajectory" enabled={data.enabled}>
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        {params.fileName ? (
          <div style={fileNameStyle}>{params.fileName}</div>
        ) : (
          <div style={{ fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
            No trajectory loaded
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          style={{ ...smallBtnStyle, marginTop: 6, width: "100%" }}
        >
          Load trajectory...
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={TRAJECTORY_ACCEPT}
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

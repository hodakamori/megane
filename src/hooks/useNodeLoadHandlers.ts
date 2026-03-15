/**
 * Custom hook that wires up node-level file load event handlers.
 * Manages structure, trajectory, and vector load handler registration/teardown.
 * Returns a ref to the primary load_structure node ID for downstream use.
 */

import { useEffect, useRef, type MutableRefObject } from "react";
import { usePipelineStore } from "../pipeline/store";
import { setStructureLoadHandler } from "../components/nodes/LoadStructureNode";
import { setTrajectoryLoadHandler } from "../components/nodes/LoadTrajectoryNode";
import { setVectorLoadHandler } from "../components/nodes/LoadVectorNode";
import { loadVectorFileData } from "../logic/vectorSourceLogic";
import { parseStructureFile } from "../parsers/structure";
import type { NodeSnapshotData } from "../pipeline/execute";
import type { Snapshot } from "../types";

interface UseNodeLoadHandlersOptions {
  snapshot: Snapshot | null;
  onUploadStructure: (file: File) => void;
  onUploadTrajectory?: (file: File) => void;
}

/**
 * Registers node load event handlers for structure, trajectory, and vector nodes.
 * Returns a ref containing the ID of the primary load_structure node.
 */
export function useNodeLoadHandlers({
  snapshot,
  onUploadStructure,
  onUploadTrajectory,
}: UseNodeLoadHandlersOptions): MutableRefObject<string | null> {
  const setNodeSnapshot = usePipelineStore((s) => s.setNodeSnapshot);
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const setNodeParseError = usePipelineStore((s) => s.setNodeParseError);
  const clearNodeParseError = usePipelineStore((s) => s.clearNodeParseError);
  const setFileVectors = usePipelineStore((s) => s.setFileVectors);
  const pipelineNodes = usePipelineStore((s) => s.nodes);

  const primaryNodeIdRef = useRef<string | null>(null);

  // Track the primary load_structure node (first one, for backward compat)
  useEffect(() => {
    const primary = pipelineNodes.find((n) => n.type === "load_structure");
    primaryNodeIdRef.current = primary?.id ?? null;
  }, [pipelineNodes]);

  // Wire up structure load handler
  useEffect(() => {
    setStructureLoadHandler((nodeId, file) => {
      parseStructureFile(file)
        .then((result) => {
          clearNodeParseError(nodeId);
          const data: NodeSnapshotData = {
            snapshot: result.snapshot,
            frames: result.frames.length > 0 ? result.frames : null,
            meta: result.meta,
            labels: result.labels,
          };
          setNodeSnapshot(nodeId, data);
          updateNodeParams(nodeId, {
            hasTrajectory: result.frames.length > 0,
            hasCell: !!result.snapshot.box,
          });
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          setNodeParseError(nodeId, `Failed to parse file: ${message}`);
        });
      // For the primary node, also trigger legacy load path for trajectory/label compat
      if (nodeId === primaryNodeIdRef.current) {
        onUploadStructure(file);
      }
    });
    return () => {
      setStructureLoadHandler(null);
    };
  }, [onUploadStructure, setNodeSnapshot, updateNodeParams, setNodeParseError, clearNodeParseError]);

  // Wire up trajectory load handler
  useEffect(() => {
    if (onUploadTrajectory) {
      setTrajectoryLoadHandler((file) => onUploadTrajectory(file));
    }
    return () => {
      setTrajectoryLoadHandler(null);
    };
  }, [onUploadTrajectory]);

  // Wire up vector load handler
  useEffect(() => {
    setVectorLoadHandler((file) => {
      const nAtoms = snapshot?.nAtoms ?? 0;
      if (nAtoms === 0) return;
      loadVectorFileData(file, nAtoms).then(({ vectors }) => {
        setFileVectors(vectors);
      });
    });
    return () => {
      setVectorLoadHandler(null);
    };
  }, [snapshot, setFileVectors]);

  return primaryNodeIdRef;
}

/**
 * Sub-hook for label source management within useMeganeLocal.
 * Manages label source state and cached structure/file labels.
 */

import { useState, useRef, useCallback } from "react";
import { computeLabelsForSource, loadLabelFileData } from "../logic/labelSourceLogic";
import type { Snapshot, LabelSource } from "../types";

export interface LabelSourceState {
  labelSource: LabelSource;
  setLabelSource: (source: LabelSource) => void;
  loadLabelFile: (file: File) => Promise<void>;
  labelFileName: string | null;
  hasStructureLabels: boolean;
  atomLabels: string[] | null;
  /** Reset all label state (called when a new structure is loaded). */
  reset: (labels: string[] | null) => void;
  /** Internal refs exposed for the parent hook. */
  structureLabelsRef: React.MutableRefObject<string[] | null>;
  fileLabelsRef: React.MutableRefObject<string[] | null>;
}

export function useLabelSource(
  baseSnapshotRef: React.MutableRefObject<Snapshot | null>,
): LabelSourceState {
  const [labelSource, setLabelSourceState] = useState<LabelSource>("none");
  const [labelFileName, setLabelFileName] = useState<string | null>(null);
  const [hasStructureLabels, setHasStructureLabels] = useState(false);
  const [atomLabels, setAtomLabels] = useState<string[] | null>(null);

  const structureLabelsRef = useRef<string[] | null>(null);
  const fileLabelsRef = useRef<string[] | null>(null);

  const setLabelSource = useCallback((source: LabelSource) => {
    setLabelSourceState(source);
    const base = baseSnapshotRef.current;
    if (!base) {
      setAtomLabels(null);
      return;
    }
    const labels = computeLabelsForSource(source, {
      structureLabels: structureLabelsRef.current,
      fileLabels: fileLabelsRef.current,
    }, base.nAtoms);
    setAtomLabels(labels);
  }, [baseSnapshotRef]);

  const loadLabelFile = useCallback(async (file: File) => {
    const base = baseSnapshotRef.current;
    if (!base) return;
    const { labels, fileName } = await loadLabelFileData(file, base.nAtoms);
    fileLabelsRef.current = labels;
    setLabelFileName(fileName);
    setLabelSourceState("file");
    setAtomLabels(labels);
  }, [baseSnapshotRef]);

  const reset = useCallback((labels: string[] | null) => {
    structureLabelsRef.current = labels;
    fileLabelsRef.current = null;
    setLabelFileName(null);
    setHasStructureLabels(labels != null);
    setLabelSourceState("none");
    setAtomLabels(null);
  }, []);

  return {
    labelSource,
    setLabelSource,
    loadLabelFile,
    labelFileName,
    hasStructureLabels,
    atomLabels,
    reset,
    structureLabelsRef,
    fileLabelsRef,
  };
}

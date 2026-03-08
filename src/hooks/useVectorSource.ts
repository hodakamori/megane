/**
 * Sub-hook for vector source management within useMeganeLocal.
 * Manages vector source state and cached file/demo vectors.
 */

import { useState, useRef, useCallback } from "react";
import { getVectorsForFrame, loadVectorFileData, generateDemoVectors } from "../logic/vectorSourceLogic";
import type { Snapshot, VectorSource, VectorFrame, TrajectoryMeta } from "../types";
import type { Frame } from "../types";

export interface VectorSourceState {
  vectorSource: VectorSource;
  setVectorSource: (source: VectorSource) => void;
  loadVectorFile: (file: File) => Promise<void>;
  loadDemoVectors: () => void;
  vectorFileName: string | null;
  atomVectors: Float32Array | null;
  /** Update vectors for the current frame (called on seek). */
  updateForFrame: (frameIdx: number) => void;
  /** Reset all vector state (called when a new structure is loaded). */
  reset: () => void;
  /** Internal ref exposed for the parent hook. */
  fileVectorsRef: React.MutableRefObject<VectorFrame[] | null>;
}

export function useVectorSource(
  baseSnapshotRef: React.MutableRefObject<Snapshot | null>,
  currentFrameRef: React.MutableRefObject<number>,
  structureFramesRef: React.MutableRefObject<Frame[]>,
  fileTrajMetaRef: React.MutableRefObject<TrajectoryMeta | null>,
): VectorSourceState {
  const [vectorSource, setVectorSourceState] = useState<VectorSource>("none");
  const [vectorFileName, setVectorFileName] = useState<string | null>(null);
  const [atomVectors, setAtomVectors] = useState<Float32Array | null>(null);

  const fileVectorsRef = useRef<VectorFrame[] | null>(null);

  const setVectorSource = useCallback((source: VectorSource) => {
    setVectorSourceState(source);
    if (source === "none") {
      setAtomVectors(null);
    } else if (source === "demo") {
      const base = baseSnapshotRef.current;
      if (!base) return;
      const nFrames = fileTrajMetaRef.current?.nFrames ?? structureFramesRef.current.length + 1;
      const vectors = generateDemoVectors(base.nAtoms, nFrames);
      fileVectorsRef.current = vectors;
      setVectorFileName("demo");
      const vecs = getVectorsForFrame({ fileVectors: vectors }, currentFrameRef.current);
      setAtomVectors(vecs);
    } else if (source === "file" && fileVectorsRef.current) {
      const vecs = getVectorsForFrame({ fileVectors: fileVectorsRef.current }, currentFrameRef.current);
      setAtomVectors(vecs);
    }
  }, [baseSnapshotRef, currentFrameRef, structureFramesRef, fileTrajMetaRef]);

  const loadVectorFile = useCallback(async (file: File) => {
    const base = baseSnapshotRef.current;
    if (!base) return;
    const { vectors, fileName } = await loadVectorFileData(file, base.nAtoms);
    fileVectorsRef.current = vectors;
    setVectorFileName(fileName);
    setVectorSourceState("file");
    const vecs = getVectorsForFrame({ fileVectors: vectors }, currentFrameRef.current);
    setAtomVectors(vecs);
  }, [baseSnapshotRef, currentFrameRef]);

  const loadDemoVectors = useCallback(() => {
    const base = baseSnapshotRef.current;
    if (!base) return;
    const nFrames = fileTrajMetaRef.current?.nFrames ?? structureFramesRef.current.length + 1;
    const vectors = generateDemoVectors(base.nAtoms, nFrames);
    fileVectorsRef.current = vectors;
    setVectorFileName("demo");
    setVectorSourceState("demo");
    const vecs = getVectorsForFrame({ fileVectors: vectors }, currentFrameRef.current);
    setAtomVectors(vecs);
  }, [baseSnapshotRef, currentFrameRef, structureFramesRef, fileTrajMetaRef]);

  const updateForFrame = useCallback((frameIdx: number) => {
    if (fileVectorsRef.current) {
      const vecs = getVectorsForFrame({ fileVectors: fileVectorsRef.current }, frameIdx);
      setAtomVectors(vecs);
    }
  }, []);

  const reset = useCallback(() => {
    fileVectorsRef.current = null;
    setVectorFileName(null);
    setVectorSourceState("none");
    setAtomVectors(null);
  }, []);

  return {
    vectorSource,
    setVectorSource,
    loadVectorFile,
    loadDemoVectors,
    vectorFileName,
    atomVectors,
    updateForFrame,
    reset,
    fileVectorsRef,
  };
}

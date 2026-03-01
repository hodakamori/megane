/**
 * Local (in-memory) data source hook.
 * Parses PDB files in the browser via WASM — no server communication needed.
 * Supports XTC trajectory loading as a separate step.
 */

import { useState, useRef, useCallback } from "react";
import { parsePDBFile, parsePDBText } from "../core/parsers/pdb";
import { parseXTCFile } from "../core/parsers/xtc";
import type { Snapshot, Frame, TrajectoryMeta } from "../core/types";

export interface MeganeLocalState {
  snapshot: Snapshot | null;
  frame: Frame | null;
  meta: TrajectoryMeta | null;
  connected: boolean;
  currentFrame: number;
  currentFrameRef: React.MutableRefObject<number>;
  pdbFileName: string | null;
  xtcFileName: string | null;
  loadFile: (pdb: File) => Promise<void>;
  loadText: (text: string) => Promise<void>;
  loadXtc: (xtc: File) => Promise<void>;
  seekFrame: (frameIdx: number) => void;
}

export function useMeganeLocal(): MeganeLocalState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [meta, setMeta] = useState<TrajectoryMeta | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [pdbFileName, setPdbFileName] = useState<string | null>(null);
  const [xtcFileName, setXtcFileName] = useState<string | null>(null);

  const currentFrameRef = useRef(0);
  const framesRef = useRef<Frame[]>([]);
  const snapshotRef = useRef<Snapshot | null>(null);

  const applyResult = useCallback(
    (result: { snapshot: Snapshot; frames: Frame[]; meta: TrajectoryMeta | null }) => {
      snapshotRef.current = result.snapshot;
      framesRef.current = result.frames;
      setSnapshot(result.snapshot);
      setMeta(result.meta);
      setFrame(null);
      setCurrentFrame(0);
      currentFrameRef.current = 0;
    },
    [],
  );

  const loadFile = useCallback(async (pdb: File) => {
    const result = await parsePDBFile(pdb);
    applyResult(result);
    setPdbFileName(pdb.name);
    setXtcFileName(result.meta ? `PDB models` : null);
  }, [applyResult]);

  const loadText = useCallback(async (text: string) => {
    const result = await parsePDBText(text);
    applyResult(result);
    setPdbFileName("1crn.pdb");
    setXtcFileName(result.meta ? `PDB models` : null);
  }, [applyResult]);

  const loadXtc = useCallback(async (xtc: File) => {
    if (!snapshotRef.current) {
      throw new Error("Load a PDB structure before loading a trajectory");
    }
    const { frames, meta: xtcMeta } = await parseXTCFile(
      xtc,
      snapshotRef.current.nAtoms,
    );
    framesRef.current = frames;
    setMeta(xtcMeta);
    setFrame(null);
    setCurrentFrame(0);
    currentFrameRef.current = 0;
    setXtcFileName(xtc.name);
  }, []);

  const seekFrame = useCallback((frameIdx: number) => {
    if (frameIdx === 0) {
      if (snapshotRef.current) {
        setFrame({
          frameId: 0,
          nAtoms: snapshotRef.current.nAtoms,
          positions: snapshotRef.current.positions,
        });
      }
    } else {
      const f = framesRef.current[frameIdx - 1];
      if (f) {
        setFrame(f);
      }
    }
    setCurrentFrame(frameIdx);
    currentFrameRef.current = frameIdx;
  }, []);

  return {
    snapshot,
    frame,
    meta,
    connected: true,
    currentFrame,
    currentFrameRef,
    pdbFileName,
    xtcFileName,
    loadFile,
    loadText,
    loadXtc,
    seekFrame,
  };
}

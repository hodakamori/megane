/**
 * Local (in-memory) data source hook.
 * Parses PDB files in the browser via WASM — no server communication needed.
 */

import { useState, useRef, useCallback } from "react";
import { parsePDBFile, parsePDBText } from "../core/parsers/pdb";
import type { Snapshot, Frame, TrajectoryMeta } from "../core/types";

export interface MeganeLocalState {
  snapshot: Snapshot | null;
  frame: Frame | null;
  meta: TrajectoryMeta | null;
  connected: boolean;
  currentFrame: number;
  currentFrameRef: React.MutableRefObject<number>;
  loadFile: (pdb: File) => Promise<void>;
  loadText: (text: string) => Promise<void>;
  seekFrame: (frameIdx: number) => void;
}

export function useMeganeLocal(): MeganeLocalState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [meta, setMeta] = useState<TrajectoryMeta | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);

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
    applyResult(await parsePDBFile(pdb));
  }, [applyResult]);

  const loadText = useCallback(async (text: string) => {
    applyResult(await parsePDBText(text));
  }, [applyResult]);

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
    loadFile,
    loadText,
    seekFrame,
  };
}

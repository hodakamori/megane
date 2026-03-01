/**
 * Local (in-memory) data source hook.
 * Parses structure files in the browser via WASM — no server communication needed.
 * Supports XTC trajectory loading as a separate step.
 * Supports bond source switching (structure / file / distance / none).
 * Supports trajectory source switching (structure / file).
 */

import { useState, useRef, useCallback } from "react";
import { parseStructureFile, parseStructureText } from "../core/parsers/structure";
import { parseXTCFile } from "../core/parsers/xtc";
import { withBonds, computeBondsForSource, loadBondFileData } from "../core/bondSourceLogic";
import type { Snapshot, Frame, TrajectoryMeta, BondSource, TrajectorySource } from "../core/types";

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
  bondSource: BondSource;
  setBondSource: (source: BondSource) => void;
  trajectorySource: TrajectorySource;
  setTrajectorySource: (source: TrajectorySource) => void;
  loadBondFile: (file: File) => Promise<void>;
  bondFileName: string | null;
  hasStructureBonds: boolean;
  hasStructureFrames: boolean;
  hasFileFrames: boolean;
}

export function useMeganeLocal(): MeganeLocalState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [meta, setMeta] = useState<TrajectoryMeta | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [pdbFileName, setPdbFileName] = useState<string | null>(null);
  const [xtcFileName, setXtcFileName] = useState<string | null>(null);
  const [bondSource, setBondSourceState] = useState<BondSource>("structure");
  const [trajectorySource, setTrajectorySourceState] = useState<TrajectorySource>("structure");
  const [bondFileName, setBondFileName] = useState<string | null>(null);
  const [hasStructureBonds, setHasStructureBonds] = useState(false);
  const [hasStructureFrames, setHasStructureFrames] = useState(false);
  const [hasFileFrames, setHasFileFrames] = useState(false);

  const currentFrameRef = useRef(0);
  const structureFramesRef = useRef<Frame[]>([]);
  const fileFramesRef = useRef<Frame[]>([]);
  const baseSnapshotRef = useRef<Snapshot | null>(null);
  const fileBondsRef = useRef<Uint32Array | null>(null);
  const vdwBondsRef = useRef<Uint32Array | null>(null);
  const xtcFileNameRef = useRef<string | null>(null);
  const fileTrajMetaRef = useRef<TrajectoryMeta | null>(null);
  const currentTrajSourceRef = useRef<TrajectorySource>("structure");

  const resetPlayback = useCallback(() => {
    setFrame(null);
    setCurrentFrame(0);
    currentFrameRef.current = 0;
  }, []);

  const applyBondSource = useCallback(async (source: BondSource) => {
    const result = await computeBondsForSource(source, {
      baseSnapshot: baseSnapshotRef.current,
      fileBonds: fileBondsRef.current,
      vdwBonds: vdwBondsRef.current,
    });
    // Cache VDW bonds if they were computed
    if (source === "distance" && result) {
      vdwBondsRef.current = result.bonds;
    }
    if (result) setSnapshot(result);
  }, []);

  const updateMetaForTrajSource = useCallback((trajSource: TrajectorySource) => {
    const base = baseSnapshotRef.current;
    if (!base) return;

    if (trajSource === "file") {
      const fm = fileTrajMetaRef.current;
      if (fm && fileFramesRef.current.length > 0) {
        setMeta(fm);
      } else {
        setMeta(null);
      }
    } else {
      if (structureFramesRef.current.length > 0) {
        setMeta({
          nFrames: structureFramesRef.current.length + 1,
          timestepPs: 1.0,
          nAtoms: base.nAtoms,
        });
      } else {
        setMeta(null);
      }
    }
  }, []);

  const applyResult = useCallback(
    (result: { snapshot: Snapshot; frames: Frame[]; meta: TrajectoryMeta | null }) => {
      baseSnapshotRef.current = result.snapshot;
      structureFramesRef.current = result.frames;
      fileFramesRef.current = [];
      fileBondsRef.current = null;
      vdwBondsRef.current = null;
      fileTrajMetaRef.current = null;
      xtcFileNameRef.current = null;
      setBondFileName(null);

      setHasStructureBonds(result.snapshot.nFileBonds > 0);
      setHasStructureFrames(result.frames.length > 0);
      setHasFileFrames(false);

      currentTrajSourceRef.current = "structure";
      setBondSourceState("structure");
      setTrajectorySourceState("structure");

      setSnapshot(result.snapshot);
      setMeta(result.meta);
      resetPlayback();
    },
    [resetPlayback],
  );

  const loadFile = useCallback(async (pdb: File) => {
    const result = await parseStructureFile(pdb);
    applyResult(result);
    setPdbFileName(pdb.name);
    setXtcFileName(result.meta ? "PDB models" : null);
  }, [applyResult]);

  const loadText = useCallback(async (text: string) => {
    const result = await parseStructureText(text);
    applyResult(result);
    setPdbFileName("1crn.pdb");
    setXtcFileName(result.meta ? "PDB models" : null);
  }, [applyResult]);

  const loadXtc = useCallback(async (xtc: File) => {
    if (!baseSnapshotRef.current) {
      throw new Error("Load a structure before loading a trajectory");
    }
    const { frames, meta: xtcMeta } = await parseXTCFile(
      xtc,
      baseSnapshotRef.current.nAtoms,
    );
    fileFramesRef.current = frames;
    fileTrajMetaRef.current = xtcMeta;
    xtcFileNameRef.current = xtc.name;
    setHasFileFrames(true);

    currentTrajSourceRef.current = "file";
    setTrajectorySourceState("file");
    setMeta(xtcMeta);
    resetPlayback();
    setXtcFileName(xtc.name);
  }, [resetPlayback]);

  const seekFrame = useCallback((frameIdx: number) => {
    const frames = currentTrajSourceRef.current === "file"
      ? fileFramesRef.current
      : structureFramesRef.current;

    if (frameIdx === 0) {
      if (baseSnapshotRef.current) {
        setFrame({
          frameId: 0,
          nAtoms: baseSnapshotRef.current.nAtoms,
          positions: baseSnapshotRef.current.positions,
        });
      }
    } else {
      const f = frames[frameIdx - 1];
      if (f) setFrame(f);
    }
    setCurrentFrame(frameIdx);
    currentFrameRef.current = frameIdx;
  }, []);

  const setBondSource = useCallback(async (source: BondSource) => {
    setBondSourceState(source);
    await applyBondSource(source);
  }, [applyBondSource]);

  const setTrajectorySource = useCallback((source: TrajectorySource) => {
    currentTrajSourceRef.current = source;
    setTrajectorySourceState(source);
    updateMetaForTrajSource(source);
    resetPlayback();

    if (source === "file") {
      setXtcFileName(xtcFileNameRef.current);
    } else {
      setXtcFileName(structureFramesRef.current.length > 0 ? "PDB models" : null);
    }
  }, [updateMetaForTrajSource, resetPlayback]);

  const loadBondFile = useCallback(async (file: File) => {
    const base = baseSnapshotRef.current;
    if (!base) return;

    const { bonds, fileName } = await loadBondFileData(file, base.nAtoms);
    fileBondsRef.current = bonds;
    setBondFileName(fileName);
    setBondSourceState("file");
    setSnapshot(withBonds(base, bonds, null));
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
    bondSource,
    setBondSource,
    trajectorySource,
    setTrajectorySource,
    loadBondFile,
    bondFileName,
    hasStructureBonds,
    hasStructureFrames,
    hasFileFrames,
  };
}

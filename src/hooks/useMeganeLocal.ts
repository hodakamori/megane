/**
 * Local (in-memory) data source hook.
 * Parses PDB files in the browser via WASM — no server communication needed.
 * Supports XTC trajectory loading as a separate step.
 * Supports bond source switching (structure / file / distance).
 * Supports trajectory source switching (structure / file).
 */

import { useState, useRef, useCallback } from "react";
import { parsePDBFile, parsePDBText, inferBondsVdw, parseTopBonds, parsePdbBonds } from "../core/parsers/pdb";
import { parseXTCFile } from "../core/parsers/xtc";
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

/** Rebuild a snapshot with different bonds. */
function withBonds(
  base: Snapshot,
  bonds: Uint32Array,
  bondOrders: Uint8Array | null,
): Snapshot {
  return {
    ...base,
    nBonds: bonds.length / 2,
    bonds,
    bondOrders,
  };
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
  // Structure file frames (multi-model PDB)
  const structureFramesRef = useRef<Frame[]>([]);
  // XTC file frames
  const fileFramesRef = useRef<Frame[]>([]);
  // Full snapshot from parser (with all bonds = structure + inferred)
  const baseSnapshotRef = useRef<Snapshot | null>(null);
  // Bonds from external file
  const fileBondsRef = useRef<Uint32Array | null>(null);
  // VDW-inferred bonds (cached)
  const vdwBondsRef = useRef<Uint32Array | null>(null);
  // XTC file name
  const xtcFileNameRef = useRef<string | null>(null);
  // XTC trajectory meta
  const fileTrajMetaRef = useRef<TrajectoryMeta | null>(null);

  const currentTrajSourceRef = useRef<TrajectorySource>("structure");

  const resetPlayback = useCallback(() => {
    setFrame(null);
    setCurrentFrame(0);
    currentFrameRef.current = 0;
  }, []);

  /** Apply bond source to the current snapshot. */
  const applyBondSource = useCallback(async (source: BondSource) => {
    const base = baseSnapshotRef.current;
    if (!base) return;

    if (source === "none") {
      // Visibility toggled by MeganeViewer; no snapshot change needed.
      return;
    }

    let newSnapshot: Snapshot;
    switch (source) {
      case "structure":
        newSnapshot = base;
        break;
      case "file":
        if (fileBondsRef.current) {
          newSnapshot = withBonds(base, fileBondsRef.current, null);
        } else {
          newSnapshot = withBonds(base, new Uint32Array(0), null);
        }
        break;
      case "distance": {
        if (!vdwBondsRef.current) {
          vdwBondsRef.current = await inferBondsVdw(
            base.positions,
            base.elements,
            base.nAtoms,
          );
        }
        newSnapshot = withBonds(base, vdwBondsRef.current, null);
        break;
      }
    }
    setSnapshot(newSnapshot);
  }, []);

  /** Update meta based on trajectory source. */
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

      // Reset sources
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
    const result = await parsePDBFile(pdb);
    applyResult(result);
    setPdbFileName(pdb.name);
    setXtcFileName(result.meta ? "PDB models" : null);
  }, [applyResult]);

  const loadText = useCallback(async (text: string) => {
    const result = await parsePDBText(text);
    applyResult(result);
    setPdbFileName("1crn.pdb");
    setXtcFileName(result.meta ? "PDB models" : null);
  }, [applyResult]);

  const loadXtc = useCallback(async (xtc: File) => {
    if (!baseSnapshotRef.current) {
      throw new Error("Load a PDB structure before loading a trajectory");
    }
    const { frames, meta: xtcMeta } = await parseXTCFile(
      xtc,
      baseSnapshotRef.current.nAtoms,
    );
    fileFramesRef.current = frames;
    fileTrajMetaRef.current = xtcMeta;
    xtcFileNameRef.current = xtc.name;
    setHasFileFrames(true);

    // Switch to file trajectory source
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
      if (f) {
        setFrame(f);
      }
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

    const text = await file.text();
    const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";

    let bonds: Uint32Array;
    if (ext === ".top") {
      bonds = await parseTopBonds(text, base.nAtoms);
    } else {
      bonds = await parsePdbBonds(text, base.nAtoms);
    }

    fileBondsRef.current = bonds;
    setBondFileName(file.name);

    // Switch to file bond source
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

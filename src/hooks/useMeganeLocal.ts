/**
 * Local (in-memory) data source hook.
 * Parses structure files in the browser via WASM — no server communication needed.
 * Supports XTC trajectory loading as a separate step.
 * Delegates bond/label/vector source management to dedicated sub-hooks.
 */

import { useState, useRef, useCallback } from "react";
import { parseStructureFile, parseStructureText } from "../parsers/structure";
import { parseXTCFile, parseLammpstrjFile } from "../parsers/xtc";
import { useBondSource } from "./useBondSource";
import { useLabelSource } from "./useLabelSource";
import { useVectorSource } from "./useVectorSource";
import { usePipelineStore } from "../pipeline/store";
import type {
  Snapshot,
  Frame,
  TrajectoryMeta,
  BondSource,
  TrajectorySource,
  LabelSource,
  VectorSource,
} from "../types";

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
  loadText: (text: string, fileName?: string) => Promise<void>;
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
  labelSource: LabelSource;
  setLabelSource: (source: LabelSource) => void;
  loadLabelFile: (file: File) => Promise<void>;
  labelFileName: string | null;
  hasStructureLabels: boolean;
  atomLabels: string[] | null;
  vectorSource: VectorSource;
  setVectorSource: (source: VectorSource) => void;
  loadVectorFile: (file: File) => Promise<void>;
  loadDemoVectors: () => void;
  vectorFileName: string | null;
  atomVectors: Float32Array | null;
}

export function useMeganeLocal(): MeganeLocalState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [meta, setMeta] = useState<TrajectoryMeta | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [pdbFileName, setPdbFileName] = useState<string | null>(null);
  const [xtcFileName, setXtcFileName] = useState<string | null>(null);
  const [trajectorySource, setTrajectorySourceState] = useState<TrajectorySource>("structure");
  const [hasStructureFrames, setHasStructureFrames] = useState(false);
  const [hasFileFrames, setHasFileFrames] = useState(false);

  const currentFrameRef = useRef(0);
  const structureFramesRef = useRef<Frame[]>([]);
  const fileFramesRef = useRef<Frame[]>([]);
  const baseSnapshotRef = useRef<Snapshot | null>(null);
  const xtcFileNameRef = useRef<string | null>(null);
  const fileTrajMetaRef = useRef<TrajectoryMeta | null>(null);
  const currentTrajSourceRef = useRef<TrajectorySource>("structure");

  // Sub-hooks for source management
  const bonds = useBondSource(baseSnapshotRef, setSnapshot);
  const labels = useLabelSource(baseSnapshotRef);
  const vectors = useVectorSource(
    baseSnapshotRef,
    currentFrameRef,
    structureFramesRef,
    fileTrajMetaRef,
  );

  const resetPlayback = useCallback(() => {
    setFrame(null);
    setCurrentFrame(0);
    currentFrameRef.current = 0;
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
    (result: {
      snapshot: Snapshot;
      frames: Frame[];
      meta: TrajectoryMeta | null;
      labels: string[] | null;
    }) => {
      baseSnapshotRef.current = result.snapshot;
      structureFramesRef.current = result.frames;
      fileFramesRef.current = [];
      fileTrajMetaRef.current = null;
      xtcFileNameRef.current = null;

      // Reset sub-hook state
      bonds.reset(result.snapshot);
      labels.reset(result.labels);
      vectors.reset();

      setHasStructureFrames(result.frames.length > 0);
      setHasFileFrames(false);

      const initialTrajSource = result.frames.length > 0 ? "structure" : "file";
      currentTrajSourceRef.current = initialTrajSource;
      setTrajectorySourceState(initialTrajSource);

      setSnapshot(result.snapshot);
      setMeta(result.meta);
      resetPlayback();
    },
    [resetPlayback, bonds.reset, labels.reset, vectors.reset],
  );

  const loadFile = useCallback(
    async (pdb: File) => {
      const result = await parseStructureFile(pdb);
      applyResult(result);
      setPdbFileName(pdb.name);
      setXtcFileName(result.meta ? "PDB models" : null);
    },
    [applyResult],
  );

  const loadText = useCallback(
    async (text: string, fileName?: string) => {
      const result = await parseStructureText(text, fileName);
      applyResult(result);
      setPdbFileName(fileName ?? "caffeine_water.pdb");
      setXtcFileName(result.meta ? "PDB models" : null);
    },
    [applyResult],
  );

  const loadXtc = useCallback(
    async (xtc: File) => {
      if (!baseSnapshotRef.current) {
        throw new Error("Load a structure before loading a trajectory");
      }
      const ext = xtc.name.toLowerCase();
      const isLammpstrj = ext.endsWith(".lammpstrj") || ext.endsWith(".dump");
      const parseFn = isLammpstrj ? parseLammpstrjFile : parseXTCFile;
      const { frames, meta: xtcMeta, vectorChannels } = await parseFn(
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

      // Auto-load first embedded vector channel (e.g. LAMMPS dump vx/vy/vz) into pipeline.
      if (vectorChannels.length > 0) {
        usePipelineStore.getState().setFileVectors(vectorChannels[0].frames);
      }
    },
    [resetPlayback],
  );

  const seekFrame = useCallback(
    (frameIdx: number) => {
      const frames =
        currentTrajSourceRef.current === "file"
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

      // Update vectors for this frame
      vectors.updateForFrame(frameIdx);
    },
    [vectors.updateForFrame],
  );

  const setTrajectorySource = useCallback(
    (source: TrajectorySource) => {
      currentTrajSourceRef.current = source;
      setTrajectorySourceState(source);
      updateMetaForTrajSource(source);
      resetPlayback();

      if (source === "file") {
        setXtcFileName(xtcFileNameRef.current);
      } else {
        setXtcFileName(structureFramesRef.current.length > 0 ? "PDB models" : null);
      }
    },
    [updateMetaForTrajSource, resetPlayback],
  );

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
    bondSource: bonds.bondSource,
    setBondSource: bonds.setBondSource,
    trajectorySource,
    setTrajectorySource,
    loadBondFile: bonds.loadBondFile,
    bondFileName: bonds.bondFileName,
    hasStructureBonds: bonds.hasStructureBonds,
    hasStructureFrames,
    hasFileFrames,
    labelSource: labels.labelSource,
    setLabelSource: labels.setLabelSource,
    loadLabelFile: labels.loadLabelFile,
    labelFileName: labels.labelFileName,
    hasStructureLabels: labels.hasStructureLabels,
    atomLabels: labels.atomLabels,
    vectorSource: vectors.vectorSource,
    setVectorSource: vectors.setVectorSource,
    loadVectorFile: vectors.loadVectorFile,
    loadDemoVectors: vectors.loadDemoVectors,
    vectorFileName: vectors.vectorFileName,
    atomVectors: vectors.atomVectors,
  };
}

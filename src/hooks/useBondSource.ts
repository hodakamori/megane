/**
 * Sub-hook for bond source management within useMeganeLocal.
 * Manages bond source state, file bonds cache, and VDW bonds cache.
 */

import { useState, useRef, useCallback } from "react";
import { withBonds, computeBondsForSource, loadBondFileData } from "../logic/bondSourceLogic";
import type { Snapshot, BondSource } from "../types";

export interface BondSourceState {
  bondSource: BondSource;
  setBondSource: (source: BondSource) => Promise<void>;
  loadBondFile: (file: File) => Promise<void>;
  bondFileName: string | null;
  hasStructureBonds: boolean;
  /** Reset all bond state (called when a new structure is loaded). */
  reset: (snapshot: Snapshot) => void;
  /** Apply the current bond source to a base snapshot. */
  applyBondSource: (source: BondSource) => Promise<void>;
  /** Internal refs exposed for the parent hook. */
  fileBondsRef: React.MutableRefObject<Uint32Array | null>;
  vdwBondsRef: React.MutableRefObject<Uint32Array | null>;
}

export function useBondSource(
  baseSnapshotRef: React.MutableRefObject<Snapshot | null>,
  setSnapshot: (s: Snapshot) => void,
): BondSourceState {
  const [bondSource, setBondSourceState] = useState<BondSource>("structure");
  const [bondFileName, setBondFileName] = useState<string | null>(null);
  const [hasStructureBonds, setHasStructureBonds] = useState(false);

  const fileBondsRef = useRef<Uint32Array | null>(null);
  const vdwBondsRef = useRef<Uint32Array | null>(null);

  const applyBondSource = useCallback(
    async (source: BondSource) => {
      const result = await computeBondsForSource(source, {
        baseSnapshot: baseSnapshotRef.current,
        fileBonds: fileBondsRef.current,
        vdwBonds: vdwBondsRef.current,
      });
      if (source === "distance" && result) {
        vdwBondsRef.current = result.bonds;
      }
      if (result) setSnapshot(result);
    },
    [baseSnapshotRef, setSnapshot],
  );

  const setBondSource = useCallback(
    async (source: BondSource) => {
      setBondSourceState(source);
      await applyBondSource(source);
    },
    [applyBondSource],
  );

  const loadBondFile = useCallback(
    async (file: File) => {
      const base = baseSnapshotRef.current;
      if (!base) return;
      const { bonds, fileName } = await loadBondFileData(file, base.nAtoms);
      fileBondsRef.current = bonds;
      setBondFileName(fileName);
      setBondSourceState("file");
      setSnapshot(withBonds(base, bonds, null));
    },
    [baseSnapshotRef, setSnapshot],
  );

  const reset = useCallback((snapshot: Snapshot) => {
    fileBondsRef.current = null;
    vdwBondsRef.current = null;
    setBondFileName(null);
    setHasStructureBonds(snapshot.nFileBonds > 0);
    setBondSourceState("structure");
  }, []);

  return {
    bondSource,
    setBondSource,
    loadBondFile,
    bondFileName,
    hasStructureBonds,
    reset,
    applyBondSource,
    fileBondsRef,
    vdwBondsRef,
  };
}

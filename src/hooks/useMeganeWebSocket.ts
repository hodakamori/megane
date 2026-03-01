/**
 * Custom hook for WebSocket connection to the megane backend.
 * Handles connection lifecycle, message routing, and frame tracking.
 * Supports client-side bond source switching (structure/file/distance/none)
 * and trajectory source switching (structure/file).
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { WebSocketClient } from "../stream/WebSocketClient";
import {
  decodeSnapshot,
  decodeFrame,
  decodeMetadata,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
  MSG_METADATA,
} from "../core/protocol";
import { inferBondsVdw, parseTopBonds, parsePdbBonds } from "../core/parsers/pdb";
import type { Snapshot, Frame, TrajectoryMeta, BondSource, TrajectorySource } from "../core/types";

export interface MeganeWebSocketState {
  snapshot: Snapshot | null;
  frame: Frame | null;
  meta: TrajectoryMeta | null;
  connected: boolean;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  currentFrameRef: React.MutableRefObject<number>;
  clientRef: React.MutableRefObject<WebSocketClient | null>;
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

export function useMeganeWebSocket(url: string | null): MeganeWebSocketState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [meta, setMeta] = useState<TrajectoryMeta | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [bondSource, setBondSourceState] = useState<BondSource>("structure");
  const [trajectorySource, setTrajectorySourceState] = useState<TrajectorySource>("file");
  const [bondFileName, setBondFileName] = useState<string | null>(null);
  const [hasStructureBonds, setHasStructureBonds] = useState(false);

  const clientRef = useRef<WebSocketClient | null>(null);
  const currentFrameRef = useRef(0);
  const baseSnapshotRef = useRef<Snapshot | null>(null);
  const fileBondsRef = useRef<Uint32Array | null>(null);
  const vdwBondsRef = useRef<Uint32Array | null>(null);

  /** Apply bond source to the base snapshot. */
  const applyBondSource = useCallback(async (source: BondSource, base: Snapshot) => {
    if (source === "none") return;

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

  useEffect(() => {
    if (!url) return;

    const client = new WebSocketClient(
      url,
      (data: ArrayBuffer) => {
        const { msgType } = decodeHeader(data);
        if (msgType === MSG_SNAPSHOT) {
          const decoded = decodeSnapshot(data);
          baseSnapshotRef.current = decoded;
          setHasStructureBonds(decoded.nFileBonds > 0);
          // Clear caches for new molecule
          fileBondsRef.current = null;
          vdwBondsRef.current = null;
          setBondFileName(null);
          setBondSourceState("structure");
          setSnapshot(decoded);
        } else if (msgType === MSG_FRAME) {
          const decoded = decodeFrame(data);
          setFrame(decoded);
          setCurrentFrame(decoded.frameId);
          currentFrameRef.current = decoded.frameId;
        } else if (msgType === MSG_METADATA) {
          setMeta(decodeMetadata(data));
        }
      },
      setConnected,
    );

    client.connect();
    clientRef.current = client;

    return () => {
      client.disconnect();
    };
  }, [url]);

  const setBondSource = useCallback(async (source: BondSource) => {
    setBondSourceState(source);
    const base = baseSnapshotRef.current;
    if (base) {
      await applyBondSource(source, base);
    }
  }, [applyBondSource]);

  const setTrajectorySource = useCallback((source: TrajectorySource) => {
    setTrajectorySourceState(source);
  }, []);

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
    setBondSourceState("file");
    setSnapshot(withBonds(base, bonds, null));
  }, []);

  // Streaming: hasStructureFrames is always false, hasFileFrames when server has trajectory
  const hasFileFrames = meta != null && meta.nFrames > 0;

  return {
    snapshot,
    frame,
    meta,
    connected,
    currentFrame,
    setCurrentFrame,
    currentFrameRef,
    clientRef,
    bondSource,
    setBondSource,
    trajectorySource,
    setTrajectorySource,
    loadBondFile,
    bondFileName,
    hasStructureBonds,
    hasStructureFrames: false,
    hasFileFrames,
  };
}

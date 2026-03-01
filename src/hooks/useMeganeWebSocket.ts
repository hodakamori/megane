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
import { withBonds, computeBondsForSource, loadBondFileData } from "../core/bondSourceLogic";
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

  const applyBondSource = useCallback(async (source: BondSource, base: Snapshot) => {
    const result = await computeBondsForSource(source, {
      baseSnapshot: base,
      fileBonds: fileBondsRef.current,
      vdwBonds: vdwBondsRef.current,
    });
    if (source === "distance" && result) {
      vdwBondsRef.current = result.bonds;
    }
    if (result) setSnapshot(result);
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

    const { bonds, fileName } = await loadBondFileData(file, base.nAtoms);
    fileBondsRef.current = bonds;
    setBondFileName(fileName);
    setBondSourceState("file");
    setSnapshot(withBonds(base, bonds, null));
  }, []);

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

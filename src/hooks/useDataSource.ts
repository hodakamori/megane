/**
 * Unified data source hook.
 * Wraps streaming (WebSocket) and local (WASM) data sources behind a
 * common interface so that index.tsx doesn't need mode-switching boilerplate.
 */

import { useCallback } from "react";
import { useMeganeWebSocket } from "./useMeganeWebSocket";
import { useMeganeLocal, type MeganeLocalState } from "./useMeganeLocal";
import type {
  DataMode,
  Snapshot,
  Frame,
  TrajectoryMeta,
  BondSource,
  LabelSource,
  VectorSource,
} from "../types";

export interface DataSource {
  snapshot: Snapshot | null;
  frame: Frame | null;
  meta: TrajectoryMeta | null;
  currentFrame: number;
  currentFrameRef: React.MutableRefObject<number>;

  seekFrame: (frameIdx: number) => void;
  uploadStructure: (file: File) => void;
  uploadTrajectory: (file: File) => void;

  setBondSource: (source: BondSource) => void;
  setLabelSource: (source: LabelSource) => void;
  loadLabelFile: (file: File) => void;
  setVectorSource: (source: VectorSource) => void;
  loadVectorFile: (file: File) => void;
  loadDemoVectors: () => void;

  /** Access to the full local state for demo loading etc. */
  local: MeganeLocalState;
}

async function uploadFiles(pdb: File): Promise<void> {
  const form = new FormData();
  form.append("pdb", pdb);
  await fetch("/api/upload", { method: "POST", body: form });
}

export function useDataSource(mode: DataMode): DataSource {
  const wsUrl =
    mode === "streaming"
      ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
      : null;
  const ws = useMeganeWebSocket(wsUrl);
  const local = useMeganeLocal();

  const snapshot = mode === "streaming" ? ws.snapshot : local.snapshot;
  const frame = mode === "streaming" ? ws.frame : local.frame;
  const meta = mode === "streaming" ? ws.meta : local.meta;
  const currentFrame = mode === "streaming" ? ws.currentFrame : local.currentFrame;
  const currentFrameRef = mode === "streaming" ? ws.currentFrameRef : local.currentFrameRef;

  const seekFrame = useCallback(
    (frameIdx: number) => {
      if (mode === "streaming") {
        ws.currentFrameRef.current = frameIdx;
        ws.clientRef.current?.send({ type: "request_frame", frame: frameIdx });
      } else {
        local.seekFrame(frameIdx);
      }
    },
    [mode, ws.currentFrameRef, ws.clientRef, local.seekFrame],
  );

  const uploadStructure = useCallback(
    (file: File) => {
      if (mode === "streaming") {
        uploadFiles(file);
      } else {
        local.loadFile(file);
      }
    },
    [mode, local.loadFile],
  );

  const uploadTrajectory = useCallback(
    (file: File) => {
      if (mode === "local") {
        local.loadXtc(file);
      }
    },
    [mode, local.loadXtc],
  );

  const setBondSource = useCallback(
    (source: BondSource) => {
      if (mode === "streaming") {
        ws.setBondSource(source);
      } else {
        local.setBondSource(source);
      }
    },
    [mode, ws.setBondSource, local.setBondSource],
  );

  const setLabelSource = useCallback(
    (source: LabelSource) => {
      if (mode === "streaming") {
        ws.setLabelSource(source);
      } else {
        local.setLabelSource(source);
      }
    },
    [mode, ws.setLabelSource, local.setLabelSource],
  );

  const loadLabelFile = useCallback(
    (file: File) => {
      if (mode === "streaming") {
        ws.loadLabelFile(file);
      } else {
        local.loadLabelFile(file);
      }
    },
    [mode, ws.loadLabelFile, local.loadLabelFile],
  );

  const setVectorSource = useCallback(
    (source: VectorSource) => {
      if (mode === "streaming") {
        ws.setVectorSource(source);
      } else {
        local.setVectorSource(source);
      }
    },
    [mode, ws.setVectorSource, local.setVectorSource],
  );

  const loadVectorFile = useCallback(
    (file: File) => {
      if (mode === "streaming") {
        ws.loadVectorFile(file);
      } else {
        local.loadVectorFile(file);
      }
    },
    [mode, ws.loadVectorFile, local.loadVectorFile],
  );

  const loadDemoVectors = useCallback(() => {
    if (mode === "local") {
      local.loadDemoVectors();
    }
  }, [mode, local.loadDemoVectors]);

  return {
    snapshot,
    frame,
    meta,
    currentFrame,
    currentFrameRef,
    seekFrame,
    uploadStructure,
    uploadTrajectory,
    setBondSource,
    setLabelSource,
    loadLabelFile,
    setVectorSource,
    loadVectorFile,
    loadDemoVectors,
    local,
  };
}

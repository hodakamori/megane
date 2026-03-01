/**
 * megane - Standalone web application entry point.
 * Supports two data modes:
 *   - "streaming": connects to Python backend via WebSocket
 *   - "local": parses PDB files in-browser via WASM (no server needed)
 */

import { StrictMode, useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { useMeganeWebSocket } from "./hooks/useMeganeWebSocket";
import { useMeganeLocal } from "./hooks/useMeganeLocal";
import defaultPDB from "./assets/1crn.pdb?raw";
import demoXtcUrl from "./assets/1crn_vibration.xtc?url";
import "./styles/megane.css";

export type DataMode = "streaming" | "local";

async function uploadFiles(pdb: File, xtc?: File): Promise<void> {
  const form = new FormData();
  form.append("pdb", pdb);
  if (xtc) form.append("xtc", xtc);
  await fetch("/api/upload", { method: "POST", body: form });
}

function App() {
  const [mode, setMode] = useState<DataMode>("local");

  // WebSocket data source (only active in streaming mode)
  const wsUrl =
    mode === "streaming"
      ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
      : null;
  const ws = useMeganeWebSocket(wsUrl);

  // Local data source
  const local = useMeganeLocal();

  // Load bundled demo PDB and XTC on first mount
  useEffect(() => {
    (async () => {
      await local.loadText(defaultPDB);
      const resp = await fetch(demoXtcUrl);
      const buffer = await resp.arrayBuffer();
      const file = new File([buffer], "1crn_vibration.xtc");
      await local.loadXtc(file);
    })().catch(() => {});
  }, []);

  // Select active data source based on mode
  const snapshot = mode === "streaming" ? ws.snapshot : local.snapshot;
  const frame = mode === "streaming" ? ws.frame : local.frame;
  const meta = mode === "streaming" ? ws.meta : local.meta;
  const currentFrame =
    mode === "streaming" ? ws.currentFrame : local.currentFrame;
  const currentFrameRef =
    mode === "streaming" ? ws.currentFrameRef : local.currentFrameRef;

  // Streaming mode file name tracking (client-side only)
  const [streamPdbFileName, setStreamPdbFileName] = useState<string | null>(null);
  const [streamXtcFileName, setStreamXtcFileName] = useState<string | null>(null);

  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const playingRef = useRef(false);

  // Playback loop (works for both modes)
  useEffect(() => {
    playingRef.current = playing;
    if (!playing || !meta) return;

    const interval = setInterval(() => {
      if (!playingRef.current) return;
      const nextFrame = (currentFrameRef.current + 1) % meta.nFrames;

      if (mode === "streaming" && ws.clientRef.current) {
        ws.clientRef.current.send({ type: "request_frame", frame: nextFrame });
      } else if (mode === "local") {
        local.seekFrame(nextFrame);
      }
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [playing, meta, fps, mode, ws.clientRef, currentFrameRef, local.seekFrame]);

  const handleSeek = useCallback(
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

  const handlePlayPause = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const handleFpsChange = useCallback((newFps: number) => {
    setFps(newFps);
  }, []);

  const handleUploadPdb = useCallback(
    (pdb: File) => {
      setPlaying(false);
      if (mode === "streaming") {
        uploadFiles(pdb);
        setStreamPdbFileName(pdb.name);
        setStreamXtcFileName(null);
      } else {
        local.loadFile(pdb);
      }
    },
    [mode, local.loadFile],
  );

  const handleUploadXtc = useCallback(
    (xtc: File) => {
      setPlaying(false);
      if (mode === "streaming") {
        uploadFiles(undefined as unknown as File, xtc);
        setStreamXtcFileName(xtc.name);
      } else {
        local.loadXtc(xtc);
      }
    },
    [mode, local.loadXtc],
  );

  const handleModeToggle = useCallback(() => {
    setPlaying(false);
    setMode((prev) => (prev === "streaming" ? "local" : "streaming"));
  }, []);

  return (
    <MeganeViewer
      snapshot={snapshot}
      frame={frame}
      currentFrame={currentFrame}
      totalFrames={meta?.nFrames ?? 0}
      playing={playing}
      fps={fps}
      onSeek={handleSeek}
      onPlayPause={handlePlayPause}
      onFpsChange={handleFpsChange}
      onUploadPdb={handleUploadPdb}
      onUploadXtc={handleUploadXtc}
      mode={mode}
      onToggleMode={handleModeToggle}
      pdbFileName={
        mode === "streaming"
          ? streamPdbFileName || ws.meta?.pdbName || null
          : local.pdbFileName
      }
      xtcFileName={
        mode === "streaming"
          ? streamXtcFileName || ws.meta?.xtcName || null
          : local.xtcFileName
      }
      timestepPs={meta?.timestepPs ?? 0}
      bondSource={mode === "streaming" ? ws.bondSource : local.bondSource}
      onBondSourceChange={mode === "streaming" ? ws.setBondSource : local.setBondSource}
      onUploadBondFile={mode === "streaming" ? ws.loadBondFile : local.loadBondFile}
      bondFileName={mode === "streaming" ? ws.bondFileName : local.bondFileName}
      hasStructureBonds={mode === "streaming" ? ws.hasStructureBonds : local.hasStructureBonds}
      trajectorySource={mode === "streaming" ? ws.trajectorySource : local.trajectorySource}
      onTrajectorySourceChange={mode === "streaming" ? ws.setTrajectorySource : local.setTrajectorySource}
      hasStructureFrames={mode === "streaming" ? ws.hasStructureFrames : local.hasStructureFrames}
      hasFileFrames={mode === "streaming" ? ws.hasFileFrames : local.hasFileFrames}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

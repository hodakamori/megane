/**
 * megane - Standalone web application entry point.
 * Supports two data modes:
 *   - "streaming": connects to Python backend via WebSocket
 *   - "local": parses PDB files in-browser via WASM (no server needed)
 */

import { StrictMode, useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { UploadArea } from "./components/UploadArea";
import { useMeganeWebSocket } from "./hooks/useMeganeWebSocket";
import { useMeganeLocal } from "./hooks/useMeganeLocal";
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

  // Load default PDB on first mount
  useEffect(() => {
    fetch("/1crn.pdb")
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((text) => local.loadText(text))
      .catch(() => {});
  }, []);

  // Select active data source based on mode
  const snapshot = mode === "streaming" ? ws.snapshot : local.snapshot;
  const frame = mode === "streaming" ? ws.frame : local.frame;
  const meta = mode === "streaming" ? ws.meta : local.meta;
  const connected = mode === "streaming" ? ws.connected : local.connected;
  const currentFrame =
    mode === "streaming" ? ws.currentFrame : local.currentFrame;
  const currentFrameRef =
    mode === "streaming" ? ws.currentFrameRef : local.currentFrameRef;

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

  const handleUpload = useCallback(
    (pdb: File, xtc?: File) => {
      if (mode === "streaming") {
        uploadFiles(pdb, xtc);
      } else {
        local.loadFile(pdb);
      }
    },
    [mode, local.loadFile],
  );

  const handleModeToggle = useCallback(() => {
    setPlaying(false);
    setMode((prev) => (prev === "streaming" ? "local" : "streaming"));
  }, []);

  return (
    <>
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
        onUpload={handleUpload}
        mode={mode}
        onToggleMode={handleModeToggle}
      />
      {!snapshot && (mode === "local" || connected) && (
        <UploadArea onUpload={handleUpload} />
      )}
      <div
        className={`megane-status ${connected ? "megane-status--connected" : "megane-status--disconnected"}`}
      >
        {mode === "streaming"
          ? connected
            ? "Connected"
            : "Connecting..."
          : snapshot
            ? "Local mode"
            : "Drop a PDB file"}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

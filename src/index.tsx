/**
 * megane - Standalone web application entry point.
 * Connects to the Python backend via WebSocket and renders molecules.
 */

import { StrictMode, useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { UploadArea } from "./components/UploadArea";
import { useMeganeWebSocket } from "./hooks/useMeganeWebSocket";
import "./styles/megane.css";

async function uploadFiles(pdb: File, xtc?: File): Promise<void> {
  const form = new FormData();
  form.append("pdb", pdb);
  if (xtc) form.append("xtc", xtc);
  await fetch("/api/upload", { method: "POST", body: form });
}

function App() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
  const {
    snapshot,
    frame,
    meta,
    connected,
    currentFrame,
    currentFrameRef,
    clientRef,
  } = useMeganeWebSocket(wsUrl);

  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const playingRef = useRef(false);

  // Playback loop: request frames from server
  useEffect(() => {
    playingRef.current = playing;
    if (!playing || !meta || !clientRef.current) return;

    const interval = setInterval(() => {
      if (!playingRef.current || !clientRef.current) return;
      const nextFrame = (currentFrameRef.current + 1) % meta.nFrames;
      clientRef.current.send({ type: "request_frame", frame: nextFrame });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [playing, meta, fps, clientRef, currentFrameRef]);

  const handleSeek = useCallback(
    (frameIdx: number) => {
      currentFrameRef.current = frameIdx;
      clientRef.current?.send({ type: "request_frame", frame: frameIdx });
    },
    [clientRef, currentFrameRef],
  );

  const handlePlayPause = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const handleFpsChange = useCallback((newFps: number) => {
    setFps(newFps);
  }, []);

  const handleUpload = useCallback((pdb: File, xtc?: File) => {
    uploadFiles(pdb, xtc);
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
      />
      {!snapshot && connected && <UploadArea onUpload={handleUpload} />}
      <div
        className={`megane-status ${connected ? "megane-status--connected" : "megane-status--disconnected"}`}
      >
        {connected ? "Connected" : "Connecting..."}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

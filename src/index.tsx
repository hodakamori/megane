/**
 * megane - Standalone web application entry point.
 * Supports two data modes:
 *   - "streaming": connects to Python backend via WebSocket
 *   - "local": parses structure files in-browser via WASM (no server needed)
 */

import { StrictMode, useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { useMeganeWebSocket } from "./hooks/useMeganeWebSocket";
import { useMeganeLocal } from "./hooks/useMeganeLocal";
import defaultPDB from "../tests/fixtures/caffeine_water.pdb?raw";
import "./styles/megane.css";

export type DataMode = "streaming" | "local";

async function uploadFiles(pdb: File, xtc?: File): Promise<void> {
  const form = new FormData();
  form.append("pdb", pdb);
  if (xtc) form.append("xtc", xtc);
  await fetch("/api/upload", { method: "POST", body: form });
}

function App() {
  const [mode] = useState<DataMode>("local");

  // WebSocket data source (only active in streaming mode)
  const wsUrl =
    mode === "streaming"
      ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`
      : null;
  const ws = useMeganeWebSocket(wsUrl);

  // Local data source
  const local = useMeganeLocal();

  // Load bundled demo PDB on first mount
  useEffect(() => {
    (async () => {
      await local.loadText(defaultPDB);
      local.loadDemoVectors();
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

  const handleUploadStructure = useCallback(
    (file: File) => {
      setPlaying(false);
      if (mode === "streaming") {
        uploadFiles(file);
      } else {
        local.loadFile(file);
      }
    },
    [mode, local.loadFile],
  );

  const handleBondSourceChange = useCallback(
    (source: string) => {
      if (mode === "streaming") {
        ws.setBondSource(source as "structure" | "file" | "distance" | "none");
      } else {
        local.setBondSource(source as "structure" | "file" | "distance" | "none");
      }
    },
    [mode, ws.setBondSource, local.setBondSource],
  );

  const handleLabelSourceChange = useCallback(
    (source: string) => {
      if (mode === "streaming") {
        ws.setLabelSource(source as "none" | "structure" | "file");
      } else {
        local.setLabelSource(source as "none" | "structure" | "file");
      }
    },
    [mode, ws.setLabelSource, local.setLabelSource],
  );

  const handleLoadLabelFile = useCallback(
    (file: File) => {
      if (mode === "streaming") {
        ws.loadLabelFile(file);
      } else {
        local.loadLabelFile(file);
      }
    },
    [mode, ws.loadLabelFile, local.loadLabelFile],
  );

  const handleVectorSourceChange = useCallback(
    (source: string) => {
      if (mode === "streaming") {
        ws.setVectorSource(source as "none" | "file" | "demo");
      } else {
        local.setVectorSource(source as "none" | "file" | "demo");
      }
    },
    [mode, ws.setVectorSource, local.setVectorSource],
  );

  const handleLoadVectorFile = useCallback(
    (file: File) => {
      if (mode === "streaming") {
        ws.loadVectorFile(file);
      } else {
        local.loadVectorFile(file);
      }
    },
    [mode, ws.loadVectorFile, local.loadVectorFile],
  );

  const handleLoadDemoVectors = useCallback(() => {
    if (mode === "local") {
      local.loadDemoVectors();
    }
  }, [mode, local.loadDemoVectors]);

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
      onUploadStructure={handleUploadStructure}
      onBondSourceChange={handleBondSourceChange}
      onLabelSourceChange={handleLabelSourceChange}
      onLoadLabelFile={handleLoadLabelFile}
      onVectorSourceChange={handleVectorSourceChange}
      onLoadVectorFile={handleLoadVectorFile}
      onLoadDemoVectors={handleLoadDemoVectors}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

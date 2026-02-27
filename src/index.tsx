/**
 * megane - Standalone web application entry point.
 * Connects to the Python backend via WebSocket and renders molecules.
 */

import { StrictMode, useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { WebSocketClient } from "./stream/WebSocketClient";
import {
  decodeSnapshot,
  decodeFrame,
  decodeMetadata,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
  MSG_METADATA,
} from "./core/protocol";
import type { Snapshot, Frame, TrajectoryMeta } from "./core/types";
import "./styles/megane.css";

function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [meta, setMeta] = useState<TrajectoryMeta | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);

  const clientRef = useRef<WebSocketClient | null>(null);
  const playingRef = useRef(false);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const wsUrl = `ws://${window.location.host}/ws`;
    const client = new WebSocketClient(wsUrl, (data: ArrayBuffer) => {
      const { msgType } = decodeHeader(data);
      if (msgType === MSG_SNAPSHOT) {
        setSnapshot(decodeSnapshot(data));
      } else if (msgType === MSG_FRAME) {
        const decoded = decodeFrame(data);
        setFrame(decoded);
        setCurrentFrame(decoded.frameId);
        currentFrameRef.current = decoded.frameId;
      } else if (msgType === MSG_METADATA) {
        setMeta(decodeMetadata(data));
      }
    });

    client.connect();
    clientRef.current = client;

    const checkConnection = setInterval(() => {
      setConnected(client.connected);
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      client.disconnect();
    };
  }, []);

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
  }, [playing, meta, fps]);

  const handleSeek = useCallback(
    (frameIdx: number) => {
      setCurrentFrame(frameIdx);
      currentFrameRef.current = frameIdx;
      clientRef.current?.send({ type: "request_frame", frame: frameIdx });
    },
    []
  );

  const handlePlayPause = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const handleFpsChange = useCallback((newFps: number) => {
    setFps(newFps);
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
      />
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
  </StrictMode>
);

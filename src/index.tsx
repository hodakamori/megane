/**
 * megane - Standalone web application entry point.
 * Connects to the Python backend via WebSocket and renders molecules.
 */

import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { WebSocketClient } from "./stream/WebSocketClient";
import { decodeSnapshot, decodeFrame, MSG_SNAPSHOT, MSG_FRAME, decodeHeader } from "./core/protocol";
import type { Snapshot, Frame } from "./core/types";
import "./styles/megane.css";

function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const wsUrl = `ws://${window.location.host}/ws`;
    const client = new WebSocketClient(wsUrl, (data: ArrayBuffer) => {
      const { msgType } = decodeHeader(data);
      if (msgType === MSG_SNAPSHOT) {
        setSnapshot(decodeSnapshot(data));
      } else if (msgType === MSG_FRAME) {
        setFrame(decodeFrame(data));
      }
    });

    client.connect();

    const checkConnection = setInterval(() => {
      setConnected(client.connected);
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      client.disconnect();
    };
  }, []);

  return (
    <>
      <MeganeViewer snapshot={snapshot} frame={frame} />
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

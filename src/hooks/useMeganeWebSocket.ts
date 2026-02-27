/**
 * Custom hook for WebSocket connection to the megane backend.
 * Handles connection lifecycle, message routing, and frame tracking.
 */

import { useState, useEffect, useRef } from "react";
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
import type { Snapshot, Frame, TrajectoryMeta } from "../core/types";

export interface MeganeWebSocketState {
  snapshot: Snapshot | null;
  frame: Frame | null;
  meta: TrajectoryMeta | null;
  connected: boolean;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  currentFrameRef: React.MutableRefObject<number>;
  clientRef: React.MutableRefObject<WebSocketClient | null>;
}

export function useMeganeWebSocket(url: string): MeganeWebSocketState {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [meta, setMeta] = useState<TrajectoryMeta | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const clientRef = useRef<WebSocketClient | null>(null);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const client = new WebSocketClient(
      url,
      (data: ArrayBuffer) => {
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
      },
      setConnected,
    );

    client.connect();
    clientRef.current = client;

    return () => {
      client.disconnect();
    };
  }, [url]);

  return {
    snapshot,
    frame,
    meta,
    connected,
    currentFrame,
    setCurrentFrame,
    currentFrameRef,
    clientRef,
  };
}

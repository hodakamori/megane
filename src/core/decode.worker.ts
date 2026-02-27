/**
 * Web Worker for off-main-thread binary decoding.
 *
 * Receives ArrayBuffers via postMessage, decodes them using the protocol
 * module, and returns the decoded data with Transferable ownership.
 * This keeps the main thread free for rendering during large file loads.
 */

import {
  decodeSnapshot,
  decodeFrame,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
} from "./protocol";

export interface WorkerRequest {
  id: number;
  type: "decode";
  buffer: ArrayBuffer;
}

export interface WorkerResponse {
  id: number;
  type: "snapshot" | "frame" | "error";
  data?: unknown;
  error?: string;
}

interface WorkerSelf {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage(message: unknown, transfer?: Transferable[]): void;
}

const ctx = self as unknown as WorkerSelf;

ctx.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, buffer } = e.data;

  try {
    const { msgType } = decodeHeader(buffer);

    if (msgType === MSG_SNAPSHOT) {
      const snapshot = decodeSnapshot(buffer);
      const transfers: ArrayBuffer[] = [
        snapshot.positions.buffer as ArrayBuffer,
        snapshot.elements.buffer as ArrayBuffer,
        snapshot.bonds.buffer as ArrayBuffer,
      ];
      if (snapshot.bondOrders) {
        transfers.push(snapshot.bondOrders.buffer as ArrayBuffer);
      }
      if (snapshot.box) {
        transfers.push(snapshot.box.buffer as ArrayBuffer);
      }
      ctx.postMessage(
        {
          id,
          type: "snapshot",
          data: {
            nAtoms: snapshot.nAtoms,
            nBonds: snapshot.nBonds,
            positions: snapshot.positions,
            elements: snapshot.elements,
            bonds: snapshot.bonds,
            bondOrders: snapshot.bondOrders,
            box: snapshot.box,
          },
        } satisfies WorkerResponse,
        transfers,
      );
    } else if (msgType === MSG_FRAME) {
      const frame = decodeFrame(buffer);
      const transfers: ArrayBuffer[] = [
        frame.positions.buffer as ArrayBuffer,
      ];
      ctx.postMessage(
        {
          id,
          type: "frame",
          data: {
            frameId: frame.frameId,
            nAtoms: frame.nAtoms,
            positions: frame.positions,
          },
        } satisfies WorkerResponse,
        transfers,
      );
    }
  } catch (err) {
    ctx.postMessage({
      id,
      type: "error",
      error: err instanceof Error ? err.message : String(err),
    } satisfies WorkerResponse);
  }
};

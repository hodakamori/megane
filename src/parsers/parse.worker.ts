/**
 * Web Worker that runs WASM file parsing off the main thread.
 *
 * Thin wrapper: it initialises the WASM module (with the URL resolved on the
 * main thread), calls the shared `parseCore` functions, and posts the result
 * back — transferring the underlying ArrayBuffers so the big coordinate buffers
 * move to the main thread with zero copy. All parse logic lives in `parseCore`,
 * so worker output is byte-identical to the synchronous path.
 */

import {
  ensureInit,
  parseStructureCore,
  parseTrajectoryCore,
  collectResultBuffers,
  indexTrajectoryCore,
  decodeFrameCore,
  type WasmXtcDecoder,
} from "./parseCore";
import type { ParseRequest, ParseResponse } from "./parseMessages";

interface WorkerSelf {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage(message: unknown, transfer?: Transferable[]): void;
}

const ctx = self as unknown as WorkerSelf;

// Persistent lazy XTC decoders, keyed by a client-allocated trajectoryId. Each
// holds the whole file in WASM memory for the trajectory's lifetime so frames
// can be decoded on demand; freed on `disposeTrajectory`.
const decoders = new Map<number, WasmXtcDecoder>();

ctx.onmessage = async (e: MessageEvent<ParseRequest>) => {
  const req = e.data;
  try {
    if (req.op === "structure") {
      await ensureInit(req.wasmUrl);
      const result = parseStructureCore({
        ext: req.ext,
        text: req.text,
        bytes: req.bytes ? new Uint8Array(req.bytes) : undefined,
      });
      const transfer = collectResultBuffers(result);
      ctx.postMessage(
        { id: req.id, ok: true, op: "structure", result } satisfies ParseResponse,
        transfer,
      );
    } else if (req.op === "trajectory") {
      await ensureInit(req.wasmUrl);
      const result = parseTrajectoryCore({
        kind: req.kind,
        text: req.text,
        bytes: req.bytes ? new Uint8Array(req.bytes) : undefined,
        expectedNAtoms: req.expectedNAtoms,
      });
      const transfer = collectResultBuffers(result);
      ctx.postMessage(
        { id: req.id, ok: true, op: "trajectory", result } satisfies ParseResponse,
        transfer,
      );
    } else if (req.op === "indexTrajectory") {
      await ensureInit(req.wasmUrl);
      const { decoder, index } = indexTrajectoryCore(
        new Uint8Array(req.bytes),
        req.expectedNAtoms,
      );
      decoders.set(req.trajectoryId, decoder);
      // Transfer the small index arrays (box, times) zero-copy.
      const transfer: Transferable[] = [index.times.buffer];
      if (index.box) transfer.push(index.box.buffer);
      ctx.postMessage(
        { id: req.id, ok: true, op: "indexTrajectory", result: index } satisfies ParseResponse,
        transfer,
      );
    } else if (req.op === "decodeFrame") {
      const decoder = decoders.get(req.trajectoryId);
      if (!decoder) throw new Error(`unknown trajectoryId ${req.trajectoryId}`);
      const positions = decodeFrameCore(decoder, req.frame);
      ctx.postMessage(
        {
          id: req.id,
          ok: true,
          op: "decodeFrame",
          result: { frame: req.frame, positions },
        } satisfies ParseResponse,
        [positions.buffer],
      );
    } else if (req.op === "disposeTrajectory") {
      decoders.get(req.trajectoryId)?.free();
      decoders.delete(req.trajectoryId);
      ctx.postMessage({ id: req.id, ok: true, op: "disposeTrajectory" } satisfies ParseResponse);
    }
  } catch (err) {
    ctx.postMessage({
      id: req.id,
      ok: false,
      op: req.op,
      error: err instanceof Error ? err.message : String(err),
    } satisfies ParseResponse);
  }
};

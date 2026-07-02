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
} from "./parseCore";
import type { ParseRequest, ParseResponse } from "./parseMessages";

interface WorkerSelf {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage(message: unknown, transfer?: Transferable[]): void;
}

const ctx = self as unknown as WorkerSelf;

ctx.onmessage = async (e: MessageEvent<ParseRequest>) => {
  const req = e.data;
  try {
    await ensureInit(req.wasmUrl);

    if (req.op === "structure") {
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
    } else {
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

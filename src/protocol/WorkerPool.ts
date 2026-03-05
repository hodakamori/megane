/**
 * Simple worker pool for parallel binary decoding.
 * Uses Vite's ?worker import to inline the worker script.
 */

import type { WorkerResponse } from "./decode.worker";
import DecodeWorker from "./decode.worker?worker";

type PendingResolve = (response: WorkerResponse) => void;
type PendingReject = (error: Error) => void;

interface PendingEntry {
  resolve: PendingResolve;
  reject: PendingReject;
  timer: ReturnType<typeof setTimeout>;
}

export class WorkerPool {
  private workers: Worker[];
  private pending = new Map<number, PendingEntry>();
  private nextId = 0;
  private robin = 0;

  constructor(size: number = Math.min(navigator.hardwareConcurrency || 2, 4)) {
    this.workers = Array.from({ length: size }, () => {
      const w = new DecodeWorker();
      w.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const entry = this.pending.get(e.data.id);
        if (entry) {
          clearTimeout(entry.timer);
          this.pending.delete(e.data.id);
          entry.resolve(e.data);
        }
      };
      return w;
    });
  }

  /** Send a buffer to a worker for decoding. Returns decoded response. */
  decode(buffer: ArrayBuffer, timeoutMs: number = 10_000): Promise<WorkerResponse> {
    const id = this.nextId++;
    const worker = this.workers[this.robin % this.workers.length];
    this.robin++;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Worker decode timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      this.pending.set(id, { resolve, reject, timer });
      worker.postMessage({ id, type: "decode", buffer }, [buffer]);
    });
  }

  dispose(): void {
    for (const entry of this.pending.values()) {
      clearTimeout(entry.timer);
    }
    for (const w of this.workers) {
      w.terminate();
    }
    this.workers = [];
    this.pending.clear();
  }
}

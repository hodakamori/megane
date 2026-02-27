/**
 * Simple worker pool for parallel binary decoding.
 * Uses Vite's ?worker import to inline the worker script.
 */

import type { WorkerResponse } from "./decode.worker";
import DecodeWorker from "./decode.worker?worker";

type PendingResolve = (response: WorkerResponse) => void;

export class WorkerPool {
  private workers: Worker[];
  private pending = new Map<number, PendingResolve>();
  private nextId = 0;
  private robin = 0;

  constructor(size: number = Math.min(navigator.hardwareConcurrency || 2, 4)) {
    this.workers = Array.from({ length: size }, () => {
      const w = new DecodeWorker();
      w.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const resolve = this.pending.get(e.data.id);
        if (resolve) {
          this.pending.delete(e.data.id);
          resolve(e.data);
        }
      };
      return w;
    });
  }

  /** Send a buffer to a worker for decoding. Returns decoded response. */
  decode(buffer: ArrayBuffer): Promise<WorkerResponse> {
    const id = this.nextId++;
    const worker = this.workers[this.robin % this.workers.length];
    this.robin++;

    return new Promise((resolve) => {
      this.pending.set(id, resolve);
      worker.postMessage({ id, type: "decode", buffer }, [buffer]);
    });
  }

  dispose(): void {
    for (const w of this.workers) {
      w.terminate();
    }
    this.workers = [];
    this.pending.clear();
  }
}

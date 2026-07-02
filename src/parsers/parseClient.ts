/**
 * Worker-backed parse client.
 *
 * Runs WASM file parsing in a single reusable Web Worker so the main thread
 * stays responsive during large / multi-frame file loads. Falls back
 * transparently to the synchronous main-thread path (`parseClientSync`) when a
 * worker cannot be created or a request errors / times out — so no host is ever
 * left unable to open a file.
 *
 * Exposes the same signatures as the original `structure.ts` / `xtc.ts`.
 *
 * NOTE: on hosts whose bundler cannot handle the worker import (JupyterLab's
 * webpack, and the single-file anywidget bundle), this module is swapped for
 * `parseClientSync` at build time — see `jupyterlab-megane/webpack.config.js`
 * and `vite.widget.config.ts`.
 */

import ParseWorker from "./parse.worker?worker&inline";
import wasmAssetUrl from "../../crates/megane-wasm/pkg/megane_wasm_bg.wasm?url";
import { perfMark, perfMeasure } from "../perf";
import * as sync from "./parseClientSync";
import type { StructureParseResult, XTCParseResult, TrajectoryKind } from "./parseCore";
import type { ParseRequest, ParseResponse } from "./parseMessages";

const TIMEOUT_MS = 120_000;

let worker: Worker | null = null;
let workerBroken = false;
let nextId = 0;

interface Pending {
  resolve: (r: StructureParseResult | XTCParseResult) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}
const pending = new Map<number, Pending>();

function workerUnavailable(): boolean {
  return workerBroken || typeof Worker === "undefined";
}

/** Reject every in-flight request and drop the worker (used on a fatal error). */
function tearDown(reason: string): void {
  workerBroken = true;
  for (const entry of pending.values()) {
    clearTimeout(entry.timer);
    entry.reject(new Error(reason));
  }
  pending.clear();
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

function getWorker(): Worker {
  if (worker) return worker;
  const w = new ParseWorker();
  w.onmessage = (e: MessageEvent<ParseResponse>) => {
    const entry = pending.get(e.data.id);
    if (!entry) return;
    clearTimeout(entry.timer);
    pending.delete(e.data.id);
    if (e.data.ok && e.data.result) {
      entry.resolve(e.data.result);
    } else {
      entry.reject(new Error(e.data.error ?? "worker parse failed"));
    }
  };
  w.onerror = () => tearDown("parse worker crashed");
  worker = w;
  return w;
}

/** Resolve the WASM asset URL on the main thread to pass into the worker. */
function resolveWasmUrl(): string | undefined {
  const override = (globalThis as Record<string, unknown>).__MEGANE_WASM_URL__;
  if (typeof override === "string") return override;
  return wasmAssetUrl as unknown as string;
}

function send<T extends StructureParseResult | XTCParseResult>(
  req: ParseRequest,
  transfer: Transferable[],
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const w = getWorker();
    const timer = setTimeout(() => {
      pending.delete(req.id);
      reject(new Error(`parse worker timed out after ${TIMEOUT_MS}ms`));
    }, TIMEOUT_MS);
    pending.set(req.id, {
      resolve: resolve as Pending["resolve"],
      reject,
      timer,
    });
    w.postMessage(req, transfer);
  });
}

export async function parseStructureFile(file: File): Promise<StructureParseResult> {
  if (workerUnavailable()) return sync.parseStructureFile(file);

  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? ".pdb";
  const tag = `${file.name.replace(/[^A-Za-z0-9._-]/g, "_")}-${Date.now()}`;
  perfMark(`megane:parse:start:${tag}`);
  try {
    const id = nextId++;
    let req: ParseRequest;
    const transfer: Transferable[] = [];
    if (ext === ".traj") {
      const buffer = await file.arrayBuffer();
      req = { id, op: "structure", wasmUrl: resolveWasmUrl(), ext, bytes: buffer };
      transfer.push(buffer);
    } else {
      const text = await file.text();
      req = { id, op: "structure", wasmUrl: resolveWasmUrl(), ext, text };
    }
    const result = await send<StructureParseResult>(req, transfer);
    perfMark(`megane:parse:end:${tag}`);
    perfMeasure(`megane:parse:${tag}`, `megane:parse:start:${tag}`, `megane:parse:end:${tag}`);
    return result;
  } catch {
    tearDown("falling back to synchronous parse");
    return sync.parseStructureFile(file);
  }
}

export async function parseStructureText(
  text: string,
  fileName?: string,
): Promise<StructureParseResult> {
  if (workerUnavailable()) return sync.parseStructureText(text, fileName);
  const ext = fileName ? (fileName.toLowerCase().match(/\.[^.]+$/)?.[0] ?? ".pdb") : ".pdb";
  try {
    const id = nextId++;
    const req: ParseRequest = { id, op: "structure", wasmUrl: resolveWasmUrl(), ext, text };
    return await send<StructureParseResult>(req, []);
  } catch {
    tearDown("falling back to synchronous parse");
    return sync.parseStructureText(text, fileName);
  }
}

async function parseTrajectoryFile(
  kind: TrajectoryKind,
  file: File,
  expectedNAtoms: number,
  syncFn: (f: File, n: number) => Promise<XTCParseResult>,
): Promise<XTCParseResult> {
  if (workerUnavailable()) return syncFn(file, expectedNAtoms);
  try {
    const id = nextId++;
    let req: ParseRequest;
    const transfer: Transferable[] = [];
    if (kind === "lammpstrj") {
      const text = await file.text();
      req = { id, op: "trajectory", wasmUrl: resolveWasmUrl(), kind, text, expectedNAtoms };
    } else {
      const buffer = await file.arrayBuffer();
      req = {
        id,
        op: "trajectory",
        wasmUrl: resolveWasmUrl(),
        kind,
        bytes: buffer,
        expectedNAtoms,
      };
      transfer.push(buffer);
    }
    return await send<XTCParseResult>(req, transfer);
  } catch {
    tearDown("falling back to synchronous parse");
    return syncFn(file, expectedNAtoms);
  }
}

export function parseXTCFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  return parseTrajectoryFile("xtc", file, expectedNAtoms, sync.parseXTCFile);
}

export function parseDCDFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  return parseTrajectoryFile("dcd", file, expectedNAtoms, sync.parseDCDFile);
}

export function parseLammpstrjFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  return parseTrajectoryFile("lammpstrj", file, expectedNAtoms, sync.parseLammpstrjFile);
}

export function parseNetCDFFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  return parseTrajectoryFile("netcdf", file, expectedNAtoms, sync.parseNetCDFFile);
}

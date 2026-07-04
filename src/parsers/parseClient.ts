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
import type {
  StructureParseResult,
  XTCParseResult,
  TrajectoryKind,
  TrajectoryIndexResult,
  LazyTrajectoryKind,
  LazyStructureKind,
  StructureIndexResult,
} from "./parseCore";
import type { ParseRequest, ParseResponse, DecodeFrameResult } from "./parseMessages";

const TIMEOUT_MS = 120_000;

let worker: Worker | null = null;
let workerBroken = false;
let nextId = 0;
let nextTrajId = 0;

interface Pending {
  resolve: (r: unknown) => void;
  reject: (e: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}
const pending = new Map<number, Pending>();

function workerUnavailable(): boolean {
  return workerBroken || typeof Worker === "undefined";
}

// Below this file size, eager decode is fast enough that streaming would only
// add per-frame worker overhead (and slightly slower playback) for no benefit —
// so lazy decode only kicks in for genuinely large trajectories, where decoding
// every frame up-front is the actual bottleneck.
const LAZY_XTC_MIN_BYTES = 8 * 1024 * 1024;

/**
 * Shared gate for lazy/streaming decode. Requires a worker. A
 * `globalThis.__MEGANE_LAZY_XTC__` boolean override forces lazy on/off
 * (bypassing the size gate — used by tests and as a kill switch); otherwise
 * lazy is used only for files at or above {@link LAZY_XTC_MIN_BYTES}.
 */
function shouldUseLazy(fileSize: number): boolean {
  if (workerUnavailable()) return false;
  const override = (globalThis as Record<string, unknown>).__MEGANE_LAZY_XTC__;
  if (typeof override === "boolean") return override;
  return fileSize >= LAZY_XTC_MIN_BYTES;
}

/** Whether to stream a given trajectory file lazily (XTC / LAMMPS dump). */
export function shouldUseLazyTrajectory(_kind: LazyTrajectoryKind, fileSize: number): boolean {
  return shouldUseLazy(fileSize);
}

/** Whether to lazily decode a multi-frame structure file's extra frames (XYZ). */
export function shouldUseLazyStructure(_kind: LazyStructureKind, fileSize: number): boolean {
  return shouldUseLazy(fileSize);
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
    if (e.data.ok) {
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

function send<T>(req: ParseRequest, transfer: Transferable[]): Promise<T> {
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

/** Handle returned by `indexTrajectoryLazy`, consumed by `LazyFrameProvider`. */
export interface TrajectoryLazyHandle {
  trajectoryId: number;
  kind: LazyTrajectoryKind;
  index: TrajectoryIndexResult;
}

/** One lazily-decoded frame: positions plus any embedded vector channels. */
export interface DecodedLazyFrame {
  positions: Float32Array;
  /** Concatenated per-atom vector channels for this frame (empty if none). */
  vectors: Float32Array;
  vectorChannelCount: number;
}

/**
 * Build a lazy trajectory decoder in the worker: reads the file, scans its
 * frame index (no coordinate decode), and keeps the bytes resident in the
 * worker so frames can be decoded on demand via {@link decodeTrajectoryFrame}.
 * Returns `null` — the single uniform "fall back to eager parse" signal — when
 * the worker is unavailable (incl. the `parseClientSync` build) or indexing fails.
 */
export async function indexTrajectoryLazy(
  file: File,
  kind: LazyTrajectoryKind,
  expectedNAtoms: number,
): Promise<TrajectoryLazyHandle | null> {
  if (workerUnavailable()) return null;
  try {
    const id = nextId++;
    const trajectoryId = nextTrajId++;
    const buffer = await file.arrayBuffer();
    const index = await send<TrajectoryIndexResult>(
      {
        id,
        op: "indexTrajectory",
        wasmUrl: resolveWasmUrl(),
        kind,
        trajectoryId,
        bytes: buffer,
        expectedNAtoms,
      },
      [buffer],
    );
    return { trajectoryId, kind, index };
  } catch {
    // Any failure ⇒ let the caller fall back to eager parsing.
    return null;
  }
}

/** Decode one frame (positions + any vectors) of a previously-indexed trajectory. */
export async function decodeTrajectoryFrame(
  trajectoryId: number,
  frame: number,
): Promise<DecodedLazyFrame> {
  const id = nextId++;
  const result = await send<DecodeFrameResult>({ id, op: "decodeFrame", trajectoryId, frame }, []);
  return {
    positions: result.positions,
    vectors: result.vectors,
    vectorChannelCount: result.vectorChannelCount,
  };
}

/** Free a lazy trajectory decoder in the worker (fire-and-forget). */
export function disposeTrajectoryLazy(trajectoryId: number): void {
  if (workerUnavailable()) return;
  const id = nextId++;
  void send<undefined>({ id, op: "disposeTrajectory", trajectoryId }, []).catch(() => {
    // best-effort cleanup; worker teardown already frees everything
  });
}

// ── Lazy multi-frame structure files (XYZ) ──────────────────────────────
//
// Structure files carry frame 0 as the eager snapshot and frames 1..N as
// "extra" frames. Frame 0 is parsed eagerly (topology + coordinates) via
// `parseStructureFrame0`; the extra frames are decoded on demand from a
// persistent worker decoder built by `indexStructureLazy`. The decoder shares
// the trajectory decoder map, so `decodeTrajectoryFrame` / `disposeTrajectoryLazy`
// service structure frames too.

/** Handle returned by `indexStructureLazy`, consumed by `LazyFrameProvider`. */
export interface StructureLazyHandle {
  trajectoryId: number;
  kind: LazyStructureKind;
  index: StructureIndexResult;
}

/**
 * Parse only frame 0 of a multi-frame structure file into a snapshot (topology +
 * frame-0 coordinates, no extra frames). Returns `null` when the worker is
 * unavailable or the parse fails — the caller then falls back to eager parsing.
 */
export async function parseStructureFrame0(
  file: File,
  ext: string,
): Promise<StructureParseResult | null> {
  if (workerUnavailable()) return null;
  try {
    const id = nextId++;
    const text = await file.text();
    const req: ParseRequest = { id, op: "structureFrame0", wasmUrl: resolveWasmUrl(), ext, text };
    return await send<StructureParseResult>(req, []);
  } catch {
    return null;
  }
}

/**
 * Build a lazy structure-frame decoder in the worker: scans the extra-frame
 * index (no coordinate decode) and keeps the bytes resident so frames stream in
 * on demand via {@link decodeTrajectoryFrame}. Returns `null` (fall back to
 * eager parse) when the worker is unavailable or indexing fails.
 */
export async function indexStructureLazy(
  file: File,
  kind: LazyStructureKind,
): Promise<StructureLazyHandle | null> {
  if (workerUnavailable()) return null;
  try {
    const id = nextId++;
    const trajectoryId = nextTrajId++;
    const buffer = await file.arrayBuffer();
    const index = await send<StructureIndexResult>(
      { id, op: "indexStructure", wasmUrl: resolveWasmUrl(), kind, trajectoryId, bytes: buffer },
      [buffer],
    );
    return { trajectoryId, kind, index };
  } catch {
    return null;
  }
}

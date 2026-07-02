/**
 * Synchronous, main-thread parse client.
 *
 * Reads the File on the main thread and calls `parseCore` directly — no Web
 * Worker. This is BOTH:
 *   1. the runtime fallback used by `parseClient.ts` when a worker cannot be
 *      created or errors/times out, and
 *   2. the build-time replacement for `parseClient.ts` on hosts whose bundler
 *      cannot handle a worker import (JupyterLab/webpack via
 *      `NormalModuleReplacementPlugin`, anywidget via a `resolve.alias`).
 *
 * It exposes exactly the same function signatures as `parseClient.ts` and the
 * original `structure.ts` / `xtc.ts`, so callers never change.
 */

import { perfMark, perfMeasure } from "../perf";
import {
  ensureInit,
  parseStructureCore,
  parseTrajectoryCore,
  type StructureParseResult,
  type XTCParseResult,
} from "./parseCore";

function extOf(name: string, fallback: string): string {
  return name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? fallback;
}

export async function parseStructureFile(file: File): Promise<StructureParseResult> {
  await ensureInit();
  const ext = extOf(file.name, ".pdb");
  const tag = `${file.name.replace(/[^A-Za-z0-9._-]/g, "_")}-${Date.now()}`;
  perfMark(`megane:parse:start:${tag}`);

  let parseResult: StructureParseResult;
  if (ext === ".traj") {
    const buffer = await file.arrayBuffer();
    parseResult = parseStructureCore({ ext, bytes: new Uint8Array(buffer) });
  } else {
    const text = await file.text();
    parseResult = parseStructureCore({ ext, text });
  }

  perfMark(`megane:parse:end:${tag}`);
  perfMeasure(`megane:parse:${tag}`, `megane:parse:start:${tag}`, `megane:parse:end:${tag}`);
  return parseResult;
}

export async function parseStructureText(
  text: string,
  fileName?: string,
): Promise<StructureParseResult> {
  await ensureInit();
  const ext = fileName ? extOf(fileName, ".pdb") : ".pdb";
  return parseStructureCore({ ext, text });
}

export async function parseXTCFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  await ensureInit();
  const buffer = await file.arrayBuffer();
  return parseTrajectoryCore({ kind: "xtc", bytes: new Uint8Array(buffer), expectedNAtoms });
}

export async function parseDCDFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  await ensureInit();
  const buffer = await file.arrayBuffer();
  return parseTrajectoryCore({ kind: "dcd", bytes: new Uint8Array(buffer), expectedNAtoms });
}

export async function parseLammpstrjFile(
  file: File,
  expectedNAtoms: number,
): Promise<XTCParseResult> {
  await ensureInit();
  const text = await file.text();
  return parseTrajectoryCore({ kind: "lammpstrj", text, expectedNAtoms });
}

export async function parseNetCDFFile(file: File, expectedNAtoms: number): Promise<XTCParseResult> {
  await ensureInit();
  const buffer = await file.arrayBuffer();
  return parseTrajectoryCore({ kind: "netcdf", bytes: new Uint8Array(buffer), expectedNAtoms });
}

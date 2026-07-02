/**
 * Message protocol shared between `parseClient.ts` (main thread) and
 * `parse.worker.ts` (Web Worker).
 */

import type { StructureParseResult, XTCParseResult, TrajectoryKind } from "./parseCore";

/** Request: parse a structure file's already-read contents. */
export interface StructureParseRequest {
  id: number;
  op: "structure";
  wasmUrl: string | undefined;
  ext: string;
  text?: string;
  bytes?: ArrayBuffer;
}

/** Request: parse a trajectory file's already-read contents. */
export interface TrajectoryParseRequest {
  id: number;
  op: "trajectory";
  wasmUrl: string | undefined;
  kind: TrajectoryKind;
  text?: string;
  bytes?: ArrayBuffer;
  expectedNAtoms: number;
}

export type ParseRequest = StructureParseRequest | TrajectoryParseRequest;

export interface ParseResponse {
  id: number;
  ok: boolean;
  op: "structure" | "trajectory";
  result?: StructureParseResult | XTCParseResult;
  error?: string;
}

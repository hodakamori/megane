/**
 * Message protocol shared between `parseClient.ts` (main thread) and
 * `parse.worker.ts` (Web Worker).
 */

import type {
  StructureParseResult,
  XTCParseResult,
  TrajectoryKind,
  XtcIndexResult,
} from "./parseCore";

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

/** Request: build a lazy XTC decoder (scans the index, holds bytes in the worker). */
export interface IndexTrajectoryRequest {
  id: number;
  op: "indexTrajectory";
  wasmUrl: string | undefined;
  trajectoryId: number;
  bytes: ArrayBuffer;
  expectedNAtoms: number;
}

/** Request: decode a single frame from a previously-indexed trajectory. */
export interface DecodeFrameRequest {
  id: number;
  op: "decodeFrame";
  trajectoryId: number;
  frame: number;
}

/** Request: free a lazy XTC decoder and its retained bytes. */
export interface DisposeTrajectoryRequest {
  id: number;
  op: "disposeTrajectory";
  trajectoryId: number;
}

export type ParseRequest =
  | StructureParseRequest
  | TrajectoryParseRequest
  | IndexTrajectoryRequest
  | DecodeFrameRequest
  | DisposeTrajectoryRequest;

/** Response payload for a `decodeFrame` request: one frame's positions. */
export interface DecodeFrameResult {
  frame: number;
  positions: Float32Array;
}

export interface ParseResponse {
  id: number;
  ok: boolean;
  op: "structure" | "trajectory" | "indexTrajectory" | "decodeFrame" | "disposeTrajectory";
  result?: StructureParseResult | XTCParseResult | XtcIndexResult | DecodeFrameResult;
  error?: string;
}

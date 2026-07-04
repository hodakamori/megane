/**
 * Message protocol shared between `parseClient.ts` (main thread) and
 * `parse.worker.ts` (Web Worker).
 */

import type {
  StructureParseResult,
  XTCParseResult,
  TrajectoryKind,
  TrajectoryIndexResult,
  LazyTrajectoryKind,
  LazyStructureKind,
  StructureIndexResult,
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

/** Request: build a lazy trajectory decoder (scans the index, holds bytes in the worker). */
export interface IndexTrajectoryRequest {
  id: number;
  op: "indexTrajectory";
  wasmUrl: string | undefined;
  kind: LazyTrajectoryKind;
  trajectoryId: number;
  bytes: ArrayBuffer;
  expectedNAtoms: number;
}

/** Request: parse only frame 0 of a multi-frame structure file (XYZ) into a snapshot. */
export interface StructureFrame0Request {
  id: number;
  op: "structureFrame0";
  wasmUrl: string | undefined;
  ext: string;
  text?: string;
  bytes?: ArrayBuffer;
}

/** Request: build a lazy structure-frame decoder (scans extra frames, holds bytes in the worker). */
export interface IndexStructureRequest {
  id: number;
  op: "indexStructure";
  wasmUrl: string | undefined;
  kind: LazyStructureKind;
  /** Reuses the trajectory decoder map, so `decodeFrame` / `disposeTrajectory` apply. */
  trajectoryId: number;
  bytes: ArrayBuffer;
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
  | StructureFrame0Request
  | IndexStructureRequest
  | IndexTrajectoryRequest
  | DecodeFrameRequest
  | DisposeTrajectoryRequest;

/** Response payload for a `decodeFrame` request: one frame's positions (+ vectors). */
export interface DecodeFrameResult {
  frame: number;
  positions: Float32Array;
  /** Embedded vector channels for this frame, concatenated (empty if none). */
  vectors: Float32Array;
  /** Number of vector channels packed into `vectors`. */
  vectorChannelCount: number;
}

export interface ParseResponse {
  id: number;
  ok: boolean;
  op:
    | "structure"
    | "trajectory"
    | "structureFrame0"
    | "indexStructure"
    | "indexTrajectory"
    | "decodeFrame"
    | "disposeTrajectory";
  result?:
    | StructureParseResult
    | XTCParseResult
    | TrajectoryIndexResult
    | StructureIndexResult
    | DecodeFrameResult;
  error?: string;
}

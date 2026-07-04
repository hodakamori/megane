/**
 * Trajectory parser entry points (XTC, DCD, LAMMPS dump, AMBER NetCDF).
 *
 * Thin facade: the heavy parse runs off the main thread via `parseClient`
 * (Web Worker, with a synchronous fallback). Signatures are unchanged so
 * callers and `openFile.ts` are untouched.
 */

export type { XTCParseResult, LazyTrajectoryKind } from "./parseCore";
export { parseXTCFile, parseDCDFile, parseLammpstrjFile, parseNetCDFFile } from "./parseClient";
export {
  indexTrajectoryLazy,
  decodeTrajectoryFrame0,
  decodeTrajectoryFrame,
  disposeTrajectoryLazy,
  shouldUseLazyTrajectory,
  type TrajectoryLazyHandle,
  type DecodedLazyFrame,
} from "./parseClient";

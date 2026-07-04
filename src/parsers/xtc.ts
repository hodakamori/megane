/**
 * Trajectory parser entry points (XTC, DCD, LAMMPS dump, AMBER NetCDF).
 *
 * Thin facade: the heavy parse runs off the main thread via `parseClient`
 * (Web Worker, with a synchronous fallback). Signatures are unchanged so
 * callers and `openFile.ts` are untouched.
 */

export type { XTCParseResult } from "./parseCore";
export { parseXTCFile, parseDCDFile, parseLammpstrjFile, parseNetCDFFile } from "./parseClient";
export {
  indexXTCFile,
  decodeXTCFrame,
  disposeXTCTrajectory,
  type XtcLazyHandle,
} from "./parseClient";

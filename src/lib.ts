/**
 * megane - Public library exports.
 * Use these to embed megane in your own React application.
 */

// React components
export { MeganeViewer } from "./components/MeganeViewer";
export { Viewport } from "./components/Viewport";
export { Toolbar } from "./components/Toolbar";
export { Timeline } from "./components/Timeline";

// Core renderer (framework-agnostic)
export { MoleculeRenderer } from "./core/MoleculeRenderer";

// Worker pool for off-main-thread decoding
export { WorkerPool } from "./core/WorkerPool";

// Protocol
export {
  decodeSnapshot,
  decodeFrame,
  decodeMetadata,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
  MSG_METADATA,
} from "./core/protocol";

// Types
export type {
  Snapshot,
  Frame,
  TrajectoryMeta,
  AtomRenderer,
  BondRenderer,
  HoverInfo,
  AtomHoverInfo,
  BondHoverInfo,
  SelectionState,
  Measurement,
} from "./core/types";

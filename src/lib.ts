/**
 * megane - Public library exports.
 * Use these to embed megane in your own React application.
 */

// React components
export { MeganeViewer } from "./components/MeganeViewer";
export { Viewport } from "./components/Viewport";
export { Sidebar } from "./components/Sidebar";
export { Timeline } from "./components/Timeline";

// Sidebar config types
export type { BondConfig, TrajectoryConfig } from "./components/Sidebar";

// Appearance panel & config types (legacy, kept for widget compatibility)
export { AppearancePanel } from "./components/AppearancePanel";
export type { LabelConfig, VectorConfig } from "./components/AppearancePanel";

// Pipeline
export { PipelineEditor } from "./components/PipelineEditor";
export { usePipelineStore } from "./pipeline/store";
export { executePipeline } from "./pipeline/execute";
export { applyRenderState } from "./pipeline/apply";
export { serializePipeline, deserializePipeline } from "./pipeline/serialize";
export type {
  PipelineNodeType,
  PipelineNodeParams,
  RenderState,
  SerializedPipeline,
} from "./pipeline/types";

// Structure parsers
export { parseStructureFile, parseStructureText } from "./parsers/structure";
export type { StructureParseResult } from "./parsers/structure";

// Core renderer (framework-agnostic)
export { MoleculeRenderer } from "./renderer/MoleculeRenderer";

// Worker pool for off-main-thread decoding
export { WorkerPool } from "./protocol/WorkerPool";

// Protocol
export {
  decodeSnapshot,
  decodeFrame,
  decodeMetadata,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
  MSG_METADATA,
} from "./protocol/protocol";

// Types
export type {
  Snapshot,
  Frame,
  TrajectoryMeta,
  BondSource,
  TrajectorySource,
  AtomRenderer,
  BondRenderer,
  HoverInfo,
  AtomHoverInfo,
  BondHoverInfo,
  SelectionState,
  Measurement,
} from "./types";

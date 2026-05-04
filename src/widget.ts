/**
 * anywidget entry point.
 * Bridges the Python widget model to the WidgetViewer React component.
 *
 * Handles deferred initialization: Jupyter widget output areas may have
 * zero dimensions when the render function is first called.  We use a
 * ResizeObserver to wait until the container is laid out before mounting React.
 */

import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { WidgetViewer } from "./components/WidgetViewer";
import { perfMark, perfMeasure } from "./perf";
import { useThemeStore } from "./stores/useThemeStore";
import {
  decodeSnapshot,
  decodeFrame,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
} from "./protocol/protocol";
import type { Snapshot, Frame, Measurement } from "./types";
import type { MeganeCameraState } from "./renderer/MoleculeRenderer";
// Accepted structure extensions — mirrors WIDGET_STRUCTURE_EXTS in WidgetViewer.tsx.
// Kept here as a plain constant so the WASM module is never imported statically.
const WIDGET_STRUCTURE_EXTS = [
  ".pdb",
  ".gro",
  ".xyz",
  ".mol",
  ".sdf",
  ".mol2",
  ".cif",
  ".data",
  ".lammps",
  ".traj",
];

interface AnyWidgetModel {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  save_changes(): void;
  on(event: string, callback: () => void): void;
}

function render({ model, el }: { model: AnyWidgetModel; el: HTMLElement }) {
  perfMark("megane:widget:start");
  // Container setup
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "500px";
  container.style.position = "relative";
  container.style.background = "var(--megane-bg, #ffffff)";
  container.style.borderRadius = "8px";
  container.style.overflow = "hidden";
  el.appendChild(container);

  // Apply initial theme to document root (system preference detection)
  const { resolvedTheme, _syncSystemTheme } = useThemeStore.getState();
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  const mq =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
  mq?.addEventListener("change", _syncSystemTheme);

  let root: Root | null = null;
  let currentSnapshot: Snapshot | null = null;
  let currentFrame: Frame | null = null;
  let disposed = false;

  // Client-side trajectory loaded via the in-widget file picker.
  // Seeking is handled locally without a Python round-trip.
  let localFrames: Frame[] = [];
  let localFrameIndex: number = 0;

  function parseSnapshot(): Snapshot | null {
    const data = model.get("_snapshot_data") as DataView | null;
    if (!data || data.byteLength === 0) return null;
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    const { msgType } = decodeHeader(buffer);
    if (msgType === MSG_SNAPSHOT) {
      return decodeSnapshot(buffer);
    }
    return null;
  }

  function parseFrame(): Frame | null {
    const data = model.get("_frame_data") as DataView | null;
    if (!data || data.byteLength === 0) return null;
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    const { msgType } = decodeHeader(buffer);
    if (msgType === MSG_FRAME) {
      return decodeFrame(buffer);
    }
    return null;
  }

  function handleSeek(frame: number) {
    if (localFrames.length > 0) {
      // Local trajectory from file picker — seek without Python round-trip.
      const total = localFrames.length + 1; // +1: frame 0 uses snapshot positions
      const target = frame === -1 ? (localFrameIndex + 1) % total : frame;
      localFrameIndex = target;
      // Frame 0 → snapshot positions (currentFrame = null); subsequent frames
      // → the corresponding localFrames entry.
      currentFrame = target === 0 ? null : localFrames[target - 1];
      renderApp();
      return;
    }
    const totalFrames = (model.get("total_frames") as number) || 0;
    if (frame === -1) {
      // "next frame" signal from playback
      const current = (model.get("frame_index") as number) || 0;
      const next = (current + 1) % totalFrames;
      model.set("frame_index", next);
    } else {
      model.set("frame_index", frame);
    }
    model.save_changes();
  }

  async function handleFilePick(file: File): Promise<void> {
    const lower = file.name.toLowerCase();
    if (!WIDGET_STRUCTURE_EXTS.some((ext) => lower.endsWith(ext))) {
      throw new Error(`Unsupported format: ${file.name}`);
    }
    // Dynamic import so the WASM bundle is only fetched when the user actually
    // picks a file, keeping the widget startup cost unchanged.
    const { parseStructureFile } = await import("./parsers/structure");
    const result = await parseStructureFile(file);
    currentSnapshot = result.snapshot;
    currentFrame = null;
    localFrames = result.frames;
    localFrameIndex = 0;
    // Notify Python so it can fire the "file_load" event.
    model.set("_uploaded_file_name", file.name);
    model.save_changes();
    renderApp();
  }

  function handleMeasurementChange(measurement: Measurement | null) {
    const json = measurement ? JSON.stringify(measurement) : "";
    model.set("_measurement_json", json);
    model.save_changes();
  }

  function handlePipelineChange(json: string) {
    model.set("_pipeline_json", json);
    model.save_changes();
  }

  function handleCameraStateChange(state: MeganeCameraState) {
    model.set("camera_state", state);
    model.save_changes();
  }

  function getInitialCameraState(): MeganeCameraState | null {
    const saved = model.get("camera_state") as Record<string, unknown> | null;
    if (
      saved &&
      typeof saved.mode === "string" &&
      Array.isArray(saved.position) &&
      Array.isArray(saved.target) &&
      typeof saved.zoom === "number"
    ) {
      return saved as unknown as MeganeCameraState;
    }
    return null;
  }

  function renderApp() {
    if (!root || disposed) return;
    const frameIndex =
      localFrames.length > 0 ? localFrameIndex : (model.get("frame_index") as number) || 0;
    const totalFrames =
      localFrames.length > 0 ? localFrames.length + 1 : (model.get("total_frames") as number) || 0;
    const selectedAtoms = (model.get("selected_atoms") as number[]) || [];
    const pipelineJson = (model.get("_pipeline_json") as string) || "";
    const nodeSnapshotsData = (model.get("_node_snapshots_data") as Record<string, DataView>) || {};

    root.render(
      createElement(WidgetViewer, {
        snapshot: currentSnapshot,
        frame: currentFrame,
        currentFrame: frameIndex,
        totalFrames: totalFrames,
        onSeek: handleSeek,
        selectedAtoms: selectedAtoms,
        onMeasurementChange: handleMeasurementChange,
        pipelineJson: pipelineJson,
        nodeSnapshotsData: nodeSnapshotsData,
        onPipelineChange: handlePipelineChange,
        initialCameraState: getInitialCameraState(),
        onCameraStateChange: handleCameraStateChange,
        onFilePick: handleFilePick,
      }),
    );
  }

  function initApp(): boolean {
    if (root || disposed) return !!root;
    if (container.clientWidth === 0 || container.clientHeight === 0) return false;

    root = createRoot(container);
    currentSnapshot = parseSnapshot();
    currentFrame = parseFrame();
    renderApp();
    perfMark("megane:widget:end");
    perfMeasure("megane:widget-mount", "megane:widget:start", "megane:widget:end");
    return true;
  }

  // Defer initialization until the container has real dimensions.
  const ro = new ResizeObserver(() => {
    if (!root && !disposed) initApp();
  });
  ro.observe(container);
  initApp();

  // React to model changes
  model.on("change:_snapshot_data", () => {
    currentSnapshot = parseSnapshot();
    if (root) renderApp();
    else initApp();
  });

  model.on("change:_frame_data", () => {
    currentFrame = parseFrame();
    renderApp();
  });

  model.on("change:frame_index", () => {
    renderApp();
  });

  model.on("change:total_frames", () => {
    renderApp();
  });

  model.on("change:selected_atoms", () => {
    renderApp();
  });

  model.on("change:_node_snapshots_data", () => {
    renderApp();
  });

  model.on("change:_pipeline_json", () => {
    renderApp();
  });

  // Cleanup
  return () => {
    disposed = true;
    ro.disconnect();
    mq?.removeEventListener("change", _syncSystemTheme);
    root?.unmount();
    root = null;
  };
}

export default { render };

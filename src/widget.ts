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

  // Drag-and-drop overlay for file loading
  const dropOverlay = document.createElement("div");
  dropOverlay.style.cssText = [
    "position:absolute",
    "inset:0",
    "display:none",
    "align-items:center",
    "justify-content:center",
    "background:rgba(59,130,246,0.12)",
    "border:2px dashed #3b82f6",
    "border-radius:8px",
    "pointer-events:none",
    "font-size:1rem",
    "font-weight:600",
    "color:#3b82f6",
    "z-index:10",
  ].join(";");
  dropOverlay.textContent = "Drop structure file to load";
  container.appendChild(dropOverlay);

  function showDropOverlay(): void {
    dropOverlay.style.display = "flex";
  }
  function hideDropOverlay(): void {
    dropOverlay.style.display = "none";
  }

  container.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showDropOverlay();
  });

  container.addEventListener("dragleave", (e: DragEvent) => {
    if (!container.contains(e.relatedTarget as Node | null)) {
      hideDropOverlay();
    }
  });

  container.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    hideDropOverlay();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl !== "string") return;
      const b64 = dataUrl.split(",")[1];
      if (!b64) return;
      model.set("_drop_file_name", file.name);
      model.set("_drop_file_b64", b64);
      model.save_changes();
    };
    reader.readAsDataURL(file);
  });

  let root: Root | null = null;
  let currentSnapshot: Snapshot | null = null;
  let currentFrame: Frame | null = null;
  let disposed = false;

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
    const frameIndex = (model.get("frame_index") as number) || 0;
    const totalFrames = (model.get("total_frames") as number) || 0;
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

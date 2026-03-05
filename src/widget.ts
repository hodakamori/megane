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
import {
  decodeSnapshot,
  decodeFrame,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
} from "./core/protocol";
import type { Snapshot, Frame, Measurement } from "./core/types";

interface AnyWidgetModel {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  save_changes(): void;
  on(event: string, callback: () => void): void;
}

function render({ model, el }: { model: AnyWidgetModel; el: HTMLElement }) {
  // Container setup
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "500px";
  container.style.position = "relative";
  container.style.background = "#ffffff";
  container.style.borderRadius = "8px";
  container.style.overflow = "hidden";
  el.appendChild(container);

  let root: Root | null = null;
  let currentSnapshot: Snapshot | null = null;
  let currentFrame: Frame | null = null;
  let disposed = false;

  function parseSnapshot(): Snapshot | null {
    const data = model.get("_snapshot_data") as DataView | null;
    if (!data || data.byteLength === 0) return null;
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(
      new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
    );
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
    new Uint8Array(buffer).set(
      new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
    );
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

  function renderApp() {
    if (!root || disposed) return;
    const frameIndex = (model.get("frame_index") as number) || 0;
    const totalFrames = (model.get("total_frames") as number) || 0;
    const selectedAtoms = (model.get("selected_atoms") as number[]) || [];

    root.render(
      createElement(WidgetViewer, {
        snapshot: currentSnapshot,
        frame: currentFrame,
        currentFrame: frameIndex,
        totalFrames: totalFrames,
        onSeek: handleSeek,
        selectedAtoms: selectedAtoms,
        onMeasurementChange: handleMeasurementChange,
      }),
    );
  }

  function initApp(): boolean {
    if (root || disposed) return !!root;
    if (container.clientWidth === 0 || container.clientHeight === 0)
      return false;

    root = createRoot(container);
    currentSnapshot = parseSnapshot();
    currentFrame = parseFrame();
    renderApp();
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

  // Cleanup
  return () => {
    disposed = true;
    ro.disconnect();
    root?.unmount();
    root = null;
  };
}

export default { render };

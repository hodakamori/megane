/**
 * anywidget entry point.
 * Bridges the Python widget model to the MoleculeRenderer core.
 */

import { MoleculeRenderer } from "./core/MoleculeRenderer";
import { decodeSnapshot, decodeFrame, decodeHeader, MSG_SNAPSHOT, MSG_FRAME } from "./core/protocol";
import type { Snapshot } from "./core/types";

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

  // Info overlay
  const info = document.createElement("div");
  info.style.cssText =
    "position:absolute;top:8px;left:8px;background:rgba(255,255,255,0.85);backdrop-filter:blur(8px);border-radius:6px;padding:4px 12px;font:13px system-ui;color:#495057;z-index:10;";
  info.innerHTML = '<strong>megane</strong>';
  container.appendChild(info);

  // Renderer
  const renderer = new MoleculeRenderer();
  renderer.mount(container);

  let currentSnapshot: Snapshot | null = null;

  function loadSnapshot() {
    const data = model.get("_snapshot_data") as DataView | null;
    if (!data || data.byteLength === 0) return;

    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    const { msgType } = decodeHeader(buffer);
    if (msgType === MSG_SNAPSHOT) {
      currentSnapshot = decodeSnapshot(buffer);
      renderer.loadSnapshot(currentSnapshot);
      info.innerHTML = `<strong>megane</strong> &nbsp; ${currentSnapshot.nAtoms.toLocaleString()} atoms / ${currentSnapshot.nBonds.toLocaleString()} bonds`;
    }
  }

  function loadFrame() {
    const data = model.get("_frame_data") as DataView | null;
    if (!data || data.byteLength === 0 || !currentSnapshot) return;

    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    const { msgType } = decodeHeader(buffer);
    if (msgType === MSG_FRAME) {
      const frame = decodeFrame(buffer);
      renderer.updateFrame(frame);
    }
  }

  // Load initial data
  loadSnapshot();

  // React to model changes
  model.on("change:_snapshot_data", loadSnapshot);
  model.on("change:_frame_data", loadFrame);

  // Cleanup
  return () => {
    renderer.dispose();
  };
}

export default { render };

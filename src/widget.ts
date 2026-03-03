/**
 * anywidget entry point.
 * Bridges the Python widget model to the MoleculeRenderer core.
 *
 * Handles deferred initialization: Jupyter widget output areas may have
 * zero dimensions when the render function is first called.  We use a
 * ResizeObserver to wait until the container is laid out before creating
 * the Three.js WebGL context.
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

  let renderer: MoleculeRenderer | null = null;
  let currentSnapshot: Snapshot | null = null;
  let disposed = false;

  function initRenderer(): boolean {
    if (renderer || disposed) return !!renderer;
    if (container.clientWidth === 0 || container.clientHeight === 0) return false;
    try {
      renderer = new MoleculeRenderer();
      renderer.mount(container);
      loadSnapshot();
      return true;
    } catch (e) {
      console.error("megane: failed to initialize renderer", e);
      info.innerHTML = '<strong>megane</strong> &mdash; WebGL not available';
      return false;
    }
  }

  // Defer initialization until the container has real dimensions.
  const ro = new ResizeObserver(() => {
    if (!renderer && !disposed) initRenderer();
  });
  ro.observe(container);
  initRenderer();

  function loadSnapshot() {
    if (!renderer) return;
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
    if (!renderer) return;
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

  // React to model changes
  model.on("change:_snapshot_data", () => { if (renderer) loadSnapshot(); else initRenderer(); });
  model.on("change:_frame_data", loadFrame);

  // Cleanup
  return () => {
    disposed = true;
    ro.disconnect();
    renderer?.dispose();
  };
}

export default { render };

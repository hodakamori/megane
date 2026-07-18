/**
 * Tests for the Selection Inspector interactions wired into the Viewport:
 * live preview highlight, box-select drag, camera-rotation suspension, and
 * click-to-quick-expand. The WebGL MoleculeRenderer is mocked so the DOM event
 * plumbing can be exercised in jsdom.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

const canvas = document.createElement("canvas");

const rendererMock = {
  mount: vi.fn(),
  dispose: vi.fn(),
  getCanvas: () => canvas,
  raycastAtPixel: vi.fn(() => ({ kind: "atom", atomIndex: 5 })),
  getCurrentPositionsCopy: vi.fn(() => new Float32Array([0, 0, 0])),
  setRotationCenter: vi.fn(),
  hitTestAxesInset: vi.fn(() => false),
  isAxesDragging: vi.fn(() => false),
  startAxesDrag: vi.fn(),
  moveAxesDrag: vi.fn(),
  endAxesDrag: vi.fn(),
  loadSnapshot: vi.fn(),
  updateFrame: vi.fn(),
  setLabels: vi.fn(),
  setVectors: vi.fn(),
  setPreviewSelection: vi.fn(),
  setControlsEnabled: vi.fn(),
  selectAtomsInRect: vi.fn(() => [1, 2]),
};

vi.mock("@/renderer/MoleculeRenderer", () => ({
  MoleculeRenderer: function () {
    return rendererMock;
  },
  isMeganeTestMode: () => true,
}));

import { Viewport } from "@/components/Viewport";

function pointer(type: string, x: number, y: number, button = 0) {
  canvas.dispatchEvent(
    new MouseEvent(type, { clientX: x, clientY: y, button, bubbles: true }) as unknown as Event,
  );
}

describe("Viewport — Inspector interactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("pushes the preview selection to the renderer", () => {
    render(<Viewport snapshot={null} frame={null} previewIndices={[3, 4]} />);
    expect(rendererMock.setPreviewSelection).toHaveBeenCalledWith([3, 4]);
    cleanup();
  });

  it("suspends camera controls while box-select is armed", () => {
    render(<Viewport snapshot={null} frame={null} boxSelectActive />);
    expect(rendererMock.setControlsEnabled).toHaveBeenCalledWith(false);
    cleanup();
  });

  it("reports box-selected atom indices on drag release", () => {
    const onBoxSelect = vi.fn();
    render(<Viewport snapshot={null} frame={null} boxSelectActive onBoxSelect={onBoxSelect} />);
    pointer("pointerdown", 10, 10);
    pointer("pointermove", 60, 60);
    pointer("pointerup", 60, 60);
    expect(rendererMock.selectAtomsInRect).toHaveBeenCalled();
    expect(onBoxSelect).toHaveBeenCalledWith([1, 2]);
    // The rubber-band element is cleaned up.
    expect(document.querySelector('[data-testid="viewport-box-select"]')).toBeNull();
    cleanup();
  });

  it("ignores a box drag that is too small (treated as a click)", () => {
    const onBoxSelect = vi.fn();
    render(<Viewport snapshot={null} frame={null} boxSelectActive onBoxSelect={onBoxSelect} />);
    pointer("pointerdown", 10, 10);
    pointer("pointerup", 11, 11);
    expect(onBoxSelect).not.toHaveBeenCalled();
    cleanup();
  });

  it("reports a clicked atom when the Inspector is active", () => {
    const onInspectorPick = vi.fn();
    render(
      <Viewport snapshot={null} frame={null} inspectorActive onInspectorPick={onInspectorPick} />,
    );
    pointer("click", 20, 20);
    expect(onInspectorPick).toHaveBeenCalledWith(5);
    cleanup();
  });

  it("does not quick-pick when the Inspector is inactive", () => {
    const onInspectorPick = vi.fn();
    render(<Viewport snapshot={null} frame={null} onInspectorPick={onInspectorPick} />);
    pointer("click", 20, 20);
    expect(onInspectorPick).not.toHaveBeenCalled();
    cleanup();
  });
});

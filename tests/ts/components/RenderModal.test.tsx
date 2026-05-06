import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import * as React from "react";

// Mock exporters before importing the component
vi.mock("three/examples/jsm/exporters/GLTFExporter.js", () => ({
  GLTFExporter: class {
    parseAsync() {
      return Promise.resolve(new ArrayBuffer(8));
    }
  },
}));

vi.mock("three/examples/jsm/exporters/OBJExporter.js", () => ({
  OBJExporter: class {
    parse() {
      return "# OBJ\n";
    }
  },
}));

// Mock gif.js dynamic import used by captureGif
vi.mock("gif.js", () => ({ default: class {} }));

import { RenderModal } from "@/components/RenderModal";
import type { MoleculeRenderer } from "@/renderer/MoleculeRenderer";

function makeCanvas(w = 800, h = 600): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  // clientWidth/clientHeight are read-only in jsdom; use defineProperty to override.
  Object.defineProperty(canvas, "clientWidth", { value: w, configurable: true });
  Object.defineProperty(canvas, "clientHeight", { value: h, configurable: true });
  return canvas;
}

function makeRendererRef(
  overrides?: Partial<MoleculeRenderer>,
): React.RefObject<MoleculeRenderer | null> {
  const renderer: Partial<MoleculeRenderer> = {
    getScene: vi.fn().mockReturnValue({ background: null }),
    getRenderer: vi.fn().mockReturnValue({
      getClearAlpha: () => 1,
      setClearColor: vi.fn(),
    }),
    getCanvas: vi.fn().mockReturnValue(makeCanvas()),
    getLabelOverlay: vi.fn().mockReturnValue(null),
    resizeForCapture: vi.fn().mockReturnValue(() => undefined),
    renderSingleFrame: vi.fn(),
    ...overrides,
  };
  return { current: renderer as MoleculeRenderer };
}

afterEach(() => {
  cleanup();
});

describe("RenderModal", () => {
  it("renders nothing when open=false", () => {
    render(
      <RenderModal
        open={false}
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    expect(screen.queryByTestId("render-modal")).toBeNull();
  });

  it("renders the modal when open=true", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    expect(screen.getByTestId("render-modal")).toBeTruthy();
  });

  it("shows PNG and EPS format buttons in snapshot mode", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    expect(screen.getByText("PNG")).toBeTruthy();
    expect(screen.getByText("EPS")).toBeTruthy();
  });

  it("shows glTF and OBJ format buttons in snapshot mode", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    expect(screen.getByText("glTF")).toBeTruthy();
    expect(screen.getByText("OBJ")).toBeTruthy();
  });

  it("hides resolution controls when glTF format is selected", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("glTF"));
    expect(screen.queryByText("Resolution")).toBeNull();
  });

  it("hides resolution controls when OBJ format is selected", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("OBJ"));
    expect(screen.queryByText("Resolution")).toBeNull();
  });

  it("shows resolution controls for PNG format (default)", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    expect(screen.getByText("Resolution")).toBeTruthy();
  });

  it("shows 'Export glTF (.glb)' on the button when glTF is selected", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("glTF"));
    expect(screen.getByText("Export glTF (.glb)")).toBeTruthy();
  });

  it("shows 'Export OBJ' on the button when OBJ is selected", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("OBJ"));
    expect(screen.getByText("Export OBJ")).toBeTruthy();
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    render(
      <RenderModal
        open
        onClose={onClose}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId("render-modal-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when the modal panel itself is clicked", () => {
    const onClose = vi.fn();
    render(
      <RenderModal
        open
        onClose={onClose}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId("render-modal"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("restores PNG resolution controls after switching from glTF back to PNG", () => {
    render(
      <RenderModal
        open
        onClose={() => {}}
        rendererRef={makeRendererRef()}
        totalFrames={1}
        currentFrame={0}
        onSeek={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("glTF"));
    expect(screen.queryByText("Resolution")).toBeNull();
    fireEvent.click(screen.getByText("PNG"));
    expect(screen.getByText("Resolution")).toBeTruthy();
  });
});

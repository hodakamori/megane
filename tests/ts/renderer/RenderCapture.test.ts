import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as THREE from "three";

// Mock three.js exporters before importing RenderCapture
vi.mock("three/examples/jsm/exporters/GLTFExporter.js", () => ({
  GLTFExporter: class {
    parseAsync(_scene: unknown, options: { binary?: boolean }) {
      if (options?.binary) {
        return Promise.resolve(new ArrayBuffer(8));
      }
      return Promise.resolve({ asset: { version: "2.0" } });
    }
  },
}));

vi.mock("three/examples/jsm/exporters/OBJExporter.js", () => ({
  OBJExporter: class {
    parse(_scene: unknown) {
      return "# OBJ file\nv 0 0 0\n";
    }
  },
}));

// Mock gif.js so captureGif can run headlessly. The fake GIF records the
// constructor options (so tests can inspect the workerScript) and fires the
// "finished" handler synchronously when render() is called.
const gifInstances: FakeGif[] = [];
class FakeGif {
  options: Record<string, unknown>;
  handlers: Record<string, (arg?: unknown) => void> = {};
  frames: unknown[] = [];
  constructor(options: Record<string, unknown>) {
    this.options = options;
    gifInstances.push(this);
  }
  addFrame(frame: unknown) {
    this.frames.push(frame);
  }
  on(event: string, cb: (arg?: unknown) => void) {
    this.handlers[event] = cb;
  }
  render() {
    this.handlers["finished"]?.(new Blob([new Uint8Array([71, 73, 70])], { type: "image/gif" }));
  }
  abort() {}
}
vi.mock("gif.js", () => ({ default: FakeGif }));

import {
  compositeCanvases,
  downloadBlob,
  captureGltf,
  captureObj,
  wrapInSVG,
  captureSnapshot,
  captureGif,
  resolveGifWorkerScript,
} from "@/renderer/RenderCapture";
import type { MoleculeRenderer } from "@/renderer/MoleculeRenderer";

function makeMockRenderer(scene?: THREE.Scene): MoleculeRenderer {
  const mockScene = scene ?? new THREE.Scene();
  return {
    getScene: () => mockScene,
    getRenderer: () =>
      ({
        getClearAlpha: () => 1,
        setClearColor: vi.fn(),
        info: { memory: {} },
      }) as unknown as THREE.WebGLRenderer,
    getCanvas: () => null,
    getLabelOverlay: () => null,
    resizeForCapture: () => () => undefined,
    renderSingleFrame: vi.fn(),
  } as unknown as MoleculeRenderer;
}

/** Mock canvas 2D context to avoid "Not implemented: getContext" errors in jsdom. */
function mockCanvas2dContext() {
  const ctx = { drawImage: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
  return ctx;
}

describe("compositeCanvases", () => {
  let ctx: { drawImage: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    ctx = mockCanvas2dContext();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an offscreen canvas with the given dimensions", () => {
    const webgl = document.createElement("canvas");
    webgl.width = 100;
    webgl.height = 50;
    const result = compositeCanvases(webgl, null, 100, 50);
    expect(result.width).toBe(100);
    expect(result.height).toBe(50);
  });

  it("draws the webgl canvas onto the offscreen context", () => {
    const webgl = document.createElement("canvas");
    webgl.width = 80;
    webgl.height = 60;
    compositeCanvases(webgl, null, 80, 60);
    expect(ctx.drawImage).toHaveBeenCalledWith(webgl, 0, 0, 80, 60);
  });

  it("also draws the label canvas when provided", () => {
    const webgl = document.createElement("canvas");
    const label = document.createElement("canvas");
    compositeCanvases(webgl, label, 80, 60);
    expect(ctx.drawImage).toHaveBeenCalledTimes(2);
    expect(ctx.drawImage).toHaveBeenCalledWith(label, 0, 0, 80, 60);
  });

  it("skips the label canvas draw when label is null", () => {
    const webgl = document.createElement("canvas");
    compositeCanvases(webgl, null, 80, 60);
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
  });
});

describe("downloadBlob", () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
    revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: revokeObjectURL, configurable: true });
    clickSpy = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(clickSpy);
    // Prevent removeChild errors by mocking both append/remove
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates an object URL and triggers a click", () => {
    const blob = new Blob(["test"], { type: "text/plain" });
    downloadBlob(blob, "test.txt");
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("revokes the object URL after downloading", () => {
    const blob = new Blob(["test"], { type: "text/plain" });
    downloadBlob(blob, "test.txt");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("sets the download attribute to the given filename", () => {
    const capturedNodes: HTMLAnchorElement[] = [];
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => {
      capturedNodes.push(node as HTMLAnchorElement);
      return node;
    });
    const blob = new Blob(["data"], { type: "application/octet-stream" });
    downloadBlob(blob, "megane-render.glb");
    expect(capturedNodes[0].download).toBe("megane-render.glb");
  });
});

describe("captureGltf", () => {
  it("returns a Blob with model/gltf-binary MIME type", async () => {
    const renderer = makeMockRenderer();
    const blob = await captureGltf(renderer);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("model/gltf-binary");
  });

  it("returns a non-empty Blob", async () => {
    const renderer = makeMockRenderer();
    const blob = await captureGltf(renderer);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("uses the scene from the renderer", async () => {
    const scene = new THREE.Scene();
    const renderer = makeMockRenderer(scene);
    const getScene = vi.spyOn(renderer, "getScene");
    await captureGltf(renderer);
    expect(getScene).toHaveBeenCalledOnce();
  });
});

/** Helper to read a Blob as text via FileReader (works in jsdom). */
function readBlobText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

describe("wrapInSVG", () => {
  it("returns a Blob with image/svg+xml MIME type", async () => {
    const png = new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" });
    const result = await wrapInSVG(png, 100, 80);
    expect(result).toBeInstanceOf(Blob);
    expect(result.type).toBe("image/svg+xml");
  });

  it("returns a non-empty Blob", async () => {
    const png = new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" });
    const result = await wrapInSVG(png, 100, 80);
    expect(result.size).toBeGreaterThan(0);
  });

  it("embeds correct width and height in the SVG", async () => {
    const png = new Blob([new Uint8Array([0, 1, 2])], { type: "image/png" });
    const result = await wrapInSVG(png, 320, 240);
    const text = await readBlobText(result);
    expect(text).toContain('width="320"');
    expect(text).toContain('height="240"');
  });

  it("contains an <image> element with a data URI", async () => {
    const png = new Blob([new Uint8Array([0, 1, 2])], { type: "image/png" });
    const result = await wrapInSVG(png, 10, 10);
    const text = await readBlobText(result);
    expect(text).toContain("data:");
    expect(text).toContain("<image");
  });

  it("produces valid SVG XML with correct root element", async () => {
    const png = new Blob([new Uint8Array([0])], { type: "image/png" });
    const result = await wrapInSVG(png, 50, 50);
    const text = await readBlobText(result);
    expect(text).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(text).toContain("</svg>");
  });

  it("includes viewBox matching width and height", async () => {
    const png = new Blob([new Uint8Array([0])], { type: "image/png" });
    const result = await wrapInSVG(png, 400, 300);
    const text = await readBlobText(result);
    expect(text).toContain('viewBox="0 0 400 300"');
  });
});

describe("captureSnapshot (svg format)", () => {
  let restore2d: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const ctx = {
      drawImage: vi.fn(),
      getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(16) }),
    };
    restore2d = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      ctx as unknown as CanvasRenderingContext2D,
    ) as ReturnType<typeof vi.fn>;

    // Mock toBlob to return a minimal PNG blob
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(function (
      this: HTMLCanvasElement,
      callback: BlobCallback,
    ) {
      callback(new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/png" }));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an SVG blob when format is svg", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    const renderer = {
      ...makeMockRenderer(),
      getCanvas: () => canvas,
    } as unknown as MoleculeRenderer;

    const blob = await captureSnapshot(renderer, {
      width: 8,
      height: 8,
      transparent: false,
      format: "svg",
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("image/svg+xml");
  });
});

describe("captureObj", () => {
  it("returns a Blob with text/plain MIME type", () => {
    const renderer = makeMockRenderer();
    const blob = captureObj(renderer);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("text/plain");
  });

  it("returns a non-empty Blob", () => {
    const renderer = makeMockRenderer();
    const blob = captureObj(renderer);
    expect(blob.size).toBeGreaterThan(0);
  });

  it("uses the scene from the renderer", () => {
    const scene = new THREE.Scene();
    const renderer = makeMockRenderer(scene);
    const getScene = vi.spyOn(renderer, "getScene");
    captureObj(renderer);
    expect(getScene).toHaveBeenCalledOnce();
  });
});

// Regression coverage for issue #497: GIF export freezes at 80% in JupyterLab
// because gif.js cannot load its Web Worker from the raw workerScript URL and
// hangs silently during encode. The fix fetches the worker source and hands
// gif.js a same-origin blob: URL instead.
describe("resolveGifWorkerScript (issue #497)", () => {
  let createObjectURL: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createObjectURL = vi.fn().mockReturnValue("blob:gif-worker-url");
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: vi.fn(), configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("fetches the worker script and returns a same-origin blob: URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("self.onmessage = () => {};"),
    });
    vi.stubGlobal("fetch", fetchMock);

    const script = await resolveGifWorkerScript();

    // The bug: the old code passed the raw worker URL straight to gif.js without
    // ever fetching it. A correct implementation must fetch and wrap it.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("gif.worker.js");
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(script).toBe("blob:gif-worker-url");
    expect(script.startsWith("blob:")).toBe(true);
  });

  it("falls back to the direct URL when the fetch fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404, text: () => Promise.resolve("") });
    vi.stubGlobal("fetch", fetchMock);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const script = await resolveGifWorkerScript();

    expect(createObjectURL).not.toHaveBeenCalled();
    expect(script.startsWith("blob:")).toBe(false);
    expect(script).toContain("gif.worker.js");
    expect(warn).toHaveBeenCalled();
  });
});

describe("captureGif (issue #497)", () => {
  let createObjectURL: ReturnType<typeof vi.fn>;
  let revokeObjectURL: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gifInstances.length = 0;

    // Composite step draws onto a 2D context — stub it out for jsdom.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      { drawImage: vi.fn() } as unknown as CanvasRenderingContext2D,
    );

    // requestAnimationFrame: run the callback on the next microtask so the
    // per-frame awaits resolve quickly.
    vi.stubGlobal(
      "requestAnimationFrame",
      (cb: FrameRequestCallback) => {
        Promise.resolve().then(() => cb(0));
        return 0;
      },
    );

    createObjectURL = vi.fn().mockReturnValue("blob:gif-worker-url");
    revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: revokeObjectURL, configurable: true });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve("self.onmessage = () => {};"),
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  function makeGifRenderer(): MoleculeRenderer {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    return {
      ...makeMockRenderer(),
      getCanvas: () => canvas,
    } as unknown as MoleculeRenderer;
  }

  it("hands gif.js a blob: worker script rather than the raw URL", async () => {
    const blob = await captureGif(makeGifRenderer(), {
      width: 16,
      height: 16,
      transparent: false,
      startFrame: 0,
      endFrame: 1,
      fps: 10,
      seekFrame: vi.fn(),
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(gifInstances).toHaveLength(1);
    expect(gifInstances[0].options.workerScript).toBe("blob:gif-worker-url");
  });

  it("reports progress through 0.8 (frame capture) up to 1 (encode done)", async () => {
    const progress: number[] = [];
    await captureGif(makeGifRenderer(), {
      width: 16,
      height: 16,
      transparent: false,
      startFrame: 0,
      endFrame: 1,
      fps: 10,
      seekFrame: vi.fn(),
      onProgress: (p) => progress.push(p),
    });

    // Frame-capture phase tops out at 0.8, and the encode resolves to 1.
    expect(progress).toContain(0.8);
    expect(progress[progress.length - 1]).toBe(1);
  });

  it("revokes the worker blob URL once encoding finishes", async () => {
    await captureGif(makeGifRenderer(), {
      width: 16,
      height: 16,
      transparent: false,
      startFrame: 0,
      endFrame: 0,
      fps: 10,
      seekFrame: vi.fn(),
    });

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:gif-worker-url");
  });
});

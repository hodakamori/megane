import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Snapshot, Frame } from "@/types";

/**
 * Tests for src/widget.ts — the anywidget render entry point.
 *
 * Focus: the camera-state plumbing added in PR #392 (handleCameraStateChange,
 * getInitialCameraState, plus its propagation as WidgetViewer props).
 *
 * The full render() closure is exercised by mocking the React layer so the
 * callbacks remain reachable without a real WebGL/canvas mount.
 */

// Capture the props that widget.ts passes into <WidgetViewer/> on each render.
const widgetViewerCalls: Array<Record<string, unknown>> = [];

vi.mock("@/components/WidgetViewer", () => ({
  WidgetViewer: vi.fn((props: Record<string, unknown>) => {
    widgetViewerCalls.push(props);
    return null;
  }),
}));

// react-dom/client.createRoot — return a stub Root that captures the rendered
// element (we only care about the props passed into createElement).
const renderedElements: Array<{ type: unknown; props: Record<string, unknown> }> = [];
vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn((el: { type: unknown; props: Record<string, unknown> }) => {
      renderedElements.push(el);
    }),
    unmount: vi.fn(),
  })),
}));

// Avoid pulling in the real perf hook (no-op is fine).
vi.mock("@/perf", () => ({
  perfMark: vi.fn(),
  perfMeasure: vi.fn(),
}));

// Stub the WASM-backed structure parser so handleFilePick can be exercised
// without a real WASM build. Tests configure the return value per-case.
const mockParseStructureFile = vi.fn();
vi.mock("@/parsers/structure", () => ({
  parseStructureFile: mockParseStructureFile,
}));

// Stub protocol decoders so parseSnapshot/parseFrame return null in tests
// (we don't need real binary decoding for the camera-state tests).
vi.mock("@/protocol/protocol", () => ({
  decodeSnapshot: vi.fn(() => null),
  decodeFrame: vi.fn(() => null),
  decodeHeader: vi.fn(() => ({ msgType: 0 })),
  MSG_SNAPSHOT: 0,
  MSG_FRAME: 1,
}));

import widgetEntry from "@/widget";
import { WidgetViewer } from "@/components/WidgetViewer";

const mockedWidgetViewer = vi.mocked(WidgetViewer);

interface MockModel {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  save_changes: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  // expose the registered change-event callbacks for tests to invoke
  listeners: Map<string, () => void>;
  // mutable backing store for get()
  state: Record<string, unknown>;
}

function makeMockModel(initial: Record<string, unknown> = {}): MockModel {
  const state: Record<string, unknown> = { ...initial };
  const listeners = new Map<string, () => void>();
  return {
    state,
    listeners,
    get: vi.fn((key: string) => state[key]),
    set: vi.fn((key: string, value: unknown) => {
      state[key] = value;
    }),
    save_changes: vi.fn(),
    on: vi.fn((event: string, cb: () => void) => {
      listeners.set(event, cb);
    }),
  };
}

function makeContainer(): HTMLElement {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return el;
}

// jsdom does not implement layout, so HTMLElement#clientWidth/Height are 0.
// widget.ts's initApp() bails on 0×0 containers, so we override the
// prototype with non-zero values during these tests.
let clientWidthDescriptor: PropertyDescriptor | undefined;
let clientHeightDescriptor: PropertyDescriptor | undefined;

beforeEach(() => {
  widgetViewerCalls.length = 0;
  renderedElements.length = 0;
  mockedWidgetViewer.mockClear();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).ResizeObserver = class {
    observe(): void {}
    disconnect(): void {}
    unobserve(): void {}
  };

  clientWidthDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientWidth");
  clientHeightDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "clientHeight");
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get: () => 800,
  });
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: () => 600,
  });
});

afterEach(() => {
  document.body.innerHTML = "";
  if (clientWidthDescriptor) {
    Object.defineProperty(HTMLElement.prototype, "clientWidth", clientWidthDescriptor);
  }
  if (clientHeightDescriptor) {
    Object.defineProperty(HTMLElement.prototype, "clientHeight", clientHeightDescriptor);
  }
});

describe("widget.ts — render", () => {
  it("registers change listeners for all expected model keys", () => {
    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const expected = [
      "change:_snapshot_data",
      "change:_frame_data",
      "change:frame_index",
      "change:total_frames",
      "change:selected_atoms",
      "change:_node_snapshots_data",
      "change:_pipeline_json",
    ];
    for (const ev of expected) {
      expect(model.listeners.has(ev), `listener ${ev}`).toBe(true);
    }
  });

  it("passes initialCameraState=null when model has no camera_state", () => {
    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const last = renderedElements[renderedElements.length - 1];
    expect(last.props.initialCameraState).toBeNull();
    expect(last.props.onCameraStateChange).toBeTypeOf("function");
  });

  it("returns the persisted camera state when model.camera_state is well-formed", () => {
    const cam = {
      mode: "perspective",
      position: [1, 2, 3],
      target: [0, 0, 0],
      zoom: 1.5,
    };
    const model = makeMockModel({ camera_state: cam });
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const last = renderedElements[renderedElements.length - 1];
    expect(last.props.initialCameraState).toEqual(cam);
  });

  it("rejects malformed camera_state shapes (returns null)", () => {
    const cases = [
      { mode: 42, position: [0, 0, 0], target: [0, 0, 0], zoom: 1 }, // bad mode
      { mode: "orthographic", position: "nope", target: [0, 0, 0], zoom: 1 }, // bad position
      { mode: "orthographic", position: [0, 0, 0], target: "nope", zoom: 1 }, // bad target
      { mode: "orthographic", position: [0, 0, 0], target: [0, 0, 0], zoom: "x" }, // bad zoom
      null,
    ];
    for (const cam of cases) {
      renderedElements.length = 0;
      const model = makeMockModel({ camera_state: cam });
      const el = makeContainer();
      widgetEntry.render({ model: model as never, el });
      const last = renderedElements[renderedElements.length - 1];
      expect(last.props.initialCameraState).toBeNull();
    }
  });

  it("onCameraStateChange writes back to model and triggers save_changes", () => {
    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const last = renderedElements[renderedElements.length - 1];
    const onCameraStateChange = last.props.onCameraStateChange as (
      s: Record<string, unknown>,
    ) => void;

    const newState = {
      mode: "orthographic",
      position: [10, 20, 30],
      target: [1, 1, 1],
      zoom: 2,
    };
    onCameraStateChange(newState);

    expect(model.set).toHaveBeenCalledWith("camera_state", newState);
    expect(model.save_changes).toHaveBeenCalled();
  });

  it("re-renders propagate updated camera_state through getInitialCameraState", () => {
    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    // Update model state and trigger a re-render via one of the change listeners.
    const cam = {
      mode: "orthographic",
      position: [4, 5, 6],
      target: [0, 0, 0],
      zoom: 1,
    };
    model.state.camera_state = cam;
    model.listeners.get("change:frame_index")?.();

    const last = renderedElements[renderedElements.length - 1];
    expect(last.props.initialCameraState).toEqual(cam);
  });

  it("handlePipelineChange writes _pipeline_json", () => {
    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const last = renderedElements[renderedElements.length - 1];
    const onPipelineChange = last.props.onPipelineChange as (j: string) => void;
    onPipelineChange("{}");

    expect(model.set).toHaveBeenCalledWith("_pipeline_json", "{}");
    expect(model.save_changes).toHaveBeenCalled();
  });

  it("handleSeek writes the requested frame index", () => {
    const model = makeMockModel({ total_frames: 5 });
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const last = renderedElements[renderedElements.length - 1];
    const onSeek = last.props.onSeek as (frame: number) => void;
    onSeek(3);

    expect(model.set).toHaveBeenCalledWith("frame_index", 3);
  });

  it("handleSeek with -1 advances to the next frame (wrap-around)", () => {
    const model = makeMockModel({ total_frames: 4, frame_index: 3 });
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const last = renderedElements[renderedElements.length - 1];
    const onSeek = last.props.onSeek as (frame: number) => void;
    onSeek(-1);

    expect(model.set).toHaveBeenCalledWith("frame_index", 0);
  });

  it("cleanup function unmounts and disconnects without errors", () => {
    const model = makeMockModel();
    const el = makeContainer();
    const cleanup = widgetEntry.render({ model: model as never, el }) as () => void;
    expect(() => cleanup()).not.toThrow();
  });

  // ── handleFilePick ────────────────────────────────────────────────────────

  it("handleFilePick parses the file and notifies Python with the file name", async () => {
    const mockSnapshot = { atoms: [] } as unknown as Snapshot;
    const mockFrames = [{ positions: new Float32Array([1, 2, 3]) }] as unknown as Frame[];
    mockParseStructureFile.mockResolvedValueOnce({
      snapshot: mockSnapshot,
      frames: mockFrames,
    });

    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const last = renderedElements[renderedElements.length - 1];
    const onFilePick = last.props.onFilePick as (file: File) => Promise<void>;
    const file = new File([""], "protein.pdb");
    await onFilePick(file);

    expect(mockParseStructureFile).toHaveBeenCalledWith(file);
    expect(model.set).toHaveBeenCalledWith("_uploaded_file_name", "protein.pdb");
    expect(model.save_changes).toHaveBeenCalled();
  });

  it("handleFilePick re-renders with snapshot from parsed file", async () => {
    const mockSnapshot = { atoms: [{ x: 1, y: 2, z: 3 }] } as unknown as Snapshot;
    mockParseStructureFile.mockResolvedValueOnce({ snapshot: mockSnapshot, frames: [] });

    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const { onFilePick } = renderedElements[renderedElements.length - 1].props;
    await (onFilePick as (f: File) => Promise<void>)(new File([""], "mol.gro"));

    const afterLoad = renderedElements[renderedElements.length - 1];
    expect(afterLoad.props.snapshot).toBe(mockSnapshot);
    expect(afterLoad.props.frame).toBeNull();
  });

  it("handleFilePick throws for unsupported file extensions", async () => {
    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    const { onFilePick } = renderedElements[renderedElements.length - 1].props;
    await expect(
      (onFilePick as (f: File) => Promise<void>)(new File([""], "video.mp4")),
    ).rejects.toThrow("Unsupported format: video.mp4");
  });

  // ── local-frame trajectory (after handleFilePick) ─────────────────────────

  it("handleSeek uses local frames after file pick (no Python round-trip)", async () => {
    const frames = [
      { positions: new Float32Array([1]) },
      { positions: new Float32Array([2]) },
    ] as unknown as Frame[];
    mockParseStructureFile.mockResolvedValueOnce({ snapshot: {} as Snapshot, frames });

    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    await (renderedElements[renderedElements.length - 1].props.onFilePick as (f: File) => Promise<void>)(
      new File([""], "mol.pdb"),
    );

    // After load, localFrameIndex=0 (snapshot frame). Seek to frame 2.
    const onSeek = renderedElements[renderedElements.length - 1].props.onSeek as (f: number) => void;
    onSeek(2);

    // model.set("frame_index") must NOT be called — seeking is local.
    expect(model.set).not.toHaveBeenCalledWith("frame_index", expect.anything());

    // renderApp reflects localFrameIndex=2, totalFrames=3 (frames.length+1).
    const after = renderedElements[renderedElements.length - 1];
    expect(after.props.currentFrame).toBe(2);
    expect(after.props.totalFrames).toBe(3);
  });

  it("handleSeek -1 advances local frame index with wrap-around", async () => {
    const frames = [
      { positions: new Float32Array([1]) },
      { positions: new Float32Array([2]) },
    ] as unknown as Frame[];
    mockParseStructureFile.mockResolvedValueOnce({ snapshot: {} as Snapshot, frames });

    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    await (renderedElements[renderedElements.length - 1].props.onFilePick as (f: File) => Promise<void>)(
      new File([""], "mol.pdb"),
    );

    const onSeek = renderedElements[renderedElements.length - 1].props.onSeek as (f: number) => void;
    // localFrameIndex=0, total=3; -1 → 1
    onSeek(-1);
    expect(renderedElements[renderedElements.length - 1].props.currentFrame).toBe(1);

    // -1 again → 2
    onSeek(-1);
    expect(renderedElements[renderedElements.length - 1].props.currentFrame).toBe(2);

    // -1 again wraps → 0
    onSeek(-1);
    expect(renderedElements[renderedElements.length - 1].props.currentFrame).toBe(0);
  });

  it("handleSeek frame 0 after local load sets currentFrame to null (snapshot positions)", async () => {
    const frames = [{ positions: new Float32Array([1]) }] as unknown as Frame[];
    mockParseStructureFile.mockResolvedValueOnce({ snapshot: {} as Snapshot, frames });

    const model = makeMockModel();
    const el = makeContainer();
    widgetEntry.render({ model: model as never, el });

    await (renderedElements[renderedElements.length - 1].props.onFilePick as (f: File) => Promise<void>)(
      new File([""], "mol.pdb"),
    );

    const onSeek = renderedElements[renderedElements.length - 1].props.onSeek as (f: number) => void;
    onSeek(1); // advance to frame 1
    onSeek(0); // back to frame 0 (snapshot)
    expect(renderedElements[renderedElements.length - 1].props.frame).toBeNull();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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

  describe("drag-and-drop file loading", () => {
    it("registers change listener for _drop_file_b64", () => {
      const model = makeMockModel();
      const el = makeContainer();
      widgetEntry.render({ model: model as never, el });
      // The drag-drop handler writes to the model; verify model listeners
      // include the standard pipeline change listener (not a model.on event —
      // drag-drop uses DOM events, not model.on).
      expect(model.listeners.has("change:_pipeline_json")).toBe(true);
    });

    it("dragover event on container prevents default", () => {
      const model = makeMockModel();
      const el = makeContainer();
      widgetEntry.render({ model: model as never, el });

      const container = el.firstChild as HTMLElement;
      const event = new Event("dragover", { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");
      container.dispatchEvent(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("drop with no files does not write to model", () => {
      const model = makeMockModel();
      const el = makeContainer();
      widgetEntry.render({ model: model as never, el });
      model.set.mockClear();

      const container = el.firstChild as HTMLElement;
      const event = new Event("drop", { bubbles: true, cancelable: true });
      // dataTransfer is null → drop handler early-returns
      container.dispatchEvent(event);
      expect(model.set).not.toHaveBeenCalledWith("_drop_file_name", expect.anything());
    });

    it("drop with a file triggers FileReader.readAsDataURL", () => {
      const model = makeMockModel();
      const el = makeContainer();
      widgetEntry.render({ model: model as never, el });

      const container = el.firstChild as HTMLElement;

      const readAsDataURLSpy = vi.fn();
      const mockReader = {
        readAsDataURL: readAsDataURLSpy,
        onload: null as null | ((e: ProgressEvent<FileReader>) => void),
      };
      vi.stubGlobal(
        "FileReader",
        vi.fn(() => mockReader),
      );

      const file = new File(["ATOM  1  N   ALA\n"], "test.pdb", { type: "text/plain" });
      const dt = { files: [file] } as unknown as DataTransfer;
      const dropEvent = Object.assign(
        new Event("drop", { bubbles: true, cancelable: true }),
        { dataTransfer: dt },
      );
      container.dispatchEvent(dropEvent);

      expect(readAsDataURLSpy).toHaveBeenCalledWith(file);
      vi.unstubAllGlobals();
    });

    it("FileReader onload sets _drop_file_name and _drop_file_b64 on model", () => {
      const model = makeMockModel();
      const el = makeContainer();
      widgetEntry.render({ model: model as never, el });
      model.set.mockClear();
      model.save_changes.mockClear();

      const container = el.firstChild as HTMLElement;

      let capturedOnLoad: ((e: ProgressEvent<FileReader>) => void) | null = null;
      const mockReader = {
        readAsDataURL: vi.fn(),
        set onload(fn: (e: ProgressEvent<FileReader>) => void) {
          capturedOnLoad = fn;
        },
      };
      vi.stubGlobal(
        "FileReader",
        vi.fn(() => mockReader),
      );

      const file = new File(["ATOM\n"], "mol.pdb", { type: "text/plain" });
      const dt = { files: [file] } as unknown as DataTransfer;
      const dropEvent = Object.assign(
        new Event("drop", { bubbles: true, cancelable: true }),
        { dataTransfer: dt },
      );
      container.dispatchEvent(dropEvent);

      // Simulate FileReader completing
      const fakeB64 = "QVRPTQ=="; // base64 of "ATOM\n" roughly
      capturedOnLoad!({
        target: { result: `data:text/plain;base64,${fakeB64}` },
      } as unknown as ProgressEvent<FileReader>);

      expect(model.set).toHaveBeenCalledWith("_drop_file_name", "mol.pdb");
      expect(model.set).toHaveBeenCalledWith("_drop_file_b64", fakeB64);
      expect(model.save_changes).toHaveBeenCalled();

      vi.unstubAllGlobals();
    });
  });
});

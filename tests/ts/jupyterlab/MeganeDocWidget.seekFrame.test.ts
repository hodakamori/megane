import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all heavy dependencies so MeganeDocWidget.tsx can be imported without
// a real JupyterLab runtime or WASM build.
vi.mock("@megane/components/MeganeViewer", () => ({ MeganeViewer: vi.fn(() => null) }));
vi.mock("@megane/hooks/useMeganeLocal", () => ({ useMeganeLocal: vi.fn(() => ({})) }));
vi.mock("@megane/pipeline/store", () => ({
  usePipelineStore: { getState: vi.fn(() => ({ reset: vi.fn() })), setState: vi.fn() },
}));
vi.mock("@megane/pipeline/storeSnapshot", () => ({ capturePipelineStore: vi.fn(() => ({})) }));
vi.mock("@megane/tour/useTour", () => ({ useTour: vi.fn() }));
vi.mock("@megane/stores/useThemeStore", () => ({ useThemeStore: vi.fn(() => ({})) }));
vi.mock("@megane/styles/megane.css", () => ({}));
vi.mock("../../../jupyterlab-megane/src/wasmLoader", () => ({ ensureWasmUrl: vi.fn() }));
vi.mock("../../../jupyterlab-megane/src/filetypes", () => ({
  STRUCTURE_FILETYPES_BINARY: [],
}));
vi.mock("../../../jupyterlab-megane/src/trajectoryUtils", () => ({
  TRAJECTORY_ONLY_EXTENSIONS: new Set<string>(),
}));
vi.mock("../../../jupyterlab-megane/src/frameSubscription", () => ({
  createFrameSubscription: () => ({ subscribe: vi.fn(() => vi.fn()), emit: vi.fn() }),
}));

const mockSeekFrame = vi.fn();
vi.mock("@megane/stores/usePlaybackStore", () => ({
  usePlaybackStore: {
    getState: () => ({ seekFrame: mockSeekFrame }),
  },
}));

import { MeganeReactView } from "../../../jupyterlab-megane/src/MeganeDocWidget";

function makeContext() {
  return {
    path: "/test.pdb",
    model: { toString: () => "" },
    ready: Promise.resolve(),
    contentsModel: null,
  } as Parameters<typeof MeganeReactView>[0];
}

describe("MeganeReactView.seekFrame", () => {
  beforeEach(() => {
    mockSeekFrame.mockClear();
  });

  it("delegates to usePlaybackStore.getState().seekFrame", () => {
    const view = new MeganeReactView(makeContext());
    view.seekFrame(42);
    expect(mockSeekFrame).toHaveBeenCalledWith(42);
  });

  it("passes frame index 0 correctly", () => {
    const view = new MeganeReactView(makeContext());
    view.seekFrame(0);
    expect(mockSeekFrame).toHaveBeenCalledWith(0);
  });

  it("passes large frame indices correctly", () => {
    const view = new MeganeReactView(makeContext());
    view.seekFrame(9999);
    expect(mockSeekFrame).toHaveBeenCalledWith(9999);
  });

  it("calls seekFrame exactly once per invocation", () => {
    const view = new MeganeReactView(makeContext());
    view.seekFrame(5);
    view.seekFrame(10);
    expect(mockSeekFrame).toHaveBeenCalledTimes(2);
    expect(mockSeekFrame).toHaveBeenNthCalledWith(1, 5);
    expect(mockSeekFrame).toHaveBeenNthCalledWith(2, 10);
  });
});

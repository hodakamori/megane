import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";

vi.mock("@/components/Viewport", () => ({ Viewport: vi.fn(() => null) }));
vi.mock("@/components/Tooltip", () => ({ Tooltip: vi.fn(() => null) }));
vi.mock("@/components/MeasurementPanel", () => ({ MeasurementPanel: vi.fn(() => null) }));
vi.mock("@/components/Timeline", () => ({ Timeline: vi.fn(() => null) }));
vi.mock("@/components/PipelineEditor", () => ({ PipelineEditor: vi.fn(() => null) }));
vi.mock("@/parsers/inferBondsJS", () => ({
  inferBondsVdwJS: vi.fn(() => new Uint32Array(0)),
}));
vi.mock("@/pipeline/executors/addBond", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/pipeline/executors/addBond")>();
  return { ...actual, processPbcBonds: vi.fn() };
});

import { MeganeViewer } from "@/components/MeganeViewer";
import { usePlaybackStore } from "@/stores/usePlaybackStore";

describe("MeganeViewer.onFrameChange", () => {
  afterEach(() => {
    cleanup();
    act(() => {
      usePlaybackStore.setState({ currentFrame: 0 });
    });
  });

  it("does not fire on initial mount", () => {
    const onFrameChange = vi.fn();
    render(
      <MeganeViewer
        onUploadStructure={() => {}}
        onFrameChange={onFrameChange}
      />,
    );
    expect(onFrameChange).not.toHaveBeenCalled();
  });

  it("fires when the playback store's currentFrame changes", () => {
    const onFrameChange = vi.fn();
    render(
      <MeganeViewer
        onUploadStructure={() => {}}
        onFrameChange={onFrameChange}
      />,
    );

    act(() => {
      usePlaybackStore.setState({ currentFrame: 5 });
    });
    expect(onFrameChange).toHaveBeenCalledTimes(1);
    expect(onFrameChange).toHaveBeenLastCalledWith(5);

    act(() => {
      usePlaybackStore.setState({ currentFrame: 12 });
    });
    expect(onFrameChange).toHaveBeenCalledTimes(2);
    expect(onFrameChange).toHaveBeenLastCalledWith(12);
  });

  it("does not fire when currentFrame is set to the same value", () => {
    const onFrameChange = vi.fn();
    render(
      <MeganeViewer
        onUploadStructure={() => {}}
        onFrameChange={onFrameChange}
      />,
    );

    act(() => {
      usePlaybackStore.setState({ currentFrame: 3 });
    });
    expect(onFrameChange).toHaveBeenCalledTimes(1);

    act(() => {
      usePlaybackStore.setState({ currentFrame: 3 });
    });
    expect(onFrameChange).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act, cleanup, fireEvent, waitFor } from "@testing-library/react";
import type { Snapshot } from "@/types";

// Mock heavy components to avoid WebGL/canvas in jsdom
vi.mock("@/components/Viewport", () => ({ Viewport: vi.fn(() => null) }));
vi.mock("@/components/Tooltip", () => ({ Tooltip: vi.fn(() => null) }));
vi.mock("@/components/MeasurementPanel", () => ({ MeasurementPanel: vi.fn(() => null) }));
vi.mock("@/parsers/inferBondsJS", () => ({ inferBondsVdwJS: vi.fn(() => new Uint32Array(0)) }));
vi.mock("@/pipeline/executors/addBond", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/pipeline/executors/addBond")>();
  return {
    ...actual,
    processPbcBonds: vi.fn((bondIndices: Uint32Array, bondOrders: Uint8Array | null) => ({
      bondIndices,
      bondOrders,
      nBonds: bondIndices.length / 2,
      positions: null,
      elements: null,
      nAtoms: 0,
    })),
  };
});

import { WidgetViewer } from "@/components/WidgetViewer";

function makeSnapshot(): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array([0, 0, 0, 1, 0, 0]),
    elements: new Uint8Array([1, 8]),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
  };
}

const defaultProps = {
  snapshot: null,
  frame: null,
  currentFrame: 0,
  totalFrames: 0,
  onSeek: vi.fn(),
};

describe("WidgetViewer — file picker overlay", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("shows file picker overlay when onFilePick is set and no snapshot is loaded", () => {
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={vi.fn()} />,
    );
    expect(getByTestId("widget-file-picker")).toBeDefined();
  });

  it("does not show file picker overlay when onFilePick is not provided", () => {
    const { queryByTestId } = render(<WidgetViewer {...defaultProps} />);
    expect(queryByTestId("widget-file-picker")).toBeNull();
  });

  it("hides file picker overlay when a snapshot is provided", () => {
    const { queryByTestId } = render(
      <WidgetViewer {...defaultProps} snapshot={makeSnapshot()} onFilePick={vi.fn()} />,
    );
    expect(queryByTestId("widget-file-picker")).toBeNull();
  });

  it("hides file picker overlay when pipelineJson is present", () => {
    const { queryByTestId } = render(
      <WidgetViewer
        {...defaultProps}
        pipelineJson='{"version":3,"nodes":[],"edges":[]}'
        onFilePick={vi.fn()}
      />,
    );
    expect(queryByTestId("widget-file-picker")).toBeNull();
  });

  it("calls onFilePick when a supported file is dropped", async () => {
    const onFilePick = vi.fn().mockResolvedValue(undefined);
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={onFilePick} />,
    );

    const picker = getByTestId("widget-file-picker");
    const file = new File(["ATOM  1  CA  ALA"], "test.pdb", { type: "chemical/x-pdb" });

    await act(async () => {
      fireEvent.drop(picker, { dataTransfer: { files: [file] } });
    });

    expect(onFilePick).toHaveBeenCalledWith(file);
  });

  it("calls onFilePick when a file is selected via the hidden input", async () => {
    const onFilePick = vi.fn().mockResolvedValue(undefined);
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={onFilePick} />,
    );

    const input = getByTestId("widget-file-input") as HTMLInputElement;
    const file = new File([""], "protein.gro", { type: "" });
    Object.defineProperty(input, "files", { value: [file], writable: false });

    await act(async () => {
      fireEvent.change(input);
    });

    expect(onFilePick).toHaveBeenCalledWith(file);
  });

  it("shows error message when an unsupported file is dropped", async () => {
    const onFilePick = vi.fn();
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={onFilePick} />,
    );

    const picker = getByTestId("widget-file-picker");
    const file = new File([""], "trajectory.mp4", { type: "video/mp4" });

    await act(async () => {
      fireEvent.drop(picker, { dataTransfer: { files: [file] } });
    });

    expect(onFilePick).not.toHaveBeenCalled();
    expect(getByTestId("widget-file-error")).toBeDefined();
  });

  it("shows error message when onFilePick rejects", async () => {
    const onFilePick = vi.fn().mockRejectedValue(new Error("Parse failed"));
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={onFilePick} />,
    );

    const picker = getByTestId("widget-file-picker");
    const file = new File([""], "bad.pdb", { type: "" });

    await act(async () => {
      fireEvent.drop(picker, { dataTransfer: { files: [file] } });
    });

    await waitFor(() => {
      expect(getByTestId("widget-file-error").textContent).toBe("Parse failed");
    });
  });

  it("accepts all supported structure file extensions", async () => {
    const exts = [".pdb", ".gro", ".xyz", ".mol", ".sdf", ".mol2", ".cif", ".data", ".lammps", ".traj"];

    for (const ext of exts) {
      const onFilePick = vi.fn().mockResolvedValue(undefined);
      const { getByTestId, unmount } = render(
        <WidgetViewer {...defaultProps} onFilePick={onFilePick} />,
      );

      const picker = getByTestId("widget-file-picker");
      const file = new File([""], `molecule${ext}`, { type: "" });

      await act(async () => {
        fireEvent.drop(picker, { dataTransfer: { files: [file] } });
      });

      expect(onFilePick).toHaveBeenCalledWith(file);
      unmount();
      vi.clearAllMocks();
    }
  });

  it("does not call onFilePick when no files are in the drop event", async () => {
    const onFilePick = vi.fn();
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={onFilePick} />,
    );

    const picker = getByTestId("widget-file-picker");
    await act(async () => {
      fireEvent.drop(picker, { dataTransfer: { files: [] } });
    });

    expect(onFilePick).not.toHaveBeenCalled();
  });

  it("sets isDragOver styling when dragging over the picker and clears it on drag leave", () => {
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={vi.fn()} />,
    );

    const picker = getByTestId("widget-file-picker");

    act(() => {
      fireEvent.dragOver(picker);
    });
    // jsdom normalises hex colours to rgb(); check for either form.
    const borderAfterOver = (picker as HTMLElement).style.border;
    expect(
      borderAfterOver.includes("#6366f1") || borderAfterOver.includes("rgb(99, 102, 241)"),
    ).toBe(true);

    act(() => {
      fireEvent.dragLeave(picker);
    });
    const borderAfterLeave = (picker as HTMLElement).style.border;
    expect(
      borderAfterLeave.includes("#9ca3af") || borderAfterLeave.includes("rgb(156, 163, 175)"),
    ).toBe(true);
  });

  it("contains a file input with the correct accept attribute", () => {
    const { getByTestId } = render(
      <WidgetViewer {...defaultProps} onFilePick={vi.fn()} />,
    );

    const input = getByTestId("widget-file-input") as HTMLInputElement;
    expect(input.accept).toBe(".pdb,.gro,.xyz,.mol,.sdf,.mol2,.cif,.data,.lammps,.traj");
    expect(input.type).toBe("file");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DrawingBoundaryNode } from "@/components/nodes/DrawingBoundaryNode";
import { usePipelineStore } from "@/pipeline/store";
import { defaultParams } from "@/pipeline/types";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));

function props() {
  return {
    id: "boundary",
    type: "drawing_boundary",
    data: { params: defaultParams("drawing_boundary"), enabled: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("DrawingBoundaryNode", () => {
  beforeEach(() => cleanup());

  it("exposes independent fractional min/max controls for a, b, and c", () => {
    render(<DrawingBoundaryNode {...props()} />);
    expect(screen.getByLabelText("x minimum")).toHaveValue(0);
    expect(screen.getByLabelText("x maximum")).toHaveValue(1);
    expect(screen.getByLabelText("y minimum")).toHaveValue(0);
    expect(screen.getByLabelText("z maximum")).toHaveValue(1);
  });

  it("updates an arbitrary bound", () => {
    const updateNodeParams = vi.fn();
    usePipelineStore.setState({ updateNodeParams });
    render(<DrawingBoundaryNode {...props()} />);
    fireEvent.change(screen.getByLabelText("x minimum"), { target: { value: "-0.2" } });
    expect(updateNodeParams).toHaveBeenCalledWith("boundary", { xMin: -0.2 });
  });
});

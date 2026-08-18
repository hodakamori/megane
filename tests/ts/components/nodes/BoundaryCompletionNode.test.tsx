import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BoundaryCompletionNode } from "@/components/nodes/BoundaryCompletionNode";
import { usePipelineStore } from "@/pipeline/store";
import { defaultParams } from "@/pipeline/types";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));

function props() {
  return {
    id: "completion",
    type: "boundary_completion",
    data: { params: defaultParams("boundary_completion"), enabled: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("BoundaryCompletionNode", () => {
  beforeEach(() => cleanup());

  it("defaults to one-shell neighbor completion", () => {
    render(<BoundaryCompletionNode {...props()} />);
    expect(screen.getByLabelText("Boundary completion mode")).toHaveValue("neighbors");
  });

  it("selects finite connected-component completion", () => {
    const updateNodeParams = vi.fn();
    usePipelineStore.setState({ updateNodeParams });
    render(<BoundaryCompletionNode {...props()} />);
    fireEvent.change(screen.getByLabelText("Boundary completion mode"), {
      target: { value: "components" },
    });
    expect(updateNodeParams).toHaveBeenCalledWith("completion", { mode: "components" });
  });
});

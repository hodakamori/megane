import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { usePipelineStore } from "@/pipeline/store";
import { LabelGeneratorNode } from "@/components/nodes/LabelGeneratorNode";
import type { LabelGeneratorParams } from "@/pipeline/types";
import { seedPipelineStore } from "./_helpers";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));

function nodeProps(id: string, params: LabelGeneratorParams, enabled = true) {
  return {
    id,
    type: "label_generator" as const,
    data: { params, enabled },
    selected: false,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    zIndex: 0,
    dragging: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("LabelGeneratorNode", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders the three source tabs: Element, Resname, Index", () => {
    const seeded = seedPipelineStore("label_generator", { id: "lg1" });
    render(
      <LabelGeneratorNode {...nodeProps("lg1", seeded.data.params as LabelGeneratorParams)} />,
    );

    expect(screen.getByRole("button", { name: "Element" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resname" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Index" })).toBeInTheDocument();
  });

  it("renders inside a NodeShell with the Labels title", () => {
    const seeded = seedPipelineStore("label_generator", { id: "lg1" });
    render(
      <LabelGeneratorNode {...nodeProps("lg1", seeded.data.params as LabelGeneratorParams)} />,
    );
    expect(screen.getByText("Labels")).toBeInTheDocument();
  });

  it("clicking a non-active tab dispatches updateNodeParams with the new source", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("label_generator", {
      id: "lg1",
      params: { source: "element" },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LabelGeneratorNode {...nodeProps("lg1", seeded.data.params as LabelGeneratorParams)} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Resname" }));
    expect(updateNodeParams).toHaveBeenCalledWith("lg1", { source: "resname" });

    fireEvent.click(screen.getByRole("button", { name: "Index" }));
    expect(updateNodeParams).toHaveBeenCalledWith("lg1", { source: "index" });
  });

  it("clicking the already-active tab is a no-op", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("label_generator", {
      id: "lg1",
      params: { source: "element" },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LabelGeneratorNode {...nodeProps("lg1", seeded.data.params as LabelGeneratorParams)} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Element" }));
    expect(updateNodeParams).not.toHaveBeenCalled();
  });

  it("uses the active-tab color for the currently-selected source", () => {
    const seeded = seedPipelineStore("label_generator", {
      id: "lg1",
      params: { source: "resname" },
    });
    render(
      <LabelGeneratorNode {...nodeProps("lg1", seeded.data.params as LabelGeneratorParams)} />,
    );

    const active = screen.getByRole("button", { name: "Resname" });
    const inactive = screen.getByRole("button", { name: "Element" });
    // Active tab uses the project's blue (#3b82f6 → rgb(59, 130, 246))
    expect(active.style.color).toBe("rgb(59, 130, 246)");
    // Inactive tab uses slate-400 (#94a3b8 → rgb(148, 163, 184))
    expect(inactive.style.color).toBe("rgb(148, 163, 184)");
  });
});

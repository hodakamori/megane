import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { usePipelineStore } from "@/pipeline/store";
import { PolyhedronGeneratorNode } from "@/components/nodes/PolyhedronGeneratorNode";
import type { PolyhedronGeneratorParams } from "@/pipeline/types";
import { seedPipelineStore } from "./_helpers";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));

function nodeProps(id: string, params: PolyhedronGeneratorParams, enabled = true) {
  return {
    id,
    type: "polyhedron_generator" as const,
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

const ACTIVE_COLOR = "rgb(59, 130, 246)";
const INACTIVE_COLOR = "rgb(148, 163, 184)";

describe("PolyhedronGeneratorNode", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders the Polyhedra title", () => {
    const seeded = seedPipelineStore("polyhedron_generator", { id: "pg1" });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );
    expect(screen.getByText("Polyhedra")).toBeInTheDocument();
  });

  it("renders all 12 center element chips", () => {
    const seeded = seedPipelineStore("polyhedron_generator", { id: "pg1" });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    for (const sym of ["Si", "Al", "Ti", "Fe", "Zr", "Mn", "Co", "Ni", "Cr", "Zn", "Mg", "Ca"]) {
      expect(screen.getByRole("button", { name: sym })).toBeInTheDocument();
    }
  });

  it("renders all 5 ligand element chips", () => {
    const seeded = seedPipelineStore("polyhedron_generator", { id: "pg1" });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    for (const sym of ["O", "F", "Cl", "N", "S"]) {
      expect(screen.getByRole("button", { name: sym })).toBeInTheDocument();
    }
  });

  it("highlights chips whose atomic number is in the selected list", () => {
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [14], // Si
        ligandElements: [8], // O
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: false,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    expect((screen.getByRole("button", { name: "Si" }) as HTMLElement).style.color).toBe(
      ACTIVE_COLOR,
    );
    expect((screen.getByRole("button", { name: "Al" }) as HTMLElement).style.color).toBe(
      INACTIVE_COLOR,
    );
    expect((screen.getByRole("button", { name: "O" }) as HTMLElement).style.color).toBe(
      ACTIVE_COLOR,
    );
    expect((screen.getByRole("button", { name: "F" }) as HTMLElement).style.color).toBe(
      INACTIVE_COLOR,
    );
  });

  it("clicking an unselected center chip adds its atomic number", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: false,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Si" }));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { centerElements: [14] });
  });

  it("clicking a selected center chip removes it", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [14, 22],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: false,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Ti" }));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { centerElements: [14] });
  });

  it("clicking ligand chips updates the ligand list", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [14],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: false,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "F" }));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { ligandElements: [8, 9] });
  });

  it("max distance slider commits a parsed float", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", { id: "pg1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    const sliders = screen.getAllByRole("slider") as HTMLInputElement[];
    // Order: max distance, opacity (edge width slider only renders when showEdges=true).
    fireEvent.change(sliders[0], { target: { value: "3.5" } });
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { maxDistance: 3.5 });
  });

  it("opacity slider commits a parsed float and shows percentage", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.4,
        showEdges: false,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    expect(screen.getByText("40%")).toBeInTheDocument();
    const sliders = screen.getAllByRole("slider") as HTMLInputElement[];
    fireEvent.change(sliders[1], { target: { value: "0.75" } });
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { opacity: 0.75 });
  });

  it("toggling Show edges flips the showEdges param", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", { id: "pg1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Show edges/));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { showEdges: true });
  });

  it("hides the edge color and edge width controls when showEdges is false", () => {
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: false,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    expect(screen.queryByText("Edge color")).toBeNull();
    expect(screen.queryByText("Edge width")).toBeNull();
  });

  it("shows the edge color picker and edge width slider when showEdges is true", () => {
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: true,
        edgeColor: "#abcdef",
        edgeWidth: 4,
      },
    });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    expect(screen.getByText("Edge color")).toBeInTheDocument();
    expect(screen.getByText("Edge width")).toBeInTheDocument();
    expect(screen.getByText("4.0")).toBeInTheDocument();
  });

  it("changing the edge color input dispatches updateNodeParams with the new color", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: true,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    const colorInput = screen
      .getByText("Edge color")
      .parentElement!.querySelector('input[type="color"]') as HTMLInputElement;
    fireEvent.change(colorInput, { target: { value: "#abcdef" } });

    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { edgeColor: "#abcdef" });
  });

  it("changing the edge width slider dispatches a parsed float", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("polyhedron_generator", {
      id: "pg1",
      params: {
        centerElements: [],
        ligandElements: [8],
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: true,
        edgeColor: "#dddddd",
        edgeWidth: 3,
      },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <PolyhedronGeneratorNode
        {...nodeProps("pg1", seeded.data.params as PolyhedronGeneratorParams)}
      />,
    );

    // Sliders in order: max distance, opacity, edge width
    const sliders = screen.getAllByRole("slider") as HTMLInputElement[];
    fireEvent.change(sliders[2], { target: { value: "5.5" } });
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { edgeWidth: 5.5 });
  });
});

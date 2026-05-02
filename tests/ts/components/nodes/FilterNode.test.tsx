import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { usePipelineStore } from "@/pipeline/store";
import { FilterNode } from "@/components/nodes/FilterNode";
import type { FilterParams } from "@/pipeline/types";
import { seedPipelineStore } from "./_helpers";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));
vi.mock("@/pipeline/selection", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/pipeline/selection")>();
  return {
    ...actual,
    validateQuery: vi.fn(() => ({ valid: true })),
    validateBondQuery: vi.fn(() => ({ valid: true })),
  };
});

import { validateQuery, validateBondQuery } from "@/pipeline/selection";

const mockedValidateQuery = vi.mocked(validateQuery);
const mockedValidateBondQuery = vi.mocked(validateBondQuery);

function nodeProps(id: string, params: FilterParams, enabled = true) {
  return {
    id,
    type: "filter" as const,
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

describe("FilterNode", () => {
  beforeEach(() => {
    cleanup();
    mockedValidateQuery.mockReset();
    mockedValidateQuery.mockReturnValue({ valid: true });
    mockedValidateBondQuery.mockReset();
    mockedValidateBondQuery.mockReturnValue({ valid: true });
  });

  it("renders the particle and bond query inputs with values from params", () => {
    const seeded = seedPipelineStore("filter", {
      id: "f1",
      params: { query: 'element == "C"', bond_query: "both atom_index >= 1" },
    });
    render(<FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />);

    const particleInput = screen.getByPlaceholderText('element == "C"') as HTMLInputElement;
    const bondInput = screen.getByPlaceholderText("both atom_index >= 24") as HTMLInputElement;
    expect(particleInput.value).toBe('element == "C"');
    expect(bondInput.value).toBe("both atom_index >= 1");
  });

  it("typing in the input updates local state but does not call updateNodeParams", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("filter", { id: "f1" });
    usePipelineStore.setState({ updateNodeParams });
    render(<FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />);

    const particleInput = screen.getByPlaceholderText('element == "C"') as HTMLInputElement;
    fireEvent.change(particleInput, { target: { value: "name == 'O'" } });

    expect(particleInput.value).toBe("name == 'O'");
    expect(updateNodeParams).not.toHaveBeenCalled();
  });

  it("blur with a valid particle query commits to the store with no error", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("filter", { id: "f1" });
    usePipelineStore.setState({ updateNodeParams });
    mockedValidateQuery.mockReturnValue({ valid: true });

    render(<FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />);
    const particleInput = screen.getByPlaceholderText('element == "C"');
    fireEvent.change(particleInput, { target: { value: "element == 'O'" } });
    fireEvent.blur(particleInput);

    expect(mockedValidateQuery).toHaveBeenCalledWith("element == 'O'");
    expect(updateNodeParams).toHaveBeenCalledWith("f1", { query: "element == 'O'" });
  });

  it("blur with an invalid particle query renders the error message", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("filter", { id: "f1" });
    usePipelineStore.setState({ updateNodeParams });
    mockedValidateQuery.mockReturnValue({ valid: false, error: "bad token" });

    render(<FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />);
    const particleInput = screen.getByPlaceholderText('element == "C"');
    fireEvent.change(particleInput, { target: { value: "garbage" } });
    fireEvent.blur(particleInput);

    expect(screen.getByText("bad token")).toBeInTheDocument();
    // Component still commits the value (current behavior)
    expect(updateNodeParams).toHaveBeenCalledWith("f1", { query: "garbage" });
  });

  it("Enter key triggers a commit identical to blur", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("filter", { id: "f1" });
    usePipelineStore.setState({ updateNodeParams });

    render(<FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />);
    const particleInput = screen.getByPlaceholderText('element == "C"');
    fireEvent.change(particleInput, { target: { value: "element == 'N'" } });
    fireEvent.keyDown(particleInput, { key: "Enter" });

    expect(updateNodeParams).toHaveBeenCalledWith("f1", { query: "element == 'N'" });
  });

  it("bond query input runs through validateBondQuery on commit", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("filter", { id: "f1" });
    usePipelineStore.setState({ updateNodeParams });
    mockedValidateBondQuery.mockReturnValue({ valid: false, error: "bond syntax" });

    render(<FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />);
    const bondInput = screen.getByPlaceholderText("both atom_index >= 24");
    fireEvent.change(bondInput, { target: { value: "garbage bond" } });
    fireEvent.blur(bondInput);

    expect(mockedValidateBondQuery).toHaveBeenCalledWith("garbage bond");
    expect(screen.getByText("bond syntax")).toBeInTheDocument();
    expect(updateNodeParams).toHaveBeenCalledWith("f1", { bond_query: "garbage bond" });
  });

  it("when params.query changes externally, the input re-syncs via useEffect", () => {
    const seeded = seedPipelineStore("filter", {
      id: "f1",
      params: { query: "element == 'C'", bond_query: "" },
    });
    const { rerender } = render(
      <FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />,
    );
    const particleInput = screen.getByPlaceholderText('element == "C"') as HTMLInputElement;
    expect(particleInput.value).toBe("element == 'C'");

    // Simulate an external param change (e.g. AI agent sets a new query).
    const updatedParams = {
      type: "filter",
      query: "element == 'O'",
      bond_query: "",
    } as FilterParams;
    rerender(<FilterNode {...nodeProps("f1", updatedParams)} />);
    expect(particleInput.value).toBe("element == 'O'");
  });

  it("hint text shows when query is empty and there is no error", () => {
    const seeded = seedPipelineStore("filter", {
      id: "f1",
      params: { query: "", bond_query: "" },
    });
    render(<FilterNode {...nodeProps("f1", seeded.data.params as FilterParams)} />);
    expect(screen.getByText("element, index, x, y, z, resname, mass")).toBeInTheDocument();
    expect(
      screen.getByText('bond_index, atom_index, element · "both" for AND'),
    ).toBeInTheDocument();
  });
});

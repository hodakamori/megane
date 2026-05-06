import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SelectionInspectorPanel } from "@/components/SelectionInspectorPanel";
import type { Snapshot, StructuralSelectionState } from "@/types";

afterEach(() => cleanup());

function makeSnapshot(): Snapshot {
  const n = 6;
  return {
    nAtoms: n,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(n * 3),
    elements: new Uint8Array([6, 7, 8, 6, 7, 8]), // C, N, O x2
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    atomChainIds: new Uint8Array([65, 65, 65, 66, 66, 66]),
    atomBFactors: null,
    atomResNums: new Uint32Array([1, 1, 1, 2, 2, 2]),
  };
}

describe("SelectionInspectorPanel", () => {
  it("renders nothing when selection is empty", () => {
    const sel: StructuralSelectionState = { atoms: [], granularity: "atom" };
    const { container } = render(
      <SelectionInspectorPanel selection={sel} snapshot={makeSnapshot()} onClear={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when snapshot is null", () => {
    const sel: StructuralSelectionState = { atoms: [0, 1], granularity: "atom" };
    const { container } = render(
      <SelectionInspectorPanel selection={sel} snapshot={null} onClear={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows atom count", () => {
    const sel: StructuralSelectionState = { atoms: [0, 1, 2], granularity: "residue" };
    render(<SelectionInspectorPanel selection={sel} snapshot={makeSnapshot()} onClear={vi.fn()} />);
    expect(screen.getByTestId("selection-inspector-panel").textContent).toContain("3");
  });

  it("shows granularity mode", () => {
    const sel: StructuralSelectionState = { atoms: [0], granularity: "chain" };
    render(<SelectionInspectorPanel selection={sel} snapshot={makeSnapshot()} onClear={vi.fn()} />);
    expect(screen.getByTestId("selection-inspector-panel").textContent).toContain("chain");
  });

  it("shows element counts", () => {
    const sel: StructuralSelectionState = { atoms: [0, 1, 2], granularity: "residue" };
    render(<SelectionInspectorPanel selection={sel} snapshot={makeSnapshot()} onClear={vi.fn()} />);
    const panel = screen.getByTestId("selection-inspector-panel");
    // Elements are C(6), N(7), O(8) — one of each
    expect(panel.textContent).toContain("C");
    expect(panel.textContent).toContain("N");
  });

  it("calls onClear when × is clicked", () => {
    const onClear = vi.fn();
    const sel: StructuralSelectionState = { atoms: [0], granularity: "atom" };
    render(<SelectionInspectorPanel selection={sel} snapshot={makeSnapshot()} onClear={onClear} />);
    fireEvent.click(screen.getByTestId("selection-inspector-clear"));
    expect(onClear).toHaveBeenCalled();
  });

  it("shows residue count when atomResNums available", () => {
    const sel: StructuralSelectionState = { atoms: [0, 1, 2, 3], granularity: "residue" };
    render(<SelectionInspectorPanel selection={sel} snapshot={makeSnapshot()} onClear={vi.fn()} />);
    const panel = screen.getByTestId("selection-inspector-panel");
    // Atoms 0-2 are res1/chainA, atoms 3-5 are res2/chainB → 2 residues shown for atoms 0-3
    expect(panel.textContent).toContain("Residues");
  });
});

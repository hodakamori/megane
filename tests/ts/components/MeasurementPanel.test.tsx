import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MeasurementPanel } from "@/components/MeasurementPanel";
import type { SelectionState, Measurement } from "@/types";

const onClear = vi.fn();

describe("MeasurementPanel", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders nothing when no atoms are selected", () => {
    const { container } = render(
      <MeasurementPanel
        selection={{ atoms: [] }}
        measurement={null}
        elements={null}
        onClear={onClear}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders selected atoms with element symbols", () => {
    const elements = new Uint8Array([6, 7, 8]); // C, N, O
    render(
      <MeasurementPanel
        selection={{ atoms: [0, 2] }}
        measurement={null}
        elements={elements}
        onClear={onClear}
      />
    );
    expect(screen.getByText("Selection")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("O")).toBeInTheDocument();
  });

  it("displays distance measurement", () => {
    const elements = new Uint8Array([6, 7]);
    const measurement: Measurement = {
      atoms: [0, 1],
      type: "distance",
      value: 1.47,
      label: "1.47 \u00c5",
    };
    render(
      <MeasurementPanel
        selection={{ atoms: [0, 1] }}
        measurement={measurement}
        elements={elements}
        onClear={onClear}
      />
    );
    expect(screen.getByText(/Distance/)).toBeInTheDocument();
    expect(screen.getByText(/1\.47/)).toBeInTheDocument();
  });

  it("displays angle measurement", () => {
    const elements = new Uint8Array([6, 7, 8]);
    const measurement: Measurement = {
      atoms: [0, 1, 2],
      type: "angle",
      value: 109.5,
      label: "109.5\u00b0",
    };
    render(
      <MeasurementPanel
        selection={{ atoms: [0, 1, 2] }}
        measurement={measurement}
        elements={elements}
        onClear={onClear}
      />
    );
    expect(screen.getByText(/Angle/)).toBeInTheDocument();
    expect(screen.getByText(/109\.5/)).toBeInTheDocument();
  });

  it("calls onClear when Clear button is clicked", () => {
    const clearFn = vi.fn();
    const elements = new Uint8Array([6]);
    render(
      <MeasurementPanel
        selection={{ atoms: [0] }}
        measurement={null}
        elements={elements}
        onClear={clearFn}
      />
    );
    fireEvent.click(screen.getByText("Clear"));
    expect(clearFn).toHaveBeenCalledTimes(1);
  });

  it("shows ? when elements is null", () => {
    render(
      <MeasurementPanel
        selection={{ atoms: [0] }}
        measurement={null}
        elements={null}
        onClear={onClear}
      />
    );
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});

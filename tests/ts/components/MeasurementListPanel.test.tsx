import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, act } from "@testing-library/react";
import { MeasurementListPanel } from "@/components/MeasurementListPanel";
import { useMeasurementStore, _resetIdCounter } from "@/stores/useMeasurementStore";
import * as exportUtils from "@/utils/measurementExport";
import type { Measurement } from "@/types";

function addMeasurement(m: Measurement) {
  act(() => {
    useMeasurementStore.getState().addMeasurement(m);
  });
}

const distanceMeasurement: Measurement = {
  atoms: [0, 1],
  type: "distance",
  value: 1.5,
  label: "1.500 Å",
};

const angleMeasurement: Measurement = {
  atoms: [0, 1, 2],
  type: "angle",
  value: 109.5,
  label: "109.5°",
};

describe("MeasurementListPanel", () => {
  beforeEach(() => {
    useMeasurementStore.setState({ measurements: [] });
    _resetIdCounter();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing when no measurements are stored", () => {
    const { container } = render(<MeasurementListPanel elements={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the panel when there is one measurement", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    expect(screen.getByTestId("measurement-list-panel")).toBeInTheDocument();
  });

  it("shows measurement count in header", () => {
    addMeasurement(distanceMeasurement);
    addMeasurement(angleMeasurement);
    render(<MeasurementListPanel elements={null} />);
    expect(screen.getByText(/Measurements \(2\)/)).toBeInTheDocument();
  });

  it("renders one row per measurement", () => {
    addMeasurement(distanceMeasurement);
    addMeasurement(angleMeasurement);
    render(<MeasurementListPanel elements={null} />);
    expect(screen.getAllByTestId("measurement-list-row")).toHaveLength(2);
  });

  it("shows measurement values", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    expect(screen.getByTestId("measurement-value").textContent).toBe("1.500 Å");
  });

  it("deletes a measurement when delete button is clicked", () => {
    addMeasurement(distanceMeasurement);
    addMeasurement(angleMeasurement);
    render(<MeasurementListPanel elements={null} />);
    const deleteButtons = screen.getAllByTestId("measurement-delete");
    fireEvent.click(deleteButtons[0]);
    expect(screen.getAllByTestId("measurement-list-row")).toHaveLength(1);
  });

  it("clears all measurements when Clear all is clicked", () => {
    addMeasurement(distanceMeasurement);
    addMeasurement(angleMeasurement);
    render(<MeasurementListPanel elements={null} />);
    fireEvent.click(screen.getByTestId("measurement-list-clear"));
    expect(screen.queryByTestId("measurement-list-panel")).toBeNull();
  });

  it("toggles visibility on ● click", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    const toggleBtn = screen.getByTestId("measurement-toggle-visibility");
    expect(toggleBtn.textContent).toBe("●");
    fireEvent.click(toggleBtn);
    expect(screen.getByTestId("measurement-toggle-visibility").textContent).toBe("○");
  });

  it("allows inline renaming via double-click", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    const nameEl = screen.getByTestId("measurement-name");
    fireEvent.doubleClick(nameEl);
    const input = screen.getByTestId("measurement-rename-input");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "My Bond" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByTestId("measurement-name").textContent).toBe("My Bond");
  });

  it("cancels rename on Escape", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    const originalName = screen.getByTestId("measurement-name").textContent;
    fireEvent.doubleClick(screen.getByTestId("measurement-name"));
    fireEvent.change(screen.getByTestId("measurement-rename-input"), {
      target: { value: "Changed" },
    });
    fireEvent.keyDown(screen.getByTestId("measurement-rename-input"), { key: "Escape" });
    expect(screen.getByTestId("measurement-name").textContent).toBe(originalName);
  });

  it("commits rename on blur", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    fireEvent.doubleClick(screen.getByTestId("measurement-name"));
    fireEvent.change(screen.getByTestId("measurement-rename-input"), {
      target: { value: "Blurred Name" },
    });
    fireEvent.blur(screen.getByTestId("measurement-rename-input"));
    expect(screen.getByTestId("measurement-name").textContent).toBe("Blurred Name");
  });

  it("ignores empty rename (keeps old name)", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    const originalName = screen.getByTestId("measurement-name").textContent!;
    fireEvent.doubleClick(screen.getByTestId("measurement-name"));
    fireEvent.change(screen.getByTestId("measurement-rename-input"), {
      target: { value: "   " },
    });
    fireEvent.keyDown(screen.getByTestId("measurement-rename-input"), { key: "Enter" });
    expect(screen.getByTestId("measurement-name").textContent).toBe(originalName);
  });

  it("triggers CSV export on CSV button click", () => {
    const spy = vi.spyOn(exportUtils, "downloadFile").mockImplementation(() => {});
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    fireEvent.click(screen.getByTestId("measurement-export-csv"));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Name,Type"), "measurements.csv", "text/csv");
    spy.mockRestore();
  });

  it("triggers JSON export on JSON button click", () => {
    const spy = vi.spyOn(exportUtils, "downloadFile").mockImplementation(() => {});
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    fireEvent.click(screen.getByTestId("measurement-export-json"));
    expect(spy).toHaveBeenCalledWith(expect.any(String), "measurements.json", "application/json");
    spy.mockRestore();
  });

  it("uses element symbols when elements array is provided", () => {
    const elements = new Uint8Array([6, 8]); // C, O
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={elements} />);
    const row = screen.getByTestId("measurement-list-row");
    expect(row.textContent).toContain("C0");
    expect(row.textContent).toContain("O1");
  });

  it("shows ? when elements is null", () => {
    addMeasurement(distanceMeasurement);
    render(<MeasurementListPanel elements={null} />);
    expect(screen.getByTestId("measurement-list-row").textContent).toContain("?0");
  });
});

import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AnalysisPlotsPanel } from "@/components/AnalysisPlotsPanel";
import type { PlotData } from "@/pipeline/types";

afterEach(() => {
  cleanup();
});

function makePlot(title = "RDF: O–O"): PlotData {
  return {
    type: "plot",
    kind: "line",
    title,
    xLabel: "r (Å)",
    yLabel: "g(r)",
    x: [0.5, 1.5, 2.5],
    y: [0.0, 0.5, 1.0],
  };
}

describe("AnalysisPlotsPanel", () => {
  it("renders nothing when plots array is empty", () => {
    const { container } = render(<AnalysisPlotsPanel plots={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the panel container when plots are provided", () => {
    render(<AnalysisPlotsPanel plots={[makePlot()]} />);
    expect(screen.getByTestId("analysis-plots-panel")).toBeTruthy();
  });

  it("renders one card per plot", () => {
    render(<AnalysisPlotsPanel plots={[makePlot("RDF: O–O"), makePlot("RDF: O–H")]} />);
    const cards = screen.getAllByTestId("analysis-plot-card");
    expect(cards).toHaveLength(2);
  });

  it("shows the SVG chart inside each card", () => {
    const { container } = render(<AnalysisPlotsPanel plots={[makePlot()]} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("collapses and expands a card on header click", () => {
    const { container } = render(<AnalysisPlotsPanel plots={[makePlot()]} />);
    const card = container.querySelector("[data-testid='analysis-plot-card']")!;
    const header = card.querySelector("div")!;

    // Initially expanded — SVG should be visible
    expect(card.querySelector("svg")).not.toBeNull();

    // Click header to collapse
    fireEvent.click(header);
    expect(card.querySelector("svg")).toBeNull();

    // Click again to expand
    fireEvent.click(header);
    expect(card.querySelector("svg")).not.toBeNull();
  });
});

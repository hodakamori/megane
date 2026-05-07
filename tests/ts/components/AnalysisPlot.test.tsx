import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AnalysisPlot } from "@/components/AnalysisPlot";
import type { PlotData } from "@/pipeline/types";

afterEach(() => {
  cleanup();
});

function makePlot(extra: Partial<PlotData> = {}): PlotData {
  const N = 10;
  return {
    type: "plot",
    kind: "line",
    title: "RDF: O–O",
    xLabel: "r (Å)",
    yLabel: "g(r)",
    x: Array.from({ length: N }, (_, i) => (i + 0.5) * 0.5),
    y: Array.from({ length: N }, () => 1.0),
    ...extra,
  };
}

describe("AnalysisPlot", () => {
  it("renders an SVG with the correct aria-label", () => {
    const { container } = render(<AnalysisPlot plot={makePlot()} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-label")).toBe("RDF: O–O");
  });

  it("displays the plot title text", () => {
    render(<AnalysisPlot plot={makePlot({ title: "RDF: O–H" })} />);
    expect(screen.getByText("RDF: O–H")).toBeTruthy();
  });

  it("displays the x-axis label", () => {
    render(<AnalysisPlot plot={makePlot({ xLabel: "r (Å)" })} />);
    expect(screen.getByText("r (Å)")).toBeTruthy();
  });

  it("displays the y-axis label", () => {
    render(<AnalysisPlot plot={makePlot({ yLabel: "g(r)" })} />);
    expect(screen.getByText("g(r)")).toBeTruthy();
  });

  it("renders a path element for the data line", () => {
    const { container } = render(<AnalysisPlot plot={makePlot()} />);
    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    expect(path?.getAttribute("d")).toMatch(/^M/);
  });

  it("returns null when x is empty", () => {
    const { container } = render(<AnalysisPlot plot={makePlot({ x: [], y: [] })} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders tick marks as line elements", () => {
    const { container } = render(<AnalysisPlot plot={makePlot()} />);
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBeGreaterThan(0);
  });

  it("renders axis border lines", () => {
    const { container } = render(<AnalysisPlot plot={makePlot()} />);
    // Axes are rendered as <line> elements — at least x and y axes
    const lines = Array.from(container.querySelectorAll("line"));
    expect(lines.length).toBeGreaterThanOrEqual(2);
  });
});

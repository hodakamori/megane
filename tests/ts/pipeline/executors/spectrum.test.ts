import { describe, it, expect } from "vitest";
import { executeLoadSpectrum, selectPlottedSpectrum } from "@/pipeline/executors/spectrum";
import { defaultParams } from "@/pipeline/types";
import type { LoadSpectrumParams, PipelineData, SpectrumData } from "@/pipeline/types";
import { isJcampDx, isSpectrumFileName, SPECTRUM_EXTS } from "@/parsers/spectrum";
import {
  buildPlot,
  formatTick,
  resolveConnectedSpectrum,
} from "@/components/nodes/SpectrumPlotNode";

function makeSpectrum(n = 4): SpectrumData {
  return {
    type: "spectrum",
    title: "Ethanol",
    dataType: "INFRARED SPECTRUM",
    xUnits: "1/CM",
    yUnits: "TRANSMITTANCE",
    x: Float64Array.from({ length: n }, (_, i) => 400 + i * 100),
    y: Float64Array.from({ length: n }, (_, i) => 100 - i * 10),
  };
}

describe("defaultParams for the spectrum nodes", () => {
  it("load_spectrum starts empty", () => {
    expect(defaultParams("load_spectrum")).toEqual({ type: "load_spectrum", fileName: null });
  });

  it("spectrum_plot defaults to the reversed IR/NMR abscissa", () => {
    expect(defaultParams("spectrum_plot")).toEqual({
      type: "spectrum_plot",
      reverseX: true,
      color: "#84cc16",
    });
  });
});

describe("executeLoadSpectrum", () => {
  it("emits the decoded spectrum on the spectrum port", () => {
    const spectrum = makeSpectrum();
    const params: LoadSpectrumParams = {
      type: "load_spectrum",
      fileName: "ethanol.jdx",
      spectrumData: spectrum,
    };
    const out = executeLoadSpectrum(params);
    expect(out.get("spectrum")).toBe(spectrum);
  });

  it("emits nothing when no file has been loaded", () => {
    const out = executeLoadSpectrum({ type: "load_spectrum", fileName: null });
    expect(out.size).toBe(0);
  });
});

describe("selectPlottedSpectrum", () => {
  it("picks the first spectrum on the input port", () => {
    const spectrum = makeSpectrum();
    const inputs = new Map<string, PipelineData[]>([["spectrum", [spectrum]]]);
    expect(selectPlottedSpectrum(inputs)).toBe(spectrum);
  });

  it("returns null when nothing is wired in", () => {
    expect(selectPlottedSpectrum(new Map())).toBeNull();
  });
});

describe("spectrum file dispatch", () => {
  it("accepts .jdx, .jcamp, and .dx", () => {
    expect(SPECTRUM_EXTS).toEqual([".jdx", ".jcamp", ".dx"]);
    expect(isSpectrumFileName("ethanol.JDX")).toBe(true);
    expect(isSpectrumFileName("ir.jcamp")).toBe(true);
    expect(isSpectrumFileName("potential.dx")).toBe(true);
    expect(isSpectrumFileName("1crn.pdb")).toBe(false);
  });

  it("sniffs JCAMP-DX apart from an OpenDX grid sharing .dx", () => {
    expect(isJcampDx("##TITLE=Ethanol\n##JCAMP-DX=4.24\n")).toBe(true);
    expect(isJcampDx("# comment\n##JCAMP-DX=4.24\n")).toBe(true);
    expect(isJcampDx("object 1 class gridpositions counts 2 2 2\norigin 0 0 0\n")).toBe(false);
    expect(isJcampDx("ATOM      1  N   MET A   1\n")).toBe(false);
  });
});

describe("buildPlot", () => {
  it("maps the first and last points to opposite ends of the plot area", () => {
    const plot = buildPlot([0, 10], [0, 1], false)!;
    const [first, last] = plot.points.split(" ");
    expect(Number(first.split(",")[0])).toBeLessThan(Number(last.split(",")[0]));
    expect(plot.xMin).toBe(0);
    expect(plot.xMax).toBe(10);
  });

  it("mirrors the abscissa when reverseX is set (the IR/NMR convention)", () => {
    const forward = buildPlot([0, 10], [0, 1], false)!;
    const reversed = buildPlot([0, 10], [0, 1], true)!;
    const fx0 = Number(forward.points.split(" ")[0].split(",")[0]);
    const rx0 = Number(reversed.points.split(" ")[0].split(",")[0]);
    expect(rx0).toBeGreaterThan(fx0);
  });

  it("inverts the ordinate for SVG's downward y axis", () => {
    const plot = buildPlot([0, 1], [0, 100], false)!;
    const [p0, p1] = plot.points.split(" ").map((p) => Number(p.split(",")[1]));
    expect(p0).toBeGreaterThan(p1); // the larger value sits higher, i.e. smaller y
  });

  it("draws a flat trace instead of dividing by zero", () => {
    const plot = buildPlot([0, 1, 2], [7, 7, 7], false)!;
    expect(plot.points.split(" ")).toHaveLength(3);
    expect(plot.yMin).toBe(7);
    expect(plot.yMax).toBe(7);
  });

  it("returns null for fewer than two points", () => {
    expect(buildPlot([1], [1], false)).toBeNull();
    expect(buildPlot([], [], false)).toBeNull();
  });
});

describe("formatTick", () => {
  it("keeps ordinary magnitudes short", () => {
    expect(formatTick(0)).toBe("0");
    expect(formatTick(4000)).toBe("4000");
    expect(formatTick(99.98765)).toBe("100");
  });

  it("switches to exponent form at the extremes", () => {
    expect(formatTick(1e6)).toBe("1.0e+6");
    expect(formatTick(1e-6)).toBe("1.0e-6");
  });
});

describe("resolveConnectedSpectrum", () => {
  const spectrum = makeSpectrum();
  const nodes = [
    {
      id: "ls1",
      type: "load_spectrum",
      position: { x: 0, y: 0 },
      data: {
        params: { type: "load_spectrum", fileName: "e.jdx", spectrumData: spectrum },
        enabled: true,
      },
    },
    {
      id: "ls2",
      type: "load_spectrum",
      position: { x: 0, y: 0 },
      data: { params: { type: "load_spectrum", fileName: null }, enabled: true },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any;

  it("walks one edge back to the source node's decoded spectrum", () => {
    const edges = [{ source: "ls1", target: "plot", targetHandle: "spectrum" }];
    expect(resolveConnectedSpectrum("plot", nodes, edges)).toBe(spectrum);
  });

  it("ignores a source that has not loaded anything yet", () => {
    const edges = [{ source: "ls2", target: "plot", targetHandle: "spectrum" }];
    expect(resolveConnectedSpectrum("plot", nodes, edges)).toBeNull();
  });

  it("ignores edges into a different node", () => {
    const edges = [{ source: "ls1", target: "other", targetHandle: "spectrum" }];
    expect(resolveConnectedSpectrum("plot", nodes, edges)).toBeNull();
  });

  it("returns null when nothing is wired in", () => {
    expect(resolveConnectedSpectrum("plot", nodes, [])).toBeNull();
  });
});

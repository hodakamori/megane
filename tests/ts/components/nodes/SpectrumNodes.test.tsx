import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { usePipelineStore } from "@/pipeline/store";
import { LoadSpectrumNode } from "@/components/nodes/LoadSpectrumNode";
import { SpectrumPlotNode } from "@/components/nodes/SpectrumPlotNode";
import type { LoadSpectrumParams, SpectrumData, SpectrumPlotParams } from "@/pipeline/types";
import { seedPipelineStore } from "./_helpers";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));

// The decode itself lives in WASM; these tests exercise the component wiring,
// so the parser facade is mocked. The decoding is covered by the Rust tests.
vi.mock("@/parsers/spectrum", async () => {
  const actual = await vi.importActual<typeof import("@/parsers/spectrum")>("@/parsers/spectrum");
  return {
    ...actual,
    parseSpectrum: vi.fn(async (text: string) => {
      if (!actual.isJcampDx(text)) {
        throw new Error("This file is not a JCAMP-DX spectrum.");
      }
      return {
        type: "spectrum",
        title: "Ethanol",
        dataType: "INFRARED SPECTRUM",
        xUnits: "1/CM",
        yUnits: "TRANSMITTANCE",
        x: new Float64Array([400, 500, 600]),
        y: new Float64Array([100, 40, 90]),
      } satisfies SpectrumData;
    }),
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nodeProps(id: string, params: unknown, type: string): any {
  return {
    id,
    type,
    data: { params, enabled: true },
    selected: false,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    zIndex: 0,
    dragging: false,
  };
}

const JCAMP = "##TITLE=Ethanol\n##JCAMP-DX=4.24\n##XYDATA=(X++(Y..Y))\n400 1 2 3\n##END=\n";
const OPENDX = "object 1 class gridpositions counts 2 2 2\norigin 0 0 0\n";

function dropOnSpectrumNode(name: string, text: string) {
  const file = new File([text], name, { type: "text/plain" });
  fireEvent.drop(screen.getByTestId("load-spectrum-dropzone"), {
    dataTransfer: { files: [file] },
  });
}

describe("LoadSpectrumNode", () => {
  beforeEach(() => cleanup());

  it("renders the empty placeholder", () => {
    const seeded = seedPipelineStore("load_spectrum", { id: "sp1" });
    render(
      <LoadSpectrumNode
        {...nodeProps("sp1", seeded.data.params as LoadSpectrumParams, "load_spectrum")}
      />,
    );
    expect(screen.getByTestId("load-spectrum-filename")).toHaveTextContent("No spectrum loaded");
  });

  it("decodes a dropped .jdx and records the spectrum", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_spectrum", { id: "sp1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LoadSpectrumNode
        {...nodeProps("sp1", seeded.data.params as LoadSpectrumParams, "load_spectrum")}
      />,
    );

    dropOnSpectrumNode("ethanol.jdx", JCAMP);

    await waitFor(() => expect(updateNodeParams).toHaveBeenCalled());
    const [, params] = updateNodeParams.mock.calls[0];
    expect(params.fileName).toBe("ethanol.jdx");
    expect(params.parseError).toBeNull();
    expect(params.spectrumData?.x.length).toBe(3);
  });

  it("records an actionable error for a .dx that is really an OpenDX grid", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_spectrum", { id: "sp1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LoadSpectrumNode
        {...nodeProps("sp1", seeded.data.params as LoadSpectrumParams, "load_spectrum")}
      />,
    );

    dropOnSpectrumNode("potential.dx", OPENDX);

    await waitFor(() => expect(updateNodeParams).toHaveBeenCalled());
    const [, params] = updateNodeParams.mock.calls[0];
    expect(params.spectrumData).toBeNull();
    expect(params.parseError).toMatch(/not a JCAMP-DX spectrum/);
  });

  it("ignores an unsupported extension", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_spectrum", { id: "sp1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LoadSpectrumNode
        {...nodeProps("sp1", seeded.data.params as LoadSpectrumParams, "load_spectrum")}
      />,
    );
    dropOnSpectrumNode("1crn.pdb", "ATOM");
    expect(updateNodeParams).not.toHaveBeenCalled();
  });

  it("accepts the drag so the browser does not navigate away", () => {
    const seeded = seedPipelineStore("load_spectrum", { id: "sp1" });
    render(
      <LoadSpectrumNode
        {...nodeProps("sp1", seeded.data.params as LoadSpectrumParams, "load_spectrum")}
      />,
    );
    const dropzone = screen.getByTestId("load-spectrum-dropzone");
    const accepted = fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });
    // fireEvent returns false once preventDefault() has been called.
    expect(accepted).toBe(false);
  });

  it("loads through the file picker and clears the input for a re-pick", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_spectrum", { id: "sp1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LoadSpectrumNode
        {...nodeProps("sp1", seeded.data.params as LoadSpectrumParams, "load_spectrum")}
      />,
    );

    // The visible button forwards to the hidden input.
    const input = screen.getByTestId("load-spectrum-input") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    fireEvent.click(screen.getByText("Load spectrum..."));
    expect(clickSpy).toHaveBeenCalled();

    const file = new File([JCAMP], "ethanol.jdx", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(updateNodeParams).toHaveBeenCalled());
    expect(updateNodeParams.mock.calls[0][1].fileName).toBe("ethanol.jdx");
    // Reset so picking the same file twice still fires a change event.
    expect(input.value).toBe("");
  });

  it("summarises a loaded spectrum", () => {
    const seeded = seedPipelineStore("load_spectrum", {
      id: "sp1",
      params: {
        fileName: "ethanol.jdx",
        spectrumData: {
          type: "spectrum",
          title: "Ethanol",
          dataType: "INFRARED SPECTRUM",
          xUnits: "1/CM",
          yUnits: "TRANSMITTANCE",
          x: new Float64Array([1, 2, 3]),
          y: new Float64Array([1, 2, 3]),
        },
      },
    });
    render(
      <LoadSpectrumNode
        {...nodeProps("sp1", seeded.data.params as LoadSpectrumParams, "load_spectrum")}
      />,
    );
    expect(screen.getByTestId("load-spectrum-summary")).toHaveTextContent("INFRARED SPECTRUM");
    expect(screen.getByTestId("load-spectrum-summary")).toHaveTextContent("3 points");
  });
});

describe("SpectrumPlotNode", () => {
  const spectrum: SpectrumData = {
    type: "spectrum",
    title: "Ethanol IR",
    dataType: "INFRARED SPECTRUM",
    xUnits: "1/CM",
    yUnits: "TRANSMITTANCE",
    x: new Float64Array([400, 500, 600, 700]),
    y: new Float64Array([100, 40, 90, 95]),
  };

  beforeEach(() => {
    cleanup();
    usePipelineStore.setState({
      nodes: [
        {
          id: "ls1",
          type: "load_spectrum",
          position: { x: 0, y: 0 },
          data: {
            params: { type: "load_spectrum", fileName: "e.jdx", spectrumData: spectrum },
            enabled: true,
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
      edges: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { id: "e1", source: "ls1", target: "pl1", targetHandle: "spectrum" } as any,
      ],
    });
  });

  const params: SpectrumPlotParams = { type: "spectrum_plot", reverseX: true, color: "#84cc16" };

  it("draws the trace, the title, and the unit labels", () => {
    render(<SpectrumPlotNode {...nodeProps("pl1", params, "spectrum_plot")} />);
    expect(screen.getByTestId("spectrum-plot-title")).toHaveTextContent("Ethanol IR");
    const trace = screen.getByTestId("spectrum-plot-trace");
    expect(trace.getAttribute("points")?.split(" ")).toHaveLength(4);
    expect(trace.getAttribute("stroke")).toBe("#84cc16");
    expect(screen.getByTestId("spectrum-plot-svg")).toBeInTheDocument();
    expect(screen.getByText("1/CM")).toBeInTheDocument();
    expect(screen.getByText("TRANSMITTANCE")).toBeInTheDocument();
  });

  it("shows the high abscissa on the left when reverseX is set", () => {
    render(<SpectrumPlotNode {...nodeProps("pl1", params, "spectrum_plot")} />);
    // Reversed: 700 on the left, 400 on the right.
    expect(screen.getByText("700")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
  });

  it("toggles reverseX through the store", () => {
    const updateNodeParams = vi.fn();
    usePipelineStore.setState({ updateNodeParams });
    render(<SpectrumPlotNode {...nodeProps("pl1", params, "spectrum_plot")} />);
    fireEvent.click(screen.getByTestId("spectrum-plot-reverse"));
    expect(updateNodeParams).toHaveBeenCalledWith("pl1", { reverseX: false });
  });

  it("shows the empty state when nothing is wired in", () => {
    usePipelineStore.setState({ edges: [] });
    render(<SpectrumPlotNode {...nodeProps("pl1", params, "spectrum_plot")} />);
    expect(screen.getByTestId("spectrum-plot-empty")).toHaveTextContent("No spectrum connected");
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { usePipelineStore } from "@/pipeline/store";
import { LoadVolumetricNode } from "@/components/nodes/LoadVolumetricNode";
import type { LoadVolumetricParams } from "@/pipeline/types";
import { seedPipelineStore } from "./_helpers";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));

function nodeProps(id: string, params: LoadVolumetricParams, enabled = true) {
  return {
    id,
    type: "load_volumetric" as const,
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

const DX = [
  "object 1 class gridpositions counts 2 2 2",
  "origin 0 0 0",
  "delta 1 0 0",
  "delta 0 1 0",
  "delta 0 0 1",
  "object 3 class array type double rank 0 items 8 data follows",
  "1 2 3 4 5 6 7 8",
].join("\n");

const JCAMP = "##TITLE=Ethanol\n##JCAMP-DX=4.24\n##XYDATA=(X++(Y..Y))\n400 1 2\n##END=\n";

/** jsdom's FileReader is real, so a File carrying text resolves normally. */
function dropFile(name: string, text: string) {
  const file = new File([text], name, { type: "text/plain" });
  const zone = screen.getByTestId("load-volumetric-dropzone");
  fireEvent.drop(zone, { dataTransfer: { files: [file] } });
}

describe("LoadVolumetricNode", () => {
  beforeEach(() => {
    cleanup();
  });

  it("renders the multi-format placeholder", () => {
    const seeded = seedPipelineStore("load_volumetric", { id: "lv1" });
    render(
      <LoadVolumetricNode {...nodeProps("lv1", seeded.data.params as LoadVolumetricParams)} />,
    );
    expect(screen.getByText("No volumetric file loaded")).toBeInTheDocument();
  });

  it("parses a dropped OpenDX grid", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_volumetric", { id: "lv1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LoadVolumetricNode {...nodeProps("lv1", seeded.data.params as LoadVolumetricParams)} />,
    );

    dropFile("potential.dx", DX);

    await waitFor(() => expect(updateNodeParams).toHaveBeenCalled());
    const [, params] = updateNodeParams.mock.calls[0];
    expect(params.fileName).toBe("potential.dx");
    expect(params.parseError).toBeNull();
    expect(params.volumetricData?.data.length).toBe(8);
  });

  it("records an actionable error for a .dx that is really a JCAMP-DX spectrum", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_volumetric", { id: "lv1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LoadVolumetricNode {...nodeProps("lv1", seeded.data.params as LoadVolumetricParams)} />,
    );

    dropFile("ethanol.dx", JCAMP);

    await waitFor(() => expect(updateNodeParams).toHaveBeenCalled());
    const [, params] = updateNodeParams.mock.calls[0];
    expect(params.volumetricData).toBeNull();
    expect(params.parseError).toMatch(/JCAMP-DX spectrum/);
  });

  it("ignores a file with an unsupported extension", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_volumetric", { id: "lv1" });
    usePipelineStore.setState({ updateNodeParams });
    render(
      <LoadVolumetricNode {...nodeProps("lv1", seeded.data.params as LoadVolumetricParams)} />,
    );

    dropFile("notes.txt", "hello");

    expect(updateNodeParams).not.toHaveBeenCalled();
  });

  it("parses a CUBE chosen through the file picker", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("load_volumetric", { id: "lv1" });
    usePipelineStore.setState({ updateNodeParams });
    const { container } = render(
      <LoadVolumetricNode {...nodeProps("lv1", seeded.data.params as LoadVolumetricParams)} />,
    );

    const cube = [
      "comment 1",
      "comment 2",
      "1 0.0 0.0 0.0",
      "2 1.0 0.0 0.0",
      "2 0.0 1.0 0.0",
      "2 0.0 0.0 1.0",
      "6 6.0 0.0 0.0 0.0",
      "1 2 3 4 5 6 7 8",
    ].join("\n");
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, "files", {
      value: [new File([cube], "density.cube", { type: "text/plain" })],
      configurable: true,
    });
    fireEvent.change(input);

    await waitFor(() => expect(updateNodeParams).toHaveBeenCalled());
    const [, params] = updateNodeParams.mock.calls[0];
    expect(params.fileName).toBe("density.cube");
    expect(params.volumetricData?.nx).toBe(2);
  });

  it("shows the voxel dimensions once a grid is loaded", () => {
    const seeded = seedPipelineStore("load_volumetric", {
      id: "lv1",
      params: {
        fileName: "potential.dx",
        volumetricData: {
          type: "volumetric",
          nx: 4,
          ny: 5,
          nz: 6,
          origin: new Float32Array(3),
          step: new Float32Array(9),
          data: new Float32Array(120),
          dataMin: 0,
          dataMax: 1,
        },
      },
    });
    render(
      <LoadVolumetricNode {...nodeProps("lv1", seeded.data.params as LoadVolumetricParams)} />,
    );
    expect(screen.getByText("4×5×6 voxels")).toBeInTheDocument();
  });

  it("surfaces the stored parse error in the node body", () => {
    const seeded = seedPipelineStore("load_volumetric", {
      id: "lv1",
      params: {
        fileName: "ethanol.dx",
        volumetricData: null,
        parseError: "This .dx file is not an OpenDX grid.",
      },
    });
    render(
      <LoadVolumetricNode {...nodeProps("lv1", seeded.data.params as LoadVolumetricParams)} />,
    );
    expect(screen.getByTestId("load-volumetric-error")).toHaveTextContent(
      "This .dx file is not an OpenDX grid.",
    );
  });
});

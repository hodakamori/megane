import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { usePipelineStore } from "@/pipeline/store";
import { AddBondNode } from "@/components/nodes/AddBondNode";
import type { AddBondParams } from "@/pipeline/types";
import { seedPipelineStore } from "./_helpers";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));
vi.mock("@/parsers/structure", () => ({
  parseTopBonds: vi.fn(async () => new Uint32Array([0, 1, 2, 3])),
  parsePsfBonds: vi.fn(async () => new Uint32Array([])),
}));

import { parseTopBonds } from "@/parsers/structure";

const mockedParseTopBonds = vi.mocked(parseTopBonds);

/**
 * Build a File whose `.text()` resolves to the given string. jsdom's File
 * does not implement `text()` in the version bundled with vitest, and the
 * production code awaits it.
 */
function makeFileWithText(name: string, text: string): File {
  const file = new File([text], name, { type: "text/plain" });
  Object.defineProperty(file, "text", {
    value: () => Promise.resolve(text),
    configurable: true,
  });
  return file;
}

function nodeProps(id: string, params: AddBondParams, enabled = true) {
  return {
    id,
    type: "add_bond" as const,
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

describe("AddBondNode", () => {
  beforeEach(() => {
    cleanup();
    mockedParseTopBonds.mockClear();
    mockedParseTopBonds.mockResolvedValue(new Uint32Array([0, 1, 2, 3]));
  });

  it("renders three tab buttons: File / VDW / Topology", () => {
    const seeded = seedPipelineStore("add_bond", { id: "ab1" });
    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    expect(screen.getByRole("tab", { name: "File" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "VDW" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Topology" })).toBeInTheDocument();
  });

  it("clicking a tab calls updateNodeParams with the new bondSource", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "distance" },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    fireEvent.click(screen.getByRole("tab", { name: "File" }));
    expect(updateNodeParams).toHaveBeenCalledWith("ab1", { bondSource: "structure" });

    fireEvent.click(screen.getByRole("tab", { name: "Topology" }));
    expect(updateNodeParams).toHaveBeenCalledWith("ab1", { bondSource: "file" });
  });

  it("hides the topology upload UI when bondSource !== 'file'", () => {
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "distance" },
    });
    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    expect(screen.queryByText("Load .top / .psf...")).toBeNull();
    expect(screen.queryByText("No topology loaded")).toBeNull();
  });

  it("shows 'No topology loaded' placeholder when bondSource='file' and no file selected", () => {
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "file" },
    });
    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    expect(screen.getByText("No topology loaded")).toBeInTheDocument();
    expect(screen.getByText("Load .top / .psf...")).toBeInTheDocument();
  });

  it("shows the topology filename when bondSource='file' and bondFileName is set", () => {
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "file", bondFileName: "system.top" },
    });
    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    expect(screen.getByText("system.top")).toBeInTheDocument();
    expect(screen.queryByText("No topology loaded")).toBeNull();
  });

  it("uploading a .top file parses it and dispatches the parsed bonds to the store", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "file" },
    });
    usePipelineStore.setState({ updateNodeParams });

    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    const fileText = "[ bonds ]\n1 2";
    const file = makeFileWithText("system.top", fileText);
    const input = screen.getByText("Load .top / .psf...").parentElement!.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
      configurable: true,
    });
    fireEvent.change(input);

    await waitFor(() => {
      expect(mockedParseTopBonds).toHaveBeenCalledTimes(1);
    });
    expect(mockedParseTopBonds).toHaveBeenCalledWith(fileText, 0xffffffff);
    expect(updateNodeParams).toHaveBeenCalledWith("ab1", {
      bondSource: "file",
      bondFileName: "system.top",
      bondFileData: expect.any(Uint32Array),
    });
    const dispatchedData = updateNodeParams.mock.calls[0][1].bondFileData as Uint32Array;
    expect(Array.from(dispatchedData)).toEqual([0, 1, 2, 3]);
  });

  it("shows the VDW threshold slider only when bondSource='distance'", () => {
    const distance = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "distance" },
    });
    const { rerender } = render(
      <AddBondNode {...nodeProps("ab1", distance.data.params as AddBondParams)} />,
    );
    expect(screen.getByTestId("add-bond-vdw-scale")).toBeInTheDocument();

    const file = seedPipelineStore("add_bond", {
      id: "ab2",
      params: { bondSource: "file" },
    });
    rerender(<AddBondNode {...nodeProps("ab2", file.data.params as AddBondParams)} />);
    expect(screen.queryByTestId("add-bond-vdw-scale")).toBeNull();
  });

  it("defaults the threshold slider to 0.6 and displays the value", () => {
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "distance" },
    });
    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    const slider = screen.getByTestId("add-bond-vdw-scale") as HTMLInputElement;
    expect(slider.value).toBe("0.6");
    expect(screen.getByText("0.60")).toBeInTheDocument();
  });

  it("reflects an explicit vdwScale and dispatches changes via updateNodeParams", () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "distance", vdwScale: 0.9 },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    const slider = screen.getByTestId("add-bond-vdw-scale") as HTMLInputElement;
    expect(slider.value).toBe("0.9");
    expect(screen.getByText("0.90")).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: "0.75" } });
    expect(updateNodeParams).toHaveBeenCalledWith("ab1", { vdwScale: 0.75 });
  });

  it("uploading a non-.top file does not call the parser or dispatch", async () => {
    const updateNodeParams = vi.fn();
    const seeded = seedPipelineStore("add_bond", {
      id: "ab1",
      params: { bondSource: "file" },
    });
    usePipelineStore.setState({ updateNodeParams });

    render(<AddBondNode {...nodeProps("ab1", seeded.data.params as AddBondParams)} />);

    const file = new File(["junk"], "system.json", { type: "application/json" });
    const input = screen.getByText("Load .top / .psf...").parentElement!.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    Object.defineProperty(input, "files", {
      value: [file],
      writable: false,
      configurable: true,
    });
    fireEvent.change(input);

    // Allow any pending async work to flush.
    await new Promise((r) => setTimeout(r, 0));

    expect(mockedParseTopBonds).not.toHaveBeenCalled();
    expect(updateNodeParams).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DropZone, TabSelector, matchesAccept } from "@/components/ui";

afterEach(() => {
  cleanup();
});

describe("matchesAccept", () => {
  it("matches by extension case-insensitively", () => {
    expect(matchesAccept("foo.PDB", [".pdb"])).toBe(true);
    expect(matchesAccept("foo.xyz", [".pdb", ".xyz"])).toBe(true);
    expect(matchesAccept("foo.txt", [".pdb"])).toBe(false);
  });
});

describe("DropZone", () => {
  it("invokes onFile when a matching file is dropped", () => {
    const onFile = vi.fn();
    render(
      <DropZone accept=".pdb" exts={[".pdb"]} onFile={onFile} label="Open" testId="dz">
        <div>placeholder</div>
      </DropZone>,
    );

    const file = new File(["..."], "test.pdb", { type: "chemical/x-pdb" });
    const dropzone = screen.getByTestId("dz-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it("ignores dropped files that don't match the accept list", () => {
    const onFile = vi.fn();
    render(
      <DropZone accept=".pdb" exts={[".pdb"]} onFile={onFile} label="Open" testId="dz">
        <div>placeholder</div>
      </DropZone>,
    );

    const file = new File(["..."], "test.txt");
    const dropzone = screen.getByTestId("dz-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFile).not.toHaveBeenCalled();
  });

  it("invokes onFile when a matching file is selected via the input", () => {
    const onFile = vi.fn();
    render(
      <DropZone accept=".pdb" exts={[".pdb"]} onFile={onFile} label="Open" testId="dz">
        <div />
      </DropZone>,
    );

    const file = new File(["..."], "ok.pdb");
    const input = screen.getByTestId("dz-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFile).toHaveBeenCalledWith(file);
  });
});

describe("TabSelector", () => {
  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
    { value: "c", label: "Gamma" },
  ];

  it("calls onChange when an inactive non-disabled option is clicked", () => {
    const onChange = vi.fn();
    render(<TabSelector options={options} value="a" onChange={onChange} />);

    fireEvent.click(screen.getByText("Beta"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("does not call onChange when the active option is clicked", () => {
    const onChange = vi.fn();
    render(<TabSelector options={options} value="a" onChange={onChange} />);
    fireEvent.click(screen.getByText("Alpha"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders disabled options with the muted color and ignores clicks", () => {
    const onChange = vi.fn();
    const disabled = new Set(["c"]);
    render(
      <TabSelector options={options} value="a" onChange={onChange} disabledOptions={disabled} />,
    );

    const gamma = screen.getByText("Gamma") as HTMLButtonElement;
    expect(gamma.disabled).toBe(true);
    fireEvent.click(gamma);
    expect(onChange).not.toHaveBeenCalled();
  });
});

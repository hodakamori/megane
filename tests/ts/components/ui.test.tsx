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

  it("exposes tablist/tab roles with aria-selected reflecting the active option", () => {
    render(
      <TabSelector
        options={options}
        value="b"
        onChange={() => {}}
        ariaLabel="Choose"
        tabIdFor={(v) => `t-${v}`}
        panelIdFor={(v) => `p-${v}`}
        testIdFor={(v) => `tab-${v}`}
      />,
    );

    const tablist = screen.getByRole("tablist", { name: "Choose" });
    expect(tablist).toBeTruthy();

    const beta = screen.getByTestId("tab-b");
    expect(beta.getAttribute("role")).toBe("tab");
    expect(beta.getAttribute("aria-selected")).toBe("true");
    expect(beta.getAttribute("aria-controls")).toBe("p-b");
    expect(beta.getAttribute("id")).toBe("t-b");
    expect(beta.getAttribute("tabindex")).toBe("0");

    const alpha = screen.getByTestId("tab-a");
    expect(alpha.getAttribute("aria-selected")).toBe("false");
    expect(alpha.getAttribute("tabindex")).toBe("-1");
  });

  it("size=\"compact\" renders smaller buttons with no bottom margin", () => {
    render(
      <TabSelector
        options={options}
        value="a"
        onChange={() => {}}
        size="compact"
        testIdFor={(v) => `tab-${v}`}
      />,
    );

    const tablist = screen.getByRole("tablist");
    expect(tablist.style.marginBottom).toBe("0px");

    const alpha = screen.getByTestId("tab-a") as HTMLButtonElement;
    expect(alpha.style.fontSize).toBe("12px");
    expect(alpha.style.padding).toBe("4px 0px");
  });

  it("size defaults to the larger sizing when no size prop is passed", () => {
    render(<TabSelector options={options} value="a" onChange={() => {}} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.style.marginBottom).toBe("10px");
  });
});

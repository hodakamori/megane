import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SelectionGranularityToggle } from "@/components/SelectionGranularityToggle";

afterEach(() => cleanup());

describe("SelectionGranularityToggle", () => {
  it("renders four granularity buttons", () => {
    render(<SelectionGranularityToggle granularity="atom" onChange={vi.fn()} />);
    expect(screen.getByTestId("granularity-atom")).toBeTruthy();
    expect(screen.getByTestId("granularity-residue")).toBeTruthy();
    expect(screen.getByTestId("granularity-chain")).toBeTruthy();
    expect(screen.getByTestId("granularity-ss")).toBeTruthy();
  });

  it("calls onChange with the selected granularity", () => {
    const onChange = vi.fn();
    render(<SelectionGranularityToggle granularity="atom" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("granularity-residue"));
    expect(onChange).toHaveBeenCalledWith("residue");
  });

  it("calls onChange when chain button is clicked", () => {
    const onChange = vi.fn();
    render(<SelectionGranularityToggle granularity="residue" onChange={onChange} />);
    fireEvent.click(screen.getByTestId("granularity-chain"));
    expect(onChange).toHaveBeenCalledWith("chain");
  });

  it("active button reflects current granularity", () => {
    render(<SelectionGranularityToggle granularity="residue" onChange={vi.fn()} />);
    const residueBtn = screen.getByTestId("granularity-residue") as HTMLButtonElement;
    // Active button has blue background; check fontWeight as proxy
    expect(residueBtn.style.fontWeight).toBe("600");
  });

  it("inactive buttons have weight 400", () => {
    render(<SelectionGranularityToggle granularity="atom" onChange={vi.fn()} />);
    const residueBtn = screen.getByTestId("granularity-residue") as HTMLButtonElement;
    expect(residueBtn.style.fontWeight).toBe("400");
  });
});

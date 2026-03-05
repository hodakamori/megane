import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "@/components/Tooltip";
import type { AtomHoverInfo, BondHoverInfo } from "@/types";

describe("Tooltip", () => {
  it("renders nothing when info is null", () => {
    const { container } = render(<Tooltip info={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders atom info with element symbol and index", () => {
    const info: AtomHoverInfo = {
      kind: "atom",
      atomIndex: 42,
      elementSymbol: "C",
      atomicNumber: 6,
      position: [1.23, 4.56, 7.89],
      screenX: 100,
      screenY: 200,
    };

    render(<Tooltip info={info} />);
    expect(screen.getByText(/C/)).toBeInTheDocument();
    expect(screen.getByText(/#42/)).toBeInTheDocument();
    expect(screen.getByText(/1\.23/)).toBeInTheDocument();
    expect(screen.getByText(/4\.56/)).toBeInTheDocument();
  });

  it("renders bond info with bond order and length", () => {
    const info: BondHoverInfo = {
      kind: "bond",
      atomA: 10,
      atomB: 20,
      bondOrder: 2,
      bondLength: 1.34,
      screenX: 150,
      screenY: 250,
    };

    render(<Tooltip info={info} />);
    expect(screen.getByText(/Double/)).toBeInTheDocument();
    expect(screen.getByText(/1\.34/)).toBeInTheDocument();
  });
});

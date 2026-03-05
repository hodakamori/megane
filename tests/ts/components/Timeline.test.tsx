import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Timeline } from "@/components/Timeline";

const defaultProps = {
  currentFrame: 0,
  totalFrames: 100,
  playing: false,
  fps: 30,
  onSeek: vi.fn(),
  onPlayPause: vi.fn(),
  onFpsChange: vi.fn(),
};

describe("Timeline", () => {
  afterEach(() => {
    cleanup();
  });

  it("returns null when totalFrames <= 1", () => {
    const { container } = render(
      <Timeline {...defaultProps} totalFrames={1} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("returns null when totalFrames is 0", () => {
    const { container } = render(
      <Timeline {...defaultProps} totalFrames={0} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders play button when not playing", () => {
    render(<Timeline {...defaultProps} playing={false} />);
    const button = screen.getByTitle("Play");
    expect(button).toBeInTheDocument();
  });

  it("renders pause button when playing", () => {
    render(<Timeline {...defaultProps} playing={true} />);
    const button = screen.getByTitle("Pause");
    expect(button).toBeInTheDocument();
  });

  it("displays frame counter", () => {
    render(<Timeline {...defaultProps} currentFrame={49} totalFrames={100} />);
    expect(screen.getByText("50 / 100")).toBeInTheDocument();
  });

  it("calls onPlayPause when play button is clicked", () => {
    const onPlayPause = vi.fn();
    render(<Timeline {...defaultProps} onPlayPause={onPlayPause} />);
    fireEvent.click(screen.getByTitle("Play"));
    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it("renders seek slider with correct range", () => {
    render(<Timeline {...defaultProps} currentFrame={10} totalFrames={50} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "49");
    expect(slider).toHaveValue("10");
  });

  it("calls onSeek when slider value changes", () => {
    const onSeek = vi.fn();
    render(<Timeline {...defaultProps} onSeek={onSeek} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "42" } });
    expect(onSeek).toHaveBeenCalledWith(42);
  });

  it("renders FPS selector with options", () => {
    render(<Timeline {...defaultProps} fps={30} />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("30");
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Timeline } from "@/components/Timeline";

const defaultProps = {
  currentFrame: 0,
  totalFrames: 100,
  playing: false,
  fps: 30,
  speedMultiplier: 1,
  loopStart: 0,
  loopEnd: 99,
  onSeek: vi.fn(),
  onPlayPause: vi.fn(),
  onFpsChange: vi.fn(),
  onSpeedChange: vi.fn(),
  onLoopRangeChange: vi.fn(),
  onStepBackward: vi.fn(),
  onStepForward: vi.fn(),
};

describe("Timeline", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
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
    render(<Timeline {...defaultProps} currentFrame={10} totalFrames={50} loopEnd={49} />);
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
    const select = screen.getByTestId("playback-fps");
    expect(select).toHaveValue("30");
  });

  it("renders step backward button", () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getByTestId("step-backward")).toBeInTheDocument();
  });

  it("renders step forward button", () => {
    render(<Timeline {...defaultProps} />);
    expect(screen.getByTestId("step-forward")).toBeInTheDocument();
  });

  it("calls onStepBackward when step-backward is clicked", () => {
    const onStepBackward = vi.fn();
    render(<Timeline {...defaultProps} onStepBackward={onStepBackward} />);
    fireEvent.click(screen.getByTestId("step-backward"));
    expect(onStepBackward).toHaveBeenCalledTimes(1);
  });

  it("calls onStepForward when step-forward is clicked", () => {
    const onStepForward = vi.fn();
    render(<Timeline {...defaultProps} onStepForward={onStepForward} />);
    fireEvent.click(screen.getByTestId("step-forward"));
    expect(onStepForward).toHaveBeenCalledTimes(1);
  });

  it("renders speed selector with correct value", () => {
    render(<Timeline {...defaultProps} speedMultiplier={2} />);
    const select = screen.getByTestId("playback-speed");
    expect(select).toHaveValue("2");
  });

  it("calls onSpeedChange when speed selector changes", () => {
    const onSpeedChange = vi.fn();
    render(<Timeline {...defaultProps} onSpeedChange={onSpeedChange} />);
    fireEvent.change(screen.getByTestId("playback-speed"), { target: { value: "0.5" } });
    expect(onSpeedChange).toHaveBeenCalledWith(0.5);
  });

  it("renders loop start input with correct value", () => {
    render(<Timeline {...defaultProps} loopStart={5} />);
    const input = screen.getByTestId("loop-start");
    expect(input).toHaveValue(5);
  });

  it("renders loop end input with correct value", () => {
    render(<Timeline {...defaultProps} loopEnd={80} />);
    const input = screen.getByTestId("loop-end");
    expect(input).toHaveValue(80);
  });

  it("calls onLoopRangeChange when loop-start changes", () => {
    const onLoopRangeChange = vi.fn();
    render(<Timeline {...defaultProps} loopStart={0} loopEnd={99} onLoopRangeChange={onLoopRangeChange} />);
    fireEvent.change(screen.getByTestId("loop-start"), { target: { value: "10" } });
    expect(onLoopRangeChange).toHaveBeenCalledWith(10, 99);
  });

  it("calls onLoopRangeChange when loop-end changes", () => {
    const onLoopRangeChange = vi.fn();
    render(<Timeline {...defaultProps} loopStart={0} loopEnd={99} onLoopRangeChange={onLoopRangeChange} />);
    fireEvent.change(screen.getByTestId("loop-end"), { target: { value: "50" } });
    expect(onLoopRangeChange).toHaveBeenCalledWith(0, 50);
  });

  it("calls onStepBackward on ArrowLeft key press", () => {
    const onStepBackward = vi.fn();
    render(<Timeline {...defaultProps} onStepBackward={onStepBackward} />);
    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(onStepBackward).toHaveBeenCalledTimes(1);
  });

  it("calls onStepForward on ArrowRight key press", () => {
    const onStepForward = vi.fn();
    render(<Timeline {...defaultProps} onStepForward={onStepForward} />);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(onStepForward).toHaveBeenCalledTimes(1);
  });

  it("does not call step on ArrowLeft when focus is in an input", () => {
    const onStepBackward = vi.fn();
    render(<Timeline {...defaultProps} onStepBackward={onStepBackward} />);
    const input = screen.getByTestId("loop-start");
    fireEvent.keyDown(input, { key: "ArrowLeft", target: input });
    expect(onStepBackward).not.toHaveBeenCalled();
  });
});

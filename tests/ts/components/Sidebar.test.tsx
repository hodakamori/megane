import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Sidebar } from "@/components/Sidebar";
import type { TrajectoryConfig, BondConfig } from "@/components/Sidebar";

afterEach(() => {
  cleanup();
});

function makeTrajectoryConfig(overrides: Partial<TrajectoryConfig> = {}): TrajectoryConfig {
  return {
    source: "file",
    onSourceChange: vi.fn(),
    hasStructureFrames: false,
    hasFileFrames: false,
    fileName: null,
    totalFrames: 0,
    timestepPs: 0,
    onUploadXtc: vi.fn(),
    ...overrides,
  };
}

function makeBondConfig(): BondConfig {
  return {
    source: "none",
    onSourceChange: vi.fn(),
    onUploadFile: vi.fn(),
    fileName: null,
    count: 0,
  };
}

function renderSidebar(trajectory: TrajectoryConfig) {
  return render(
    <Sidebar
      mode="local"
      structure={{ atomCount: 0, fileName: null }}
      bonds={makeBondConfig()}
      trajectory={trajectory}
      onUploadStructure={vi.fn()}
      onResetView={vi.fn()}
      hasCell={false}
      cellVisible={false}
      onToggleCell={vi.fn()}
      collapsed={false}
      onToggleCollapse={vi.fn()}
    />,
  );
}

describe("Sidebar trajectory DropZone", () => {
  it("calls onUploadXtc when a .xtc file is dropped", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["dummy"], "traj.xtc", { type: "application/octet-stream" });
    const dropzone = screen.getByTestId("trajectory-upload-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(onUploadXtc).toHaveBeenCalledWith(file);
  });

  it("calls onUploadXtc when a .dcd file is dropped", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["dummy"], "traj.dcd", { type: "application/octet-stream" });
    const dropzone = screen.getByTestId("trajectory-upload-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(onUploadXtc).toHaveBeenCalledWith(file);
  });

  it("calls onUploadXtc when a .nc file is dropped", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["dummy"], "traj.nc", { type: "application/octet-stream" });
    const dropzone = screen.getByTestId("trajectory-upload-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(onUploadXtc).toHaveBeenCalledWith(file);
  });

  it("calls onUploadXtc when a .lammpstrj file is dropped", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["dummy"], "run.lammpstrj", { type: "text/plain" });
    const dropzone = screen.getByTestId("trajectory-upload-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(onUploadXtc).toHaveBeenCalledWith(file);
  });

  it("calls onUploadXtc when a .dump file is dropped", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["dummy"], "run.dump", { type: "text/plain" });
    const dropzone = screen.getByTestId("trajectory-upload-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(onUploadXtc).toHaveBeenCalledWith(file);
  });

  it("does not call onUploadXtc when an unsupported file is dropped", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["junk"], "data.txt", { type: "text/plain" });
    const dropzone = screen.getByTestId("trajectory-upload-dropzone");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(onUploadXtc).not.toHaveBeenCalled();
  });

  it("calls onUploadXtc via file input for .dcd", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["dummy"], "traj.dcd", { type: "application/octet-stream" });
    const input = screen.getByTestId("trajectory-upload-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(onUploadXtc).toHaveBeenCalledWith(file);
  });

  it("calls onUploadXtc via file input for .nc", () => {
    const onUploadXtc = vi.fn();
    renderSidebar(makeTrajectoryConfig({ onUploadXtc }));

    const file = new File(["dummy"], "traj.nc", { type: "application/octet-stream" });
    const input = screen.getByTestId("trajectory-upload-input") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(onUploadXtc).toHaveBeenCalledWith(file);
  });

  it("the file input accept attribute includes .dcd and .nc", () => {
    renderSidebar(makeTrajectoryConfig());

    const input = screen.getByTestId("trajectory-upload-input") as HTMLInputElement;
    const accept = input.getAttribute("accept") ?? "";
    expect(accept).toContain(".dcd");
    expect(accept).toContain(".nc");
  });
});

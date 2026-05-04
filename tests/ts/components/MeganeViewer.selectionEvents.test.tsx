import { describe, it, expect, vi, afterEach } from "vitest";
import { render, act, cleanup } from "@testing-library/react";
import type { SelectionState, Measurement } from "@/types";

vi.mock("@/components/Viewport", () => ({ Viewport: vi.fn(() => null) }));
vi.mock("@/components/Tooltip", () => ({ Tooltip: vi.fn(() => null) }));
vi.mock("@/components/MeasurementPanel", () => ({ MeasurementPanel: vi.fn(() => null) }));
vi.mock("@/components/Timeline", () => ({ Timeline: vi.fn(() => null) }));
vi.mock("@/components/PipelineEditor", () => ({ PipelineEditor: vi.fn(() => null) }));
vi.mock("@/parsers/inferBondsJS", () => ({
  inferBondsVdwJS: vi.fn(() => new Uint32Array(0)),
}));
vi.mock("@/pipeline/executors/addBond", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/pipeline/executors/addBond")>();
  return { ...actual, processPbcBonds: vi.fn() };
});

import { MeganeViewer } from "@/components/MeganeViewer";
import { Viewport } from "@/components/Viewport";
import { MeasurementPanel } from "@/components/MeasurementPanel";

const mockViewport = vi.mocked(Viewport);
const mockMeasurementPanel = vi.mocked(MeasurementPanel);

/**
 * Build a fake MoleculeRenderer with configurable selection/measurement
 * responses. All other methods are no-op stubs via Proxy.
 */
function makeFakeRenderer(opts: {
  toggleResult?: SelectionState;
  measurementResult?: Measurement | null;
  clearResult?: SelectionState;
  setSelectionResult?: SelectionState;
}) {
  const toggleAtomSelection = vi.fn(() => opts.toggleResult ?? { atoms: [] });
  const getMeasurement = vi.fn(() => opts.measurementResult ?? null);
  const clearSelection = vi.fn();
  const setSelection = vi.fn(() => opts.setSelectionResult ?? { atoms: [] });

  const renderer = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "toggleAtomSelection") return toggleAtomSelection;
        if (prop === "getMeasurement") return getMeasurement;
        if (prop === "clearSelection") return clearSelection;
        if (prop === "setSelection") return setSelection;
        return vi.fn();
      },
    },
  );

  return { renderer, toggleAtomSelection, getMeasurement, clearSelection, setSelection };
}

function mountAndWireRenderer(
  onSelectionChange?: (s: SelectionState) => void,
  onMeasurementChange?: (m: Measurement | null) => void,
  rendererOpts: Parameters<typeof makeFakeRenderer>[0] = {},
) {
  render(
    <MeganeViewer
      onUploadStructure={() => {}}
      onSelectionChange={onSelectionChange}
      onMeasurementChange={onMeasurementChange}
    />,
  );

  const viewportProps = mockViewport.mock.calls[0][0];
  const { renderer, ...spies } = makeFakeRenderer(rendererOpts);

  act(() => {
    viewportProps.onRendererReady?.(renderer as never);
  });

  return { viewportProps, spies };
}

describe("MeganeViewer.onSelectionChange", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("fires with the new atom list on right-click selection", () => {
    const onSelectionChange = vi.fn();
    const selected: SelectionState = { atoms: [3] };

    const { viewportProps } = mountAndWireRenderer(onSelectionChange, undefined, {
      toggleResult: selected,
    });

    act(() => {
      viewportProps.onAtomRightClick(3);
    });

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith(selected);
  });

  it("fires with empty atoms when selection is cleared", () => {
    const onSelectionChange = vi.fn();
    const { viewportProps } = mountAndWireRenderer(onSelectionChange, undefined, {
      toggleResult: { atoms: [5] },
    });

    act(() => {
      viewportProps.onAtomRightClick(5);
    });
    onSelectionChange.mockClear();

    // Simulate clear from MeasurementPanel's onClear
    const panelProps = mockMeasurementPanel.mock.lastCall?.[0];
    act(() => {
      panelProps?.onClear();
    });

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange).toHaveBeenCalledWith({ atoms: [] });
  });

  it("fires for multi-atom selection (angle)", () => {
    const onSelectionChange = vi.fn();
    const { viewportProps } = mountAndWireRenderer(onSelectionChange, undefined, {
      toggleResult: { atoms: [1, 2] },
    });

    act(() => {
      viewportProps.onAtomRightClick(2);
    });

    expect(onSelectionChange).toHaveBeenCalledWith({ atoms: [1, 2] });
  });

  it("does not throw when onSelectionChange is not provided", () => {
    const { viewportProps } = mountAndWireRenderer(undefined, undefined, {
      toggleResult: { atoms: [0] },
    });

    expect(() => {
      act(() => {
        viewportProps.onAtomRightClick(0);
      });
    }).not.toThrow();
  });
});

describe("MeganeViewer.onMeasurementChange", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("fires with distance measurement when two atoms are selected", () => {
    const onMeasurementChange = vi.fn();
    const measurement: Measurement = {
      atoms: [0, 1],
      type: "distance",
      value: 1.5,
      label: "1.500 Å",
    };

    const { viewportProps } = mountAndWireRenderer(undefined, onMeasurementChange, {
      toggleResult: { atoms: [0, 1] },
      measurementResult: measurement,
    });

    act(() => {
      viewportProps.onAtomRightClick(1);
    });

    expect(onMeasurementChange).toHaveBeenCalledTimes(1);
    expect(onMeasurementChange).toHaveBeenCalledWith(measurement);
  });

  it("fires with null when selection is cleared", () => {
    const onMeasurementChange = vi.fn();
    const { viewportProps } = mountAndWireRenderer(undefined, onMeasurementChange, {
      toggleResult: { atoms: [0, 1] },
      measurementResult: {
        atoms: [0, 1],
        type: "distance",
        value: 2.0,
        label: "2.000 Å",
      },
    });

    act(() => {
      viewportProps.onAtomRightClick(1);
    });
    onMeasurementChange.mockClear();

    const panelProps = mockMeasurementPanel.mock.lastCall?.[0];
    act(() => {
      panelProps?.onClear();
    });

    expect(onMeasurementChange).toHaveBeenCalledWith(null);
  });

  it("fires with null when no measurement is available (single atom)", () => {
    const onMeasurementChange = vi.fn();

    const { viewportProps } = mountAndWireRenderer(undefined, onMeasurementChange, {
      toggleResult: { atoms: [7] },
      measurementResult: null,
    });

    act(() => {
      viewportProps.onAtomRightClick(7);
    });

    expect(onMeasurementChange).toHaveBeenCalledWith(null);
  });

  it("does not throw when onMeasurementChange is not provided", () => {
    const { viewportProps } = mountAndWireRenderer(undefined, undefined, {
      measurementResult: {
        atoms: [0, 1],
        type: "distance",
        value: 1.0,
        label: "1.000 Å",
      },
    });

    expect(() => {
      act(() => {
        viewportProps.onAtomRightClick(1);
      });
    }).not.toThrow();
  });

  it("fires both onSelectionChange and onMeasurementChange on the same interaction", () => {
    const onSelectionChange = vi.fn();
    const onMeasurementChange = vi.fn();
    const measurement: Measurement = {
      atoms: [2, 3, 4],
      type: "angle",
      value: 109.5,
      label: "109.5°",
    };

    const { viewportProps } = mountAndWireRenderer(onSelectionChange, onMeasurementChange, {
      toggleResult: { atoms: [2, 3, 4] },
      measurementResult: measurement,
    });

    act(() => {
      viewportProps.onAtomRightClick(4);
    });

    expect(onSelectionChange).toHaveBeenCalledWith({ atoms: [2, 3, 4] });
    expect(onMeasurementChange).toHaveBeenCalledWith(measurement);
  });
});

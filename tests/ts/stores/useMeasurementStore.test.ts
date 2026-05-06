import { describe, it, expect, beforeEach } from "vitest";
import { useMeasurementStore, _resetIdCounter } from "@/stores/useMeasurementStore";
import type { Measurement } from "@/types";

function makeMeasurement(type: Measurement["type"] = "distance"): Measurement {
  if (type === "distance") {
    return { atoms: [0, 1], type: "distance", value: 1.5, label: "1.500 Å" };
  }
  if (type === "angle") {
    return { atoms: [0, 1, 2], type: "angle", value: 109.5, label: "109.5°" };
  }
  return { atoms: [0, 1, 2, 3], type: "dihedral", value: 45.0, label: "45.0°" };
}

describe("useMeasurementStore", () => {
  beforeEach(() => {
    useMeasurementStore.setState({ measurements: [] });
    _resetIdCounter();
  });

  it("starts empty", () => {
    expect(useMeasurementStore.getState().measurements).toHaveLength(0);
  });

  it("addMeasurement stores a distance measurement", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    const { measurements } = useMeasurementStore.getState();
    expect(measurements).toHaveLength(1);
    expect(measurements[0].type).toBe("distance");
    expect(measurements[0].value).toBe(1.5);
    expect(measurements[0].label).toBe("1.500 Å");
    expect(measurements[0].hidden).toBe(false);
    expect(measurements[0].name).toMatch(/^Dist/);
  });

  it("addMeasurement stores an angle measurement with correct name prefix", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("angle"));
    const { measurements } = useMeasurementStore.getState();
    expect(measurements[0].name).toMatch(/^Angle/);
  });

  it("addMeasurement stores a dihedral measurement with correct name prefix", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("dihedral"));
    const { measurements } = useMeasurementStore.getState();
    expect(measurements[0].name).toMatch(/^Dihedral/);
  });

  it("addMeasurement copies atoms array defensively", () => {
    const m = makeMeasurement("distance");
    useMeasurementStore.getState().addMeasurement(m);
    m.atoms.push(99);
    const stored = useMeasurementStore.getState().measurements[0];
    expect(stored.atoms).not.toContain(99);
  });

  it("addMeasurement accumulates multiple measurements", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    useMeasurementStore.getState().addMeasurement(makeMeasurement("angle"));
    useMeasurementStore.getState().addMeasurement(makeMeasurement("dihedral"));
    expect(useMeasurementStore.getState().measurements).toHaveLength(3);
  });

  it("removeMeasurement removes by id", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    useMeasurementStore.getState().addMeasurement(makeMeasurement("angle"));
    const { measurements } = useMeasurementStore.getState();
    const firstId = measurements[0].id;
    useMeasurementStore.getState().removeMeasurement(firstId);
    expect(useMeasurementStore.getState().measurements).toHaveLength(1);
    expect(useMeasurementStore.getState().measurements[0].type).toBe("angle");
  });

  it("removeMeasurement is a no-op for unknown id", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    useMeasurementStore.getState().removeMeasurement("nonexistent");
    expect(useMeasurementStore.getState().measurements).toHaveLength(1);
  });

  it("renameMeasurement updates name", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    const id = useMeasurementStore.getState().measurements[0].id;
    useMeasurementStore.getState().renameMeasurement(id, "My Bond");
    expect(useMeasurementStore.getState().measurements[0].name).toBe("My Bond");
  });

  it("renameMeasurement only affects the targeted row", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    useMeasurementStore.getState().addMeasurement(makeMeasurement("angle"));
    const [a, b] = useMeasurementStore.getState().measurements;
    useMeasurementStore.getState().renameMeasurement(a.id, "Renamed");
    const updated = useMeasurementStore.getState().measurements;
    expect(updated[0].name).toBe("Renamed");
    expect(updated[1].name).toBe(b.name);
  });

  it("toggleVisibility flips hidden flag", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    const id = useMeasurementStore.getState().measurements[0].id;
    useMeasurementStore.getState().toggleVisibility(id);
    expect(useMeasurementStore.getState().measurements[0].hidden).toBe(true);
    useMeasurementStore.getState().toggleVisibility(id);
    expect(useMeasurementStore.getState().measurements[0].hidden).toBe(false);
  });

  it("clearAll removes all measurements", () => {
    useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    useMeasurementStore.getState().addMeasurement(makeMeasurement("angle"));
    useMeasurementStore.getState().clearAll();
    expect(useMeasurementStore.getState().measurements).toHaveLength(0);
  });

  it("measurements have unique ids across multiple adds", () => {
    for (let i = 0; i < 5; i++) {
      useMeasurementStore.getState().addMeasurement(makeMeasurement("distance"));
    }
    const ids = useMeasurementStore.getState().measurements.map((m) => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(5);
  });
});

import { describe, it, expect, vi, afterEach } from "vitest";
import { exportToCSV, exportToJSON, downloadFile } from "@/utils/measurementExport";
import { downloadBlob } from "@/renderer/RenderCapture";
import type { StoredMeasurement } from "@/types";

vi.mock("@/renderer/RenderCapture", () => ({
  downloadBlob: vi.fn(),
}));

function makeStored(overrides: Partial<StoredMeasurement> = {}): StoredMeasurement {
  return {
    id: "1",
    name: "Dist 1",
    atoms: [0, 1],
    type: "distance",
    value: 1.5,
    label: "1.500 Å",
    hidden: false,
    createdAt: 1000000,
    ...overrides,
  };
}

describe("exportToCSV", () => {
  it("produces a header and one data row", () => {
    const csv = exportToCSV([makeStored()]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe("Name,Type,Value,Label,Atoms");
    expect(lines[1]).toContain("Dist 1");
    expect(lines[1]).toContain("distance");
    expect(lines[1]).toContain("1.5");
  });

  it("returns only header for empty list", () => {
    const csv = exportToCSV([]);
    expect(csv).toBe("Name,Type,Value,Label,Atoms");
  });

  it("escapes double quotes in name", () => {
    const csv = exportToCSV([makeStored({ name: 'Bond "A"' })]);
    expect(csv).toContain('"Bond ""A"""');
  });

  it("escapes double quotes in label", () => {
    const csv = exportToCSV([makeStored({ label: '1.5"' })]);
    expect(csv).toContain('"1.5"""');
  });

  it("semicolon-joins atom indices", () => {
    const csv = exportToCSV([makeStored({ atoms: [0, 1, 2] })]);
    expect(csv).toContain('"0;1;2"');
  });

  it("produces multiple rows for multiple measurements", () => {
    const csv = exportToCSV([
      makeStored({ name: "D1" }),
      makeStored({ name: "D2", type: "angle", atoms: [0, 1, 2] }),
    ]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[1]).toContain("D1");
    expect(lines[2]).toContain("D2");
  });
});

describe("exportToJSON", () => {
  it("returns valid JSON", () => {
    const json = exportToJSON([makeStored()]);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("includes name, type, value, label, atoms", () => {
    const json = exportToJSON([makeStored()]);
    const parsed = JSON.parse(json);
    expect(parsed[0]).toHaveProperty("name", "Dist 1");
    expect(parsed[0]).toHaveProperty("type", "distance");
    expect(parsed[0]).toHaveProperty("value", 1.5);
    expect(parsed[0]).toHaveProperty("label", "1.500 Å");
    expect(parsed[0]).toHaveProperty("atoms");
  });

  it("does not include id, hidden, or createdAt", () => {
    const json = exportToJSON([makeStored()]);
    const parsed = JSON.parse(json);
    expect(parsed[0]).not.toHaveProperty("id");
    expect(parsed[0]).not.toHaveProperty("hidden");
    expect(parsed[0]).not.toHaveProperty("createdAt");
  });

  it("returns empty array for empty input", () => {
    const json = exportToJSON([]);
    expect(JSON.parse(json)).toEqual([]);
  });
});

describe("downloadFile", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("delegates to the shared downloadBlob helper with a typed Blob", () => {
    downloadFile("hello", "test.csv", "text/csv");

    expect(downloadBlob).toHaveBeenCalledTimes(1);
    const [blob, filename] = vi.mocked(downloadBlob).mock.calls[0];
    expect(filename).toBe("test.csv");
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("text/csv");
    expect(blob.size).toBe("hello".length);
  });
});

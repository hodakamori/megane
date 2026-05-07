import type { StoredMeasurement } from "../types";

/** Serialize measurements to a CSV string. */
export function exportToCSV(measurements: StoredMeasurement[]): string {
  const header = "Name,Type,Value,Label,Atoms";
  const rows = measurements.map((m) => {
    const safeName = `"${m.name.replace(/"/g, '""')}"`;
    const safeLabel = `"${m.label.replace(/"/g, '""')}"`;
    const atoms = `"${m.atoms.join(";")}"`;
    return `${safeName},${m.type},${m.value},${safeLabel},${atoms}`;
  });
  return [header, ...rows].join("\n");
}

/** Serialize measurements to a pretty-printed JSON string. */
export function exportToJSON(measurements: StoredMeasurement[]): string {
  const data = measurements.map((m) => ({
    name: m.name,
    type: m.type,
    value: m.value,
    label: m.label,
    atoms: m.atoms,
  }));
  return JSON.stringify(data, null, 2);
}

/** Trigger a browser file download with the given content. */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

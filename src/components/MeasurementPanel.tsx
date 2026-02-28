/**
 * Panel showing selected atoms and geometric measurement results.
 */

import type { SelectionState, Measurement } from "../core/types";
import { getElementSymbol } from "../core/constants";

interface MeasurementPanelProps {
  selection: SelectionState;
  measurement: Measurement | null;
  elements: Uint8Array | null;
  onClear: () => void;
}

const MEASUREMENT_LABELS: Record<string, string> = {
  distance: "Distance",
  angle: "Angle",
  dihedral: "Dihedral",
};

export function MeasurementPanel({
  selection,
  measurement,
  elements,
  onClear,
}: MeasurementPanelProps) {
  if (selection.atoms.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        right: 12,
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(8px)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#212529",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 15,
        minWidth: 180,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <strong>Selection</strong>
        <button
          onClick={onClear}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6c757d",
            fontSize: 12,
            padding: "2px 4px",
          }}
        >
          Clear
        </button>
      </div>
      <div style={{ marginBottom: 6, fontSize: 12, color: "#495057" }}>
        {selection.atoms.map((idx, i) => (
          <span key={idx}>
            {i > 0 && " \u2014 "}
            <strong>{elements ? getElementSymbol(elements[idx]) : "?"}</strong>
            {idx}
          </span>
        ))}
      </div>
      {measurement && (
        <div
          style={{
            padding: "6px 0",
            borderTop: "1px solid #dee2e6",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {MEASUREMENT_LABELS[measurement.type]}: {measurement.label}
        </div>
      )}
      <div style={{ fontSize: 11, color: "#adb5bd", marginTop: 4 }}>
        Right-click atoms to select (max 4)
      </div>
    </div>
  );
}

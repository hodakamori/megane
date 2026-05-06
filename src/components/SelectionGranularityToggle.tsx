/**
 * Toggle bar for choosing selection granularity: atom / residue / chain / SS.
 */

import type { SelectionGranularity } from "../types";

interface SelectionGranularityToggleProps {
  granularity: SelectionGranularity;
  onChange: (g: SelectionGranularity) => void;
}

const OPTIONS: { value: SelectionGranularity; label: string; title: string }[] = [
  { value: "atom", label: "Atom", title: "Select individual atoms" },
  { value: "residue", label: "Residue", title: "Select whole residue" },
  { value: "chain", label: "Chain", title: "Select whole chain" },
  { value: "ss", label: "SS", title: "Select secondary-structure segment" },
];

export function SelectionGranularityToggle({
  granularity,
  onChange,
}: SelectionGranularityToggleProps) {
  return (
    <div
      data-testid="selection-granularity-toggle"
      style={{
        display: "flex",
        gap: 2,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(226,232,240,0.7)",
        borderRadius: 8,
        padding: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === granularity;
        return (
          <button
            key={opt.value}
            data-testid={`granularity-${opt.value}`}
            title={opt.title}
            onClick={() => onChange(opt.value)}
            style={{
              padding: "3px 9px",
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              background: active ? "#3b82f6" : "transparent",
              color: active ? "#fff" : "#64748b",
              transition: "all 0.15s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Inspector panel showing a summary of the current structural selection.
 */

import type { StructuralSelectionState, Snapshot } from "../types";
import { getElementSymbol } from "../constants";

interface SelectionInspectorPanelProps {
  selection: StructuralSelectionState;
  snapshot: Snapshot | null;
  onClear: () => void;
}

function summarizeSelection(
  atoms: number[],
  snapshot: Snapshot,
): { residues: number; chains: number; elementCounts: Map<string, number> } {
  const { elements, atomResNums, atomChainIds } = snapshot;
  const residueSet = new Set<string>();
  const chainSet = new Set<number>();
  const elementCounts = new Map<string, number>();

  for (const idx of atoms) {
    const sym = getElementSymbol(elements[idx]);
    elementCounts.set(sym, (elementCounts.get(sym) ?? 0) + 1);
    if (atomResNums) {
      const chain = atomChainIds ? atomChainIds[idx] : 0;
      residueSet.add(`${atomResNums[idx]}_${chain}`);
    }
    if (atomChainIds) {
      chainSet.add(atomChainIds[idx]);
    }
  }

  return {
    residues: residueSet.size,
    chains: chainSet.size,
    elementCounts,
  };
}

export function SelectionInspectorPanel({
  selection,
  snapshot,
  onClear,
}: SelectionInspectorPanelProps) {
  if (selection.atoms.length === 0 || !snapshot) return null;

  const { atoms, granularity } = selection;
  const { residues, chains, elementCounts } = summarizeSelection(atoms, snapshot);

  const topElements = Array.from(elementCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div
      data-testid="selection-inspector-panel"
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: "#1e293b",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(226,232,240,0.6)",
        zIndex: 15,
        minWidth: 160,
        maxWidth: 220,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Selection
        </span>
        <button
          data-testid="selection-inspector-clear"
          onClick={onClear}
          title="Clear selection"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: 14,
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        <Row label="Mode" value={granularity} />
        <Row label="Atoms" value={String(atoms.length)} />
        {residues > 0 && <Row label="Residues" value={String(residues)} />}
        {chains > 0 && <Row label="Chains" value={String(chains)} />}
      </div>

      {topElements.length > 0 && (
        <div style={{ marginTop: 8, borderTop: "1px solid rgba(226,232,240,0.6)", paddingTop: 6 }}>
          {topElements.map(([sym, count]) => (
            <div key={sym} style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "#64748b" }}>{sym}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: "#94a3b8" }}>{label}</span>
      <span style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

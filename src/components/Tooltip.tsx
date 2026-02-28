/**
 * Hover tooltip for atoms and bonds.
 */

import type { HoverInfo } from "../core/types";
import { getElementSymbol, BOND_ORDER_NAMES } from "../core/constants";

interface TooltipProps {
  info: HoverInfo;
}

export function Tooltip({ info }: TooltipProps) {
  if (!info) return null;

  const style: React.CSSProperties = {
    position: "fixed",
    left: info.screenX + 14,
    top: info.screenY - 14,
    background: "rgba(15, 23, 42, 0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "system-ui, -apple-system, monospace",
    pointerEvents: "none",
    zIndex: 100,
    whiteSpace: "nowrap",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  };

  if (info.kind === "atom") {
    return (
      <div style={style}>
        <div style={{ fontWeight: 600 }}>
          {info.elementSymbol} (#{info.atomIndex})
        </div>
        <div style={{ opacity: 0.7, fontSize: 11 }}>
          ({info.position[0].toFixed(2)}, {info.position[1].toFixed(2)},{" "}
          {info.position[2].toFixed(2)}) {"\u00c5"}
        </div>
      </div>
    );
  }

  return (
    <div style={style}>
      <div style={{ fontWeight: 600 }}>
        {getElementSymbol(0)
          ? `Atom ${info.atomA} \u2014 Atom ${info.atomB}`
          : `${info.atomA} \u2014 ${info.atomB}`}
      </div>
      <div style={{ opacity: 0.7, fontSize: 11 }}>
        {BOND_ORDER_NAMES[info.bondOrder] ?? "Bond"} |{" "}
        {info.bondLength.toFixed(2)} {"\u00c5"}
      </div>
    </div>
  );
}

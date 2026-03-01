#!/usr/bin/env python3
"""
Generate performance benchmark chart from bench_results.json.

Usage: python3 bench/plot.py
Output: bench/results/bench_performance.png
"""

import json
from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np

RESULTS_DIR = Path(__file__).parent / "results"
INPUT = RESULTS_DIR / "bench_results.json"
OUTPUT = RESULTS_DIR / "bench_performance.png"


def format_atoms(x, _):
    if x >= 1_000_000:
        return f"{x / 1_000_000:.0f}M"
    if x >= 1_000:
        return f"{x / 1_000:.0f}K"
    return f"{x:.0f}"


def format_time(x, _):
    if x < 0.001:
        return f"{x * 1_000_000:.0f} \u00b5s"
    if x < 1:
        return f"{x * 1000:.1f} ms"
    return f"{x:.1f} s"


def main():
    with open(INPUT) as f:
        data = json.load(f)

    atoms = [d["nAtoms"] for d in data]
    pdb_parse = [d["pdbParse"] for d in data]
    bond_inf = [d["bondInference"] for d in data]

    has_server = data[0].get("streamingEndToEnd") is not None

    fig, ax = plt.subplots(figsize=(10, 6))
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")

    # Local mode: WASM PDB parse
    ax.loglog(atoms, pdb_parse, "o-", color="#f59e0b", linewidth=2, markersize=6,
              label="Local: WASM PDB Parse")

    # Bond inference
    ax.loglog(atoms, bond_inf, "s-", color="#10b981", linewidth=2, markersize=6,
              label="Bond Inference (VDW)")

    if has_server:
        streaming_e2e = [d["streamingEndToEnd"] for d in data]
        rdkit_parse = [d["rdkitParse"] for d in data]
        protocol_encode = [d["protocolEncode"] for d in data]

        # Streaming end-to-end: server parse + encode + client decode
        ax.loglog(atoms, streaming_e2e, "D-", color="#ef4444", linewidth=2, markersize=6,
                  label="Streaming: End-to-End (server parse + encode + decode)")

        # Breakdown: RDKit parse only
        ax.loglog(atoms, rdkit_parse, "^--", color="#8b5cf6", linewidth=1.5, markersize=5,
                  alpha=0.7, label="  \u2514 Server: RDKit Parse")

        # Breakdown: Protocol encode only
        ax.loglog(atoms, protocol_encode, "v--", color="#06b6d4", linewidth=1.5, markersize=5,
                  alpha=0.7, label="  \u2514 Server: Protocol Encode")

    ax.set_xlabel("Number of Atoms", fontsize=12)
    ax.set_ylabel("Time (ms)", fontsize=12)
    ax.set_title("megane: Local vs Streaming Processing Time", fontsize=14, fontweight="bold")

    ax.xaxis.set_major_formatter(ticker.FuncFormatter(format_atoms))
    ax.yaxis.set_major_formatter(ticker.FuncFormatter(format_time))

    ax.grid(True, which="major", alpha=0.3)
    ax.grid(True, which="minor", alpha=0.1)
    ax.legend(fontsize=10, loc="upper left")

    # Add reference line for O(n)
    x = np.array(atoms)
    y_linear = pdb_parse[0] * (x / atoms[0])
    ax.plot(x, y_linear, "--", color="#cbd5e1", linewidth=1, alpha=0.5, label="_nolegend_")
    ax.annotate("O(n)", xy=(x[-1], y_linear[-1]), fontsize=9, color="#94a3b8",
                xytext=(5, 0), textcoords="offset points", va="center")

    plt.tight_layout()
    plt.savefig(OUTPUT, dpi=150, bbox_inches="tight")
    print(f"Chart saved to {OUTPUT}")


if __name__ == "__main__":
    main()

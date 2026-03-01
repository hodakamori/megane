#!/usr/bin/env python3
"""
Server-side benchmark for megane streaming mode.

Measures RDKit PDB parsing + binary protocol encoding times
across varying atom counts. These represent the server-side cost
that must be included for a fair streaming vs local comparison.

Usage: python3 bench/run_server.py
Output: bench/results/bench_server_results.json
"""

import json
import os
import sys
import tempfile
import time
from pathlib import Path

import numpy as np

# Add project root to path so we can import megane modules
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from python.megane.parsers.pdb import load_pdb
from python.megane.protocol import encode_snapshot

# RDKit PDB parse has super-quadratic scaling for dense grids due to bond
# perception. 50K atoms takes ~300s, 100K would take 30+ minutes.
# Cap at 10K for practical benchmark times; 50K/100K use WASM-only data.
ATOM_COUNTS = [100, 500, 1_000, 5_000, 10_000]

RESULTS_DIR = Path(__file__).parent / "results"


def get_runs(n_atoms):
    """Return (warmup, measure) run counts based on atom count."""
    if n_atoms >= 50_000:
        return 0, 1  # Single run for very large (RDKit is extremely slow)
    if n_atoms >= 10_000:
        return 1, 3
    return 2, 5


def generate_pdb_file(n_atoms: int, path: str) -> None:
    """Generate a PDB file with N atoms on a cubic grid (1.8A spacing)."""
    spacing = 1.8
    side = int(np.ceil(n_atoms ** (1 / 3)))

    with open(path, "w") as f:
        for i in range(n_atoms):
            ix = i % side
            iy = (i // side) % side
            iz = i // (side * side)
            x = ix * spacing + (np.random.random() - 0.5) * 0.5
            y = iy * spacing + (np.random.random() - 0.5) * 0.5
            z = iz * spacing + (np.random.random() - 0.5) * 0.5
            serial = (i + 1) % 100000
            f.write(
                f"ATOM  {serial:5d}  C   UNK A   1    "
                f"{x:8.3f}{y:8.3f}{z:8.3f}  1.00  0.00           C\n"
            )
        f.write("END\n")


def benchmark(fn, runs, warmup):
    """Run fn multiple times and return median time in ms."""
    for _ in range(warmup):
        fn()

    times = []
    for _ in range(runs):
        t0 = time.perf_counter()
        fn()
        t1 = time.perf_counter()
        times.append((t1 - t0) * 1000)  # ms

    times.sort()
    return times[len(times) // 2]  # median


def main():
    print("=== megane Server-Side Benchmark (Rust + Protocol) ===\n")
    print(f"Atom counts: {', '.join(f'{n:,}' for n in ATOM_COUNTS)}\n")

    results = []

    for n_atoms in ATOM_COUNTS:
        warmup, runs = get_runs(n_atoms)
        print(
            f"{n_atoms:>10,} atoms ({runs} runs, {warmup} warmup): ",
            end="",
            flush=True,
        )

        entry = {
            "nAtoms": n_atoms,
            "rustParse": None,
            "protocolEncode": None,
            "serverTotal": None,
        }

        with tempfile.NamedTemporaryFile(suffix=".pdb", mode="w", delete=False) as tmp:
            tmp_path = tmp.name

        try:
            # Generate PDB file
            generate_pdb_file(n_atoms, tmp_path)

            # 1. RDKit PDB Parse
            structure = None

            def do_parse():
                nonlocal structure
                structure = load_pdb(tmp_path)

            entry["rustParse"] = benchmark(do_parse, runs, warmup)

            # 2. Binary Protocol Encode (very fast, use same structure)
            def do_encode():
                encode_snapshot(structure)

            entry["protocolEncode"] = benchmark(do_encode, runs, warmup)

            # 3. Server total = parse + encode (summed, avoid extra slow runs)
            entry["serverTotal"] = entry["rustParse"] + entry["protocolEncode"]

        finally:
            os.unlink(tmp_path)

        results.append(entry)

        def fmt(ms):
            if ms < 1:
                return f"{ms * 1000:.0f} us"
            if ms < 1000:
                return f"{ms:.1f} ms"
            return f"{ms / 1000:.2f} s"

        print(
            f"parse={fmt(entry['rustParse'])}  "
            f"encode={fmt(entry['protocolEncode'])}  "
            f"total={fmt(entry['serverTotal'])}"
        )

    # Write results
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = RESULTS_DIR / "bench_server_results.json"
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nResults written to {out_path}")


if __name__ == "__main__":
    main()

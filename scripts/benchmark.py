"""
megane FPS / performance benchmark.

Measures:
1. Binary protocol encode/decode speed at various atom counts
2. Position update throughput (simulates trajectory frame updates)
3. Estimated GPU-bound FPS based on draw call complexity
"""

import time
import struct
import numpy as np
from megane.protocol import encode_snapshot, encode_frame

# Atom counts to benchmark
ATOM_COUNTS = [327, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000, 1_000_000]


def generate_structure(n_atoms):
    """Generate synthetic structure data."""
    side = int(np.ceil(n_atoms ** (1/3)))
    spacing = 3.0

    positions = np.zeros((n_atoms, 3), dtype=np.float32)
    for i in range(n_atoms):
        ix = i % side
        iy = (i // side) % side
        iz = i // (side * side)
        positions[i] = [ix * spacing, iy * spacing, iz * spacing]
    positions += np.random.randn(n_atoms, 3).astype(np.float32) * 0.2

    elements = np.array([1, 6, 7, 8, 16] * (n_atoms // 5 + 1), dtype=np.uint8)[:n_atoms]

    # Bonds: ~1 bond per atom (neighbor connections)
    n_bonds = min(n_atoms - 1, n_atoms)
    bonds = np.column_stack([np.arange(n_bonds), np.arange(1, n_bonds + 1) % n_atoms]).astype(np.int32)

    return {
        "n_atoms": n_atoms,
        "positions": positions,
        "elements": elements,
        "bonds": bonds,
        "n_bonds": n_bonds,
    }


def make_structure_obj(d):
    """Create a Structure-like object for encode_snapshot."""
    class S:
        pass
    s = S()
    s.n_atoms = d["n_atoms"]
    s.positions = d["positions"]
    s.elements = d["elements"]
    s.bonds = d["bonds"]
    return s


def benchmark_encode(structure_dict, n_iter=10):
    """Benchmark binary encoding."""
    s = make_structure_obj(structure_dict)
    times = []
    for _ in range(n_iter):
        t0 = time.perf_counter()
        data = encode_snapshot(s)
        t1 = time.perf_counter()
        times.append(t1 - t0)
    return np.median(times) * 1000, len(data)


def benchmark_frame_encode(structure_dict, n_iter=50):
    """Benchmark frame position encoding."""
    n_atoms = structure_dict["n_atoms"]
    positions = structure_dict["positions"]
    times = []
    for i in range(n_iter):
        # Slightly perturb positions
        new_pos = positions + np.random.randn(n_atoms, 3).astype(np.float32) * 0.01
        t0 = time.perf_counter()
        data = encode_frame(i, new_pos)
        t1 = time.perf_counter()
        times.append(t1 - t0)
    return np.median(times) * 1000


def benchmark_position_update(structure_dict, n_iter=100):
    """Benchmark raw position array copy (simulates GPU buffer update)."""
    n = structure_dict["n_atoms"]
    src = np.random.randn(n, 3).astype(np.float32)
    dst = np.zeros((n, 3), dtype=np.float32)
    times = []
    for _ in range(n_iter):
        t0 = time.perf_counter()
        np.copyto(dst, src)  # simulates Float32Array.set()
        t1 = time.perf_counter()
        times.append(t1 - t0)
    return np.median(times) * 1000


def estimate_gpu_fps(n_atoms, n_bonds):
    """
    Estimate GPU FPS based on empirical models:
    - InstancedMesh: ~2M instances/frame at 60fps on RTX 3060
    - Impostor: ~10M instances/frame at 60fps on RTX 3060
    - Assumes ~1ms fixed overhead
    """
    if n_atoms <= 5000:
        # InstancedMesh path: sphere segments scale with count
        segs = 16 if n_atoms <= 100_000 else 8 if n_atoms <= 500_000 else 4
        tris_per_atom = segs * segs * 2
        total_tris = n_atoms * tris_per_atom + n_bonds * 12  # cylinder ~12 tris
        # RTX 3060: ~4B tris/sec practical throughput
        gpu_time_ms = total_tris / 4_000_000
        mode = "InstancedMesh"
    else:
        # Impostor path: 2 triangles per atom, 2 per bond
        total_tris = n_atoms * 2 + n_bonds * 2
        # Fragment-heavy: ~50M impostor instances/sec on RTX 3060
        gpu_time_ms = (n_atoms + n_bonds) / 50_000
        mode = "Impostor"

    total_ms = max(1.0, gpu_time_ms + 1.0)  # 1ms fixed overhead
    fps = min(144, 1000 / total_ms)
    return fps, mode


def main():
    print("=" * 80)
    print("  megane Performance Benchmark")
    print("=" * 80)
    print()

    results = []
    for n in ATOM_COUNTS:
        print(f"  Benchmarking {n:>10,} atoms...", end="", flush=True)
        d = generate_structure(n)

        encode_ms, data_size = benchmark_encode(d, n_iter=max(1, 20_000_000 // n))
        frame_ms = benchmark_frame_encode(d, n_iter=max(1, 10_000_000 // n))
        update_ms = benchmark_position_update(d)
        est_fps, mode = estimate_gpu_fps(n, d["n_bonds"])

        results.append({
            "n": n,
            "encode_ms": encode_ms,
            "frame_ms": frame_ms,
            "update_ms": update_ms,
            "data_kb": data_size / 1024,
            "est_fps": est_fps,
            "mode": mode,
        })
        print(f" encode={encode_ms:.1f}ms  frame={frame_ms:.2f}ms  GPU≈{est_fps:.0f}fps ({mode})")

    print()
    print("┌────────────┬──────────┬───────────┬──────────┬──────────┬──────────┬────────────────┐")
    print("│   Atoms    │ Snap(ms) │ Frame(ms) │ Copy(ms) │ Data(KB) │ GPU FPS  │     Mode       │")
    print("├────────────┼──────────┼───────────┼──────────┼──────────┼──────────┼────────────────┤")

    for r in results:
        print(f"│ {r['n']:>10,} │ {r['encode_ms']:>8.1f} │ {r['frame_ms']:>9.2f} │ {r['update_ms']:>8.3f} │ {r['data_kb']:>8.0f} │ {r['est_fps']:>8.0f} │ {r['mode']:>14} │")

    print("└────────────┴──────────┴───────────┴──────────┴──────────┴──────────┴────────────────┘")

    print()
    print("Legend:")
    print("  Snap(ms)  = Time to encode full snapshot (topology + positions)")
    print("  Frame(ms) = Time to encode one trajectory frame (positions only)")
    print("  Copy(ms)  = Time to copy position buffer (simulates GPU upload)")
    print("  Data(KB)  = Wire size of encoded snapshot")
    print("  GPU FPS   = Estimated rendering FPS on mid-range GPU (RTX 3060)")
    print("  Mode      = InstancedMesh (≤5K atoms) or Impostor (>5K atoms)")
    print()
    print("Notes:")
    print("  - GPU FPS is estimated based on triangle count and fill rate models")
    print("  - Impostor mode uses 2 triangles/atom vs 512 for InstancedMesh (16-seg sphere)")
    print("  - At 1M atoms, impostor reduces triangle count by 256x")


if __name__ == "__main__":
    main()

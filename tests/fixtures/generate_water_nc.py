#!/usr/bin/env python3
"""Generate tests/fixtures/water.nc — a minimal AMBER NetCDF CDF-1 trajectory.

3 atoms (water: O + 2H), 5 frames, timestep 1 ps, orthorhombic box 10×10×10 Å.
Uses only Python stdlib struct — no external NetCDF library required.
"""
import struct
import os


def u32be(v: int) -> bytes:
    return struct.pack(">I", v)


def f32be(v: float) -> bytes:
    return struct.pack(">f", v)


def f64be(v: float) -> bytes:
    return struct.pack(">d", v)


def nc_string(s: str) -> bytes:
    b = s.encode("ascii")
    n = len(b)
    padded = (n + 3) & ~3
    return u32be(n) + b + b"\x00" * (padded - n)


def absent() -> bytes:
    return u32be(0) + u32be(0)


TAG_DIM = 10
TAG_VAR = 11
TAG_ATT = 12
NC_FLOAT = 5
NC_DOUBLE = 6

N_ATOMS = 3
N_FRAMES = 5
TIMESTEP_PS = 1.0


def build_var(name: str, dimids: list[int], nc_type: int, vsize: int, begin: int) -> bytes:
    b = nc_string(name)
    b += u32be(len(dimids))
    for d in dimids:
        b += u32be(d)
    b += absent()  # no per-variable attributes
    b += u32be(nc_type)
    b += u32be(vsize)
    b += u32be(begin)  # CDF-1: 4-byte begin
    return b


def main() -> None:
    # ── header ──────────────────────────────────────────────────────────────
    magic = b"CDF\x01"
    numrecs = u32be(N_FRAMES)

    # dims: frame(0=unlimited), atom(N_ATOMS), spatial(3), cell_spatial(3)
    dim_list = (
        u32be(TAG_DIM)
        + u32be(4)
        + nc_string("frame") + u32be(0)          # unlimited
        + nc_string("atom") + u32be(N_ATOMS)
        + nc_string("spatial") + u32be(3)
        + nc_string("cell_spatial") + u32be(3)
    )

    # global attrs: Conventions="AMBER", ConventionVersion="1.0"
    def nc_char_attr(name: str, val: str) -> bytes:
        b = nc_string(name) + u32be(2)  # NC_CHAR
        v = val.encode("ascii")
        n = len(v)
        padded = (n + 3) & ~3
        b += u32be(n) + v + b"\x00" * (padded - n)
        return b

    gatt_list = (
        u32be(TAG_ATT)
        + u32be(2)
        + nc_char_attr("Conventions", "AMBER")
        + nc_char_attr("ConventionVersion", "1.0")
    )

    # var layout:
    #   var 0: coordinates(frame=0, atom=1, spatial=2) FLOAT  vsize=N_ATOMS*3*4
    #   var 1: time(frame=0) FLOAT  vsize=4
    #   var 2: cell_lengths(frame=0, cell_spatial=3) DOUBLE  vsize=24
    coord_vsize = N_ATOMS * 3 * 4
    time_vsize = 4
    cell_vsize = 3 * 8  # 3 × f64

    # compute begin offsets after we know the header size
    # Build the var section with placeholder begins (0) first
    var_section_placeholder = (
        u32be(TAG_VAR)
        + u32be(3)
        + build_var("coordinates", [0, 1, 2], NC_FLOAT, coord_vsize, 0)
        + build_var("time", [0], NC_FLOAT, time_vsize, 0)
        + build_var("cell_lengths", [0, 3], NC_DOUBLE, cell_vsize, 0)
    )

    header_placeholder = magic + numrecs + dim_list + gatt_list + var_section_placeholder
    header_size = len(header_placeholder)

    # recsize = sum of padded vsizes of all record variables
    recsize = (
        ((coord_vsize + 3) & ~3)
        + ((time_vsize + 3) & ~3)
        + ((cell_vsize + 3) & ~3)
    )

    # begin offsets (all record vars, ordered by var_list position)
    coord_begin = header_size
    time_begin = coord_begin + ((coord_vsize + 3) & ~3)
    cell_begin = time_begin + ((time_vsize + 3) & ~3)

    var_section = (
        u32be(TAG_VAR)
        + u32be(3)
        + build_var("coordinates", [0, 1, 2], NC_FLOAT, coord_vsize, coord_begin)
        + build_var("time", [0], NC_FLOAT, time_vsize, time_begin)
        + build_var("cell_lengths", [0, 3], NC_DOUBLE, cell_vsize, cell_begin)
    )

    header = magic + numrecs + dim_list + gatt_list + var_section
    assert len(header) == header_size, f"header size mismatch: {len(header)} != {header_size}"

    # ── data section ────────────────────────────────────────────────────────
    # water: O at (0,0,0), H at (0.96,0,0), H at (-0.24,0.93,0) per frame
    # Each frame shifts atoms by 0.1 Å in x for variety.
    base_coords = [
        (0.000, 0.000, 0.000),  # O
        (0.960, 0.000, 0.000),  # H
        (-0.240, 0.928, 0.000),  # H
    ]
    cell = [10.0, 10.0, 10.0]  # orthorhombic

    data = bytearray()
    for i in range(N_FRAMES):
        shift = i * 0.1
        # coordinates
        for (x, y, z) in base_coords:
            data += f32be(x + shift)
            data += f32be(y)
            data += f32be(z)
        # time
        data += f32be(i * TIMESTEP_PS)
        # cell_lengths
        for cl in cell:
            data += f64be(cl)

    # verify first-frame offsets
    assert data[0:4] == f32be(base_coords[0][0]), "coord_begin drift"
    assert data[coord_vsize : coord_vsize + 4] == f32be(0.0), "time_begin drift"

    out = header + bytes(data)
    dest = os.path.join(os.path.dirname(__file__), "water.nc")
    with open(dest, "wb") as fh:
        fh.write(out)
    print(f"Wrote {len(out)} bytes to {dest}")
    print(f"  n_atoms={N_ATOMS}  n_frames={N_FRAMES}  recsize={recsize}")
    print(f"  coord_begin={coord_begin}  time_begin={time_begin}  cell_begin={cell_begin}")


if __name__ == "__main__":
    main()

/**
 * Unit tests for the synchronous parse client and the parseCore dispatch layer.
 *
 * The real WASM module is replaced with a mock (jsdom cannot run the wasm-bindgen
 * bundle), so these exercise the full main-thread path: File read → ensureInit →
 * format dispatch (getParserForExtension / parseTrajectoryCore) → result
 * extraction. This is the coverage that the worker/E2E paths cannot provide in a
 * unit environment.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Everything the vi.mock factory touches must be created inside vi.hoisted(),
// because vi.mock is hoisted above the module body (and above these helpers).
const { calls, wasmMock } = vi.hoisted(() => {
  const calls: string[] = [];

  function mockStructResult(nAtoms: number, nFrames = 0) {
    return {
      n_atoms: nAtoms,
      n_bonds: 0,
      n_file_bonds: 0,
      n_frames: nFrames,
      has_box: false,
      has_atom_labels: false,
      has_chain_ids: false,
      has_bfactors: false,
      atom_labels: "",
      vector_channel_count: 0,
      vector_channel_meta: "[]",
      ca_count: 0,
      symmetry_op_count: 0,
      symmetry_ops: "",
      positions: () => new Float32Array(nAtoms * 3),
      elements: () => new Uint8Array(nAtoms),
      bonds: () => new Uint32Array(0),
      bond_orders: () => new Uint8Array(0),
      box_matrix: () => new Float32Array(9),
      frame_data: () => new Float32Array(nFrames * nAtoms * 3),
      chain_ids: () => new Uint8Array(nAtoms),
      bfactors: () => new Float32Array(nAtoms),
      vector_channel_data: () => new Float32Array(),
      ca_indices: () => new Uint32Array(0),
      ca_chain_ids: () => new Uint8Array(0),
      ca_res_nums: () => new Uint32Array(0),
      ca_ss_type: () => new Uint8Array(0),
      free: () => {},
    };
  }

  function mockXtcResult(nAtoms: number, nFrames: number) {
    return {
      n_atoms: nAtoms,
      n_frames: nFrames,
      timestep_ps: 1,
      has_box: false,
      vector_channel_count: 0,
      vector_channel_meta: "[]",
      box_matrix: () => new Float32Array(9),
      frame_data: () => new Float32Array(nFrames * nAtoms * 3),
      vector_channel_data: () => new Float32Array(),
      free: () => {},
    };
  }

  const structFn = (name: string) => () => {
    calls.push(name);
    return mockStructResult(3);
  };
  const xtcFn = (name: string) => () => {
    calls.push(name);
    return mockXtcResult(4, 2);
  };

  const wasmMock = {
    default: async () => {},
    parse_pdb: structFn("parse_pdb"),
    parse_gro: structFn("parse_gro"),
    parse_xyz: structFn("parse_xyz"),
    parse_xyz_frame0: structFn("parse_xyz_frame0"),
    parse_mol: structFn("parse_mol"),
    parse_mol2: structFn("parse_mol2"),
    parse_cif: structFn("parse_cif"),
    parse_mmcif: structFn("parse_mmcif"),
    parse_lammps_data: structFn("parse_lammps_data"),
    parse_prmtop: structFn("parse_prmtop"),
    parse_traj: () => {
      calls.push("parse_traj");
      return mockStructResult(3, 1);
    },
    parse_xtc_file: xtcFn("parse_xtc_file"),
    parse_dcd_file: xtcFn("parse_dcd_file"),
    parse_netcdf_file: xtcFn("parse_netcdf_file"),
    parse_lammpstrj_file: xtcFn("parse_lammpstrj_file"),
    infer_bonds_vdw: () => new Uint32Array([0, 1]),
    parse_top_bonds: () => new Uint32Array([0, 1]),
    parse_top_bonds_with_includes: () => new Uint32Array([0, 1]),
    parse_psf_bonds: () => new Uint32Array([0, 1]),
    parse_pdb_bonds: () => new Uint32Array([0, 1]),
    extract_labels: () => "A\nB\nC",
    XtcDecoder: class {
      n_atoms = 4;
      n_frames = 2;
      timestep_ps = 1;
      has_box = false;
      box_matrix() {
        return new Float32Array(9);
      }
      times() {
        return new Float32Array(2);
      }
      decode_frame() {
        return new Float32Array(4 * 3);
      }
      free() {}
    },
    LammpstrjDecoder: class {
      n_atoms = 4;
      n_frames = 2;
      timestep_ps = 1;
      has_box = false;
      vector_channel_count = 0;
      vector_channel_names = "";
      box_matrix() {
        return new Float32Array(9);
      }
      decode_frame() {
        return new Float32Array(4 * 3);
      }
      decode_frame_vectors() {
        return new Float32Array(0);
      }
      free() {}
    },
    StructureFrameDecoder: class {
      n_atoms = 3;
      n_frames = 2;
      decode_frame() {
        return new Float32Array(3 * 3);
      }
      free() {}
    },
  };

  return { calls, wasmMock };
});

vi.mock("../../../crates/megane-wasm/pkg", () => wasmMock);

import * as sync from "@/parsers/parseClientSync";

function fakeFile(name: string, content = "DATA"): File {
  return {
    name,
    text: async () => content,
    arrayBuffer: async () => new TextEncoder().encode(content).buffer,
  } as unknown as File;
}

describe("parseClientSync (main-thread path with mocked wasm)", () => {
  beforeEach(() => {
    calls.length = 0;
  });

  it("dispatches structure formats by extension", async () => {
    const out = await sync.parseStructureFile(fakeFile("x.gro"));
    expect(out.snapshot.nAtoms).toBe(3);
    expect(calls).toContain("parse_gro");
  });

  it("routes .traj through the binary structure parser", async () => {
    const out = await sync.parseStructureFile(fakeFile("m.traj"));
    expect(calls).toContain("parse_traj");
    expect(out.frames.length).toBe(1); // one extra frame
  });

  it("parseStructureText defaults to PDB and honors fileName", async () => {
    await sync.parseStructureText("ATOM", "y.cif");
    expect(calls).toContain("parse_cif");
    await sync.parseStructureText("ATOM");
    expect(calls).toContain("parse_pdb");
  });

  it("parses each trajectory format", async () => {
    await sync.parseXTCFile(fakeFile("t.xtc"), 4);
    await sync.parseDCDFile(fakeFile("t.dcd"), 4);
    await sync.parseNetCDFFile(fakeFile("t.nc"), 4);
    await sync.parseLammpstrjFile(fakeFile("t.lammpstrj"), 4);
    expect(calls).toEqual(
      expect.arrayContaining([
        "parse_xtc_file",
        "parse_dcd_file",
        "parse_netcdf_file",
        "parse_lammpstrj_file",
      ]),
    );
  });

  it("throws on a trajectory atom-count mismatch", async () => {
    await expect(sync.parseXTCFile(fakeFile("t.xtc"), 99)).rejects.toThrow(/atom count/);
  });

  it("exposes bond and label helpers", async () => {
    const core = await import("@/parsers/parseCore");
    expect(await core.inferBondsVdw(new Float32Array(6), new Uint8Array(2), 2)).toBeInstanceOf(
      Uint32Array,
    );
    expect(await core.parseTopBonds("x", 2)).toBeInstanceOf(Uint32Array);
    expect(await core.parseTopBondsWithIncludes("x", {}, 2)).toBeInstanceOf(Uint32Array);
    expect(await core.parsePsfBonds("x", 2)).toBeInstanceOf(Uint32Array);
    expect(await core.parsePdbBonds("x", 2)).toBeInstanceOf(Uint32Array);
    const labels = await core.extractLabelsFromFile(fakeFile("x.gro"), 2);
    expect(labels).toHaveLength(2); // trimmed to nAtoms
    const txt = await core.extractLabelsFromFile(fakeFile("notes.txt", "a\nb"), 3);
    expect(txt).toEqual(["a", "b", ""]); // padded to nAtoms
  });

  it("degrades the lazy XTC exports to eager (worker-only feature)", async () => {
    // On the sync path (JupyterLab/anywidget / worker-unavailable), indexXTCFile
    // returns null so the caller falls back to eager parseXTCFile; decode is
    // never reached and dispose is a no-op.
    expect(await sync.indexTrajectoryLazy(fakeFile("t.xtc"), "xtc", 4)).toBeNull();
    await expect(sync.decodeTrajectoryFrame(0, 0)).rejects.toThrow(/worker-only/);
    expect(() => sync.disposeTrajectoryLazy(0)).not.toThrow();
    // Never streams on the sync path, regardless of file size.
    expect(sync.shouldUseLazyTrajectory("xtc", 1)).toBe(false);
    expect(sync.shouldUseLazyTrajectory("lammpstrj", 1024 * 1024 * 1024)).toBe(false);
  });

  it("degrades the lazy structure exports to eager (worker-only feature)", async () => {
    // Multi-frame XYZ streaming needs a worker; the sync path never uses it.
    expect(await sync.parseStructureFrame0(fakeFile("m.xyz"), ".xyz")).toBeNull();
    expect(await sync.indexStructureLazy(fakeFile("m.xyz"), "xyz")).toBeNull();
    expect(sync.shouldUseLazyStructure("xyz", 1024 * 1024 * 1024)).toBe(false);
  });
});

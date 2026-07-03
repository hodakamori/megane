/**
 * Unit tests for the parse worker's message handler.
 *
 * Importing parse.worker.ts installs `self.onmessage`. With the WASM module
 * mocked, we can invoke the handler directly and assert it posts back an
 * ok/error response — covering the worker wrapper without a real Worker.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { wasmMock } = vi.hoisted(() => {
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
  const wasmMock = {
    default: async () => {},
    parse_pdb: () => mockStructResult(3),
    parse_gro: () => mockStructResult(3),
    parse_xyz: () => mockStructResult(3),
    parse_mol: () => mockStructResult(3),
    parse_mol2: () => mockStructResult(3),
    parse_cif: () => mockStructResult(3),
    parse_mmcif: () => mockStructResult(3),
    parse_lammps_data: () => mockStructResult(3),
    parse_prmtop: () => mockStructResult(3),
    parse_traj: () => mockStructResult(3, 1),
    parse_xtc_file: () => mockXtcResult(4, 2),
    parse_dcd_file: () => mockXtcResult(4, 2),
    parse_netcdf_file: () => mockXtcResult(4, 2),
    parse_lammpstrj_file: () => mockXtcResult(4, 2),
    infer_bonds_vdw: () => new Uint32Array(),
    parse_top_bonds: () => new Uint32Array(),
    parse_top_bonds_with_includes: () => new Uint32Array(),
    parse_psf_bonds: () => new Uint32Array(),
    parse_pdb_bonds: () => new Uint32Array(),
    extract_labels: () => "",
  };
  return { wasmMock };
});

vi.mock("../../../crates/megane-wasm/pkg", () => wasmMock);

type Handler = (e: { data: unknown }) => Promise<void> | void;

interface WorkerResponse {
  id: number;
  ok: boolean;
  op: string;
  result?: unknown;
  error?: string;
}

async function loadWorker(): Promise<{ handler: Handler; posts: WorkerResponse[] }> {
  vi.resetModules();
  const posts: WorkerResponse[] = [];
  (self as unknown as { postMessage: unknown }).postMessage = (msg: WorkerResponse) =>
    posts.push(msg);
  await import("@/parsers/parse.worker");
  const handler = (self as unknown as { onmessage: Handler }).onmessage;
  return { handler, posts };
}

describe("parse.worker onmessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses a structure request and posts an ok response", async () => {
    const { handler, posts } = await loadWorker();
    await handler({
      data: { id: 1, op: "structure", wasmUrl: undefined, ext: ".pdb", text: "ATOM" },
    });
    expect(posts).toHaveLength(1);
    expect(posts[0].ok).toBe(true);
    expect(posts[0].op).toBe("structure");
    expect(posts[0].result).toBeDefined();
  });

  it("parses a trajectory request and posts an ok response", async () => {
    const { handler, posts } = await loadWorker();
    await handler({
      data: {
        id: 2,
        op: "trajectory",
        wasmUrl: undefined,
        kind: "xtc",
        bytes: new Uint8Array([1, 2]).buffer,
        expectedNAtoms: 4,
      },
    });
    expect(posts[0].ok).toBe(true);
    expect(posts[0].op).toBe("trajectory");
  });

  it("posts an error response when parsing throws", async () => {
    const { handler, posts } = await loadWorker();
    // expectedNAtoms mismatch makes extractFrames throw.
    await handler({
      data: {
        id: 3,
        op: "trajectory",
        wasmUrl: undefined,
        kind: "xtc",
        bytes: new Uint8Array([1]).buffer,
        expectedNAtoms: 999,
      },
    });
    expect(posts[0].ok).toBe(false);
    expect(posts[0].error).toMatch(/atom count/);
  });
});

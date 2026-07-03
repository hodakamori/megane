/**
 * Unit tests for parseClient's Web Worker path.
 *
 * jsdom has no real Worker, so we install a fake Worker (both as the mocked
 * `?worker&inline` import and as `globalThis.Worker`) that echoes a canned
 * response. This exercises getWorker / send / resolveWasmUrl / onmessage and
 * the error → tearDown → synchronous-fallback branch that the plain fallback
 * test cannot reach.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { state, FakeWorker } = vi.hoisted(() => {
  const state = { mode: "ok" as "ok" | "err", lastReq: null as { id: number; op: string } | null };
  class FakeWorker {
    onmessage: ((e: { data: unknown }) => void) | null = null;
    onerror: (() => void) | null = null;
    postMessage(req: { id: number; op: string }) {
      state.lastReq = req;
      queueMicrotask(() => {
        if (state.mode === "ok") {
          this.onmessage?.({ data: { id: req.id, ok: true, op: req.op, result: { tag: "worker" } } });
        } else {
          this.onmessage?.({ data: { id: req.id, ok: false, op: req.op, error: "boom" } });
        }
      });
    }
    terminate() {}
  }
  return { state, FakeWorker };
});

vi.mock("@/parsers/parse.worker?worker&inline", () => ({ default: FakeWorker }));
vi.mock("@/parsers/parseClientSync", () => ({
  parseStructureFile: vi.fn(async () => ({ tag: "sync" })),
  parseStructureText: vi.fn(async () => ({ tag: "sync" })),
  parseXTCFile: vi.fn(async () => ({ tag: "sync" })),
  parseDCDFile: vi.fn(async () => ({ tag: "sync" })),
  parseLammpstrjFile: vi.fn(async () => ({ tag: "sync" })),
  parseNetCDFFile: vi.fn(async () => ({ tag: "sync" })),
}));

function fakeFile(name: string): File {
  return {
    name,
    text: async () => "DATA",
    arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
  } as unknown as File;
}

// Fresh parseClient module (and its worker/workerBroken state) per test.
async function freshClient() {
  vi.resetModules();
  (globalThis as Record<string, unknown>).Worker = FakeWorker;
  return import("@/parsers/parseClient");
}

describe("parseClient worker path", () => {
  beforeEach(() => {
    state.mode = "ok";
    state.lastReq = null;
    vi.clearAllMocks();
  });

  it("resolves a structure parse via the worker", async () => {
    const client = await freshClient();
    const out = await client.parseStructureFile(fakeFile("x.pdb"));
    expect(out).toEqual({ tag: "worker" });
    expect(state.lastReq?.op).toBe("structure");
  });

  it("sends .traj bytes through the worker", async () => {
    const client = await freshClient();
    await client.parseStructureFile(fakeFile("m.traj"));
    expect(state.lastReq?.op).toBe("structure");
  });

  it("resolves each trajectory format via the worker", async () => {
    const client = await freshClient();
    expect(await client.parseXTCFile(fakeFile("t.xtc"), 4)).toEqual({ tag: "worker" });
    expect(await client.parseDCDFile(fakeFile("t.dcd"), 4)).toEqual({ tag: "worker" });
    expect(await client.parseNetCDFFile(fakeFile("t.nc"), 4)).toEqual({ tag: "worker" });
    expect(await client.parseLammpstrjFile(fakeFile("t.lammpstrj"), 4)).toEqual({ tag: "worker" });
  });

  it("parseStructureText resolves via the worker", async () => {
    const client = await freshClient();
    expect(await client.parseStructureText("ATOM", "x.pdb")).toEqual({ tag: "worker" });
  });

  it("falls back to sync when the worker returns an error", async () => {
    const client = await freshClient();
    const sync = await import("@/parsers/parseClientSync");
    state.mode = "err";
    const out = await client.parseStructureFile(fakeFile("x.pdb"));
    expect(out).toEqual({ tag: "sync" });
    expect(sync.parseStructureFile).toHaveBeenCalled();
  });

  it("falls back to sync for trajectories when the worker errors", async () => {
    const client = await freshClient();
    const sync = await import("@/parsers/parseClientSync");
    state.mode = "err";
    const out = await client.parseXTCFile(fakeFile("t.xtc"), 4);
    expect(out).toEqual({ tag: "sync" });
    expect(sync.parseXTCFile).toHaveBeenCalled();
  });
});

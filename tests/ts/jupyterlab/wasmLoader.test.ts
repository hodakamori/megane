import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

type GlobalWithWasm = Record<string, unknown> & {
  __MEGANE_WASM_URL__?: unknown;
};

beforeEach(() => {
  vi.resetModules();
  delete (globalThis as GlobalWithWasm).__MEGANE_WASM_URL__;
});

afterEach(() => {
  vi.doUnmock("@jupyterlab/coreutils");
  delete (globalThis as GlobalWithWasm).__MEGANE_WASM_URL__;
});

describe("ensureWasmUrl — catch branch", () => {
  it("constructs the labextension URL from PageConfig when the wasm import fails", async () => {
    vi.doMock("@jupyterlab/coreutils", () => ({
      PageConfig: { getOption: vi.fn(() => "https://lab.example.test/extensions") },
    }));

    const { ensureWasmUrl } = await import(
      "../../../jupyterlab-megane/src/wasmLoader"
    );
    await ensureWasmUrl();

    expect((globalThis as GlobalWithWasm).__MEGANE_WASM_URL__).toBe(
      "https://lab.example.test/extensions/megane-jupyterlab/static/megane_wasm_bg.wasm",
    );
  });

  it("rethrows the original wasm import error when PageConfig has no base URL", async () => {
    vi.doMock("@jupyterlab/coreutils", () => ({
      PageConfig: { getOption: vi.fn(() => "") },
    }));

    const { ensureWasmUrl } = await import(
      "../../../jupyterlab-megane/src/wasmLoader"
    );

    await expect(ensureWasmUrl()).rejects.toBeDefined();
    expect((globalThis as GlobalWithWasm).__MEGANE_WASM_URL__).toBeUndefined();
  });
});

describe("ensureWasmUrl — promise cache", () => {
  it("returns the same Promise reference on subsequent calls", async () => {
    vi.doMock("@jupyterlab/coreutils", () => ({
      PageConfig: { getOption: vi.fn(() => "/lab/extensions") },
    }));

    const { ensureWasmUrl } = await import(
      "../../../jupyterlab-megane/src/wasmLoader"
    );

    const first = ensureWasmUrl();
    const second = ensureWasmUrl();
    expect(first).toBe(second);

    await first;
  });

  it("invokes PageConfig.getOption only once across two ensureWasmUrl calls", async () => {
    const getOption = vi.fn(() => "/lab/extensions");
    vi.doMock("@jupyterlab/coreutils", () => ({ PageConfig: { getOption } }));

    const { ensureWasmUrl } = await import(
      "../../../jupyterlab-megane/src/wasmLoader"
    );

    await ensureWasmUrl();
    await ensureWasmUrl();

    expect(getOption).toHaveBeenCalledTimes(1);
    expect(getOption).toHaveBeenCalledWith("fullLabextensionsUrl");
  });

  it("survives a fresh module load with a cleared cache (vi.resetModules)", async () => {
    vi.doMock("@jupyterlab/coreutils", () => ({
      PageConfig: { getOption: vi.fn(() => "/lab/extensions") },
    }));

    const first = await import("../../../jupyterlab-megane/src/wasmLoader");
    await first.ensureWasmUrl();
    expect((globalThis as GlobalWithWasm).__MEGANE_WASM_URL__).toBe(
      "/lab/extensions/megane-jupyterlab/static/megane_wasm_bg.wasm",
    );

    delete (globalThis as GlobalWithWasm).__MEGANE_WASM_URL__;
    vi.resetModules();

    vi.doMock("@jupyterlab/coreutils", () => ({
      PageConfig: { getOption: vi.fn(() => "/other/base") },
    }));
    const second = await import("../../../jupyterlab-megane/src/wasmLoader");
    await second.ensureWasmUrl();
    expect((globalThis as GlobalWithWasm).__MEGANE_WASM_URL__).toBe(
      "/other/base/megane-jupyterlab/static/megane_wasm_bg.wasm",
    );
  });
});

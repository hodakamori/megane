import { describe, it, expect, afterEach, vi } from "vitest";
import { isE2ETestMode } from "@/testMode";

type TestGlobal = { __MEGANE_TEST__?: boolean };

afterEach(() => {
  delete (globalThis as TestGlobal).__MEGANE_TEST__;
  vi.unstubAllGlobals();
  // Restore jsdom's default location (no query string).
  window.history.replaceState(null, "", "/");
});

describe("isE2ETestMode", () => {
  it("is false by default (no flag, no query param)", () => {
    expect(isE2ETestMode()).toBe(false);
  });

  it("is true when the __MEGANE_TEST__ global is set", () => {
    (globalThis as TestGlobal).__MEGANE_TEST__ = true;
    expect(isE2ETestMode()).toBe(true);
  });

  it("ignores a non-true __MEGANE_TEST__ global", () => {
    (globalThis as TestGlobal).__MEGANE_TEST__ = false;
    expect(isE2ETestMode()).toBe(false);
  });

  it("is true when the URL carries ?test=1 (webapp E2E path)", () => {
    window.history.replaceState(null, "", "/?test=1");
    expect(isE2ETestMode()).toBe(true);
  });

  it("is false for other test query values", () => {
    window.history.replaceState(null, "", "/?test=0");
    expect(isE2ETestMode()).toBe(false);
  });

  it("inherits the flag from a same-origin parent window", () => {
    vi.stubGlobal("window", {
      location: { search: "" },
      parent: { __MEGANE_TEST__: true },
    } as unknown as Window & typeof globalThis);
    expect(isE2ETestMode()).toBe(true);
  });

  it("treats a throwing parent access as non-test", () => {
    vi.stubGlobal("window", {
      location: { search: "" },
      get parent(): Window {
        throw new Error("cross-origin");
      },
    } as unknown as Window & typeof globalThis);
    expect(isE2ETestMode()).toBe(false);
  });
});

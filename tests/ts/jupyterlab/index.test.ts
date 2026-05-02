import { describe, it, expect, afterEach } from "vitest";

import { exposeAppForTests } from "../../../jupyterlab-megane/src/testHook";

const fakeApp = { __id: "fake-jupyterfrontend" } as unknown as Parameters<
  typeof exposeAppForTests
>[0];

afterEach(() => {
  delete (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__;
  delete (globalThis as { jupyterapp?: unknown }).jupyterapp;
});

describe("exposeAppForTests", () => {
  it("publishes the app on globalThis.jupyterapp when __MEGANE_TEST__ is true", () => {
    (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = true;
    exposeAppForTests(fakeApp);
    expect((globalThis as { jupyterapp?: unknown }).jupyterapp).toBe(fakeApp);
  });

  it("leaves globalThis.jupyterapp untouched when __MEGANE_TEST__ is unset", () => {
    exposeAppForTests(fakeApp);
    expect((globalThis as { jupyterapp?: unknown }).jupyterapp).toBeUndefined();
  });

  it("leaves globalThis.jupyterapp untouched when __MEGANE_TEST__ is explicitly false", () => {
    (globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__ = false;
    exposeAppForTests(fakeApp);
    expect((globalThis as { jupyterapp?: unknown }).jupyterapp).toBeUndefined();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { usePipelineUIStore } from "@/stores/usePipelineUIStore";

const STORAGE_KEY = "megane-pipeline-ui";

function resetStore() {
  usePipelineUIStore.setState({ mode: "editor", pendingNotice: null });
}

describe("usePipelineUIStore", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to the editor tab and no pending notice", () => {
    expect(usePipelineUIStore.getState().mode).toBe("editor");
    expect(usePipelineUIStore.getState().pendingNotice).toBeNull();
  });

  it("setMode persists the chosen tab to sessionStorage (not localStorage)", () => {
    usePipelineUIStore.getState().setMode("chat");

    expect(usePipelineUIStore.getState().mode).toBe("chat");
    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY)!)).toEqual({ mode: "chat" });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    usePipelineUIStore.getState().setMode("editor");
    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY)!)).toEqual({ mode: "editor" });
  });

  it("setMode tolerates a sessionStorage that throws", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    expect(() => usePipelineUIStore.getState().setMode("chat")).not.toThrow();
    expect(usePipelineUIStore.getState().mode).toBe("chat");
    setItem.mockRestore();
  });

  it("markPipelineApplied switches to the editor tab and stamps a notice", () => {
    usePipelineUIStore.setState({ mode: "chat", pendingNotice: null });

    usePipelineUIStore.getState().markPipelineApplied();

    expect(usePipelineUIStore.getState().mode).toBe("editor");
    expect(usePipelineUIStore.getState().pendingNotice).toMatchObject({ kind: "applied" });
    expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY)!)).toEqual({ mode: "editor" });
  });

  it("each markPipelineApplied call yields a fresh notice id", () => {
    usePipelineUIStore.getState().markPipelineApplied();
    const first = usePipelineUIStore.getState().pendingNotice!.id;

    usePipelineUIStore.getState().markPipelineApplied();
    const second = usePipelineUIStore.getState().pendingNotice!.id;

    expect(second).toBeGreaterThan(first);
  });

  it("dismissNotice clears the pending notice", () => {
    usePipelineUIStore.getState().markPipelineApplied();
    expect(usePipelineUIStore.getState().pendingNotice).not.toBeNull();

    usePipelineUIStore.getState().dismissNotice();
    expect(usePipelineUIStore.getState().pendingNotice).toBeNull();
  });
});

describe("usePipelineUIStore initial load", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hydrates the mode from sessionStorage when a valid value is stored", async () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: "chat" }));
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("chat");
  });

  it("ignores legacy localStorage entries and defaults to 'editor' on cold start", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: "chat" }));
    const mod = await import("@/stores/usePipelineUIStore");
    // Cold-start always opens on the editor so the pipeline is visible by
    // default — even for users whose previous build persisted "chat" to
    // localStorage. The legacy entry is also cleaned up.
    expect(mod.usePipelineUIStore.getState().mode).toBe("editor");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("falls back to 'editor' when the stored payload is malformed", async () => {
    sessionStorage.setItem(STORAGE_KEY, "not-json");
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("editor");
  });

  it("falls back to 'editor' when the stored mode is unknown", async () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: "neon" }));
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("editor");
  });

  it("falls back to 'editor' when sessionStorage.getItem throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("editor");
  });
});

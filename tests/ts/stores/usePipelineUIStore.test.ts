import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { usePipelineUIStore } from "@/stores/usePipelineUIStore";

const STORAGE_KEY = "megane-pipeline-ui";

function resetStore() {
  usePipelineUIStore.setState({ mode: "editor", pendingNotice: null });
}

describe("usePipelineUIStore", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to the editor tab and no pending notice", () => {
    expect(usePipelineUIStore.getState().mode).toBe("editor");
    expect(usePipelineUIStore.getState().pendingNotice).toBeNull();
  });

  it("setMode persists the chosen tab to localStorage", () => {
    usePipelineUIStore.getState().setMode("chat");

    expect(usePipelineUIStore.getState().mode).toBe("chat");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ mode: "chat" });

    usePipelineUIStore.getState().setMode("editor");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ mode: "editor" });
  });

  it("setMode tolerates a localStorage that throws", () => {
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
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual({ mode: "editor" });
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hydrates the mode from localStorage when a valid value is stored", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: "chat" }));
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("chat");
  });

  it("falls back to 'editor' when the stored payload is malformed", async () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("editor");
  });

  it("falls back to 'editor' when the stored mode is unknown", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: "neon" }));
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("editor");
  });

  it("falls back to 'editor' when localStorage.getItem throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const mod = await import("@/stores/usePipelineUIStore");
    expect(mod.usePipelineUIStore.getState().mode).toBe("editor");
  });
});

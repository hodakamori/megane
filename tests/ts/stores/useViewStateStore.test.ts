import { describe, it, expect, beforeEach, vi } from "vitest";
import type { MeganeCameraState } from "@/renderer/MoleculeRenderer";

// Note: useViewStateStore reads localStorage at module load time, so each test
// resets localStorage and re-imports the module to start from a clean slate.

const STORAGE_KEY = "megane-view-state";

function makeCameraState(overrides: Partial<MeganeCameraState> = {}): MeganeCameraState {
  return {
    mode: "orthographic",
    position: [1, 2, 3],
    target: [0, 0, 0],
    zoom: 1,
    ...overrides,
  };
}

async function freshStore() {
  vi.resetModules();
  return (await import("@/stores/useViewStateStore")).useViewStateStore;
}

describe("useViewStateStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadViewState (initial state)", () => {
    it("starts with camera = null when localStorage is empty", async () => {
      const store = await freshStore();
      expect(store.getState().camera).toBeNull();
    });

    it("hydrates camera from localStorage when valid JSON is present", async () => {
      const cam = makeCameraState({ position: [10, 20, 30] });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ camera: cam }));
      const store = await freshStore();
      expect(store.getState().camera).toEqual(cam);
    });

    it("returns null camera when JSON is malformed", async () => {
      localStorage.setItem(STORAGE_KEY, "{not valid json");
      const store = await freshStore();
      expect(store.getState().camera).toBeNull();
    });

    it("returns null camera when payload has no camera key", async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ other: "value" }));
      const store = await freshStore();
      expect(store.getState().camera).toBeNull();
    });

    it("returns null camera when stored camera is not an object", async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ camera: 42 }));
      const store = await freshStore();
      expect(store.getState().camera).toBeNull();
    });
  });

  describe("updateCamera", () => {
    it("sets the in-memory camera state", async () => {
      const store = await freshStore();
      const cam = makeCameraState();
      store.getState().updateCamera(cam);
      expect(store.getState().camera).toEqual(cam);
    });

    it("persists the camera state to localStorage", async () => {
      const store = await freshStore();
      const cam = makeCameraState({ zoom: 2.5 });
      store.getState().updateCamera(cam);
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual({ camera: cam });
    });

    it("overwrites a previously persisted camera", async () => {
      const store = await freshStore();
      store.getState().updateCamera(makeCameraState({ zoom: 1 }));
      store.getState().updateCamera(makeCameraState({ zoom: 9 }));
      expect(store.getState().camera?.zoom).toBe(9);
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).camera.zoom).toBe(9);
    });

    it("silently ignores localStorage write errors", async () => {
      const store = await freshStore();
      const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
      try {
        // Should not throw despite setItem rejecting
        expect(() => store.getState().updateCamera(makeCameraState())).not.toThrow();
        // In-memory state still updates even when persistence fails
        expect(store.getState().camera).not.toBeNull();
      } finally {
        setItemSpy.mockRestore();
      }
    });
  });

  describe("clearViewState", () => {
    it("resets camera to null", async () => {
      const store = await freshStore();
      store.getState().updateCamera(makeCameraState());
      store.getState().clearViewState();
      expect(store.getState().camera).toBeNull();
    });

    it("removes the localStorage key", async () => {
      const store = await freshStore();
      store.getState().updateCamera(makeCameraState());
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
      store.getState().clearViewState();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("silently ignores localStorage removal errors", async () => {
      const store = await freshStore();
      store.getState().updateCamera(makeCameraState());
      const removeSpy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
        throw new Error("storage unavailable");
      });
      try {
        expect(() => store.getState().clearViewState()).not.toThrow();
        expect(store.getState().camera).toBeNull();
      } finally {
        removeSpy.mockRestore();
      }
    });
  });

  describe("round-trip", () => {
    it("persisted state survives a fresh module reload", async () => {
      const store1 = await freshStore();
      const cam = makeCameraState({
        mode: "perspective",
        position: [5, 6, 7],
        target: [1, 1, 1],
        zoom: 1.5,
      });
      store1.getState().updateCamera(cam);

      // Simulate reload: re-import the module and confirm initial state
      // is restored from localStorage.
      const store2 = await freshStore();
      expect(store2.getState().camera).toEqual(cam);
    });
  });
});

/**
 * View state persistence store.
 * Saves camera position/orientation to localStorage so that camera state
 * survives page reloads. Follows the same pattern as useAIConfigStore.
 */

import { create } from "zustand";
import type { MeganeCameraState } from "../renderer/MoleculeRenderer";

export interface PersistedViewState {
  camera: MeganeCameraState | null;
}

const STORAGE_KEY = "megane-view-state";

function loadViewState(): PersistedViewState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.camera && typeof parsed.camera === "object") {
        return { camera: parsed.camera as MeganeCameraState };
      }
    }
  } catch {
    // ignore parse errors
  }
  return { camera: null };
}

function saveViewState(state: PersistedViewState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors (private browsing, quota exceeded)
  }
}

interface ViewStateStore extends PersistedViewState {
  updateCamera: (camera: MeganeCameraState) => void;
  clearViewState: () => void;
}

export const useViewStateStore = create<ViewStateStore>((set) => ({
  ...loadViewState(),

  updateCamera: (camera) => {
    set({ camera });
    saveViewState({ camera });
  },

  clearViewState: () => {
    set({ camera: null });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },
}));

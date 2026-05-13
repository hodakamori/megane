/**
 * UI state for the Pipeline panel: which tab is active (Editor vs Chat) and a
 * transient "pipeline applied" notice surfaced after the chat assistant
 * rewrites the graph.
 *
 * Persistence is per-session (sessionStorage) rather than across reloads, so
 * every cold start opens on the Editor tab — the pipeline is always visible
 * by default. Within a session the user's tab choice is preserved across
 * navigations.
 */

import { create } from "zustand";

export type PipelinePanelMode = "editor" | "chat";

export interface PipelineAppliedNotice {
  kind: "applied";
  /** Monotonic id so consumers can de-dupe transient renders. */
  id: number;
}

const STORAGE_KEY = "megane-pipeline-ui";

function loadMode(): PipelinePanelMode {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.mode === "editor" || parsed.mode === "chat")) {
        return parsed.mode;
      }
    }
  } catch {
    // ignore parse / storage errors
  }
  // Drop any stale localStorage entry from earlier builds so a user who got
  // stuck on "chat" via the previous persistence model is freed automatically.
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return "editor";
}

function saveMode(mode: PipelinePanelMode) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ mode }));
  } catch {
    // ignore quota / blocked storage
  }
}

interface PipelineUIStore {
  mode: PipelinePanelMode;
  pendingNotice: PipelineAppliedNotice | null;
  setMode: (mode: PipelinePanelMode) => void;
  /** Switch to the editor tab and surface a one-shot "applied" notice. */
  markPipelineApplied: () => void;
  dismissNotice: () => void;
}

let nextNoticeId = 1;

export const usePipelineUIStore = create<PipelineUIStore>((set) => ({
  mode: loadMode(),
  pendingNotice: null,

  setMode: (mode) => {
    saveMode(mode);
    set({ mode });
  },

  markPipelineApplied: () => {
    saveMode("editor");
    set({ mode: "editor", pendingNotice: { kind: "applied", id: nextNoticeId++ } });
  },

  dismissNotice: () => {
    set({ pendingNotice: null });
  },
}));

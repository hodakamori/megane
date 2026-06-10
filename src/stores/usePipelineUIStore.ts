/**
 * UI state for the Pipeline panel: which tab is active (Editor vs Chat) and a
 * transient "pipeline applied" notice surfaced after the chat assistant
 * rewrites the graph.
 *
 * Persistence is per-session (sessionStorage) rather than across reloads, so
 * every cold start opens on the Chat tab — the assistant is the primary entry
 * point for building pipelines. Within a session the user's tab choice is
 * preserved across navigations.
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
  // Drop any stale localStorage entry from earlier builds so the per-session
  // model is the single source of truth.
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  return "chat";
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
  /** Surface a one-shot "applied" notice without leaving the current tab. */
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
    // Stay on the current tab (typically Chat) so the assistant's reply remains
    // visible; the editor frames the freshly applied graph via its own
    // mode-change effect when the user switches to it.
    set({ pendingNotice: { kind: "applied", id: nextNoticeId++ } });
  },

  dismissNotice: () => {
    set({ pendingNotice: null });
  },
}));

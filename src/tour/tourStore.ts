/**
 * Tour state for the first-time user guide.
 *
 * Persisted state lives in localStorage under STORAGE_KEY and is JSON-encoded.
 * The store keeps host metadata (which platform we're embedded in) so callers
 * can decide the per-host default behaviour and skip auto-start where the host
 * defaults to off (ipywidget).
 */
import { create } from "zustand";

export type TourHost = "webapp" | "vscode" | "jupyterlab" | "ipywidget";

const STORAGE_KEY = "megane-tour-prefs";

const HOST_DEFAULT_AUTO_START: Record<TourHost, boolean> = {
  webapp: true,
  vscode: true,
  jupyterlab: true,
  ipywidget: false,
};

interface PersistedPrefs {
  dontShowAgain: boolean;
}

function loadPrefs(): PersistedPrefs {
  if (typeof localStorage === "undefined") return { dontShowAgain: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dontShowAgain: false };
    const parsed = JSON.parse(raw) as Partial<PersistedPrefs>;
    return { dontShowAgain: Boolean(parsed.dontShowAgain) };
  } catch {
    return { dontShowAgain: false };
  }
}

function savePrefs(prefs: PersistedPrefs): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore quota / privacy-mode failures
  }
}

interface TourState {
  host: TourHost;
  isActive: boolean;
  dontShowAgain: boolean;
  /** Becomes true once auto-start has run for this session, regardless of outcome. */
  autoStartHandled: boolean;
  setHost: (host: TourHost) => void;
  setActive: (active: boolean) => void;
  setDontShowAgain: (value: boolean) => void;
  markAutoStartHandled: () => void;
}

export const useTourStore = create<TourState>((set) => ({
  host: "webapp",
  isActive: false,
  dontShowAgain: loadPrefs().dontShowAgain,
  autoStartHandled: false,
  setHost: (host) => set({ host }),
  setActive: (active) => set({ isActive: active }),
  setDontShowAgain: (value) => {
    savePrefs({ dontShowAgain: value });
    set({ dontShowAgain: value });
  },
  markAutoStartHandled: () => set({ autoStartHandled: true }),
}));

/**
 * URL query override for the webapp launcher: `?guide=on` forces the tour to
 * start, `?guide=off` suppresses it for this session. Returns null on other
 * hosts or when no recognised flag is present.
 */
function readWebappUrlOverride(): "on" | "off" | null {
  if (typeof window === "undefined") return null;
  try {
    const value = new URLSearchParams(window.location.search).get("guide");
    if (value === "on" || value === "1" || value === "true") return "on";
    if (value === "off" || value === "0" || value === "false") return "off";
  } catch {
    // ignore
  }
  return null;
}

export function shouldAutoStart(host: TourHost, dontShowAgain: boolean): boolean {
  if (host === "webapp") {
    const override = readWebappUrlOverride();
    if (override === "on") return true;
    if (override === "off") return false;
  }
  if (!HOST_DEFAULT_AUTO_START[host]) return false;
  return !dontShowAgain;
}

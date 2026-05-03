import { create } from "zustand";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "megane-theme";

function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    // ignore storage errors (private browsing, cross-origin)
  }
  return "system";
}

function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

export function themeToHex(resolvedTheme: ResolvedTheme): number {
  return resolvedTheme === "dark" ? 0x0f172a : 0xffffff;
}

interface ThemeStore {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  /** Called by a media query listener when system preference changes. */
  _syncSystemTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => {
  const theme = loadTheme();
  return {
    theme,
    resolvedTheme: resolveTheme(theme),

    setTheme: (theme) => {
      saveTheme(theme);
      set({ theme, resolvedTheme: resolveTheme(theme) });
    },

    _syncSystemTheme: () => {
      if (get().theme === "system") {
        set({ resolvedTheme: resolveTheme("system") });
      }
    },
  };
});

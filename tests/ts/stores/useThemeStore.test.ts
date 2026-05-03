import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  useThemeStore,
  resolveTheme,
  themeToHex,
  type Theme,
} from "@/stores/useThemeStore";

const STORAGE_KEY = "megane-theme";

function resetStore(theme: Theme = "system") {
  useThemeStore.setState({
    theme,
    resolvedTheme: theme === "dark" ? "dark" : "light",
  });
}

describe("resolveTheme", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 'light' for an explicit light theme", () => {
    expect(resolveTheme("light")).toBe("light");
  });

  it("returns 'dark' for an explicit dark theme", () => {
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("returns 'dark' when system prefers dark", () => {
    vi.stubGlobal("window", {
      ...window,
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    });
    expect(resolveTheme("system")).toBe("dark");
  });

  it("returns 'light' when system prefers light", () => {
    vi.stubGlobal("window", {
      ...window,
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
    });
    expect(resolveTheme("system")).toBe("light");
  });

  it("returns 'light' when matchMedia is unavailable", () => {
    vi.stubGlobal("window", { ...window, matchMedia: undefined });
    expect(resolveTheme("system")).toBe("light");
  });
});

describe("themeToHex", () => {
  it("maps 'light' to white (0xffffff)", () => {
    expect(themeToHex("light")).toBe(0xffffff);
  });

  it("maps 'dark' to slate-900-ish (0x0f172a)", () => {
    expect(themeToHex("dark")).toBe(0x0f172a);
  });
});

describe("useThemeStore", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("setTheme persists the chosen theme and updates resolvedTheme", () => {
    useThemeStore.getState().setTheme("dark");

    expect(useThemeStore.getState().theme).toBe("dark");
    expect(useThemeStore.getState().resolvedTheme).toBe("dark");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });

  it("setTheme('light') resolves to light regardless of system preference", () => {
    vi.stubGlobal("window", {
      ...window,
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    });

    useThemeStore.getState().setTheme("light");

    expect(useThemeStore.getState().resolvedTheme).toBe("light");
  });

  it("setTheme('system') resolves via matchMedia", () => {
    vi.stubGlobal("window", {
      ...window,
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    });

    useThemeStore.getState().setTheme("system");

    expect(useThemeStore.getState().theme).toBe("system");
    expect(useThemeStore.getState().resolvedTheme).toBe("dark");
  });

  it("setTheme tolerates a localStorage that throws", () => {
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    expect(() => useThemeStore.getState().setTheme("dark")).not.toThrow();
    expect(useThemeStore.getState().theme).toBe("dark");
    setItem.mockRestore();
  });

  it("_syncSystemTheme updates resolvedTheme only when theme is 'system'", () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true });
    vi.stubGlobal("window", { ...window, matchMedia });

    useThemeStore.setState({ theme: "system", resolvedTheme: "light" });
    useThemeStore.getState()._syncSystemTheme();
    expect(useThemeStore.getState().resolvedTheme).toBe("dark");

    useThemeStore.setState({ theme: "light", resolvedTheme: "light" });
    matchMedia.mockReturnValue({ matches: true });
    useThemeStore.getState()._syncSystemTheme();
    expect(useThemeStore.getState().resolvedTheme).toBe("light");
  });
});

describe("useThemeStore initial load", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hydrates theme from localStorage when a valid value is stored", async () => {
    localStorage.setItem(STORAGE_KEY, "dark");
    const mod = await import("@/stores/useThemeStore");
    expect(mod.useThemeStore.getState().theme).toBe("dark");
    expect(mod.useThemeStore.getState().resolvedTheme).toBe("dark");
  });

  it("falls back to 'system' when stored value is invalid", async () => {
    localStorage.setItem(STORAGE_KEY, "neon");
    const mod = await import("@/stores/useThemeStore");
    expect(mod.useThemeStore.getState().theme).toBe("system");
  });

  it("falls back to 'system' when localStorage.getItem throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const mod = await import("@/stores/useThemeStore");
    expect(mod.useThemeStore.getState().theme).toBe("system");
  });
});

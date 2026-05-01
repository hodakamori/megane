import { describe, it, expect, beforeEach, vi } from "vitest";
import { shouldAutoStart, useTourStore, type TourHost } from "@/tour/tourStore";

const STORAGE_KEY = "megane-tour-prefs";

function setLocation(search: string): void {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, search },
  });
}

describe("useTourStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useTourStore.setState({
      host: "webapp",
      isActive: false,
      dontShowAgain: false,
      autoStartHandled: false,
    });
    setLocation("");
  });

  it("has expected initial state", () => {
    const state = useTourStore.getState();
    expect(state.host).toBe("webapp");
    expect(state.isActive).toBe(false);
    expect(state.dontShowAgain).toBe(false);
    expect(state.autoStartHandled).toBe(false);
  });

  it("setHost updates host", () => {
    useTourStore.getState().setHost("vscode");
    expect(useTourStore.getState().host).toBe("vscode");
  });

  it("setActive toggles isActive", () => {
    useTourStore.getState().setActive(true);
    expect(useTourStore.getState().isActive).toBe(true);
    useTourStore.getState().setActive(false);
    expect(useTourStore.getState().isActive).toBe(false);
  });

  it("markAutoStartHandled flips autoStartHandled to true", () => {
    useTourStore.getState().markAutoStartHandled();
    expect(useTourStore.getState().autoStartHandled).toBe(true);
  });

  it("setDontShowAgain updates state and persists to localStorage", () => {
    useTourStore.getState().setDontShowAgain(true);
    expect(useTourStore.getState().dontShowAgain).toBe(true);

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed.dontShowAgain).toBe(true);
  });

  it("setDontShowAgain(false) is also persisted", () => {
    useTourStore.getState().setDontShowAgain(true);
    useTourStore.getState().setDontShowAgain(false);
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
    expect(parsed.dontShowAgain).toBe(false);
  });

  it("loads persisted dontShowAgain on a fresh module import", async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dontShowAgain: true }));
    // The store reads localStorage at module init, so reset modules and re-import.
    vi.resetModules();
    const fresh = await import("@/tour/tourStore");
    expect(fresh.useTourStore.getState().dontShowAgain).toBe(true);
  });

  it("tolerates malformed persisted JSON", async () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    vi.resetModules();
    const fresh = await import("@/tour/tourStore");
    expect(fresh.useTourStore.getState().dontShowAgain).toBe(false);
  });
});

describe("shouldAutoStart", () => {
  beforeEach(() => {
    setLocation("");
  });

  const cases: Array<{ host: TourHost; dontShow: boolean; expected: boolean }> = [
    { host: "webapp", dontShow: false, expected: true },
    { host: "webapp", dontShow: true, expected: false },
    { host: "vscode", dontShow: false, expected: true },
    { host: "vscode", dontShow: true, expected: false },
    { host: "jupyterlab", dontShow: false, expected: true },
    { host: "jupyterlab", dontShow: true, expected: false },
    { host: "ipywidget", dontShow: false, expected: false },
    { host: "ipywidget", dontShow: true, expected: false },
  ];

  it.each(cases)(
    "host=$host dontShowAgain=$dontShow → $expected",
    ({ host, dontShow, expected }) => {
      expect(shouldAutoStart(host, dontShow)).toBe(expected);
    },
  );

  it("URL override ?guide=on forces auto-start on webapp even when dontShowAgain=true", () => {
    setLocation("?guide=on");
    expect(shouldAutoStart("webapp", true)).toBe(true);
  });

  it("URL override ?guide=off suppresses auto-start on webapp even when dontShowAgain=false", () => {
    setLocation("?guide=off");
    expect(shouldAutoStart("webapp", false)).toBe(false);
  });

  it("URL override accepts numeric and boolean string variants", () => {
    setLocation("?guide=1");
    expect(shouldAutoStart("webapp", true)).toBe(true);
    setLocation("?guide=true");
    expect(shouldAutoStart("webapp", true)).toBe(true);
    setLocation("?guide=0");
    expect(shouldAutoStart("webapp", false)).toBe(false);
    setLocation("?guide=false");
    expect(shouldAutoStart("webapp", false)).toBe(false);
  });

  it("URL override is ignored on non-webapp hosts", () => {
    setLocation("?guide=on");
    expect(shouldAutoStart("ipywidget", false)).toBe(false);
  });
});

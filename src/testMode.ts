/**
 * Canonical E2E test-mode detection for host-agnostic UI.
 *
 * Mirrors the renderer's `isMeganeTestMode()`
 * (`src/renderer/MoleculeRenderer.ts`) but without importing Three.js, so
 * lightweight modules like the tour hook can suppress non-deterministic UI
 * under Playwright. Recognises three signals:
 *   - the `?test=1` query param (webapp specs navigate to `/?test=1`),
 *   - an explicitly injected `__MEGANE_TEST__` global (the VSCode / JupyterLab
 *     host emulators set this via `addInitScript`), and
 *   - inheritance from a same-origin parent window (iframed widget hosts, where
 *     the megane bundle runs one frame below the page the runner controls).
 *
 * Any cross-origin / missing-global access throws and is treated as non-test.
 */
export function isE2ETestMode(): boolean {
  try {
    const g = globalThis as { __MEGANE_TEST__?: boolean };
    if (g.__MEGANE_TEST__ === true) return true;
    if (typeof window !== "undefined") {
      if (window.location?.search) {
        const params = new URLSearchParams(window.location.search);
        if (params.get("test") === "1") return true;
      }
      if (window.parent && window.parent !== window) {
        const parentFlag = (window.parent as Window & { __MEGANE_TEST__?: boolean })
          .__MEGANE_TEST__;
        if (parentFlag === true) return true;
      }
    }
  } catch {
    /* cross-origin frame or missing globals — treat as non-test */
  }
  return false;
}

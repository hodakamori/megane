import type { JupyterFrontEnd } from "@jupyterlab/application";

/**
 * Expose the JupyterFrontEnd app on `globalThis.jupyterapp` when
 * `__MEGANE_TEST__` is set. JupyterLab does not publish its app instance
 * globally, so without this hook the E2E suite cannot drive commands like
 * `docmanager:open` to script multi-tab flows. Production sessions
 * (without the flag) are unaffected.
 */
export function exposeAppForTests(app: JupyterFrontEnd): void {
  if ((globalThis as { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__) {
    (globalThis as { jupyterapp?: JupyterFrontEnd }).jupyterapp = app;
  }
}

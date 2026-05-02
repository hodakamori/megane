// Test-only stub for `@jupyterlab/application`. See sibling jupyterlab-coreutils.ts.
// Provides minimal class / token shapes so `jupyterlab-megane/src/index.ts`
// resolves at transform time. vi.mock() supplies behaviour where needed.

export class JupyterFrontEnd {
  docRegistry?: unknown;
  serviceManager?: unknown;
  commands?: unknown;
}

export class ILayoutRestorer {
  restore() {
    return Promise.resolve();
  }
}

export type JupyterFrontEndPlugin<T = unknown> = {
  id: string;
  description?: string;
  autoStart?: boolean;
  requires?: unknown[];
  activate: (...args: unknown[]) => T;
};

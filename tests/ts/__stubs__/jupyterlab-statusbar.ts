// Test-only stub for `@jupyterlab/statusbar`.
// Provides the IStatusBar token shape so index.ts resolves at transform time.
// vi.mock() supplies behavior where needed.

export class IStatusBar {
  registerStatusItem(_id: string, _options: object): void {
    void _id;
    void _options;
  }
}

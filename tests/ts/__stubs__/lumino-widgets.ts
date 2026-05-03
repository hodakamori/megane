// Test-only stub for `@lumino/widgets`.
// Provides minimal Widget shape so jupyterlab-megane/src/frameStatusBar.ts
// resolves at transform time. Tests can use vi.mock() to override behavior.

export class Widget {
  node: HTMLElement;
  constructor() {
    this.node = document.createElement("div");
  }
  addClass(_className: string): void {
    void _className;
  }
  dispose(): void {}
}

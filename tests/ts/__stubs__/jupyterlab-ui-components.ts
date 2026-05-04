// Test-only stub for `@jupyterlab/ui-components`.
// Provides minimal ReactWidget shape so jupyterlab-megane/src/MeganeDocWidget.tsx
// resolves at transform time. Tests can use vi.mock() to override behaviour.

export class ReactWidget {
  addClass(_className: string): void {}
  protected render(): null {
    return null;
  }
}

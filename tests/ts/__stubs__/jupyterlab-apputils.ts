// Test-only stub for `@jupyterlab/apputils`. See sibling jupyterlab-coreutils.ts.

export class WidgetTracker<T = unknown> {
  add(_widget: T): Promise<void> {
    void _widget;
    return Promise.resolve();
  }
  save(_widget: T): Promise<void> {
    void _widget;
    return Promise.resolve();
  }
}

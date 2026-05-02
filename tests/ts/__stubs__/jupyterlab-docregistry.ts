// Test-only stub for `@jupyterlab/docregistry`. See sibling jupyterlab-coreutils.ts.
// Provides minimal class shapes so `jupyterlab-megane/src/factory.ts` and
// `filetypes.ts` resolve at transform time. vi.mock() supplies behavior in tests.

export class ABCWidgetFactory<T = unknown, U = unknown> {
  constructor(_options: unknown) {
    void _options;
  }
}

export class DocumentWidget<T = unknown, U = unknown> {
  content: unknown;
  context: unknown;
  title = { iconClass: "" };
  constructor(opts: { content: unknown; context: unknown }) {
    this.content = opts.content;
    this.context = opts.context;
  }
}

export namespace DocumentRegistry {
  export type Context = unknown;
  export type IModel = unknown;
  export type IFileType = {
    name: string;
    displayName?: string;
    extensions?: string[];
    mimeTypes?: string[];
    fileFormat?: string;
    contentType?: string;
  };
  export type IWidgetFactoryOptions<T = unknown> = unknown;
}

export type IDocumentWidget<T = unknown, U = unknown> = unknown;

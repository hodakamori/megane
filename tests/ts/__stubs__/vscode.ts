// Test-only stub for the `vscode` module, which is injected by the VS Code
// extension host at runtime and is NOT installed at the repo root. Vite's
// import-analysis pass needs every bare specifier to resolve, even when
// vi.mock() will replace the module at runtime. This stub provides just enough
// of the surface that `vscode-megane/src/extension.ts` references.
// See `vitest.config.ts` resolve.alias for the wiring.

export class Uri {
  scheme: string;
  authority: string;
  path: string;
  query: string;
  fragment: string;

  constructor(scheme = "", authority = "", path = "", query = "", fragment = "") {
    this.scheme = scheme;
    this.authority = authority;
    this.path = path;
    this.query = query;
    this.fragment = fragment;
  }

  get fsPath(): string {
    return this.path;
  }

  static file(path: string): Uri {
    return new Uri("file", "", path);
  }

  static joinPath(base: Uri, ...segments: string[]): Uri {
    const joined = [base.path, ...segments].filter(Boolean).join("/").replace(/\/+/g, "/");
    return new Uri(base.scheme, base.authority, joined);
  }

  toString(): string {
    return `${this.scheme}://${this.authority}${this.path}`;
  }
}

export const workspace = {
  fs: {
    readFile: (_uri: Uri): Promise<Uint8Array> => Promise.resolve(new Uint8Array()),
  },
};

export const window = {
  registerCustomEditorProvider: (
    _viewType: string,
    _provider: unknown,
    _options?: unknown,
  ): { dispose: () => void } => ({ dispose: () => {} }),
};

export interface Disposable {
  dispose(): void;
}

export interface CustomDocument {
  readonly uri: Uri;
  dispose(): void;
}

export type CustomDocumentOpenContext = unknown;
export type CancellationToken = unknown;
export type ExtensionContext = unknown;
export type WebviewPanel = unknown;
export type Webview = unknown;

export interface CustomReadonlyEditorProvider<T extends CustomDocument = CustomDocument> {
  openCustomDocument(
    uri: Uri,
    openContext: CustomDocumentOpenContext,
    token: CancellationToken,
  ): T | Thenable<T>;
  resolveCustomEditor(
    document: T,
    webviewPanel: WebviewPanel,
    token: CancellationToken,
  ): void | Thenable<void>;
}

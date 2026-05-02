import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

interface FakeProvider {
  openCustomDocument: (
    uri: FakeUri,
    openContext: unknown,
    token: unknown,
  ) => { uri: FakeUri; dispose: () => void };
  resolveCustomEditor: (
    document: { uri: FakeUri; dispose: () => void },
    webviewPanel: FakeWebviewPanel,
    token: unknown,
  ) => Promise<void>;
}

interface RegisteredProvider {
  viewType: string;
  provider: FakeProvider;
  options: {
    webviewOptions?: { retainContextWhenHidden?: boolean };
    supportsMultipleEditorsPerDocument?: boolean;
  };
}

interface FakeUri {
  scheme: string;
  authority: string;
  path: string;
  fsPath: string;
  toString(): string;
}

interface FakeWebview {
  options: unknown;
  html: string;
  cspSource: string;
  onDidReceiveMessage: ReturnType<typeof vi.fn>;
  postMessage: ReturnType<typeof vi.fn>;
  asWebviewUri: (uri: FakeUri) => string;
}

interface FakeWebviewPanel {
  webview: FakeWebview;
}

const { mockState } = vi.hoisted(() => ({
  mockState: {
    registered: [] as RegisteredProvider[],
    readFile: vi.fn<(uri: FakeUri) => Promise<Uint8Array>>(),
  },
}));

vi.mock("vscode", () => {
  class Uri {
    scheme: string;
    authority: string;
    path: string;
    constructor(scheme = "", authority = "", path = "") {
      this.scheme = scheme;
      this.authority = authority;
      this.path = path;
    }
    get fsPath(): string {
      return this.path;
    }
    static file(p: string): Uri {
      return new Uri("file", "", p);
    }
    static joinPath(base: Uri, ...segs: string[]): Uri {
      const trimmed = base.path.replace(/\/+$/, "");
      const joined = [trimmed, ...segs].filter((s) => s.length > 0).join("/");
      return new Uri(base.scheme, base.authority, joined);
    }
    toString(): string {
      return `${this.scheme}://${this.authority}${this.path}`;
    }
  }
  return {
    Uri,
    workspace: { fs: { readFile: mockState.readFile } },
    window: {
      registerCustomEditorProvider: vi.fn(
        (viewType: string, provider: FakeProvider, options: RegisteredProvider["options"]) => {
          mockState.registered.push({ viewType, provider, options });
          return { dispose: vi.fn() };
        },
      ),
    },
  };
});

import * as vscode from "vscode";
import { activate, deactivate } from "../../../vscode-megane/src/extension";

const VscodeUri = (vscode as unknown as { Uri: { file: (p: string) => FakeUri } }).Uri;

function makeContext(extensionPath = "/ext"): {
  extensionUri: FakeUri;
  subscriptions: Array<{ dispose: () => void }>;
} {
  return {
    extensionUri: VscodeUri.file(extensionPath),
    subscriptions: [],
  };
}

function makeWebviewPanel(): {
  panel: FakeWebviewPanel;
  fireMessage: (msg: unknown) => void;
} {
  let onMessage: ((m: unknown) => void) | undefined;
  const webview: FakeWebview = {
    options: undefined,
    html: "",
    cspSource: "vscode-webview://test",
    onDidReceiveMessage: vi.fn((handler: (m: unknown) => void) => {
      onMessage = handler;
      return { dispose: vi.fn() };
    }),
    postMessage: vi.fn(),
    asWebviewUri: (uri: FakeUri) => `webview:${uri.toString()}`,
  };
  return {
    panel: { webview },
    fireMessage: (msg) => {
      if (!onMessage) throw new Error("onDidReceiveMessage not registered");
      onMessage(msg);
    },
  };
}

function getProvider(viewType: string): FakeProvider {
  const entry = mockState.registered.find((r) => r.viewType === viewType);
  if (!entry) throw new Error(`provider not registered: ${viewType}`);
  return entry.provider;
}

beforeEach(() => {
  mockState.registered.length = 0;
  mockState.readFile.mockReset();
  vi.mocked(vscode.window.registerCustomEditorProvider).mockClear();
  delete process.env.MEGANE_E2E_MODE;
});

afterEach(() => {
  delete process.env.MEGANE_E2E_MODE;
});

describe("activate / deactivate", () => {
  it("registers two custom editor providers", () => {
    const ctx = makeContext();
    activate(ctx as unknown as Parameters<typeof activate>[0]);

    expect(mockState.registered.map((r) => r.viewType)).toEqual([
      "megane.structureViewer",
      "megane.pipelineViewer",
    ]);
  });

  it("pushes both registration disposables onto context.subscriptions", () => {
    const ctx = makeContext();
    activate(ctx as unknown as Parameters<typeof activate>[0]);

    expect(ctx.subscriptions).toHaveLength(2);
    for (const sub of ctx.subscriptions) {
      expect(typeof sub.dispose).toBe("function");
    }
  });

  it("configures retainContextWhenHidden and disables multi-editor for both providers", () => {
    activate(makeContext() as unknown as Parameters<typeof activate>[0]);

    for (const reg of mockState.registered) {
      expect(reg.options.webviewOptions?.retainContextWhenHidden).toBe(true);
      expect(reg.options.supportsMultipleEditorsPerDocument).toBe(false);
    }
  });

  it("deactivate is a no-op", () => {
    expect(() => deactivate()).not.toThrow();
    expect(deactivate()).toBeUndefined();
  });
});

describe("MeganeEditorProvider — structureViewer", () => {
  beforeEach(() => {
    activate(makeContext("/ext") as unknown as Parameters<typeof activate>[0]);
  });

  it("openCustomDocument returns a CustomDocument bound to the supplied uri", () => {
    const provider = getProvider("megane.structureViewer");
    const uri = VscodeUri.file("/work/sample.pdb");
    const doc = provider.openCustomDocument(uri, {}, {});
    expect(doc.uri).toBe(uri);
    expect(typeof doc.dispose).toBe("function");
    expect(() => doc.dispose()).not.toThrow();
  });

  it("sets webview.options with enableScripts and the media folder as the only resource root", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    const options = panel.webview.options as {
      enableScripts: boolean;
      localResourceRoots: FakeUri[];
    };
    expect(options.enableScripts).toBe(true);
    expect(options.localResourceRoots).toHaveLength(1);
    expect(options.localResourceRoots[0].path).toBe("/ext/media");
  });

  it("posts loadFile payload (file bytes + wasm bytes + filename) when the webview signals ready", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile
      .mockResolvedValueOnce(new Uint8Array([72, 73, 74])) // doc bytes
      .mockResolvedValueOnce(new Uint8Array([1, 2, 3])); // wasm bytes

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    expect(panel.webview.postMessage).not.toHaveBeenCalled();
    fireMessage({ type: "ready" });

    expect(panel.webview.postMessage).toHaveBeenCalledWith({
      type: "loadFile",
      contentBytes: [72, 73, 74],
      filename: "sample.pdb",
      wasmBytes: [1, 2, 3],
    });
  });

  it("ignores webview messages whose type is not 'ready'", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array([0]));

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "selectionChanged" });
    fireMessage({});
    expect(panel.webview.postMessage).not.toHaveBeenCalled();
  });

  it("posts an error payload when reading the document fails", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockRejectedValueOnce(new Error("ENOENT: missing"));
    mockState.readFile.mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    expect(panel.webview.postMessage).toHaveBeenCalledWith({
      type: "error",
      message: "ENOENT: missing",
    });
  });

  it("coerces non-Error throws into a string message", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockRejectedValueOnce("filesystem unavailable");
    mockState.readFile.mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    expect(panel.webview.postMessage).toHaveBeenCalledWith({
      type: "error",
      message: "filesystem unavailable",
    });
  });

  it("renders webview.html with CSP, vscode context flag, and a 32-char nonce", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    const html = panel.webview.html;
    expect(html).toContain("Content-Security-Policy");
    expect(html).toContain('window.__MEGANE_CONTEXT__ = "vscode"');
    expect(html).toContain("__MEGANE_WASM_URL__");
    expect(html).not.toContain("__MEGANE_TEST__");

    const nonceMatch = html.match(/nonce-([A-Za-z0-9]+)/);
    expect(nonceMatch).not.toBeNull();
    expect(nonceMatch![1]).toHaveLength(32);
  });

  it("emits __MEGANE_TEST__ when MEGANE_E2E_MODE=1 is set on the extension host", async () => {
    process.env.MEGANE_E2E_MODE = "1";
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    expect(panel.webview.html).toContain("window.__MEGANE_TEST__ = true;");
  });

  it("each call to getNonce produces a fresh random nonce", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array());

    const seen = new Set<string>();
    for (let i = 0; i < 4; i++) {
      const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
      const { panel } = makeWebviewPanel();
      await provider.resolveCustomEditor(doc, panel, {});
      const nonce = panel.webview.html.match(/nonce-([A-Za-z0-9]+)/)?.[1];
      expect(nonce).toBeDefined();
      seen.add(nonce!);
    }
    // Random — collisions across 4 picks of 32-char strings should be effectively impossible.
    expect(seen.size).toBe(4);
  });
});

describe("MeganePipelineEditorProvider — pipelineViewer", () => {
  beforeEach(() => {
    activate(makeContext("/ext") as unknown as Parameters<typeof activate>[0]);
  });

  function pipelineBytes(payload: unknown): Uint8Array {
    return new TextEncoder().encode(JSON.stringify(payload));
  }

  it("openCustomDocument returns a CustomDocument bound to the supplied uri", () => {
    const provider = getProvider("megane.pipelineViewer");
    const uri = VscodeUri.file("/work/pipe.megane.json");
    const doc = provider.openCustomDocument(uri, {}, {});
    expect(doc.uri).toBe(uri);
    expect(() => doc.dispose()).not.toThrow();
  });

  it("posts loadPipeline with structure + trajectory companions resolved relative to the pipeline file", async () => {
    const provider = getProvider("megane.pipelineViewer");
    const pipeline = {
      version: 3,
      nodes: [
        { id: "n1", type: "load_structure", fileName: "struct.pdb" },
        { id: "n2", type: "load_trajectory", fileName: "traj.xtc" },
      ],
      edges: [],
    };
    mockState.readFile
      .mockResolvedValueOnce(pipelineBytes(pipeline))
      .mockResolvedValueOnce(new Uint8Array([1, 2, 3]))
      .mockResolvedValueOnce(new TextEncoder().encode("ATOM 1"))
      .mockResolvedValueOnce(new Uint8Array([9, 8, 7]));

    const doc = { uri: VscodeUri.file("/work/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    expect(panel.webview.postMessage).toHaveBeenCalledTimes(1);
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      type: string;
      pipeline: unknown;
      structureFiles: Array<{ nodeId: string; content: string; filename: string }>;
      trajectoryFiles: Array<{ nodeId: string; content: ArrayBuffer; filename: string }>;
      wasmBytes: number[];
    };

    expect(payload.type).toBe("loadPipeline");
    expect(payload.pipeline).toEqual(pipeline);
    expect(payload.structureFiles).toEqual([
      { nodeId: "n1", content: "ATOM 1", filename: "struct.pdb" },
    ]);
    expect(payload.trajectoryFiles).toHaveLength(1);
    expect(payload.trajectoryFiles[0].nodeId).toBe("n2");
    expect(payload.trajectoryFiles[0].filename).toBe("traj.xtc");
    expect(new Uint8Array(payload.trajectoryFiles[0].content as ArrayBuffer)).toEqual(
      new Uint8Array([9, 8, 7]),
    );
    expect(payload.wasmBytes).toEqual([1, 2, 3]);
  });

  it("rejects pipelines whose version is not 3", async () => {
    const provider = getProvider("megane.pipelineViewer");
    mockState.readFile
      .mockResolvedValueOnce(pipelineBytes({ version: 2, nodes: [], edges: [] }))
      .mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      type: string;
      message: string;
    };
    expect(payload.type).toBe("error");
    expect(payload.message).toContain("version 3 required");
    expect(payload.message).toContain("got 2");
  });

  it("posts an error payload when the pipeline JSON is malformed", async () => {
    const provider = getProvider("megane.pipelineViewer");
    mockState.readFile
      .mockResolvedValueOnce(new TextEncoder().encode("{ not json"))
      .mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      type: string;
      message: string;
    };
    expect(payload.type).toBe("error");
    expect(payload.message.length).toBeGreaterThan(0);
  });

  it("skips nodes referencing absolute fileName paths (path traversal protection)", async () => {
    const provider = getProvider("megane.pipelineViewer");
    const pipeline = {
      version: 3,
      nodes: [{ id: "n1", type: "load_structure", fileName: "/etc/passwd" }],
      edges: [],
    };
    mockState.readFile
      .mockResolvedValueOnce(pipelineBytes(pipeline))
      .mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      structureFiles: unknown[];
      trajectoryFiles: unknown[];
    };
    expect(payload.structureFiles).toEqual([]);
    expect(payload.trajectoryFiles).toEqual([]);
    // Only pipeline + wasm read; no companion read attempted.
    expect(mockState.readFile).toHaveBeenCalledTimes(2);
  });

  it("skips nodes whose fileName escapes the pipeline directory", async () => {
    const provider = getProvider("megane.pipelineViewer");
    const pipeline = {
      version: 3,
      nodes: [{ id: "n1", type: "load_structure", fileName: "../../escape.pdb" }],
      edges: [],
    };
    mockState.readFile
      .mockResolvedValueOnce(pipelineBytes(pipeline))
      .mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/sub/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      structureFiles: unknown[];
    };
    expect(payload.structureFiles).toEqual([]);
    expect(mockState.readFile).toHaveBeenCalledTimes(2);
  });

  it("silently skips nodes whose companion file cannot be read", async () => {
    const provider = getProvider("megane.pipelineViewer");
    const pipeline = {
      version: 3,
      nodes: [
        { id: "n1", type: "load_structure", fileName: "missing.pdb" },
        { id: "n2", type: "load_trajectory", fileName: "ok.xtc" },
      ],
      edges: [],
    };
    mockState.readFile
      .mockResolvedValueOnce(pipelineBytes(pipeline))
      .mockResolvedValueOnce(new Uint8Array([1]))
      .mockRejectedValueOnce(new Error("ENOENT")) // missing.pdb
      .mockResolvedValueOnce(new Uint8Array([4, 5])); // ok.xtc

    const doc = { uri: VscodeUri.file("/work/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      type: string;
      structureFiles: Array<{ nodeId: string }>;
      trajectoryFiles: Array<{ nodeId: string }>;
    };
    expect(payload.type).toBe("loadPipeline");
    expect(payload.structureFiles).toEqual([]);
    expect(payload.trajectoryFiles).toHaveLength(1);
    expect(payload.trajectoryFiles[0].nodeId).toBe("n2");
  });

  it("skips nodes that have no fileName at all", async () => {
    const provider = getProvider("megane.pipelineViewer");
    const pipeline = {
      version: 3,
      nodes: [
        { id: "n1", type: "filter" },
        { id: "n2", type: "load_structure", fileName: null },
      ],
      edges: [],
    };
    mockState.readFile
      .mockResolvedValueOnce(pipelineBytes(pipeline))
      .mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    expect(mockState.readFile).toHaveBeenCalledTimes(2);
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      structureFiles: unknown[];
    };
    expect(payload.structureFiles).toEqual([]);
  });

  it("ignores companion reads for node types other than load_structure / load_trajectory", async () => {
    const provider = getProvider("megane.pipelineViewer");
    const pipeline = {
      version: 3,
      nodes: [{ id: "n1", type: "filter", fileName: "filter.txt" }],
      edges: [],
    };
    mockState.readFile
      .mockResolvedValueOnce(pipelineBytes(pipeline))
      .mockResolvedValueOnce(new Uint8Array());

    const doc = { uri: VscodeUri.file("/work/pipe.megane.json"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "ready" });
    expect(mockState.readFile).toHaveBeenCalledTimes(2);
    const payload = panel.webview.postMessage.mock.calls[0][0] as {
      structureFiles: unknown[];
      trajectoryFiles: unknown[];
    };
    expect(payload.structureFiles).toEqual([]);
    expect(payload.trajectoryFiles).toEqual([]);
  });
});

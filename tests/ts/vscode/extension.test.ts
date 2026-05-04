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

interface FakeStatusBarItem {
  tooltip: string;
  text: string;
  show: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
}

interface FakeWebviewPanel {
  webview: FakeWebview;
  onDidDispose: ReturnType<typeof vi.fn>;
  onDidChangeViewState: ReturnType<typeof vi.fn>;
  active: boolean;
}

interface RegisteredCommand {
  command: string;
  handler: (...args: unknown[]) => unknown;
}

const { mockState } = vi.hoisted(() => ({
  mockState: {
    registered: [] as RegisteredProvider[],
    registeredCommands: [] as RegisteredCommand[],
    readFile: vi.fn<(uri: FakeUri) => Promise<Uint8Array>>(),
    statusBarItems: [] as FakeStatusBarItem[],
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
      createStatusBarItem: vi.fn((_alignment: unknown, _priority: unknown) => {
        const item: FakeStatusBarItem = {
          tooltip: "",
          text: "",
          show: vi.fn(),
          dispose: vi.fn(),
        };
        mockState.statusBarItems.push(item);
        return item;
      }),
    },
    StatusBarAlignment: { Left: 1, Right: 2 },
    commands: {
      registerCommand: vi.fn((command: string, handler: (...args: unknown[]) => unknown) => {
        mockState.registeredCommands.push({ command, handler });
        return { dispose: vi.fn() };
      }),
    },
  };
});

import * as vscode from "vscode";
import {
  activate,
  deactivate,
  createFrameStatusBarItem,
  MeganeEditorProvider,
} from "../../../vscode-megane/src/extension";

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
  fireDispose: () => void;
  fireViewStateChange: (active: boolean) => void;
} {
  let onMessage: ((m: unknown) => void) | undefined;
  let onDispose: (() => void) | undefined;
  let onViewStateChange: ((e: { webviewPanel: FakeWebviewPanel }) => void) | undefined;
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
  const panel: FakeWebviewPanel = {
    webview,
    active: true,
    onDidDispose: vi.fn((handler: () => void) => {
      onDispose = handler;
      return { dispose: vi.fn() };
    }),
    onDidChangeViewState: vi.fn(
      (handler: (e: { webviewPanel: FakeWebviewPanel }) => void) => {
        onViewStateChange = handler;
        return { dispose: vi.fn() };
      },
    ),
  };
  return {
    panel,
    fireMessage: (msg) => {
      if (!onMessage) throw new Error("onDidReceiveMessage not registered");
      onMessage(msg);
    },
    fireDispose: () => {
      if (!onDispose) throw new Error("onDidDispose not registered");
      onDispose();
    },
    fireViewStateChange: (active: boolean) => {
      if (!onViewStateChange) throw new Error("onDidChangeViewState not registered");
      panel.active = active;
      onViewStateChange({ webviewPanel: panel });
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
  mockState.registeredCommands.length = 0;
  mockState.statusBarItems.length = 0;
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

  it("pushes two provider disposables and the seekFrame command onto context.subscriptions", () => {
    const ctx = makeContext();
    activate(ctx as unknown as Parameters<typeof activate>[0]);

    expect(ctx.subscriptions).toHaveLength(3);
    for (const sub of ctx.subscriptions) {
      expect(typeof sub.dispose).toBe("function");
    }
  });

  it("registers the megane.seekFrame command", () => {
    activate(makeContext() as unknown as Parameters<typeof activate>[0]);
    const commandNames = mockState.registeredCommands.map((c) => c.command);
    expect(commandNames).toContain("megane.seekFrame");
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

describe("createFrameStatusBarItem", () => {
  it("returns a status bar item with a trajectory tooltip", () => {
    const item = createFrameStatusBarItem();
    expect(item).toBeDefined();
    expect(mockState.statusBarItems).toHaveLength(1);
    expect(mockState.statusBarItems[0].tooltip).toBe("Current trajectory frame");
  });
});

describe("MeganeEditorProvider — frameChange message handling", () => {
  beforeEach(() => {
    activate(makeContext("/ext") as unknown as Parameters<typeof activate>[0]);
  });

  it("creates a status bar item when resolveCustomEditor is called", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    expect(mockState.statusBarItems).toHaveLength(1);
  });

  it("updates the status bar text when a frameChange message arrives", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "frameChange", frame: 5 });

    const item = mockState.statusBarItems[0];
    expect(item.text).toContain("5");
    expect(item.show).toHaveBeenCalledTimes(1);
  });

  it("shows successive frame indices as the frame progresses", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "frameChange", frame: 0 });
    fireMessage({ type: "frameChange", frame: 42 });

    const item = mockState.statusBarItems[0];
    expect(item.text).toContain("42");
    expect(item.show).toHaveBeenCalledTimes(2);
  });

  it("disposes the status bar item when the panel is disposed", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireDispose } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    const item = mockState.statusBarItems[0];
    expect(item.dispose).not.toHaveBeenCalled();

    fireDispose();
    expect(item.dispose).toHaveBeenCalledTimes(1);
  });

  it("does not call postMessage for frameChange messages", async () => {
    const provider = getProvider("megane.structureViewer");
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));

    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireMessage } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireMessage({ type: "frameChange", frame: 10 });
    expect(panel.webview.postMessage).not.toHaveBeenCalled();
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

describe("MeganeEditorProvider.seekFrame", () => {
  it("returns false and does not post when no panel has been opened", () => {
    const ctx = makeContext();
    const provider = new MeganeEditorProvider(
      ctx as unknown as Parameters<typeof MeganeEditorProvider>[0],
    );
    expect(provider.seekFrame(5)).toBe(false);
  });

  it("returns true and posts seekFrame message to the active panel", async () => {
    const ctx = makeContext();
    const provider = new MeganeEditorProvider(
      ctx as unknown as Parameters<typeof MeganeEditorProvider>[0],
    );
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));
    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    // Clear postMessage calls from the initial load
    panel.webview.postMessage.mockClear();

    const result = provider.seekFrame(42);
    expect(result).toBe(true);
    expect(panel.webview.postMessage).toHaveBeenCalledWith({ type: "seekFrame", frame: 42 });
  });

  it("returns false after the panel is disposed", async () => {
    const ctx = makeContext();
    const provider = new MeganeEditorProvider(
      ctx as unknown as Parameters<typeof MeganeEditorProvider>[0],
    );
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));
    const doc = { uri: VscodeUri.file("/work/sample.pdb"), dispose: vi.fn() };
    const { panel, fireDispose } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc, panel, {});

    fireDispose();
    expect(provider.seekFrame(10)).toBe(false);
  });

  it("updates the active panel when a different panel becomes active via onDidChangeViewState", async () => {
    const ctx = makeContext();
    const provider = new MeganeEditorProvider(
      ctx as unknown as Parameters<typeof MeganeEditorProvider>[0],
    );
    mockState.readFile.mockResolvedValue(new Uint8Array([1]));

    const doc1 = { uri: VscodeUri.file("/work/a.pdb"), dispose: vi.fn() };
    const { panel: panel1, fireViewStateChange: fireVsc1 } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc1, panel1, {});

    const doc2 = { uri: VscodeUri.file("/work/b.pdb"), dispose: vi.fn() };
    const { panel: panel2, fireViewStateChange: fireVsc2 } = makeWebviewPanel();
    await provider.resolveCustomEditor(doc2, panel2, {});

    // panel2 was opened last and should be active
    panel1.webview.postMessage.mockClear();
    panel2.webview.postMessage.mockClear();

    // panel1 becomes focused
    fireVsc1(true);
    provider.seekFrame(7);
    expect(panel1.webview.postMessage).toHaveBeenCalledWith({ type: "seekFrame", frame: 7 });
    expect(panel2.webview.postMessage).not.toHaveBeenCalled();

    // panel2 becomes focused again
    panel1.webview.postMessage.mockClear();
    fireVsc2(true);
    provider.seekFrame(8);
    expect(panel2.webview.postMessage).toHaveBeenCalledWith({ type: "seekFrame", frame: 8 });
    expect(panel1.webview.postMessage).not.toHaveBeenCalled();
  });

  it("megane.seekFrame command is wired to the editor provider", () => {
    const ctx = makeContext();
    activate(ctx as unknown as Parameters<typeof activate>[0]);

    const cmd = mockState.registeredCommands.find((c) => c.command === "megane.seekFrame");
    expect(cmd).toBeDefined();
    // Command handler should not throw when no panel is open
    expect(() => cmd!.handler(0)).not.toThrow();
  });
});

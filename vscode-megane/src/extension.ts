import * as vscode from "vscode";
import * as path from "path";

interface SerializedPipelineNode {
  id: string;
  type: string;
  fileName?: string | null;
  [key: string]: unknown;
}

interface SerializedPipeline {
  version: number;
  nodes: SerializedPipelineNode[];
  edges: unknown[];
}

class MeganePipelineEditorProvider implements vscode.CustomReadonlyEditorProvider {
  private static readonly viewType = "megane.pipelineViewer";

  constructor(private readonly context: vscode.ExtensionContext) {}

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MeganePipelineEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      MeganePipelineEditorProvider.viewType,
      provider,
      {
        webviewOptions: { retainContextWhenHidden: true },
        supportsMultipleEditorsPerDocument: false,
      },
    );
  }

  openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken,
  ): vscode.CustomDocument {
    return { uri, dispose: () => {} };
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    const webview = webviewPanel.webview;
    const mediaDir = vscode.Uri.joinPath(this.context.extensionUri, "media");

    webview.options = {
      enableScripts: true,
      localResourceRoots: [mediaDir],
    };

    let payload: object;
    try {
      const [pipelineData, wasmData] = await Promise.all([
        vscode.workspace.fs.readFile(document.uri),
        vscode.workspace.fs.readFile(vscode.Uri.joinPath(mediaDir, "megane_wasm_bg.wasm")),
      ]);
      const pipeline = JSON.parse(
        new TextDecoder("utf-8").decode(pipelineData),
      ) as SerializedPipeline;

      if (pipeline.version !== 3) {
        throw new Error(
          `Not a valid megane pipeline file (version 3 required, got ${pipeline.version})`,
        );
      }

      const dir = path.dirname(document.uri.fsPath);

      // Read structure files referenced by load_structure nodes
      const structureFiles: Array<{ nodeId: string; content: string; filename: string }> = [];
      // Read trajectory files referenced by load_trajectory nodes (binary as ArrayBuffer)
      const trajectoryFiles: Array<{ nodeId: string; content: ArrayBuffer; filename: string }> = [];

      for (const node of pipeline.nodes) {
        if (!node.fileName) continue;
        const filePath = String(node.fileName);

        // Reject absolute paths and paths that escape the pipeline file's directory
        if (path.isAbsolute(filePath)) {
          continue;
        }
        const resolvedPath = path.resolve(dir, filePath);
        if (!(resolvedPath === dir || resolvedPath.startsWith(dir + path.sep))) {
          continue;
        }

        const fileUri = vscode.Uri.file(resolvedPath);
        const filename = path.basename(filePath);
        try {
          if (node.type === "load_structure") {
            const raw = await vscode.workspace.fs.readFile(fileUri);
            structureFiles.push({
              nodeId: node.id,
              content: new TextDecoder("utf-8").decode(raw),
              filename,
            });
          } else if (node.type === "load_trajectory") {
            const raw = await vscode.workspace.fs.readFile(fileUri);
            trajectoryFiles.push({ nodeId: node.id, content: raw.buffer as ArrayBuffer, filename });
          }
        } catch {
          // File not found — skip silently; webview will show a warning on the node
        }
      }

      payload = {
        type: "loadPipeline",
        pipeline,
        structureFiles,
        trajectoryFiles,
        wasmBytes: Array.from(wasmData),
      };
    } catch (err) {
      payload = { type: "error", message: err instanceof Error ? err.message : String(err) };
    }

    webview.onDidReceiveMessage((message) => {
      if (message.type === "ready") {
        webview.postMessage(payload);
      }
    });

    webview.html = getHtmlForWebview(webview, mediaDir);
  }
}

class MeganeEditorProvider implements vscode.CustomReadonlyEditorProvider {
  private static readonly viewType = "megane.structureViewer";

  constructor(private readonly context: vscode.ExtensionContext) {}

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MeganeEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(MeganeEditorProvider.viewType, provider, {
      webviewOptions: { retainContextWhenHidden: true },
      supportsMultipleEditorsPerDocument: false,
    });
  }

  openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken,
  ): vscode.CustomDocument {
    return { uri, dispose: () => {} };
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    const webview = webviewPanel.webview;
    const mediaDir = vscode.Uri.joinPath(this.context.extensionUri, "media");

    webview.options = {
      enableScripts: true,
      localResourceRoots: [mediaDir],
    };

    // Prepare the message to send, then register handler, then set HTML.
    // This avoids both: (a) race where "ready" fires before handler, and
    // (b) blank screen if file reading fails before HTML is set.
    let payload: object;
    try {
      const [fileData, wasmData] = await Promise.all([
        vscode.workspace.fs.readFile(document.uri),
        vscode.workspace.fs.readFile(vscode.Uri.joinPath(mediaDir, "megane_wasm_bg.wasm")),
      ]);
      payload = {
        type: "loadFile",
        content: new TextDecoder("utf-8").decode(fileData),
        filename: path.basename(document.uri.fsPath),
        wasmBytes: Array.from(wasmData),
      };
    } catch (err) {
      payload = { type: "error", message: err instanceof Error ? err.message : String(err) };
    }

    webview.onDidReceiveMessage((message) => {
      if (message.type === "ready") {
        webview.postMessage(payload);
      }
    });

    webview.html = getHtmlForWebview(webview, mediaDir);
  }
}

function getHtmlForWebview(webview: vscode.Webview, mediaDir: vscode.Uri): string {
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, "webview.js"));
  const wasmUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, "megane_wasm_bg.wasm"));
  const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, "main.css"));
  const nonce = getNonce();
  // E2E test-mode flag — gated on MEGANE_E2E_MODE in the extension host's
  // environment so production builds don't expose it. Setting
  // window.__MEGANE_TEST__ before the bundle loads switches the megane
  // renderer into deterministic mode (see src/renderer/MoleculeRenderer.ts).
  const e2eMode = process.env.MEGANE_E2E_MODE === "1";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             script-src 'nonce-${nonce}' 'wasm-unsafe-eval' blob:;
             style-src ${webview.cspSource} 'unsafe-inline';
             img-src ${webview.cspSource} data: blob:;
             font-src ${webview.cspSource};
             connect-src ${webview.cspSource} blob: data:;
             worker-src blob:;" />
  <link rel="stylesheet" href="${cssUri}" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root {
      width: 100%; height: 100%; overflow: hidden;
      font-family: Inter, system-ui, -apple-system, sans-serif;
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}">
    window.__MEGANE_WASM_URL__ = "${wasmUri}";
    window.__MEGANE_CONTEXT__ = "vscode";
    ${e2eMode ? "window.__MEGANE_TEST__ = true;" : ""}
  </script>
  <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce(): string {
  let text = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(MeganeEditorProvider.register(context));
  context.subscriptions.push(MeganePipelineEditorProvider.register(context));
}

export function deactivate() {}

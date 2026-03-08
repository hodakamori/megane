import * as vscode from "vscode";
import * as path from "path";

class MeganeEditorProvider implements vscode.CustomReadonlyEditorProvider {
  private static readonly viewType = "megane.structureViewer";

  constructor(private readonly context: vscode.ExtensionContext) {}

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MeganeEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      MeganeEditorProvider.viewType,
      provider,
      {
        webviewOptions: { retainContextWhenHidden: true },
        supportsMultipleEditorsPerDocument: false,
      }
    );
  }

  openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken
  ): vscode.CustomDocument {
    return { uri, dispose: () => {} };
  }

  async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    const webview = webviewPanel.webview;
    const mediaDir = vscode.Uri.joinPath(this.context.extensionUri, "media");

    webview.options = {
      enableScripts: true,
      localResourceRoots: [mediaDir],
    };

    webview.html = this.getHtmlForWebview(webview, mediaDir);

    // Read the file and send its content to the webview
    const fileData = await vscode.workspace.fs.readFile(document.uri);
    const text = new TextDecoder("utf-8").decode(fileData);
    const filename = path.basename(document.uri.fsPath);

    // Wait for webview to signal it's ready, then send the file
    webview.onDidReceiveMessage((message) => {
      if (message.type === "ready") {
        webview.postMessage({ type: "loadFile", content: text, filename });
      }
    });
  }

  private getHtmlForWebview(
    webview: vscode.Webview,
    mediaDir: vscode.Uri
  ): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaDir, "webview.js")
    );
    const wasmUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaDir, "megane_wasm_bg.wasm")
    );
    const cssUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaDir, "main.css")
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             script-src 'nonce-${nonce}' blob:;
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
  </script>
  <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce(): string {
  let text = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(MeganeEditorProvider.register(context));
}

export function deactivate() {}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
class MeganePresetEditorProvider {
    context;
    static viewType = "megane.presetViewer";
    constructor(context) {
        this.context = context;
    }
    static register(context) {
        const provider = new MeganePresetEditorProvider(context);
        return vscode.window.registerCustomEditorProvider(MeganePresetEditorProvider.viewType, provider, {
            webviewOptions: { retainContextWhenHidden: true },
            supportsMultipleEditorsPerDocument: false,
        });
    }
    openCustomDocument(uri, _openContext, _token) {
        return { uri, dispose: () => { } };
    }
    async resolveCustomEditor(document, webviewPanel, _token) {
        const webview = webviewPanel.webview;
        const mediaDir = vscode.Uri.joinPath(this.context.extensionUri, "media");
        webview.options = {
            enableScripts: true,
            localResourceRoots: [mediaDir],
        };
        webview.html = getHtmlForWebview(webview, mediaDir);
        const presetData = await vscode.workspace.fs.readFile(document.uri);
        const preset = JSON.parse(new TextDecoder("utf-8").decode(presetData));
        const dir = path.dirname(document.uri.fsPath);
        const structureUri = vscode.Uri.file(path.resolve(dir, preset.structure));
        const structureData = await vscode.workspace.fs.readFile(structureUri);
        const structureText = new TextDecoder("utf-8").decode(structureData);
        const structureFilename = path.basename(preset.structure);
        let trajectoryPayload = null;
        if (preset.trajectory) {
            const trajUri = vscode.Uri.file(path.resolve(dir, preset.trajectory));
            const trajData = await vscode.workspace.fs.readFile(trajUri);
            trajectoryPayload = {
                content: Array.from(trajData),
                filename: path.basename(preset.trajectory),
            };
        }
        webview.onDidReceiveMessage((message) => {
            if (message.type === "ready") {
                webview.postMessage({
                    type: "loadPreset",
                    structure: { content: structureText, filename: structureFilename },
                    trajectory: trajectoryPayload,
                    settings: preset.settings ?? {},
                });
            }
        });
    }
}
class MeganeEditorProvider {
    context;
    static viewType = "megane.structureViewer";
    constructor(context) {
        this.context = context;
    }
    static register(context) {
        const provider = new MeganeEditorProvider(context);
        return vscode.window.registerCustomEditorProvider(MeganeEditorProvider.viewType, provider, {
            webviewOptions: { retainContextWhenHidden: true },
            supportsMultipleEditorsPerDocument: false,
        });
    }
    openCustomDocument(uri, _openContext, _token) {
        return { uri, dispose: () => { } };
    }
    async resolveCustomEditor(document, webviewPanel, _token) {
        const webview = webviewPanel.webview;
        const mediaDir = vscode.Uri.joinPath(this.context.extensionUri, "media");
        webview.options = {
            enableScripts: true,
            localResourceRoots: [mediaDir],
        };
        webview.html = getHtmlForWebview(webview, mediaDir);
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
}
function getHtmlForWebview(webview, mediaDir) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, "webview.js"));
    const wasmUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, "megane_wasm_bg.wasm"));
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaDir, "main.css"));
    const nonce = getNonce();
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
  </script>
  <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
</body>
</html>`;
}
function getNonce() {
    let text = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}
function activate(context) {
    context.subscriptions.push(MeganeEditorProvider.register(context));
    context.subscriptions.push(MeganePresetEditorProvider.register(context));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map
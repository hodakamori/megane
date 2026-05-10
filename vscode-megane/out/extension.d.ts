import * as vscode from "vscode";
export declare function createFrameStatusBarItem(): vscode.StatusBarItem;
export declare function createSelectionStatusBarItem(): vscode.StatusBarItem;
export declare class MeganeEditorProvider implements vscode.CustomReadonlyEditorProvider {
    private readonly context;
    static readonly viewType = "megane.structureViewer";
    private activePanel;
    constructor(context: vscode.ExtensionContext);
    /**
     * Programmatically seek the active megane viewer to a trajectory frame.
     * Returns `true` if a panel was active and the message was posted, `false` otherwise.
     */
    seekFrame(frame: number): boolean;
    openCustomDocument(uri: vscode.Uri, _openContext: vscode.CustomDocumentOpenContext, _token: vscode.CancellationToken): vscode.CustomDocument;
    resolveCustomEditor(document: vscode.CustomDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void>;
}
export declare function activate(context: vscode.ExtensionContext): void;
export declare function deactivate(): void;

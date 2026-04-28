import { ReactWidget } from "@jupyterlab/ui-components";
import type { DocumentRegistry } from "@jupyterlab/docregistry";
import { useCallback, useEffect, useState } from "react";
import { MeganeViewer } from "@megane/components/MeganeViewer";
import { useMeganeLocal } from "@megane/hooks/useMeganeLocal";
import "@megane/styles/megane.css";
import { ensureWasmUrl } from "./wasmLoader";

interface DocBodyProps {
  context: DocumentRegistry.Context;
}

type LoadState = "loading" | "ready" | { error: string };

function DocBody({ context }: DocBodyProps): JSX.Element {
  const local = useMeganeLocal();
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureWasmUrl();
        await context.ready;
        const filename = context.path.split("/").pop() ?? "structure";
        const text = context.model.toString();
        const file = new File([text], filename, { type: "text/plain" });
        await local.loadFile(file);
        if (!cancelled) setState("ready");
      } catch (err) {
        if (!cancelled) {
          setState({ error: err instanceof Error ? err.message : String(err) });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // `local` is intentionally omitted: useMeganeLocal returns a fresh
    // object on every render, so including it would re-fire this effect
    // on every state update and re-parse the file in a loop. We only
    // want to load when the document context is first ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const handleUploadStructure = useCallback(
    (file: File) => {
      local.loadFile(file);
    },
    [local],
  );

  if (typeof state === "object") {
    return (
      <div
        className="megane-jupyter-status error"
        data-testid="megane-doc-root"
        data-state="error"
      >
        <div className="label">Error</div>
        <div>{state.error}</div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div
        className="megane-jupyter-status"
        data-testid="megane-doc-root"
        data-state="loading"
      >
        Loading structure...
      </div>
    );
  }

  return (
    <div data-testid="megane-doc-root" data-state="ready" style={{ width: "100%", height: "100%" }}>
    <MeganeViewer
      snapshot={local.snapshot}
      frame={local.frame}
      currentFrame={local.currentFrame}
      totalFrames={local.meta?.nFrames ?? 0}
      onUploadStructure={handleUploadStructure}
      onBondSourceChange={(s: string) =>
        local.setBondSource(s as "structure" | "file" | "distance" | "none")
      }
      onLabelSourceChange={(s: string) =>
        local.setLabelSource(s as "none" | "structure" | "file")
      }
      onLoadLabelFile={(f: File) => local.loadLabelFile(f)}
      onVectorSourceChange={(s: string) => local.setVectorSource(s as "none" | "file" | "demo")}
      onLoadVectorFile={(f: File) => local.loadVectorFile(f)}
      onLoadDemoVectors={() => local.loadDemoVectors()}
    />
    </div>
  );
}

export class MeganeReactView extends ReactWidget {
  constructor(private readonly context: DocumentRegistry.Context) {
    super();
    this.addClass("megane-jupyter-doc");
  }

  protected render(): JSX.Element {
    return <DocBody context={this.context} />;
  }
}

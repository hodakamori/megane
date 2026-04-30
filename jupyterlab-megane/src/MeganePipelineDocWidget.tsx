import { ReactWidget } from "@jupyterlab/ui-components";
import type { DocumentRegistry } from "@jupyterlab/docregistry";
import type { Contents } from "@jupyterlab/services";
import { useCallback, useEffect, useState } from "react";
import { MeganeViewer } from "@megane/components/MeganeViewer";
import { useMeganeLocal } from "@megane/hooks/useMeganeLocal";
import { parseStructureFile } from "@megane/parsers/structure";
import { parseXTCFile, parseLammpstrjFile } from "@megane/parsers/xtc";
import { usePipelineStore } from "@megane/pipeline/store";
import type { SerializedPipeline } from "@megane/pipeline/types";
import "@megane/styles/megane.css";
import { ensureWasmUrl } from "./wasmLoader";

interface PipelineNode {
  id: string;
  type: string;
  fileName?: string | null;
}

interface DocBodyProps {
  context: DocumentRegistry.Context;
  contents: Contents.IManager;
}

type LoadState = "loading" | "ready" | { error: string };

function dirname(p: string): string {
  const idx = p.lastIndexOf("/");
  return idx >= 0 ? p.slice(0, idx) : "";
}

function basename(p: string): string {
  const idx = p.lastIndexOf("/");
  return idx >= 0 ? p.slice(idx + 1) : p;
}

function joinUnderDir(dir: string, rel: string): string | null {
  // Mirror the VSCode extension's safety rules:
  // - reject absolute paths (leading "/")
  // - reject paths that escape `dir` via ".." traversal
  if (rel.startsWith("/")) return null;
  const parts = (dir ? `${dir}/${rel}` : rel).split("/");
  const out: string[] = [];
  for (const seg of parts) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") {
      if (out.length === 0) return null;
      out.pop();
      continue;
    }
    out.push(seg);
  }
  const joined = out.join("/");
  if (dir === "") return joined;
  if (joined !== dir && !joined.startsWith(`${dir}/`)) return null;
  return joined;
}

async function fetchFileBytes(
  contents: Contents.IManager,
  path: string,
): Promise<Uint8Array> {
  // Always fetch as base64 so binary formats (.traj, .xtc) round-trip
  // unmodified. The shared parsers re-decode via file.text() or
  // file.arrayBuffer() based on extension.
  const model = await contents.get(path, { content: true, format: "base64" });
  const raw = String(model.content ?? "");
  return Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
}

function DocBody({ context, contents }: DocBodyProps): JSX.Element {
  const local = useMeganeLocal();
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureWasmUrl();
        await context.ready;
        const pipelineText = context.model.toString();
        const pipeline = JSON.parse(pipelineText) as SerializedPipeline;
        if (pipeline.version !== 3) {
          throw new Error(
            `Not a valid megane pipeline file (version 3 required, got ${pipeline.version})`,
          );
        }

        const dir = dirname(context.path);
        const store = usePipelineStore.getState();
        store.deserialize(pipeline);

        // Phase 1: structure files
        let firstFile: File | null = null;
        const parsedStructures: Array<{
          nodeId: string;
          filename: string;
          result: Awaited<ReturnType<typeof parseStructureFile>>;
        }> = [];

        for (const node of (pipeline.nodes ?? []) as PipelineNode[]) {
          if (node.type !== "load_structure" || !node.fileName) continue;
          const target = joinUnderDir(dir, String(node.fileName));
          if (!target) continue;
          const filename = basename(String(node.fileName));
          try {
            const bytes = await fetchFileBytes(contents, target);
            const file = new File([bytes], filename);
            const result = await parseStructureFile(file);
            parsedStructures.push({ nodeId: node.id, filename, result });
            if (!firstFile) firstFile = file;
          } catch {
            // File missing or unreadable — leave the node empty; the user
            // can re-attach via the node's file picker.
          }
        }

        if (firstFile) {
          await local.loadFile(firstFile);
        }

        let firstSnapshot: unknown = null;
        for (const { nodeId, filename, result } of parsedStructures) {
          store.setNodeSnapshot(nodeId, {
            snapshot: result.snapshot,
            frames: result.frames.length > 0 ? result.frames : null,
            meta: result.meta,
            labels: result.labels,
          });
          store.updateNodeParams(nodeId, {
            fileName: filename,
            hasTrajectory: result.frames.length > 0,
            hasCell: !!result.snapshot.box,
          });
          if (!firstSnapshot) firstSnapshot = result.snapshot;
        }

        // Phase 2: trajectory files (single global trajectory)
        for (const node of (pipeline.nodes ?? []) as PipelineNode[]) {
          if (node.type !== "load_trajectory" || !node.fileName) continue;
          if (!firstSnapshot) break;
          const target = joinUnderDir(dir, String(node.fileName));
          if (!target) continue;
          const filename = basename(String(node.fileName));
          try {
            const bytes = await fetchFileBytes(contents, target);
            const file = new File([bytes], filename);
            const lower = filename.toLowerCase();
            const isLammps = lower.endsWith(".lammpstrj") || lower.endsWith(".dump");
            const parseFn = isLammps ? parseLammpstrjFile : parseXTCFile;
            const snap = firstSnapshot as { nAtoms: number };
            const { frames, meta } = await parseFn(file, snap.nAtoms);
            store.setFileFrames(frames, meta ?? null);
            store.updateNodeParams(node.id, { fileName: filename });
          } catch {
            // Skip silently
          }
          break;
        }

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
    // `local` is intentionally omitted (see MeganeDocWidget for rationale).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, contents]);

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
        data-testid="megane-pipeline-doc-root"
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
        data-testid="megane-pipeline-doc-root"
        data-state="loading"
      >
        Loading pipeline...
      </div>
    );
  }

  return (
    <div
      data-testid="megane-pipeline-doc-root"
      data-state="ready"
      style={{ width: "100%", height: "100%" }}
    >
      <MeganeViewer
        testContext="jupyterlab-pipeline"
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

export class MeganePipelineReactView extends ReactWidget {
  constructor(
    private readonly context: DocumentRegistry.Context,
    private readonly contents: Contents.IManager,
  ) {
    super();
    this.addClass("megane-jupyter-doc");
  }

  protected render(): JSX.Element {
    return <DocBody context={this.context} contents={this.contents} />;
  }
}

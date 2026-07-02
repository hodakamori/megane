/**
 * Capture utilities for exporting the viewport as images or video.
 */

import type { MoleculeRenderer } from "./MoleculeRenderer";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter.js";

/** Composite WebGL canvas and label overlay onto an offscreen canvas. */
export function compositeCanvases(
  webglCanvas: HTMLCanvasElement,
  labelCanvas: HTMLCanvasElement | null,
  width: number,
  height: number,
): HTMLCanvasElement {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d")!;
  ctx.drawImage(webglCanvas, 0, 0, width, height);
  if (labelCanvas) {
    ctx.drawImage(labelCanvas, 0, 0, width, height);
  }
  return offscreen;
}

/** Convert canvas to Blob (promisified). */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType = "image/png",
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      mimeType,
      quality,
    );
  });
}

/**
 * Optional host override for saving blobs. Hosts where a synthetic
 * `<a download>` click is a silent no-op (the VSCode webview) install this
 * hook to route the bytes to the host instead (see vscode-megane/webview).
 */
type SaveBlobHook = (blob: Blob, filename: string) => void;

/** Trigger a file download from a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const hook = (globalThis as { __MEGANE_SAVE_BLOB__?: SaveBlobHook }).__MEGANE_SAVE_BLOB__;
  if (typeof hook === "function") {
    hook(blob, filename);
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Wrap a PNG image as an EPS file with embedded raster data. */
export async function wrapInEPS(pngBlob: Blob, width: number, height: number): Promise<Blob> {
  // Convert PNG to raw RGB pixel data via canvas
  const img = await createImageBitmap(pngBlob);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  // Convert RGBA to hex RGB string
  const hexLines: string[] = [];
  let line = "";
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i].toString(16).padStart(2, "0");
    const g = pixels[i + 1].toString(16).padStart(2, "0");
    const b = pixels[i + 2].toString(16).padStart(2, "0");
    line += r + g + b;
    if (line.length >= 72) {
      hexLines.push(line);
      line = "";
    }
  }
  if (line) hexLines.push(line);

  const eps = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${width} ${height}
%%Title: megane export
%%Creator: megane molecular viewer
%%EndComments
gsave
${width} ${height} scale
${width} ${height} 8 [${width} 0 0 -${height} 0 ${height}]
{currentfile ${width * 3} string readhexstring pop} false 3 colorimage
${hexLines.join("\n")}
grestore
showpage
%%EOF
`;

  return new Blob([eps], { type: "application/postscript" });
}

/** Read a Blob as a base64-encoded data URL. */
function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Wrap a PNG image as an SVG file with an embedded raster image element. */
export async function wrapInSVG(pngBlob: Blob, width: number, height: number): Promise<Blob> {
  const dataURL = await blobToDataURL(pngBlob);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>megane export</title>
  <image x="0" y="0" width="${width}" height="${height}" xlink:href="${dataURL}"/>
</svg>`;
  return new Blob([svg], { type: "image/svg+xml" });
}

/** Capture a single snapshot from the renderer. */
export async function captureSnapshot(
  renderer: MoleculeRenderer,
  options: {
    width: number;
    height: number;
    transparent: boolean;
    format: "png" | "eps" | "svg";
  },
): Promise<Blob> {
  const { width, height, transparent, format } = options;
  const scene = renderer.getScene();
  const webglRenderer = renderer.getRenderer();

  // Save state
  const savedBg = scene.background;
  const savedClearAlpha = webglRenderer.getClearAlpha();

  // Apply transparent background if requested
  if (transparent) {
    scene.background = null;
    webglRenderer.setClearColor(0x000000, 0);
  }

  // Resize for capture
  const restore = renderer.resizeForCapture(width, height);

  // Render single frame
  renderer.renderSingleFrame();

  // Composite canvases
  const webglCanvas = renderer.getCanvas()!;
  const labelOverlay = renderer.getLabelOverlay();
  const labelCanvas = labelOverlay?.getCanvas() ?? null;
  const composited = compositeCanvases(webglCanvas, labelCanvas, width, height);

  // Restore state
  scene.background = savedBg;
  webglRenderer.setClearColor(0xffffff, savedClearAlpha);
  restore();
  renderer.renderSingleFrame();

  // Export
  const pngBlob = await canvasToBlob(composited, "image/png");
  if (format === "eps") {
    return wrapInEPS(pngBlob, width, height);
  }
  if (format === "svg") {
    return wrapInSVG(pngBlob, width, height);
  }
  return pngBlob;
}

/**
 * Resolve the gif.js worker script into a same-origin `blob:` URL.
 *
 * gif.js spawns Web Workers from its `workerScript` URL during `render()`.
 * When that URL resolves to a cross-origin or otherwise unfetchable path — as
 * happens inside the JupyterLab labextension, where assets are served from a
 * different base path than the document — the worker either fails to construct
 * or loads a 404 HTML page and throws while parsing. gif.js does not listen for
 * the worker's `onerror`, so the encode hangs silently forever: the GIF progress
 * bar freezes at the frame-capture / encode boundary (80%). MP4 export is
 * unaffected because MediaRecorder needs no worker.
 *
 * Fetching the script ourselves and handing gif.js a same-origin `blob:` URL
 * sidesteps the cross-origin restriction. If the fetch fails we fall back to the
 * raw URL so hosts where the direct path already worked do not regress. See
 * issue #497.
 */
export async function resolveGifWorkerScript(): Promise<string> {
  const workerUrl = new URL("gif.js/dist/gif.worker.js", import.meta.url).href;
  try {
    const response = await fetch(workerUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const source = await response.text();
    const blob = new Blob([source], { type: "application/javascript" });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn(
      `megane: could not fetch GIF worker script (${String(err)}); falling back to direct URL`,
    );
    return workerUrl;
  }
}

/** Capture animation frames as GIF using gif.js. */
export async function captureGif(
  renderer: MoleculeRenderer,
  options: {
    width: number;
    height: number;
    transparent: boolean;
    startFrame: number;
    endFrame: number;
    fps: number;
    seekFrame: (frame: number) => void;
    onProgress?: (progress: number) => void;
  },
): Promise<Blob> {
  const { width, height, transparent, startFrame, endFrame, fps, seekFrame, onProgress } = options;
  const totalFrames = endFrame - startFrame + 1;
  const delay = Math.round(1000 / fps);

  const scene = renderer.getScene();
  const webglRenderer = renderer.getRenderer();

  // Save state
  const savedBg = scene.background;
  const savedClearAlpha = webglRenderer.getClearAlpha();

  if (transparent) {
    scene.background = null;
    webglRenderer.setClearColor(0x000000, 0);
  }

  const restore = renderer.resizeForCapture(width, height);

  // Dynamically import gif.js
  const GIF = (await import("gif.js")).default;
  const workerScript = await resolveGifWorkerScript();
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
    workerScript,
  });

  // Capture each frame
  for (let i = startFrame; i <= endFrame; i++) {
    seekFrame(i);
    // Wait for render
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    renderer.renderSingleFrame();

    const webglCanvas = renderer.getCanvas()!;
    const labelOverlay = renderer.getLabelOverlay();
    const labelCanvas = labelOverlay?.getCanvas() ?? null;
    const composited = compositeCanvases(webglCanvas, labelCanvas, width, height);

    gif.addFrame(composited, { delay, copy: true });
    onProgress?.(((i - startFrame + 1) / totalFrames) * 0.8);
  }

  // Restore
  scene.background = savedBg;
  webglRenderer.setClearColor(0xffffff, savedClearAlpha);
  restore();
  renderer.renderSingleFrame();

  // Render GIF
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      if (workerScript.startsWith("blob:")) {
        URL.revokeObjectURL(workerScript);
      }
    };
    gif.on("finished", (blob: Blob) => {
      cleanup();
      onProgress?.(1);
      resolve(blob);
    });
    gif.on("abort", () => {
      cleanup();
      reject(new Error("GIF encoding was aborted"));
    });
    gif.on("progress", (p: number) => {
      onProgress?.(0.8 + p * 0.2);
    });
    gif.render();
  });
}

/** Export the current scene as a binary glTF (.glb) file. */
export async function captureGltf(renderer: MoleculeRenderer): Promise<Blob> {
  const scene = renderer.getScene();
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(scene, { binary: true });
  return new Blob([result as ArrayBuffer], { type: "model/gltf-binary" });
}

/** Export the current scene as an OBJ text file (geometry only, no materials). */
export function captureObj(renderer: MoleculeRenderer): Blob {
  const scene = renderer.getScene();
  const exporter = new OBJExporter();
  const objString = exporter.parse(scene);
  return new Blob([objString], { type: "text/plain" });
}

/** Capture animation frames as MP4/WebM using MediaRecorder. */
export async function captureVideo(
  renderer: MoleculeRenderer,
  options: {
    width: number;
    height: number;
    transparent: boolean;
    startFrame: number;
    endFrame: number;
    fps: number;
    seekFrame: (frame: number) => void;
    onProgress?: (progress: number) => void;
  },
): Promise<Blob> {
  const { width, height, transparent, startFrame, endFrame, fps, seekFrame, onProgress } = options;
  const totalFrames = endFrame - startFrame + 1;

  const scene = renderer.getScene();
  const webglRenderer = renderer.getRenderer();

  const savedBg = scene.background;
  const savedClearAlpha = webglRenderer.getClearAlpha();

  if (transparent) {
    scene.background = null;
    webglRenderer.setClearColor(0x000000, 0);
  }

  const restore = renderer.resizeForCapture(width, height);

  // Create a recording canvas
  const recordCanvas = document.createElement("canvas");
  recordCanvas.width = width;
  recordCanvas.height = height;
  const recordCtx = recordCanvas.getContext("2d")!;

  // Setup MediaRecorder
  const stream = recordCanvas.captureStream(0);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 8_000_000,
  });
  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.start();

  const frameDelay = 1000 / fps;

  // Capture each frame
  for (let i = startFrame; i <= endFrame; i++) {
    seekFrame(i);
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));

    renderer.renderSingleFrame();

    const webglCanvas = renderer.getCanvas()!;
    const labelOverlay = renderer.getLabelOverlay();
    const labelCanvas = labelOverlay?.getCanvas() ?? null;

    recordCtx.clearRect(0, 0, width, height);
    recordCtx.drawImage(webglCanvas, 0, 0, width, height);
    if (labelCanvas) {
      recordCtx.drawImage(labelCanvas, 0, 0, width, height);
    }

    // Request a frame from the capture stream
    const videoTrack = stream.getVideoTracks()[0] as MediaStreamTrack & {
      requestFrame?: () => void;
    };
    videoTrack.requestFrame?.();

    // Wait for frame duration
    await new Promise((r) => setTimeout(r, frameDelay));

    onProgress?.((i - startFrame + 1) / totalFrames);
  }

  // Stop recording
  mediaRecorder.stop();
  await new Promise<void>((resolve) => {
    mediaRecorder.onstop = () => resolve();
  });

  // Restore
  scene.background = savedBg;
  webglRenderer.setClearColor(0xffffff, savedClearAlpha);
  restore();
  renderer.renderSingleFrame();

  onProgress?.(1);
  return new Blob(chunks, { type: mimeType });
}

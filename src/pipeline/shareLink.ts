/**
 * URL permalink encoding/decoding for pipeline state.
 *
 * Format: `#pipeline=<base64url(deflate-raw(JSON))>`
 * Falls back to uncompressed base64url when CompressionStream is unavailable.
 *
 * Side-effect contract for the share button flow:
 *   - `shareCurrentPipeline` ALWAYS commits the hash to the address bar
 *     before returning (when the payload fits), independently of clipboard
 *     availability. The dialog UI then drives the user-visible copy step.
 *   - `copyShareUrl` tries the modern Clipboard API first and falls back to
 *     a hidden-textarea + `document.execCommand('copy')` for non-secure
 *     contexts and sandboxed iframes.
 */

import type { SerializedPipeline } from "./types";

const HASH_PARAM = "pipeline";
/** Warn the user when the hash fragment would exceed this many characters. */
const MAX_HASH_LENGTH = 8000;

// ── byte ↔ base64url ────────────────────────────────────────────────────────

function bytesToBase64url(bytes: Uint8Array<ArrayBuffer>): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlToBytes(str: string): Uint8Array<ArrayBuffer> {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + "=".repeat(padding));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ── deflate-raw helpers (async, CompressionStream) ──────────────────────────

async function deflate(data: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const cs = new CompressionStream("deflate-raw");
  const writer = cs.writable.getWriter();
  await writer.write(data);
  await writer.close();
  return collectStream(cs.readable);
}

async function inflate(data: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
  const ds = new DecompressionStream("deflate-raw");
  const writer = ds.writable.getWriter();
  await writer.write(data);
  await writer.close();
  return collectStream(ds.readable);
}

async function collectStream(
  readable: ReadableStream<Uint8Array>,
): Promise<Uint8Array<ArrayBuffer>> {
  const chunks: Uint8Array[] = [];
  const reader = readable.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

// ── public API ───────────────────────────────────────────────────────────────

/**
 * Encode a pipeline to a shareable URL.
 * Returns the URL and whether the resulting hash would be too long to share.
 */
export async function buildShareUrl(
  pipeline: SerializedPipeline,
): Promise<{ url: string; tooLong: boolean }> {
  const json = JSON.stringify(pipeline);
  const raw = new TextEncoder().encode(json);

  let encoded: string;
  try {
    encoded = bytesToBase64url(await deflate(raw));
  } catch {
    encoded = bytesToBase64url(raw);
  }

  const hash = `${HASH_PARAM}=${encoded}`;
  const url = `${location.origin}${location.pathname}#${hash}`;
  return { url, tooLong: hash.length > MAX_HASH_LENGTH };
}

/**
 * Read and decode a pipeline from the current URL hash.
 * Returns null when no pipeline is present or decoding fails.
 */
export async function readPipelineFromHash(): Promise<SerializedPipeline | null> {
  if (typeof location === "undefined") return null;
  const hash = location.hash.slice(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const encoded = params.get(HASH_PARAM);
  if (!encoded) return null;

  try {
    const bytes = base64urlToBytes(encoded);

    let json: string;
    try {
      json = new TextDecoder().decode(await inflate(bytes));
    } catch {
      json = new TextDecoder().decode(bytes);
    }

    const parsed: unknown = JSON.parse(json);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      !("nodes" in parsed) ||
      !("edges" in parsed)
    ) {
      return null;
    }
    return parsed as SerializedPipeline;
  } catch {
    return null;
  }
}

// ── side-effect helpers ─────────────────────────────────────────────────────

/**
 * Mirror the URL's hash fragment into the browser address bar.
 * Swallows `SecurityError` from sandboxed iframes so a missing history API
 * never blocks the share flow.
 */
export function commitShareHashToHistory(url: string): void {
  try {
    history.replaceState(null, "", new URL(url).hash);
  } catch {
    // Sandboxed iframes / non-browser hosts: nothing to do.
  }
}

/**
 * Copy `url` to the user's clipboard.
 *
 * Tries the modern async Clipboard API first; falls back to a hidden
 * `<textarea>` + `document.execCommand('copy')` so non-secure contexts and
 * permission-denied environments still get a working copy. On full failure
 * the URL is logged via `console.info` so it can still be retrieved.
 */
export async function copyShareUrl(url: string): Promise<"copied" | "failed"> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      // fall through to legacy path
    }
  }

  if (typeof document !== "undefined" && document.body) {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    try {
      textarea.focus();
      textarea.select();
      const ok = document.execCommand("copy");
      if (ok) return "copied";
    } catch {
      // ignore — handled below
    } finally {
      textarea.remove();
    }
  }

  console.info("Share URL:", url);
  return "failed";
}

/**
 * Build a share URL for `pipeline` and commit the hash to the address bar.
 * Returns the dialog payload (URL + tooLong flag); does NOT touch the
 * clipboard — that is driven by an explicit user click in `<ShareDialog>`.
 */
export async function shareCurrentPipeline(
  pipeline: SerializedPipeline,
): Promise<{ url: string; tooLong: boolean }> {
  const { url, tooLong } = await buildShareUrl(pipeline);
  if (!tooLong) commitShareHashToHistory(url);
  return { url, tooLong };
}

// ── hash-restore helper ─────────────────────────────────────────────────────

/**
 * Read a pipeline from the URL hash (if present) and apply it via the supplied
 * deserializer. Returns true on a successful restore so the caller can skip
 * loading default content. Any failure (no hash, malformed payload, throwing
 * deserializer) is swallowed and reported as `false`.
 */
export async function restorePipelineFromHash(
  deserialize: (pipeline: SerializedPipeline) => void,
): Promise<boolean> {
  const hashPipeline = await readPipelineFromHash();
  if (!hashPipeline) return false;
  try {
    deserialize(hashPipeline);
    return true;
  } catch {
    return false;
  }
}

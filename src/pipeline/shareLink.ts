/**
 * URL permalink encoding/decoding for pipeline state.
 * Serializes the pipeline JSON to a base64url string stored in the URL hash
 * so viewers can share a reproducible pipeline state via link.
 *
 * Format: `#pipeline=<base64url(deflate-raw(JSON))>`
 * Falls back to uncompressed base64url when CompressionStream is unavailable.
 */

import type { SerializedPipeline } from "./types";

const HASH_PARAM = "pipeline";
/** Warn the user when the hash fragment would exceed this many characters. */
const MAX_HASH_LENGTH = 8000;

const TOO_LONG_MESSAGE = "Pipeline too large for a share link — use Export instead";
const COPIED_MESSAGE = "Link copied to clipboard!";
const COPY_FAILED_MESSAGE = "Copy failed — see console for the link";

const COPIED_TOAST_MS = 3000;
const TOO_LONG_TOAST_MS = 4000;

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
    // CompressionStream not available — fall back to plain base64url
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
      // Not compressed — treat as plain UTF-8 base64url
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

// ── share-button outcome helper ─────────────────────────────────────────────

export type ShareOutcome = {
  /** Toast message to surface to the user. */
  message: string;
  /** Milliseconds the toast should remain visible before auto-clearing. */
  clearAfterMs: number;
  /** The share URL (always set, even when copy failed). */
  url: string;
  /** True when the pipeline was too large to fit a shareable hash. */
  tooLong: boolean;
  /** True when navigator.clipboard.writeText threw. */
  copyFailed: boolean;
};

/**
 * Build a share URL for the given pipeline, copy it to the clipboard, and
 * mirror the resulting hash into the address bar. Returns a presentation-ready
 * outcome that the caller can render as a toast.
 *
 * Pure side effects (clipboard write, history.replaceState, console.info on
 * failure) are kept out of the React component so the flow is testable.
 */
export async function shareCurrentPipeline(pipeline: SerializedPipeline): Promise<ShareOutcome> {
  const { url, tooLong } = await buildShareUrl(pipeline);
  if (tooLong) {
    return {
      message: TOO_LONG_MESSAGE,
      clearAfterMs: TOO_LONG_TOAST_MS,
      url,
      tooLong: true,
      copyFailed: false,
    };
  }
  try {
    await navigator.clipboard.writeText(url);
    history.replaceState(null, "", new URL(url).hash);
    return {
      message: COPIED_MESSAGE,
      clearAfterMs: COPIED_TOAST_MS,
      url,
      tooLong: false,
      copyFailed: false,
    };
  } catch {
    console.info("Share URL:", url);
    return {
      message: COPY_FAILED_MESSAGE,
      clearAfterMs: COPIED_TOAST_MS,
      url,
      tooLong: false,
      copyFailed: true,
    };
  }
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

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

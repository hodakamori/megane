import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { buildShareUrl, readPipelineFromHash } from "@/pipeline/shareLink";
import type { SerializedPipeline } from "@/pipeline/types";

const samplePipeline: SerializedPipeline = {
  version: 3,
  nodes: [
    {
      id: "n1",
      type: "load_structure",
      position: { x: 0, y: 0 },
      enabled: true,
      fileName: null,
      hasTrajectory: false,
      hasCell: false,
    } as SerializedPipeline["nodes"][number],
    {
      id: "n2",
      type: "viewport",
      position: { x: 200, y: 0 },
      enabled: true,
      perspective: false,
      cellAxesVisible: true,
    } as SerializedPipeline["nodes"][number],
  ],
  edges: [{ source: "n1", target: "n2", sourceHandle: "particle", targetHandle: "particle" }],
};

function setHash(hash: string): void {
  window.location.hash = hash;
}

describe("buildShareUrl", () => {
  beforeEach(() => {
    setHash("");
  });

  it("encodes a pipeline into a URL with #pipeline= hash", async () => {
    const { url, tooLong } = await buildShareUrl(samplePipeline);
    expect(url.startsWith(location.origin + location.pathname + "#pipeline=")).toBe(true);
    expect(tooLong).toBe(false);
  });

  it("round-trips through readPipelineFromHash via the encoded hash", async () => {
    const { url } = await buildShareUrl(samplePipeline);
    const hashIndex = url.indexOf("#");
    setHash(url.slice(hashIndex + 1));

    const parsed = await readPipelineFromHash();
    expect(parsed).not.toBeNull();
    expect(parsed?.version).toBe(3);
    expect(parsed?.nodes).toHaveLength(2);
    expect(parsed?.edges[0]).toEqual(samplePipeline.edges[0]);
  });

  it("emits base64url alphabet only (no +, /, =)", async () => {
    const { url } = await buildShareUrl(samplePipeline);
    const encoded = url.split("#pipeline=")[1];
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it("flags tooLong=true when the encoded payload exceeds 8000 chars", async () => {
    const big: SerializedPipeline = {
      version: 3,
      nodes: Array.from({ length: 800 }, (_, i) => ({
        id: `node-${i}`,
        type: "load_structure",
        position: { x: i, y: i },
        enabled: true,
        // pad with random-ish unique data so deflate cannot collapse it
        fileName: `${i}-${Math.random().toString(36).repeat(5)}-${"x".repeat(30)}`,
        hasTrajectory: false,
        hasCell: false,
      })) as SerializedPipeline["nodes"],
      edges: [],
    };
    const { tooLong } = await buildShareUrl(big);
    expect(tooLong).toBe(true);
  });

  it("falls back to plain base64url when CompressionStream is unavailable", async () => {
    const original = globalThis.CompressionStream;
    // Simulate older browsers by removing CompressionStream entirely.
    // The implementation catches the resulting ReferenceError/TypeError and
    // falls back to encoding the raw JSON bytes.
    // @ts-expect-error - intentional removal for fallback test
    delete globalThis.CompressionStream;
    try {
      const { url } = await buildShareUrl(samplePipeline);
      const encoded = url.split("#pipeline=")[1];
      // The fallback path stores the raw JSON, so atob(decode) should yield JSON text.
      const padded = encoded.replace(/-/g, "+").replace(/_/g, "/");
      const padding = (4 - (padded.length % 4)) % 4;
      const decoded = atob(padded + "=".repeat(padding));
      expect(decoded.startsWith("{")).toBe(true);
      const parsed = JSON.parse(decoded);
      expect(parsed.version).toBe(3);
    } finally {
      globalThis.CompressionStream = original;
    }
  });
});

describe("readPipelineFromHash", () => {
  beforeEach(() => {
    setHash("");
  });

  it("returns null when the hash is empty", async () => {
    setHash("");
    expect(await readPipelineFromHash()).toBeNull();
  });

  it("returns null when the hash has no pipeline= param", async () => {
    setHash("other=value");
    expect(await readPipelineFromHash()).toBeNull();
  });

  it("returns null when the encoded payload is not valid base64url", async () => {
    setHash("pipeline=!!!not-base64!!!");
    expect(await readPipelineFromHash()).toBeNull();
  });

  it("returns null when decoded JSON is malformed", async () => {
    // base64url("not json") → "bm90IGpzb24"
    const encoded = btoa("not json").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    setHash(`pipeline=${encoded}`);
    expect(await readPipelineFromHash()).toBeNull();
  });

  it("returns null when JSON is structurally invalid (missing required keys)", async () => {
    const encoded = btoa(JSON.stringify({ version: 3, nodes: [] /* edges missing */ }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    setHash(`pipeline=${encoded}`);
    expect(await readPipelineFromHash()).toBeNull();
  });

  it("returns null when the parsed value is not an object", async () => {
    const encoded = btoa(JSON.stringify("just a string"))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    setHash(`pipeline=${encoded}`);
    expect(await readPipelineFromHash()).toBeNull();
  });

  it("decodes a plain (uncompressed) base64url payload as fallback", async () => {
    const encoded = btoa(JSON.stringify(samplePipeline))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    setHash(`pipeline=${encoded}`);
    const parsed = await readPipelineFromHash();
    expect(parsed).not.toBeNull();
    expect(parsed?.version).toBe(3);
    expect(parsed?.nodes).toHaveLength(2);
  });

  it("returns null when location is undefined (non-browser env)", async () => {
    const originalLocation = globalThis.location;
    // @ts-expect-error - intentional removal to exercise the typeof guard
    delete globalThis.location;
    try {
      expect(await readPipelineFromHash()).toBeNull();
    } finally {
      globalThis.location = originalLocation;
    }
  });
});

describe("buildShareUrl ↔ readPipelineFromHash compatibility", () => {
  let originalCompression: typeof CompressionStream | undefined;
  let originalDecompression: typeof DecompressionStream | undefined;

  afterEach(() => {
    if (originalCompression !== undefined) {
      globalThis.CompressionStream = originalCompression;
      originalCompression = undefined;
    }
    if (originalDecompression !== undefined) {
      globalThis.DecompressionStream = originalDecompression;
      originalDecompression = undefined;
    }
    setHash("");
  });

  it("readPipelineFromHash recovers a pipeline encoded without CompressionStream", async () => {
    originalCompression = globalThis.CompressionStream;
    // @ts-expect-error - simulate browser without CompressionStream
    delete globalThis.CompressionStream;

    const { url } = await buildShareUrl(samplePipeline);
    const hashIndex = url.indexOf("#");
    setHash(url.slice(hashIndex + 1));

    // Restore compression so the decoder will try inflate first; the inflate
    // attempt should fail on plain bytes, and the catch should fall through
    // to the plain UTF-8 path.
    globalThis.CompressionStream = originalCompression;
    originalCompression = undefined;

    const parsed = await readPipelineFromHash();
    expect(parsed).not.toBeNull();
    expect(parsed?.version).toBe(3);
    expect(parsed?.edges).toEqual(samplePipeline.edges);
  });

  it("CompressionStream throwing is treated as fallback (no rethrow)", async () => {
    originalCompression = globalThis.CompressionStream;
    const spy = vi.fn(() => {
      throw new Error("boom");
    });
    // @ts-expect-error - mock constructor that throws
    globalThis.CompressionStream = spy;

    const { url, tooLong } = await buildShareUrl(samplePipeline);
    expect(spy).toHaveBeenCalled();
    expect(tooLong).toBe(false);
    expect(url).toContain("#pipeline=");
  });
});

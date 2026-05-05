import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  buildShareUrl,
  commitShareHashToHistory,
  copyShareUrl,
  readPipelineFromHash,
  restorePipelineFromHash,
  shareCurrentPipeline,
} from "@/pipeline/shareLink";
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
    // @ts-expect-error - intentional removal for fallback test
    delete globalThis.CompressionStream;
    try {
      const { url } = await buildShareUrl(samplePipeline);
      const encoded = url.split("#pipeline=")[1];
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

  afterEach(() => {
    if (originalCompression !== undefined) {
      globalThis.CompressionStream = originalCompression;
      originalCompression = undefined;
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

describe("commitShareHashToHistory", () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    replaceStateSpy = vi.spyOn(history, "replaceState").mockImplementation(() => {});
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
  });

  it("calls history.replaceState with the URL's hash fragment", () => {
    commitShareHashToHistory("https://example.com/path#pipeline=abc123");
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(String(replaceStateSpy.mock.calls[0][2])).toBe("#pipeline=abc123");
  });

  it("swallows replaceState exceptions so the share flow continues", () => {
    replaceStateSpy.mockImplementationOnce(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    expect(() =>
      commitShareHashToHistory("https://example.com/path#pipeline=abc123"),
    ).not.toThrow();
  });
});

describe("copyShareUrl", () => {
  let writeText: ReturnType<typeof vi.fn>;
  let originalClipboard: PropertyDescriptor | undefined;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let originalExec: typeof document.execCommand;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    originalExec = document.execCommand;
  });

  afterEach(() => {
    if (originalClipboard) {
      Object.defineProperty(navigator, "clipboard", originalClipboard);
    } else {
      // @ts-expect-error - remove the test-installed property
      delete navigator.clipboard;
    }
    infoSpy.mockRestore();
    document.execCommand = originalExec;
  });

  it("returns 'copied' on navigator.clipboard.writeText success", async () => {
    const result = await copyShareUrl("https://example.com/#pipeline=abc");
    expect(result).toBe("copied");
    expect(writeText).toHaveBeenCalledWith("https://example.com/#pipeline=abc");
  });

  it("falls back to execCommand('copy') when writeText rejects", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    const exec = vi.fn().mockReturnValue(true);
    document.execCommand = exec as unknown as typeof document.execCommand;

    const before = document.body.querySelectorAll("textarea").length;
    const result = await copyShareUrl("https://example.com/#pipeline=abc");
    const after = document.body.querySelectorAll("textarea").length;

    expect(result).toBe("copied");
    expect(exec).toHaveBeenCalledWith("copy");
    expect(after).toBe(before);
  });

  it("falls back to execCommand('copy') when navigator.clipboard is missing", async () => {
    // @ts-expect-error - simulate missing API
    delete navigator.clipboard;
    const exec = vi.fn().mockReturnValue(true);
    document.execCommand = exec as unknown as typeof document.execCommand;

    const result = await copyShareUrl("https://example.com/#pipeline=abc");
    expect(result).toBe("copied");
    expect(exec).toHaveBeenCalledWith("copy");
  });

  it("returns 'failed' and logs the URL when both paths fail", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    const exec = vi.fn().mockReturnValue(false);
    document.execCommand = exec as unknown as typeof document.execCommand;

    const result = await copyShareUrl("https://example.com/#pipeline=abc");
    expect(result).toBe("failed");
    expect(infoSpy).toHaveBeenCalledWith("Share URL:", "https://example.com/#pipeline=abc");
  });

  it("returns 'failed' when execCommand throws after clipboard fails", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    document.execCommand = (() => {
      throw new Error("blocked");
    }) as unknown as typeof document.execCommand;

    const result = await copyShareUrl("https://example.com/#pipeline=abc");
    expect(result).toBe("failed");
  });
});

describe("shareCurrentPipeline", () => {
  let replaceStateSpy: ReturnType<typeof vi.spyOn>;
  let writeText: ReturnType<typeof vi.fn>;
  let originalClipboard: PropertyDescriptor | undefined;

  beforeEach(() => {
    replaceStateSpy = vi.spyOn(history, "replaceState").mockImplementation(() => {});
    writeText = vi.fn().mockResolvedValue(undefined);
    originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    window.location.hash = "";
  });

  afterEach(() => {
    replaceStateSpy.mockRestore();
    if (originalClipboard) {
      Object.defineProperty(navigator, "clipboard", originalClipboard);
    } else {
      // @ts-expect-error - remove the test-installed property
      delete navigator.clipboard;
    }
  });

  it("returns the URL and tooLong=false on the success path", async () => {
    const out = await shareCurrentPipeline(samplePipeline);
    expect(out.tooLong).toBe(false);
    expect(out.url).toContain("#pipeline=");
  });

  it("mirrors the hash to history.replaceState before returning", async () => {
    await shareCurrentPipeline(samplePipeline);
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(String(replaceStateSpy.mock.calls[0][2])).toMatch(/^#pipeline=/);
  });

  it("never touches the clipboard (copy is owned by the dialog)", async () => {
    await shareCurrentPipeline(samplePipeline);
    expect(writeText).not.toHaveBeenCalled();
  });

  it("skips replaceState on the tooLong path but still returns the URL", async () => {
    const big: SerializedPipeline = {
      version: 3,
      nodes: Array.from({ length: 800 }, (_, i) => ({
        id: `n-${i}`,
        type: "load_structure",
        position: { x: i, y: i },
        enabled: true,
        fileName: `${i}-${Math.random().toString(36).repeat(5)}-${"x".repeat(30)}`,
        hasTrajectory: false,
        hasCell: false,
      })) as SerializedPipeline["nodes"],
      edges: [],
    };
    const out = await shareCurrentPipeline(big);
    expect(out.tooLong).toBe(true);
    expect(out.url).toContain("#pipeline=");
    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });
});

describe("restorePipelineFromHash", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("returns false and skips deserialize when no hash is present", async () => {
    const deserialize = vi.fn();
    const restored = await restorePipelineFromHash(deserialize);
    expect(restored).toBe(false);
    expect(deserialize).not.toHaveBeenCalled();
  });

  it("returns false when hash payload is malformed", async () => {
    window.location.hash = "pipeline=!!!not-base64!!!";
    const deserialize = vi.fn();
    const restored = await restorePipelineFromHash(deserialize);
    expect(restored).toBe(false);
    expect(deserialize).not.toHaveBeenCalled();
  });

  it("returns true and calls deserialize on a valid hash", async () => {
    const { url } = await buildShareUrl(samplePipeline);
    window.location.hash = url.slice(url.indexOf("#") + 1);

    const deserialize = vi.fn();
    const restored = await restorePipelineFromHash(deserialize);
    expect(restored).toBe(true);
    expect(deserialize).toHaveBeenCalledTimes(1);
    const arg = deserialize.mock.calls[0][0];
    expect(arg.version).toBe(3);
    expect(arg.nodes).toHaveLength(2);
  });

  it("returns false when the deserializer throws", async () => {
    const { url } = await buildShareUrl(samplePipeline);
    window.location.hash = url.slice(url.indexOf("#") + 1);

    const deserialize = vi.fn(() => {
      throw new Error("bad pipeline");
    });
    const restored = await restorePipelineFromHash(deserialize);
    expect(restored).toBe(false);
    expect(deserialize).toHaveBeenCalledTimes(1);
  });
});

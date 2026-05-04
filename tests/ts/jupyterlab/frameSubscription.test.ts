import { describe, it, expect, vi } from "vitest";
import {
  createFrameSubscription,
  createSubscription,
} from "../../../jupyterlab-megane/src/frameSubscription";

describe("createFrameSubscription", () => {
  it("calls listener when emit is called", () => {
    const sub = createFrameSubscription();
    const received: number[] = [];
    sub.subscribe((f) => received.push(f));
    sub.emit(42);
    expect(received).toEqual([42]);
  });

  it("calls listener multiple times", () => {
    const sub = createFrameSubscription();
    const received: number[] = [];
    sub.subscribe((f) => received.push(f));
    sub.emit(1);
    sub.emit(2);
    sub.emit(3);
    expect(received).toEqual([1, 2, 3]);
  });

  it("unsubscribes correctly", () => {
    const sub = createFrameSubscription();
    const received: number[] = [];
    const unsub = sub.subscribe((f) => received.push(f));
    sub.emit(1);
    unsub();
    sub.emit(2);
    expect(received).toEqual([1]);
  });

  it("unsubscribing is idempotent", () => {
    const sub = createFrameSubscription();
    const received: number[] = [];
    const unsub = sub.subscribe((f) => received.push(f));
    unsub();
    unsub();
    sub.emit(99);
    expect(received).toEqual([]);
  });

  it("notifies multiple listeners independently", () => {
    const sub = createFrameSubscription();
    const a: number[] = [];
    const b: number[] = [];
    sub.subscribe((f) => a.push(f));
    sub.subscribe((f) => b.push(f));
    sub.emit(7);
    expect(a).toEqual([7]);
    expect(b).toEqual([7]);
  });

  it("removing one listener does not affect others", () => {
    const sub = createFrameSubscription();
    const a: number[] = [];
    const b: number[] = [];
    const unsubA = sub.subscribe((f) => a.push(f));
    sub.subscribe((f) => b.push(f));
    unsubA();
    sub.emit(5);
    expect(a).toEqual([]);
    expect(b).toEqual([5]);
  });

  it("swallows listener errors and continues calling remaining listeners", () => {
    const sub = createFrameSubscription();
    const received: number[] = [];
    sub.subscribe(() => {
      throw new Error("oops");
    });
    sub.subscribe((f) => received.push(f));
    expect(() => sub.emit(1)).not.toThrow();
    expect(received).toEqual([1]);
  });

  it("handles emit with no listeners without throwing", () => {
    const sub = createFrameSubscription();
    expect(() => sub.emit(0)).not.toThrow();
  });

  it("returns a function from subscribe", () => {
    const sub = createFrameSubscription();
    const unsub = sub.subscribe(vi.fn());
    expect(typeof unsub).toBe("function");
  });
});

describe("createSubscription (generic)", () => {
  it("works with object payloads", () => {
    const sub = createSubscription<{ atoms: number[] }>();
    const received: { atoms: number[] }[] = [];
    sub.subscribe((v) => received.push(v));
    sub.emit({ atoms: [1, 2, 3] });
    expect(received).toEqual([{ atoms: [1, 2, 3] }]);
  });

  it("works with nullable payloads", () => {
    const sub = createSubscription<string | null>();
    const received: (string | null)[] = [];
    sub.subscribe((v) => received.push(v));
    sub.emit("hello");
    sub.emit(null);
    expect(received).toEqual(["hello", null]);
  });

  it("unsubscribes correctly", () => {
    const sub = createSubscription<number>();
    const received: number[] = [];
    const unsub = sub.subscribe((v) => received.push(v));
    sub.emit(1);
    unsub();
    sub.emit(2);
    expect(received).toEqual([1]);
  });

  it("swallows listener errors", () => {
    const sub = createSubscription<number>();
    const received: number[] = [];
    sub.subscribe(() => {
      throw new Error("boom");
    });
    sub.subscribe((v) => received.push(v));
    expect(() => sub.emit(5)).not.toThrow();
    expect(received).toEqual([5]);
  });

  it("createFrameSubscription delegates to createSubscription", () => {
    const sub = createFrameSubscription();
    const received: number[] = [];
    sub.subscribe((f) => received.push(f));
    sub.emit(7);
    expect(received).toEqual([7]);
  });
});

export interface Subscription<T> {
  subscribe(listener: (value: T) => void): () => void;
  emit(value: T): void;
}

export function createSubscription<T>(): Subscription<T> {
  const listeners = new Set<(value: T) => void>();
  return {
    subscribe(listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    emit(value): void {
      for (const cb of listeners) {
        try {
          cb(value);
        } catch {
          // swallow listener errors so one bad listener doesn't block others
        }
      }
    },
  };
}

/** Backward-compatible alias for frame-index subscriptions. */
export type FrameSubscription = Subscription<number>;
export function createFrameSubscription(): FrameSubscription {
  return createSubscription<number>();
}

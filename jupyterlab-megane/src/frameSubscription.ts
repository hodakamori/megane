type FrameListener = (frame: number) => void;

export interface FrameSubscription {
  subscribe(listener: FrameListener): () => void;
  emit(frame: number): void;
}

export function createFrameSubscription(): FrameSubscription {
  const listeners = new Set<FrameListener>();
  return {
    subscribe(listener: FrameListener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    emit(frame: number): void {
      for (const cb of listeners) {
        try {
          cb(frame);
        } catch {
          // swallow listener errors so one bad listener doesn't block others
        }
      }
    },
  };
}

/**
 * React hook that wires the tour into a host. It runs the auto-start gate once
 * per session (per host) and exposes `startTour` for manual triggers like the
 * Pipeline header Guide button.
 */
import { useCallback, useEffect } from "react";
import { startTour, stopTour } from "./MeganeTour";
import { shouldAutoStart, useTourStore, type TourHost } from "./tourStore";

interface UseTourOptions {
  host: TourHost;
  /** Delay before auto-start so the highlighted DOM has settled. */
  autoStartDelayMs?: number;
}

export function useTour({ host, autoStartDelayMs = 600 }: UseTourOptions) {
  const setHost = useTourStore((s) => s.setHost);
  const autoStartHandled = useTourStore((s) => s.autoStartHandled);
  const markAutoStartHandled = useTourStore((s) => s.markAutoStartHandled);

  useEffect(() => {
    setHost(host);
  }, [host, setHost]);

  useEffect(() => {
    if (autoStartHandled) return;
    const { dontShowAgain } = useTourStore.getState();
    if (!shouldAutoStart(host, dontShowAgain)) {
      markAutoStartHandled();
      return;
    }
    const timer = window.setTimeout(() => {
      markAutoStartHandled();
      startTour();
    }, autoStartDelayMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [host, autoStartHandled, markAutoStartHandled, autoStartDelayMs]);

  useEffect(() => {
    return () => {
      stopTour();
    };
  }, []);

  const start = useCallback(() => {
    startTour();
  }, []);

  return { startTour: start };
}

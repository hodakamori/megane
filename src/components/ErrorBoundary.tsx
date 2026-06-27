/**
 * React error boundary.
 *
 * Without a boundary, any exception thrown while rendering or mounting a child
 * (e.g. three.js failing to create a WebGL context in a VSCode window with
 * hardware acceleration disabled) unmounts the *entire* React tree, leaving a
 * blank white webview — pipeline editor and all. This boundary contains such
 * failures and renders an actionable message instead, so the rest of the host
 * UI (where mounted around a subtree) keeps working and the user can see why.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Short label for what failed, e.g. "3D viewer". Shown in the fallback. */
  label?: string;
  /** Optional custom fallback renderer; receives the caught error. */
  fallback?: (error: Error) => ReactNode;
  /** Invoked once when an error is caught (for host-side logging/telemetry). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Surface to the console so it shows up in the webview devtools, and let
    // the host hook in (status bar, telemetry) if it wants.
    console.error("megane ErrorBoundary caught:", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  render(): ReactNode {
    const { error } = this.state;
    if (error) {
      if (this.props.fallback) return this.props.fallback(error);
      return (
        <div
          role="alert"
          data-testid="megane-error-boundary"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            minHeight: "120px",
            padding: "24px",
            textAlign: "center",
            gap: "10px",
            color: "#ef4444",
            fontSize: "14px",
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {this.props.label ? `${this.props.label} failed to load` : "Something went wrong"}
          </div>
          <div
            style={{
              color: "var(--megane-text-secondary, #6b7280)",
              maxWidth: "460px",
              wordBreak: "break-word",
              lineHeight: 1.5,
            }}
          >
            {error.message}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

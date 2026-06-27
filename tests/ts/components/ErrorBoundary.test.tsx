import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Test helper that throws on render with a configurable message. */
function Boom({ message }: { message: string }): never {
  throw new Error(message);
}

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">all good</div>
      </ErrorBoundary>,
    );
    expect(screen.getByTestId("child")).toBeTruthy();
    expect(screen.queryByTestId("megane-error-boundary")).toBeNull();
  });

  it("catches a render error and shows the fallback instead of unmounting", () => {
    // Silence the expected React error logging for this case.
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom message="kaboom in render" />
      </ErrorBoundary>,
    );
    const fallback = screen.getByTestId("megane-error-boundary");
    expect(fallback).toBeTruthy();
    // The underlying message is surfaced to the user.
    expect(fallback.textContent).toContain("kaboom in render");
  });

  it("shows the WebGL-specific hint when the error is a WebGL context failure", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom message="Error creating WebGL context." />
      </ErrorBoundary>,
    );
    const fallback = screen.getByTestId("megane-error-boundary");
    expect(fallback.getAttribute("data-webgl")).toBe("true");
    expect(fallback.textContent).toContain("WebGL is unavailable");
    expect(fallback.textContent?.toLowerCase()).toContain("hardware acceleration");
  });

  it("uses the generic message for non-WebGL errors", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom message="some parser blew up" />
      </ErrorBoundary>,
    );
    const fallback = screen.getByTestId("megane-error-boundary");
    expect(fallback.getAttribute("data-webgl")).toBe("false");
    expect(fallback.textContent).toContain("Something went wrong");
  });

  it("logs the error so it is discoverable in devtools", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <Boom message="visible in console" />
      </ErrorBoundary>,
    );
    expect(spy).toHaveBeenCalledWith(
      "megane: viewer crashed",
      expect.any(Error),
      expect.anything(),
    );
  });
});

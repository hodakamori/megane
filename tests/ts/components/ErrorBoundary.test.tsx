import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

afterEach(cleanup);

function Boom({ message }: { message: string }): never {
  throw new Error(message);
}

describe("ErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    const { getByText, queryByTestId } = render(
      <ErrorBoundary>
        <div>healthy child</div>
      </ErrorBoundary>,
    );
    expect(getByText("healthy child")).toBeTruthy();
    expect(queryByTestId("megane-error-boundary")).toBeNull();
  });

  it("catches a child render throw and shows the error message instead of unmounting", () => {
    // Silence the expected React error logging for this case.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getByTestId, getByText } = render(
      <ErrorBoundary label="3D viewer">
        <Boom message="WebGL is unavailable in this window" />
      </ErrorBoundary>,
    );
    expect(getByTestId("megane-error-boundary")).toBeTruthy();
    expect(getByText("3D viewer failed to load")).toBeTruthy();
    expect(getByText(/WebGL is unavailable in this window/)).toBeTruthy();
    spy.mockRestore();
  });

  it("invokes onError with the caught error", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Boom message="kaboom" />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect((onError.mock.calls[0][0] as Error).message).toBe("kaboom");
    spy.mockRestore();
  });

  it("renders a custom fallback when provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getByText, queryByTestId } = render(
      <ErrorBoundary fallback={(e) => <div>custom: {e.message}</div>}>
        <Boom message="oops" />
      </ErrorBoundary>,
    );
    expect(getByText("custom: oops")).toBeTruthy();
    // Default fallback markup is not used when a custom one is supplied.
    expect(queryByTestId("megane-error-boundary")).toBeNull();
    spy.mockRestore();
  });
});

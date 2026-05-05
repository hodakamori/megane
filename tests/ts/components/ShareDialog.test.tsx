import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor, act } from "@testing-library/react";
import { ShareDialog } from "@/components/ShareDialog";

afterEach(() => {
  cleanup();
});

describe("ShareDialog", () => {
  it("renders nothing when open=false", () => {
    const { container } = render(
      <ShareDialog open={false} url="http://x/#pipeline=abc" tooLong={false} onClose={() => {}} />,
    );
    expect(container.querySelector("[data-testid='share-dialog']")).toBeNull();
  });

  it("renders a read-only input containing the URL when open", () => {
    render(
      <ShareDialog open url="http://x/#pipeline=abc" tooLong={false} onClose={() => {}} />,
    );
    const input = screen.getByTestId("share-dialog-url-input") as HTMLInputElement;
    expect(input.value).toBe("http://x/#pipeline=abc");
    expect(input.readOnly).toBe(true);
  });

  it("selects the full URL when the input is clicked", () => {
    render(
      <ShareDialog open url="http://x/#pipeline=abcdef" tooLong={false} onClose={() => {}} />,
    );
    const input = screen.getByTestId("share-dialog-url-input") as HTMLInputElement;
    fireEvent.click(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe("http://x/#pipeline=abcdef".length);
  });

  it("invokes the injected copy function with the URL and shows 'Copied!'", async () => {
    const copy = vi.fn().mockResolvedValue("copied" as const);
    render(
      <ShareDialog
        open
        url="http://x/#pipeline=abc"
        tooLong={false}
        onClose={() => {}}
        copy={copy}
      />,
    );
    fireEvent.click(screen.getByTestId("share-dialog-copy"));
    await waitFor(() => {
      expect(copy).toHaveBeenCalledWith("http://x/#pipeline=abc");
    });
    const btn = await screen.findByTestId("share-dialog-copy");
    await waitFor(() => {
      expect(btn.textContent).toContain("Copied!");
      expect(btn.getAttribute("data-state")).toBe("copied");
    });
  });

  it("shows 'Copy failed' when the copy function returns failed", async () => {
    const copy = vi.fn().mockResolvedValue("failed" as const);
    render(
      <ShareDialog
        open
        url="http://x/#pipeline=abc"
        tooLong={false}
        onClose={() => {}}
        copy={copy}
      />,
    );
    fireEvent.click(screen.getByTestId("share-dialog-copy"));
    const btn = await screen.findByTestId("share-dialog-copy");
    await waitFor(() => {
      expect(btn.textContent).toContain("Copy failed");
      expect(btn.getAttribute("data-state")).toBe("failed");
    });
  });

  it("reverts the copy label to 'Copy link' after 2.5 s", async () => {
    vi.useFakeTimers();
    try {
      const copy = vi.fn().mockResolvedValue("copied" as const);
      render(
        <ShareDialog
          open
          url="http://x/#pipeline=abc"
          tooLong={false}
          onClose={() => {}}
          copy={copy}
        />,
      );
      fireEvent.click(screen.getByTestId("share-dialog-copy"));
      // Drain pending microtasks so the awaited copy() resolves.
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      const btn = screen.getByTestId("share-dialog-copy");
      expect(btn.getAttribute("data-state")).toBe("copied");
      act(() => {
        vi.advanceTimersByTime(2500);
      });
      expect(btn.getAttribute("data-state")).toBe("idle");
      expect(btn.textContent).toContain("Copy link");
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<ShareDialog open url="http://x/#pipeline=abc" tooLong={false} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on backdrop click but not on panel click", () => {
    const onClose = vi.fn();
    render(<ShareDialog open url="http://x/#pipeline=abc" tooLong={false} onClose={onClose} />);

    fireEvent.click(screen.getByTestId("share-dialog"));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("share-dialog-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the × button is clicked", () => {
    const onClose = vi.fn();
    render(<ShareDialog open url="http://x/#pipeline=abc" tooLong={false} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("share-dialog-close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders the warning and disables Copy when tooLong=true", () => {
    render(<ShareDialog open url="http://x/#pipeline=zzz" tooLong onClose={() => {}} />);
    expect(screen.getByTestId("share-dialog-warning")).toBeTruthy();
    const copyBtn = screen.getByTestId("share-dialog-copy") as HTMLButtonElement;
    expect(copyBtn.disabled).toBe(true);
  });

  it("does not invoke copy when tooLong=true even if the button is clicked", () => {
    const copy = vi.fn();
    render(
      <ShareDialog open url="http://x/#pipeline=zzz" tooLong onClose={() => {}} copy={copy} />,
    );
    fireEvent.click(screen.getByTestId("share-dialog-copy"));
    expect(copy).not.toHaveBeenCalled();
  });

  it("'Open in new tab' anchor has correct href / target / rel", () => {
    render(
      <ShareDialog open url="http://x/#pipeline=abc" tooLong={false} onClose={() => {}} />,
    );
    const anchor = screen.getByTestId("share-dialog-open-tab") as HTMLAnchorElement;
    expect(anchor.getAttribute("href")).toBe("http://x/#pipeline=abc");
    expect(anchor.getAttribute("target")).toBe("_blank");
    expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("uses the real copyShareUrl when the copy prop is omitted", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    try {
      render(
        <ShareDialog open url="http://x/#pipeline=abc" tooLong={false} onClose={() => {}} />,
      );
      fireEvent.click(screen.getByTestId("share-dialog-copy"));
      await waitFor(() => {
        expect(writeText).toHaveBeenCalledWith("http://x/#pipeline=abc");
      });
    } finally {
      if (original) {
        Object.defineProperty(navigator, "clipboard", original);
      } else {
        // @ts-expect-error - remove the test-installed property
        delete navigator.clipboard;
      }
    }
  });
});

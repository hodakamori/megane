/**
 * Shared UI components and styles for sidebar panels.
 */

import { useCallback, useRef } from "react";

export const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

export const smallBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "3px 17px",
  cursor: "pointer",
  fontSize: 19,
  fontWeight: 500,
  color: "#64748b",
  transition: "all 0.15s",
};

export const activeBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  background: "rgba(59, 130, 246, 0.08)",
  borderColor: "rgba(59, 130, 246, 0.25)",
  color: "#3b82f6",
};

export const fileNameStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: "#1e293b",
  wordBreak: "break-all",
};

export const statsStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginTop: 2,
};

export const placeholderStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  fontStyle: "italic",
};

export function matchesAccept(name: string, exts: string[]): boolean {
  const lower = name.toLowerCase();
  return exts.some((ext) => lower.endsWith(ext));
}

export function DropZone({
  accept,
  exts,
  onFile,
  label,
  children,
}: {
  accept: string;
  exts: string[];
  onFile: (file: File) => void;
  label: string;
  children: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      const match = files.find((f) => matchesAccept(f.name, exts));
      if (match) onFile(match);
    },
    [exts, onFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const match = Array.from(files).find((f) => matchesAccept(f.name, exts));
      if (match) onFile(match);
      e.target.value = "";
    },
    [exts, onFile],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ minHeight: 0 }}
    >
      {children}
      <button
        onClick={() => inputRef.current?.click()}
        style={{ ...smallBtnStyle, marginTop: 10 }}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

/** Tab-style selector for 2-4 options. */
export function TabSelector<T extends string>({
  options,
  value,
  onChange,
  disabledOptions,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabledOptions?: Set<T>;
}) {
  return (
    <div
      style={{
        display: "flex",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        marginBottom: 10,
      }}
    >
      {options.map((opt, idx) => {
        const isActive = opt.value === value;
        const isDisabled = disabledOptions?.has(opt.value) ?? false;
        return (
          <button
            key={opt.value}
            onClick={isActive || isDisabled ? undefined : () => onChange(opt.value)}
            style={{
              flex: 1,
              background: isActive ? "rgba(59,130,246,0.08)" : "none",
              border: "none",
              borderRight: idx < options.length - 1 ? "1px solid #e2e8f0" : "none",
              padding: "7px 0",
              cursor: isActive || isDisabled ? "default" : "pointer",
              fontSize: 19,
              fontWeight: 500,
              color: isDisabled ? "#cbd5e1" : isActive ? "#3b82f6" : "#94a3b8",
              transition: "all 0.15s",
            }}
            disabled={isDisabled}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

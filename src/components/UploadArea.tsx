/**
 * Full-viewport drop zone for uploading PDB files.
 * Shown when no structure is loaded yet.
 */

import { useCallback, useRef, useState } from "react";

interface UploadAreaProps {
  onUpload: (pdb: File, xtc?: File) => void;
}

export function UploadArea({ onUpload }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      const pdb = files.find((f) =>
        f.name.toLowerCase().endsWith(".pdb"),
      );
      const xtc = files.find((f) =>
        f.name.toLowerCase().endsWith(".xtc"),
      );
      if (pdb) onUpload(pdb, xtc);
    },
    [onUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const pdb = Array.from(files).find((f) =>
        f.name.toLowerCase().endsWith(".pdb"),
      );
      if (pdb) onUpload(pdb);
    },
    [onUpload],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        zIndex: 20,
        background: dragging
          ? "rgba(66, 133, 244, 0.08)"
          : "transparent",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          padding: "40px 48px",
          textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: dragging
            ? "2px dashed #4285f4"
            : "2px dashed #dee2e6",
          transition: "border-color 0.15s",
        }}
      >
        <div
          style={{
            fontSize: 36,
            marginBottom: 12,
            opacity: 0.5,
          }}
        >
          {"\u{1F9EC}"}
        </div>
        <div
          style={{
            fontSize: 16,
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#495057",
            marginBottom: 16,
          }}
        >
          Drop a PDB file here
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            background: "#495057",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Browse Files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdb"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

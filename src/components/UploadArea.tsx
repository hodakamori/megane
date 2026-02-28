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
          ? "rgba(59, 130, 246, 0.06)"
          : "radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.04) 0%, transparent 70%)",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 20,
          padding: "48px 56px",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          border: dragging
            ? "2px dashed #3b82f6"
            : "2px dashed #e2e8f0",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "-0.02em",
            marginBottom: 8,
          }}
        >
          megane
        </div>
        <div
          style={{
            fontSize: 15,
            color: "#64748b",
            marginBottom: 20,
          }}
        >
          Drop a structure file to visualize
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(59,130,246,0.3)",
            transition: "background 0.15s",
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

import React, { useState, useEffect } from "react";

interface Props {
  src: string;
}

export default function NotebookRenderer({ src }: Props) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        setHtml(text);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [src]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--ifm-color-emphasis-600)" }}>
        Loading notebook...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--ifm-color-emphasis-600)" }}>
        Notebook not available.
      </div>
    );
  }

  return (
    <div
      className="nb-container"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

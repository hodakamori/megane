import React, { useState, useEffect } from "react";

interface Props {
  src: string;
}

export default function NotebookRenderer({ src }: Props) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        setHtml(text);
        setLoading(false);
      });
  }, [src]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "var(--ifm-color-emphasis-600)" }}>
        Loading notebook...
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

import React from "react";
import styles from "./FullViewerDemo.module.css";

interface Props {
  height?: string;
}

export default function FullViewerDemo({ height = "600px" }: Props) {
  return (
    <div className={styles.fullViewerDemo}>
      <iframe
        src="/megane/app/"
        title="megane molecular viewer"
        style={{ height }}
        frameBorder={0}
        allow="fullscreen"
        loading="lazy"
      />
    </div>
  );
}

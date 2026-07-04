import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./Figure.module.css";

/**
 * Figure — a captioned, framed screenshot for guides.
 *
 * Pairs a screenshot with a caption and consistent framing (rounded border,
 * subtle shadow, dark-mode aware). Images inside the docs `.markdown` container
 * are picked up by docusaurus-plugin-image-zoom, so clicking zooms.
 *
 * Usage in MDX:
 *
 *   import Figure from "@site/src/components/Figure";
 *
 *   <Figure src="/screenshots/pipeline-editor.png" alt="Pipeline editor"
 *           caption="The visual pipeline editor in the standalone web app." />
 *
 * `src` is resolved against the site baseUrl, so pass a path rooted at
 * docs/public/ (e.g. "/screenshots/vscode.png").
 */
interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  /** Max rendered width, e.g. "640px". Defaults to full content width. */
  maxWidth?: string;
}

export default function Figure({ src, alt, caption, maxWidth }: FigureProps) {
  const resolved = useBaseUrl(src);
  return (
    <figure className={styles.figure} style={maxWidth ? { maxWidth } : undefined}>
      <div className={styles.frame}>
        <img src={resolved} alt={alt} loading="lazy" />
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}

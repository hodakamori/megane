import React, { useState, useMemo } from "react";
import { galleryExamples } from "../gallery/registry";
import GalleryViewer from "./GalleryViewer";
import styles from "./GalleryIndex.module.css";

export default function GalleryIndex() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const ex of galleryExamples) {
      for (const t of ex.tags) set.add(t);
    }
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(
    () =>
      activeTag
        ? galleryExamples.filter((ex) => ex.tags.includes(activeTag))
        : galleryExamples,
    [activeTag]
  );

  return (
    <div className={styles.galleryIndex}>
      {allTags.length > 0 && (
        <div className={styles.tagFilter}>
          <button
            className={`${styles.filterBtn} ${activeTag === null ? styles.active : ""}`}
            aria-pressed={activeTag === null}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.filterBtn} ${activeTag === tag ? styles.active : ""}`}
              aria-pressed={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.map((example) => (
        <GalleryViewer key={example.id} example={example} />
      ))}

      {filtered.length === 0 && (
        <p className={styles.emptyState}>
          No examples match the selected tag.
        </p>
      )}
    </div>
  );
}

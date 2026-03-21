<script setup lang="ts">
import { ref, computed } from "vue";
import { galleryExamples } from "../gallery/registry";
import GalleryViewer from "./GalleryViewer.vue";

// ── Tag filter ────────────────────────────────────────────────────────────────
const allTags = computed(() => {
  const set = new Set<string>();
  for (const ex of galleryExamples) {
    for (const t of ex.tags) set.add(t);
  }
  return Array.from(set).sort();
});

const activeTag = ref<string | null>(null);

const filtered = computed(() =>
  activeTag.value
    ? galleryExamples.filter((ex) => ex.tags.includes(activeTag.value!))
    : galleryExamples
);
</script>

<template>
  <div class="gallery-index">
    <!-- Tag filter bar -->
    <div v-if="allTags.length" class="tag-filter">
      <button
        :class="['filter-btn', { active: activeTag === null }]"
        :aria-pressed="activeTag === null"
        @click="activeTag = null"
      >
        All
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        :class="['filter-btn', { active: activeTag === tag }]"
        :aria-pressed="activeTag === tag"
        @click="activeTag = activeTag === tag ? null : tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Example list -->
    <GalleryViewer
      v-for="example in filtered"
      :key="example.id"
      :example="example"
    />

    <p v-if="filtered.length === 0" class="empty-state">
      No examples match the selected tag.
    </p>
  </div>
</template>

<style scoped>
/* ── Tag filter ────────────────────────────────────────────────────────────── */
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.filter-btn {
  padding: 4px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.filter-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.filter-btn.active {
  color: var(--vp-c-bg);
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* ── Empty state ───────────────────────────────────────────────────────────── */
.empty-state {
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 40px 0;
}
</style>

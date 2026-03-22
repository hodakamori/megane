<script setup lang="ts">
import { galleryExamples } from "../gallery/registry";
</script>

<template>
  <div class="gallery-outline">
    <p class="outline-title">Examples</p>
    <ul class="outline-list">
      <li v-for="ex in galleryExamples" :key="ex.id">
        <a :href="'#' + ex.id" class="outline-link">{{ ex.title }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.gallery-outline {
  margin-bottom: 16px;
}

.outline-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
  letter-spacing: 0.01em;
}

.outline-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.outline-list li {
  margin: 0;
}

.outline-link {
  display: block;
  padding: 3px 0 3px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  line-height: 1.5;
}

.outline-link:hover {
  color: var(--vp-c-brand-1);
  border-left-color: var(--vp-c-brand-1);
}
</style>

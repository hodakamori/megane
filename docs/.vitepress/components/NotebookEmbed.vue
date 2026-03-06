<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    minHeight?: string;
  }>(),
  { minHeight: "800px" }
);

const iframe = ref<HTMLIFrameElement | null>(null);
const loading = ref(true);

function onLoad() {
  loading.value = false;
}
</script>

<template>
  <div class="notebook-embed">
    <div v-if="loading" class="notebook-loading">Loading notebook...</div>
    <iframe
      ref="iframe"
      :src="props.src"
      :style="{ minHeight: props.minHeight }"
      @load="onLoad"
      frameborder="0"
      sandbox="allow-scripts allow-same-origin"
    />
  </div>
</template>

<style scoped>
.notebook-embed {
  position: relative;
  margin: 1rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.dark .notebook-embed {
  background: #1a1a2e;
}

.notebook-embed iframe {
  width: 100%;
  border: none;
  display: block;
}

.notebook-loading {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  font-size: 14px;
}
</style>

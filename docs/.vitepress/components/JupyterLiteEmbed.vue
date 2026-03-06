<script setup lang="ts">
withDefaults(
  defineProps<{
    notebook?: string;
    height?: string;
  }>(),
  {
    notebook: "",
    height: "600px",
  }
);
</script>

<template>
  <div class="jupyterlite-embed">
    <iframe
      :src="
        notebook
          ? `https://jupyterlite.github.io/demo/lab/index.html?path=${notebook}`
          : 'https://jupyterlite.github.io/demo/lab/index.html'
      "
      :style="{ height }"
      frameborder="0"
      allow="cross-origin-isolated"
      loading="lazy"
    />
    <div class="jupyterlite-caption">
      <span>Powered by <a href="https://jupyterlite.readthedocs.io/" target="_blank">JupyterLite</a> — runs entirely in your browser</span>
    </div>
  </div>
</template>

<style scoped>
.jupyterlite-embed {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.jupyterlite-embed iframe {
  width: 100%;
  display: block;
  background: #f8f9fb;
}

.jupyterlite-caption {
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-align: center;
}

.jupyterlite-caption a {
  color: var(--vp-c-brand-1);
}
</style>

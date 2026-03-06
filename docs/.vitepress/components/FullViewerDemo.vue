<script setup lang="ts">
withDefaults(
  defineProps<{
    height?: string;
  }>(),
  {
    height: "600px",
  }
);
</script>

<template>
  <div class="full-viewer-demo">
    <iframe
      src="/megane/app/"
      :style="{ height }"
      frameborder="0"
      allow="fullscreen"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.full-viewer-demo {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.full-viewer-demo iframe {
  width: 100%;
  display: block;
  background: #fff;
}
</style>

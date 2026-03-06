<script setup>
import DefaultTheme from "vitepress/theme";
import FullViewerDemo from "../components/FullViewerDemo.vue";
import { useRoute } from "vitepress";

const { Layout } = DefaultTheme;
const route = useRoute();
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <div class="hero-viewer-wrapper">
        <FullViewerDemo height="420px" />
      </div>
    </template>
  </Layout>
</template>

<style>
.hero-viewer-wrapper {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.hero-viewer-wrapper .full-viewer-demo {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Make the hero section use more width for the viewer */
@media (min-width: 960px) {
  .VPHero .container {
    max-width: 1280px !important;
  }

  .VPHero .main {
    max-width: 480px;
  }
}

/* On mobile, shrink the viewer */
@media (max-width: 959px) {
  .hero-viewer-wrapper {
    max-width: 100%;
    padding: 0 16px;
  }
}
</style>

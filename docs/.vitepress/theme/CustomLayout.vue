<script setup>
import DefaultTheme from "vitepress/theme";
import HeroCodeTabs from "../components/HeroCodeTabs.vue";
import FullViewerDemo from "../components/FullViewerDemo.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #home-hero-info-after>
      <HeroCodeTabs />
    </template>
    <template #home-hero-image>
      <div class="hero-viewer-wrapper">
        <FullViewerDemo height="600px" />
      </div>
    </template>
  </Layout>
</template>

<style>
/*
 * Override VitePress .has-image centering.
 * We want left-aligned text on all viewports.
 */
.VPHero.has-image .container {
  text-align: left;
}

.VPHero.has-image .heading .name,
.VPHero.has-image .heading .text {
  margin: 0;
}

.VPHero.has-image .tagline {
  margin: 0;
}

.VPHero.has-image .actions {
  justify-content: flex-start;
}

/*
 * Desktop: text LEFT (default), viewer RIGHT (default)
 * VPHero default: .main order:1 (left), .image order:2 (right)
 * No order override needed — this is the layout we want.
 */

/* Hero viewer wrapper */
.hero-viewer-wrapper {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

/* Give the image column more space on desktop */
@media (min-width: 960px) {
  .VPHero.has-image .main {
    max-width: 40%;
    flex-shrink: 0;
  }

  .VPHero.has-image .image {
    flex: 1;
    min-width: 0;
  }
}

.hero-viewer-wrapper .full-viewer-demo {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/*
 * Mobile: hide viewer to avoid overlap with hero text.
 */
@media (max-width: 959px) {
  .VPHero .image {
    display: none;
  }
}
</style>

<script setup>
import DefaultTheme from "vitepress/theme";
import HeroCodeTabs from "../components/HeroCodeTabs.vue";
import MoleculeDemo from "../components/MoleculeDemo.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #home-hero-info-after>
      <HeroCodeTabs />
    </template>
    <template #home-hero-image>
      <div class="hero-molecule-wrapper">
        <MoleculeDemo
          src="/megane/data/caffeine_water.json"
          height="380px"
          :autoRotate="true"
        />
      </div>
    </template>
  </Layout>
</template>

<style>
/*
 * Override VitePress .has-image centering on mobile.
 * VPHero applies text-align:center and margin:0 auto on .has-image
 * children when < 960px. We want left-aligned on all viewports.
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

/* Hero molecule viewer (right side) */
.hero-molecule-wrapper {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.hero-molecule-wrapper .molecule-demo {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* Desktop: widen the hero container */
@media (min-width: 960px) {
  .VPHero .container {
    max-width: 1152px;
  }
}

/* Mobile: hide the 3D viewer */
@media (max-width: 959px) {
  .hero-molecule-wrapper {
    display: none;
  }
}
</style>

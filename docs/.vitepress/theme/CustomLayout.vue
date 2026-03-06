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
 * Override VitePress .has-image centering.
 * VPHero applies text-align:center and margin:0 auto on mobile.
 * We want left-aligned on all viewports.
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
 * Desktop: molecule LEFT, text RIGHT
 * Default VPHero: .main order:1 (left), .image order:2 (right)
 * We flip them.
 */
@media (min-width: 960px) {
  .VPHero .main {
    order: 2 !important;
  }

  .VPHero .image {
    order: 1 !important;
  }
}

/* Hero molecule viewer */
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

/*
 * Mobile: hide molecule demo to avoid overlap with hero text.
 * The image slot has negative margins designed for logos, not 3D viewers.
 */
@media (max-width: 959px) {
  .VPHero .image {
    display: none;
  }
}
</style>

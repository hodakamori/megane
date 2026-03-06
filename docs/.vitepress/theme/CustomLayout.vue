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

/* Make the hero section use more width */
@media (min-width: 960px) {
  .VPHero .container {
    max-width: 1280px !important;
  }

  .VPHero .main {
    max-width: 520px;
  }
}

/* On mobile, hide the 3D viewer */
@media (max-width: 959px) {
  .hero-molecule-wrapper {
    display: none;
  }
}
</style>

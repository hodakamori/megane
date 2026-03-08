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
        <div class="hero-viewer-desktop">
          <FullViewerDemo height="600px" />
        </div>
        <div class="hero-viewer-mobile">
          <div class="mobile-demo-card">
            <div class="mobile-demo-icon">&#x1F9EA;</div>
            <p class="mobile-demo-text">Interactive 3D molecular viewer</p>
            <a href="/megane/demo" class="mobile-demo-button">Try Demo</a>
          </div>
        </div>
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
    padding-right: 32px;
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

/* Desktop: show viewer, hide mobile card */
.hero-viewer-desktop {
  display: block;
}
.hero-viewer-mobile {
  display: none;
}

/*
 * Mobile: hide viewer, show demo card instead.
 */
@media (max-width: 959px) {
  .hero-viewer-desktop {
    display: none;
  }
  .hero-viewer-mobile {
    display: block;
  }

  .mobile-demo-card {
    text-align: center;
    padding: 32px 24px;
    border-radius: 12px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
  }

  .mobile-demo-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .mobile-demo-text {
    color: var(--vp-c-text-2);
    margin-bottom: 16px;
    font-size: 0.95rem;
  }

  .mobile-demo-button {
    display: inline-block;
    padding: 8px 24px;
    border-radius: 20px;
    background: var(--vp-c-brand-1);
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: background 0.2s;
  }

  .mobile-demo-button:hover {
    background: var(--vp-c-brand-2);
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps<{ src: string }>();

const html = ref("");
const loading = ref(true);

onMounted(async () => {
  const res = await fetch(props.src);
  html.value = await res.text();
  loading.value = false;
});
</script>

<template>
  <div v-if="loading" class="nb-loading">Loading notebook...</div>
  <div v-else class="nb-container" v-html="html" />
</template>

<style scoped>
.nb-loading {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
}
</style>

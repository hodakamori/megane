<script setup lang="ts">
withDefaults(
  defineProps<{
    /** The execution counter, e.g. "1", "2" */
    n?: string;
    /** Whether this cell has output (adds output container below) */
    hasOutput?: boolean;
  }>(),
  {
    n: "",
    hasOutput: true,
  }
);
</script>

<template>
  <div class="nb-cell">
    <div class="nb-input">
      <div class="nb-prompt nb-prompt-in">
        <span v-if="n">In [{{ n }}]:</span>
      </div>
      <div class="nb-source">
        <slot name="code" />
      </div>
    </div>
    <div v-if="hasOutput" class="nb-output">
      <div class="nb-prompt nb-prompt-out">
        <span v-if="n">Out[{{ n }}]:</span>
      </div>
      <div class="nb-result">
        <slot name="output" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nb-cell {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.nb-input {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
}

.nb-output {
  display: flex;
}

.nb-prompt {
  flex-shrink: 0;
  width: 80px;
  padding: 12px 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  text-align: right;
  user-select: none;
}

.nb-prompt-in {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.04);
}

.nb-prompt-out {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.04);
}

:root.dark .nb-prompt-in {
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.06);
}

:root.dark .nb-prompt-out {
  color: #f87171;
  background: rgba(248, 113, 113, 0.06);
}

.nb-source {
  flex: 1;
  min-width: 0;
  overflow-x: auto;
}

/* Override VitePress code block styles inside notebook cells */
.nb-source :deep(div[class*="language-"]) {
  margin: 0 !important;
  border-radius: 0 !important;
  border: none !important;
}

.nb-source :deep(div[class*="language-"] > button) {
  /* Hide copy button in notebook cells for cleaner look */
  display: none;
}

.nb-result {
  flex: 1;
  min-width: 0;
  padding: 4px 0;
}

/* Text output styling */
.nb-result :deep(.nb-text-output) {
  padding: 8px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
}

/* Widget output - remove extra padding for MoleculeDemo */
.nb-result :deep(.molecule-demo) {
  margin: 0;
  border: none;
  border-radius: 0;
}
</style>

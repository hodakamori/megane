<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createHighlighter } from "shiki";

interface CellOutput {
  output_type: "text" | "image";
  text?: string;
  src?: string;
}

interface NotebookCell {
  cell_type: "markdown" | "code";
  html?: string;
  source?: string;
  execution_count?: number | null;
  outputs?: CellOutput[];
}

const props = defineProps<{ src: string }>();

const cells = ref<NotebookCell[]>([]);
const highlightedCells = ref<Map<number, string>>(new Map());
const loading = ref(true);

onMounted(async () => {
  const res = await fetch(props.src);
  const data = await res.json();
  cells.value = data.cells;
  loading.value = false;

  // Highlight code cells with shiki (async, upgrades after load)
  try {
    const highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: ["python"],
    });

    const map = new Map<number, string>();
    cells.value.forEach((cell, i) => {
      if (cell.cell_type === "code" && cell.source) {
        map.set(
          i,
          highlighter.codeToHtml(cell.source, {
            lang: "python",
            themes: { light: "github-light", dark: "github-dark" },
          })
        );
      }
    });
    highlightedCells.value = map;
  } catch {
    // Fallback: plain text code blocks
  }
});
</script>

<template>
  <div v-if="loading" class="nb-loading">Loading notebook...</div>
  <div v-else class="nb-renderer">
    <template v-for="(cell, idx) in cells" :key="idx">
      <!-- Markdown cell -->
      <div
        v-if="cell.cell_type === 'markdown'"
        class="vp-doc nb-markdown"
        v-html="cell.html"
      />

      <!-- Code cell -->
      <div v-else class="nb-cell">
        <div class="nb-input">
          <div class="nb-prompt nb-prompt-in">
            <span v-if="cell.execution_count">In [{{ cell.execution_count }}]:</span>
          </div>
          <div class="nb-source">
            <div
              v-if="highlightedCells.get(idx)"
              v-html="highlightedCells.get(idx)"
            />
            <pre v-else><code>{{ cell.source }}</code></pre>
          </div>
        </div>
        <div
          v-if="cell.outputs && cell.outputs.length > 0"
          class="nb-output"
        >
          <div class="nb-prompt nb-prompt-out">
            <span v-if="cell.execution_count">Out[{{ cell.execution_count }}]:</span>
          </div>
          <div class="nb-result">
            <template v-for="(output, oi) in cell.outputs" :key="oi">
              <pre
                v-if="output.output_type === 'text'"
                class="nb-text-output"
              >{{ output.text }}</pre>
              <img
                v-else-if="output.output_type === 'image'"
                :src="output.src"
                class="nb-image-output"
                alt="Widget output"
              />
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.nb-loading {
  padding: 2rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.nb-renderer {
  margin: 1rem 0;
}

/* Markdown cells blend with VitePress prose */
.nb-markdown {
  margin: 1.5rem 0;
}

.nb-markdown :deep(h1) {
  display: none; /* Hide notebook title — page already has one */
}

/* Code cells */
.nb-cell {
  margin: 12px 0;
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

/* Shiki highlighted code */
.nb-source :deep(pre) {
  margin: 0 !important;
  padding: 12px 16px !important;
  border-radius: 0 !important;
  background: transparent !important;
  font-size: 0.85rem;
  line-height: 1.6;
}

.nb-source :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
}

/* Plain code fallback */
.nb-source > pre {
  margin: 0;
  padding: 12px 16px;
  background: transparent;
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.nb-result {
  flex: 1;
  min-width: 0;
  padding: 4px 0;
}

.nb-text-output {
  margin: 0;
  padding: 8px 16px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
  background: transparent;
}

.nb-image-output {
  display: block;
  max-width: 100%;
  margin: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
}
</style>

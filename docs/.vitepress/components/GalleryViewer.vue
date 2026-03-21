<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { GalleryExample } from "../gallery/types";
import type { NodeSnapshotData } from "../../../src/pipeline/execute";

const props = defineProps<{ example: GalleryExample }>();

// ── 3D preview ────────────────────────────────────────────────────────────────
const container = ref<HTMLElement | null>(null);
let renderer: any = null;
let unmounted = false;
let observer: IntersectionObserver | null = null;
let animTimerId: ReturnType<typeof setTimeout> | null = null;

// Animation state — populated when frames are available in the snapshot
type PreviewFrame = { frameId: number; nAtoms: number; positions: Float32Array };
let previewFrames: PreviewFrame[] | null = null;
const playing      = ref(false);
const currentFrame = ref(0);
const totalFrames  = ref(0);

async function initPreview() {
  if (!container.value) return;

  const { MoleculeRenderer } = await import(
    "../../../src/renderer/MoleculeRenderer"
  );
  // Guard: component may have unmounted during the dynamic import await
  if (unmounted || !container.value) return;

  renderer = new MoleculeRenderer();
  renderer.mount(container.value);

  try {
    const res = await fetch(props.example.snapshotUrl);
    if (!res.ok) {
      console.error(
        "Failed to load gallery snapshot:",
        props.example.snapshotUrl,
        "status:",
        res.status,
      );
      return;
    }
    if (unmounted) return;
    const data = await res.json();
    if (unmounted) return;

    const snapshot = {
      nAtoms: data.nAtoms,
      nBonds: data.nBonds,
      nFileBonds: data.nFileBonds,
      positions: new Float32Array(data.positions),
      elements: new Uint8Array(data.elements),
      bonds: new Uint32Array(data.bonds),
      bondOrders: data.bondOrders ? new Uint8Array(data.bondOrders) : null,
      box: data.box ? new Float32Array(data.box) : null,
    };

    // Load base structure first
    renderer.loadSnapshot(snapshot);

    // Execute the pipeline defined in the vscode code snippet
    const { deserializePipeline } = await import("../../../src/pipeline/serialize");
    const { executePipeline } = await import("../../../src/pipeline/execute");
    const { applyViewportState } = await import("../../../src/pipeline/apply");
    if (unmounted) return;

    const pipeline = JSON.parse(props.example.code.vscode);
    const { nodes, edges } = deserializePipeline(pipeline);

    // Map all load_structure nodes to the fetched snapshot
    const nodeSnapshots: Record<string, NodeSnapshotData> = {};
    for (const node of nodes) {
      if (node.type === "load_structure") {
        nodeSnapshots[node.id] = { snapshot, frames: null, meta: null, labels: null };
      }
    }

    // Inject embedded trajectory frames and vector data when present in snapshot JSON
    const fileFrames = data.frames?.map((f: any, i: number) => ({
      frameId: i,
      nAtoms: f.nAtoms,
      positions: new Float32Array(f.positions),
    })) ?? undefined;
    const fileMeta = data.meta ?? undefined;
    const fileVectors = data.vectors
      ? [{ frame: 0, vectors: new Float32Array(data.vectors) }]
      : undefined;

    const { viewportState } = executePipeline(nodes, edges, {
      nodeSnapshots,
      fileFrames,
      fileMeta,
      fileVectors,
    });
    applyViewportState(renderer, viewportState, null);

    // If snapshot has embedded frames, wire up animation
    if (fileFrames && fileFrames.length > 0) {
      previewFrames      = fileFrames;
      totalFrames.value  = fileFrames.length;
      currentFrame.value = 0;
      renderer.updateFrame(fileFrames[0]); // show frame 0 immediately
      startAnimation();                     // auto-play
    }
  } catch (error) {
    console.error(
      "Error loading gallery snapshot:",
      props.example.snapshotUrl,
      error,
    );
  }
}

// ── Animation controls ────────────────────────────────────────────────────────
function stopAnimation() {
  if (animTimerId !== null) { clearTimeout(animTimerId); animTimerId = null; }
  playing.value = false;
}

function startAnimation() {
  if (!previewFrames || previewFrames.length === 0 || unmounted) return;
  playing.value = true;
  const tick = () => {
    if (unmounted || !playing.value) return;
    currentFrame.value = (currentFrame.value + 1) % previewFrames!.length;
    renderer.updateFrame(previewFrames![currentFrame.value]);
    animTimerId = setTimeout(tick, 1000 / 15);
  };
  animTimerId = setTimeout(tick, 1000 / 15);
}

function togglePlay() {
  if (playing.value) stopAnimation(); else startAnimation();
}

onMounted(() => {
  if (!container.value) return;

  // Defer heavy work (renderer init, fetch, pipeline execution) until the
  // card actually enters the viewport — avoids blocking the main thread for
  // all examples on initial page load.
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        observer!.disconnect();
        observer = null;
        initPreview();
      }
    },
    { rootMargin: "200px" }, // start loading slightly before it scrolls in
  );
  observer.observe(container.value);
});

onBeforeUnmount(() => {
  unmounted = true;
  if (animTimerId !== null) {
    clearTimeout(animTimerId);
    animTimerId = null;
  }
  observer?.disconnect();
  observer = null;
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  clearCopyTimer();
});

// ── Code tabs ─────────────────────────────────────────────────────────────────
type TabId = "jupyter" | "react" | "vscode";
const tabs: { id: TabId; label: string }[] = [
  { id: "jupyter", label: "Jupyter"  },
  { id: "react",   label: "React"    },
  { id: "vscode",  label: "VSCode"   },
];
const activeTab = ref<TabId>("jupyter");

// ── Copy to clipboard ─────────────────────────────────────────────────────────
const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | null = null;

function clearCopyTimer() {
  if (copyTimer !== null) {
    clearTimeout(copyTimer);
    copyTimer = null;
  }
}

async function copyCode() {
  const code = props.example.code[activeTab.value];
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // Fallback for non-secure contexts or denied permissions
    try {
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    } catch {
      return; // silent — copy just won't show feedback
    }
  }
  clearCopyTimer();
  copied.value = true;
  copyTimer = setTimeout(() => {
    copied.value = false;
    copyTimer = null;
  }, 1500);
}
</script>

<template>
  <div class="gallery-item" :id="example.id">
    <!-- Header -->
    <div class="gallery-header">
      <div class="gallery-title-row">
        <h3 class="gallery-title">{{ example.title }}</h3>
        <div class="gallery-tags">
          <span v-for="tag in example.tags" :key="tag" class="gallery-tag">
            {{ tag }}
          </span>
        </div>
      </div>
      <p class="gallery-description">{{ example.description }}</p>
    </div>

    <!-- Layout: preview left, code right (stacks on small screens) -->
    <div class="gallery-body">
      <!-- 3D preview -->
      <div
        class="gallery-preview"
        ref="container"
        :style="{ height: example.height ?? '380px' }"
      >
        <!-- Playback controls (only shown when trajectory frames are loaded) -->
        <div v-if="totalFrames > 0" class="anim-controls">
          <button
            type="button"
            class="anim-btn"
            :title="playing ? 'Pause' : 'Play'"
            @click="togglePlay"
          >{{ playing ? '⏸' : '▶' }}</button>
          <span class="anim-counter">{{ currentFrame + 1 }} / {{ totalFrames }}</span>
        </div>
      </div>

      <!-- Code panel -->
      <div class="gallery-code">
        <div class="code-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['code-tab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
          <button class="copy-btn" @click="copyCode">
            {{ copied ? "Copied!" : "Copy" }}
          </button>
        </div>
        <pre class="code-block"><code>{{ example.code[activeTab] }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Card ──────────────────────────────────────────────────────────────────── */
.gallery-item {
  margin: 40px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

/* ── Header ────────────────────────────────────────────────────────────────── */
.gallery-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.gallery-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.gallery-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.gallery-description {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

/* ── Tags ──────────────────────────────────────────────────────────────────── */
.gallery-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.gallery-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

/* ── Body layout ───────────────────────────────────────────────────────────── */
.gallery-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
}

@media (max-width: 768px) {
  .gallery-body {
    grid-template-columns: 1fr;
  }
}

/* ── 3D preview ────────────────────────────────────────────────────────────── */
.gallery-preview {
  width: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-right: 1px solid var(--vp-c-divider);
  position: relative;
}

:root.dark .gallery-preview {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

@media (max-width: 768px) {
  .gallery-preview {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
    height: 280px !important;
  }
}

/* ── Code panel ────────────────────────────────────────────────────────────── */
.gallery-code {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.code-tabs {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 4px;
  background: var(--vp-c-bg-elv);
  flex-shrink: 0;
}

.code-tab {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.code-tab:hover {
  color: var(--vp-c-text-1);
}

.code-tab.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.copy-btn {
  margin-left: auto;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--vp-font-family-base);
  color: var(--vp-c-text-2);
  background: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.copy-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.code-block {
  margin: 0;
  padding: 16px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.7;
  overflow: auto;
  flex: 1;
  background: transparent;
  color: var(--vp-c-text-1);
  white-space: pre;
  tab-size: 2;
}

.code-block code {
  font-family: inherit;
  font-size: inherit;
  background: none;
  padding: 0;
}

/* ── Animation controls overlay ────────────────────────────────────────────── */
.anim-controls {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 20px;
  padding: 4px 10px 4px 6px;
  backdrop-filter: blur(4px);
  z-index: 10;
}

.anim-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 4px;
  line-height: 1;
}

.anim-counter {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-variant-numeric: tabular-nums;
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
}
</style>

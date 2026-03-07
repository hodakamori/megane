<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    height?: string;
    autoRotate?: boolean;
  }>(),
  {
    height: "400px",
    autoRotate: false,
  }
);

const container = ref<HTMLElement | null>(null);
let renderer: any = null;
let controls: any = null;

onMounted(async () => {
  if (!container.value) return;

  // Dynamic import to avoid SSR issues
  const { MoleculeRenderer } = await import("../../../src/renderer/MoleculeRenderer");

  renderer = new MoleculeRenderer();
  renderer.mount(container.value);

  // Fetch snapshot data
  const res = await fetch(props.src);
  const data = await res.json();

  // Convert JSON arrays to typed arrays matching the Snapshot interface
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

  renderer.loadSnapshot(snapshot);

  // Enable auto-rotate if requested
  if (props.autoRotate) {
    // Access OrbitControls via the renderer's internal controls
    // MoleculeRenderer exposes controls indirectly through the animation loop
    enableAutoRotate();
  }
});

function enableAutoRotate() {
  if (!renderer || !container.value) return;
  // Find the canvas and use a rotation animation via the renderer
  const canvas = container.value.querySelector("canvas");
  if (!canvas) return;

  let angle = 0;
  const speed = 0.003;
  let animId: number | null = null;

  function rotateStep() {
    if (!renderer) return;
    // Simulate a small horizontal drag to rotate the view
    const event = {
      clientX: 0,
      clientY: 0,
      button: 0,
    };
    // Use the renderer's OrbitControls autoRotate
    // Access the controls through the private field
    const r = renderer as any;
    if (r.controls) {
      r.controls.autoRotate = true;
      r.controls.autoRotateSpeed = 2.0;
    }
  }
  rotateStep();
}

onBeforeUnmount(() => {
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
});
</script>

<template>
  <div class="molecule-demo">
    <div
      ref="container"
      class="molecule-container"
      :style="{ height: props.height }"
    />
  </div>
</template>

<style scoped>
.molecule-demo {
  margin: 16px 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.molecule-container {
  width: 100%;
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

:root.dark .molecule-container {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}
</style>

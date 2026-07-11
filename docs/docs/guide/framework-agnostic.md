# Use with Vue, Svelte & Vanilla JS

`MoleculeRenderer` is a plain Three.js class — the same renderer powering all megane components — that you can mount without React. Use it to embed megane in Vue, Svelte, or any other framework, or directly in a vanilla `<div>`.

```ts
import { MoleculeRenderer } from "megane-viewer/lib";
import type { Snapshot } from "megane-viewer/lib";

// Create and mount
const renderer = new MoleculeRenderer();
renderer.mount(document.getElementById("viewer")!);

// Load data
renderer.loadSnapshot(snapshot);

// Update positions for animation
renderer.updateFrame(frame);

// Control appearance
renderer.setAtomScale(1.2);
renderer.setAtomOpacity(0.8);
renderer.setBondScale(0.5);
renderer.setPerspective(true);
renderer.setCellVisible(true);

// Cleanup
renderer.dispose();
```

## Atom Selection & Measurement

```ts
// Select atoms programmatically
renderer.toggleAtomSelection(0);
renderer.toggleAtomSelection(1);

// Get measurement (distance, angle, or dihedral based on # selected)
const measurement = renderer.getMeasurement();
// { type: 'distance', value: 3.82, label: '3.82 Å', atoms: [0, 1] }

// Clear selection
renderer.clearSelection();
```

## Picking (Hover & Click)

Screen-space picking for identifying atoms and bonds:

```ts
const hit = renderer.raycastAtPixel(mouseX, mouseY);
if (hit) {
  if (hit.kind === "atom") {
    console.log(`Atom ${hit.atomIndex}: ${hit.elementSymbol}`);
  } else if (hit.kind === "bond") {
    console.log(`Bond: ${hit.atomA}–${hit.atomB}, length=${hit.bondLength.toFixed(2)} Å`);
  }
}
```

For decoding binary WebSocket messages from the `megane serve` backend, see the [Protocol Utilities](/guide/web#protocol-utilities) section of the React component guide.

---
title: Gallery
---

<script setup>
import GalleryIndex from '../.vitepress/components/GalleryIndex.vue'
</script>

# Gallery

A collection of visualization examples. Each example shows a live 3D preview and the code needed to reproduce it in Jupyter, React, or the VSCode extension.

<GalleryIndex />

---

## Adding Your Own Example

To contribute a new gallery example, edit
[`docs/.vitepress/gallery/registry.ts`](https://github.com/hodakamori/megane/blob/main/docs/.vitepress/gallery/registry.ts)
and add an entry to the `galleryExamples` array.

Each entry needs:

| Field | Description |
|---|---|
| `id` | Unique kebab-case identifier (used as HTML anchor) |
| `title` | Short display name |
| `description` | One-sentence description |
| `tags` | Array of lowercase tag strings |
| `snapshotUrl` | Path to a snapshot JSON in `docs/public/data/` |
| `code.jupyter` | Python snippet for Jupyter |
| `code.react` | TSX snippet using `PipelineViewer` |
| `code.vscode` | `megane.json` content (SerializedPipeline JSON) |

See the existing entries in `registry.ts` for concrete examples.

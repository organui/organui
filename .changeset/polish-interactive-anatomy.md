---
"@workspace/registry": minor
---

The anatomy tree, body map, dermatome map and image viewer take every prop of their root element, such as `id` and `aria-*`, and mark it with `data-slot`, as the clinical readouts do.

The anatomy tree expands with a chevron, as shadcn's sidebar does, rather than a plus or minus sign. A hovered row is lighter than the selected one, and each row's visibility is a quiet button that adds an eye icon once the tree has room for it. The dermatome map titles each figure above it, as the body map does. The body map names the region under keyboard focus, not only the one under the pointer.

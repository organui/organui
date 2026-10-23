---
"@workspace/registry": patch
---

OrganViewer's reset view now also clears the selection, by calling `onSelectionChange(null)` when a structure is selected. `onSelectionChange` now accepts `string | null`.

# Documentation examples

Named demos live here, separately from installable registry components. Pages reference a name through `ComponentPreview`; `ComponentSource` reads the same file and rewrites workspace imports to consumer paths for display and copy.

Each organ has its own `*-demo.tsx`, `*-without-controls.tsx`, `*-controlled.tsx` and `*-with-anatomy.tsx`. These import the public component (`Heart`, `Brain`, etc.) and accept no injected model. `_organs.tsx` explicitly registers their imports, source filenames and titles. Keep that map and the corresponding files in sync; registry tests check all 42 organs.

The `organ-viewer-*.tsx` files demonstrate the standalone `OrganViewer` API with an explicit model import. They are used only on the Organ viewer page. `With Anatomy Panel` on an organ page composes that organ and `AnatomyTree` directly; full explorer layouts with a mobile sheet remain installable blocks.

The private examples registry is documentation infrastructure. It is not included in consumer installations. Heavy previews mount near the viewport through `DeferredPreview`.

# Documentation examples

These files are the live demos and the displayed source. They are separate from
`packages/registry`, which distributes installable components.

To add a demo:

1. Add an example file exporting `Example`.
2. Register its name, title, source filename, and lazy import in `_registry.tsx`.
3. Render `<ComponentPreview name="your-demo" />` in a documentation page.

The shared preview resolves the component by name, reads its real source file,
and renders the preview and source through the adapted shadcn helpers. Workspace
imports are rewritten for display. Example-data imports remain explicit; readers
can replace those fixtures with their own data.

Organ demos share four recipe files, parameterized by the registry model. Names
such as `heart-demo` and `heart-controlled` resolve to the corresponding recipe
and model. They use the same preview as every other component. Only the heavy
3D demos defer mounting until near the viewport.

Upstream reference: shadcn/ui commit
`daaf156ee00ed91cc7e6bdd937c1b4973152d141`, particularly
`apps/v4/components/component-preview.tsx`, `component-preview-tabs.tsx`,
`component-source.tsx`, and `registry/bases/base/examples/_registry.ts`.

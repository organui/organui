# OrganUI registry foundation

OrganUI distributes editable source through a shadcn-compatible registry. The first item is an anatomy tree; it accepts application data and callbacks without any viewer, organ model, sibling checkout, or unpublished runtime dependency.

## Boundaries

- `packages/ui` remains the private website foundation (Base UI / Nova, theme and internal components).
- `packages/registry/src/anatomy-tree.tsx` is the public installable source. Its only imports are React and the Base UI button subpath. The private workspace export lets the website demonstrate that same source without duplicating it. Consumers never import the workspace package.
- `packages/registry/registry.json` declares catalog metadata, npm dependencies and the `registry:ui` file. The shadcn CLI chooses the destination from the consumer's `components.json` UI alias. There are no registry dependencies, global styles or theme overrides.
- `packages/registry/scripts/build.ts` validates the catalog and generated items using the installed shadcn schema, embeds source, rejects private imports, and writes deterministic JSON exclusively into `packages/registry/dist`.
- `apps/web/scripts/stage-registry.ts` owns copying those artifacts into `apps/web/public/r`. The site serves `/r/registry.json` and `/r/anatomy-tree.json` as static assets.
- `apps/web/app/docs/anatomy-tree` contains the documentation and state-only live example. The homepage only adds a discovery link; this change does not adopt the separate homepage proposal.
- Future versioned runtime packages should be introduced only when a shared, stable runtime contract is justified. This registry is source distribution, not an npm anatomy runtime. The four organ repositories remain independent.

## Component decisions

The public props are `data`, `selectedId`, `onSelectionChange`, `visibility`, `onVisibilityChange`, `defaultExpandedIds`, `label`, and `className`. Data is a readonly hierarchy of `{ id, label, children? }`; IDs must be globally unique and nonempty. No anatomical asset is included. The simplified heart labels were written for this example, not extracted from a model dataset.

Selection is controlled and independent of focus and visibility. Only Enter or clicking a label selects. Consumers reconcile removed selections themselves. Visibility is a controlled leaf-ID map; absent entries mean visible. A branch is checked when all leaves are visible, unchecked when none are, and mixed otherwise. A branch action changes every leaf, even when descendants are filtered or collapsed. Mixed branches become fully visible. Branch entries do not override leaf entries. Callbacks remove unknown IDs; newly introduced leaves default visible.

Expansion and search are local UI state. Search uses case-insensitive label matching, includes ancestors, and temporarily expands the matching paths without mutating saved expansion. A matching branch does not include all its nonmatching descendants. Collapse is disabled while searching. Stable IDs preserve state on data changes; expansion defaults apply on mount only.

The tree uses a roving tab stop, explicit levels and sibling positions, separate `aria-selected` and `aria-checked`, and visible focus outlines. Up/Down, Home/End, Left/Right, Enter and Space are supported. Pointer buttons are Base UI buttons and are removed from the tab order; equivalent actions are available on the treeitem. Focus recovers to a visible ancestor or first row when its row disappears, or to search when the tree becomes empty. This is a custom tree keyboard implementation, not a claim that Base UI provides a tree primitive. Keyboard checks are automated in actual installed consumers; a screen-reader usability audit is still outside the verified scope.

The component intentionally targets small/medium in-memory datasets. It has no virtualization, lazy loading, multiselect, drag and drop, typeahead, or viewer. It uses recursive traversal; very deep or very large datasets need an adapted implementation.

## Build and cache ownership

`@workspace/registry#build` caches `dist/**`. `web#stage-registry` depends on that task and caches `public/r/**`. `web#build` depends on staging and dependency builds; `web#dev` stages before starting. Default Turbo inputs track package source and configuration; generated directories are ignored so output creation does not change input hashes. Dependency hashes propagate registry edits through staging to the website build. The website's Tailwind stylesheet explicitly scans the registry source for demonstration styles.

Use root commands so Turbo orchestrates staging; running `next build` directly does not stage assets. Generated output is disposable and uncommitted. `bun run test:cache` removes both artifact directories, checks cache restoration byte-for-byte, probes source invalidation for all three task hashes, verifies changed staged content, then restores the original source and output in a `finally` block. Run it without a concurrent source editor/build.

## Commands

Requires Bun 1.4.2 and Node 22 (CI). Start with `bun install --frozen-lockfile`.

| Command                                                                | Purpose                                                                                            |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `bun run dev`                                                          | Stage the registry and start the website                                                           |
| `bun run build`                                                        | Validate/build registry, stage assets, build Next.js                                               |
| `bun run lint`                                                         | Workspace ESLint checks                                                                            |
| `bun run typecheck`                                                    | Workspace TypeScript checks                                                                        |
| `bun run format:check`                                                 | Check formatting of this registry feature                                                          |
| `bun run test`                                                         | ID and visibility model tests                                                                      |
| `bun run test:cache`                                                   | Artifact restoration and dependency invalidation                                                   |
| `bun run test:consumers`                                               | Generate disposable consumers, install through shadcn over HTTP, production-build Next.js and Vite |
| `cd packages/registry && bunx playwright install --with-deps chromium` | Install test browser and Linux dependencies                                                        |
| `bun run test:browser`                                                 | Launch both built consumers and test actual installed components                                   |

`test:consumers` creates ignored `.consumers/next` and `.consumers/vite` directories. It hosts the public artifact on a dynamically allocated loopback port and invokes the pinned shadcn 4.21.0 CLI. It never copies component source directly. Initial consumers do not include Base UI; the CLI installs the declared dependency. Checks reject private imports, preserve the consumer stylesheet byte-for-byte, require the RSC boundary for Next.js, and compile both consumers. shadcn intentionally removes the client directive for Vite's `rsc: false` configuration. Fixture templates contain only the harness and framework configuration, not duplicated component code.

Verified configuration: React/React DOM 19.2.4, TypeScript 5.9.3, Tailwind 4.2.2, Base UI dependency `^1.8.0`, shadcn `base-nova`, Next.js 16.3.3 App Router and Vite 7.3.1. Consumers use custom semantic theme tokens to verify preservation, not copied OrganUI global CSS. Other React versions, Tailwind 3, Radix presets and other frameworks are unverified. Fixture direct dependencies and CLI are pinned; downstream dependency resolution remains live to exercise real installation. The repository itself uses the frozen Bun lockfile.

The browser matrix uses ports 4318, 4319 and 4321 and refuses to reuse another service. It covers desktop/mobile website documentation plus desktop Next.js and mobile Vite consumers: navigation, independent selection, mixed visibility, filtered/collapsed descendants, no results, data replacement/focus recovery, default visibility, custom theme preservation, runtime errors and overflow. The documentation checks also verify compiled styles, visible keyboard focus and served item/catalog JSON against the registry source. The website should also be visually inspected at desktop/mobile sizes when changing styling. Vite may warn that Base UI's `use client` directives are ignored, as expected for a client-only bundle.

`.github/workflows/registry.yml` runs these checks for pull requests and master pushes with read-only GitHub permissions. It does not publish packages or deploy production. Normal Vercel PR previews remain controlled by the existing integration.

## References

- [shadcn registry item specification](https://ui.shadcn.com/docs/registry/registry-item-json)
- [shadcn registry catalog specification](https://ui.shadcn.com/docs/registry/registry-json)
- [Base UI Button](https://base-ui.com/react/components/button)
- Installed Next.js 16.3.3 documentation under `apps/web/node_modules/next/dist/docs` governs the Server/Client Component boundary.

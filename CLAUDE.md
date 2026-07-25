# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

OrganUI is a **source-first shadcn registry** for healthcare and life-science UI, published at `organui.com`. The Next.js app in `src/` is a showcase/docs site; the actual product is the set of registry items under `registry/default/` that consumers copy into their own projects via `npx shadcn@latest add @organui/<name>`.

## Commands

```bash
npm run dev                    # showcase at http://127.0.0.1:3000
npm run check                  # registry:check + lint + test + build — the pre-PR gate
npm test                       # Vitest (jsdom, Testing Library, axe)
npm run test:watch
npm run registry:check         # metadata validation + shadcn schema validation + build
npm run test:visual            # Playwright screenshots (starts dev server itself)
npm run test:visual:update     # regenerate snapshots after intentional visual changes
npm run test:registry-install  # slow: scaffolds a fresh Next app and installs every item
```

Run a single Vitest file or test:

```bash
npx vitest run registry/default/lab-result-card/lab-result-card.test.tsx -t "accessible name"
```

Run one Playwright project or test:

```bash
npx playwright test --project=desktop-chromium -g "lab-result-card"
```

Node 20+ required (CI uses 22).

## Architecture

**Dual import resolution is the central constraint.** Registry component source imports primitives as `@/components/ui/badge`. In this repo that alias resolves to `src/components/ui/`; in a consumer project the same path resolves to *their* shadcn primitives. So `src/components/ui/*` exists only to make local dev and tests work — it is not shipped. Registry items should import only from `@/components/ui/*` and `@/lib/utils`, and every primitive used must be listed in that item's `registryDependencies` (e.g. `["badge", "card"]`) so the shadcn CLI pulls it into the consumer. `tsconfig.json` also maps `@/registry/*` so the showcase can render items directly from source.

**`registry.json` is the catalog and the source of truth for what ships.** `npm run registry:build` (shadcn CLI) compiles it into `public/r/<name>.json` — gitignored, regenerated on every build.

**Metadata is enforced beyond the shadcn schema.** [scripts/validate-organui-metadata.mjs](scripts/validate-organui-metadata.mjs) requires each item to have kebab-case name, title, description, files, categories, and a `meta.organui` block with non-empty `accessibility`, `safety`, and `states`. Adding an item without that block fails `registry:check`.

**The showcase duplicates catalog data in three places that must stay in sync** when adding or renaming an item:

| File | Purpose |
| --- | --- |
| [registry.json](registry.json) | ships the item; deps + `meta.organui` |
| [src/lib/catalog.ts](src/lib/catalog.ts) | slug, title, category, states — drives `/`, `/components/[slug]`, sitemap, static params |
| [src/lib/component-api.ts](src/lib/component-api.ts) | prop summary rendered on the detail page |
| [src/components/component-preview.tsx](src/components/component-preview.tsx) | a `switch` on slug returning the live example |
| [scripts/test-registry-install.mjs](scripts/test-registry-install.mjs) | hardcoded item + expected-file lists |
| [tests/visual/components.spec.ts](tests/visual/components.spec.ts) | hardcoded component list |

**Primitives are Base UI, not Radix** (`@base-ui/react`, `components.json` style `base-nova`). Consult the bundled shadcn skill under `.claude/skills/shadcn/` — especially `rules/base-vs-radix.md` — before reaching for Radix APIs.

**Visual tests run three Playwright projects**: `desktop-chromium`, `mobile-chromium` (Pixel 7), and `high-contrast-chromium` (forced colors). Any rendering change needs snapshots regenerated for all three; snapshots are committed under `tests/visual/components.spec.ts-snapshots/`.

## Conventions

Kebab-case for item names and directories (`lab-result-card`), PascalCase for exports (`LabResultCard`). One directory per item under `registry/default/<name>/`, with the test beside it. Cross-cutting behavior lives in [registry/default/healthcare-components.test.tsx](registry/default/healthcare-components.test.tsx).

Two-space indent, no semicolons, double quotes. Semantic tokens (`bg-background`, `text-muted-foreground`) only — no fixed palette utilities, since consumers theme these.

Status components follow a consistent shape: a `const <thing>StatusConfig = { ... } as const` map of state → `{ label, variant }`, a `keyof typeof` status type, and props extending the underlying primitive's `ComponentProps`. Every state renders visible text; color never carries meaning alone.

## Domain rules

These come from [docs/foundations.md](docs/foundations.md) and are checked in review:

- All fixtures, examples, and snapshots use **synthetic** data. Never commit anything resembling PHI, credentials, or proprietary study data.
- Components are presentational. They make no diagnostic, urgency, treatment, or compliance claims; warning/critical labels are consumer-configured product language.
- Keep `unavailable`, `unknown`, `pending`, `empty`, and error states explicit and documented in `meta.organui.states`.
- Target WCAG 2.2 AA; long identifiers must wrap rather than truncate (there is a dedicated visual test for this).

## Releases

Registry items are copied source, so any rename, removed state, changed required prop, or moved install path is a **major**. `/r/<name>.json` paths are stable within a major version. Update [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]` — see [VERSIONING.md](VERSIONING.md).

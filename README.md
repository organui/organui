# OrganUI

Interfaces for healthcare and life sciences, distributed as editable source
through a [shadcn](https://ui.shadcn.com)-compatible registry at
[organui.com](https://organui.com).

## Install a component

In a React 19 project configured with shadcn, Tailwind CSS 4 and the Base UI
preset:

```bash
bunx shadcn@4.21.0 add https://organui.com/r/anatomy-tree.json
```

Or register the namespace once in `components.json`:

```json
{
  "registries": {
    "@organui": "https://organui.com/r/{name}.json"
  }
}
```

and run `bunx shadcn@4.21.0 add @organui/anatomy-tree`. The repository is also
a GitHub registry, so `bunx shadcn@4.21.0 add organui/organui/anatomy-tree`
installs straight from source (append `#<commit>` to pin a version). See
[the anatomy tree documentation](https://organui.com/docs/anatomy-tree).

## Organs

Every organ is a registry item named after it: `heart`, `brain`,
`spinal-cord`, `nerves` and so on.

```bash
bunx shadcn@4.21.0 add https://organui.com/r/heart.json
```

```tsx
import { Heart } from "@/components/heart"

;<Heart className="h-[32rem]" />
```

Each one installs the shared `organ-viewer.tsx` (three.js) plus the organ's
structures, views and model credit. The GLB itself stays in the explorer
repository under its own licence (CC BY-SA 2.1 JP, CC BY-SA 4.0, CC BY 4.0 or
CC0, per organ) and loads from a commit-pinned jsDelivr URL; organs without an
explorer repository, such as `nerves` and `parathyroid`, are built in this
repository and served from `organui.com/models/`, with an attribution file for
each model. The viewer shows its credit. See [the organ viewer documentation](https://organui.com/docs/organ-viewer).

## Blocks

Blocks are whole layouts built from those pieces, following shadcn's
`registry:block` convention: a page plus the components it needs.

| Block         | Layout                                                                       |
| ------------- | ---------------------------------------------------------------------------- |
| `explorer-01` | Viewer with an anatomy panel that docks beside it, or opens as a sheet       |
| `explorer-02` | Full-height workspace: tree sidebar and a card to hide or isolate structures |
| `explorer-03` | One viewer switching between several organs                                  |

```bash
bunx shadcn@4.21.0 add https://organui.com/r/explorer-01.json
```

In Next.js this adds a page at `app/explorer/page.tsx`; other frameworks get
the components only. Previews are at [organui.com/blocks](https://organui.com/blocks).

## Repository

| Path                    | Contents                                                          |
| ----------------------- | ----------------------------------------------------------------- |
| `apps/web`              | Website, component documentation and the staged registry (`/r`)   |
| `packages/registry`     | `registry.json`, item source under `registry/` and `shadcn build` |
| `packages/registry-e2e` | Generated Next.js/Vite consumers and Playwright browser tests     |
| `packages/ui`           | Private website foundation (theme, internal components)           |
| `packages/*-config`     | Shared ESLint and TypeScript configuration                        |
| `models`                | Build scripts and attribution for organ models kept in this repo  |

## Develop

Requires Bun 1.4.2 and Node 22.

```bash
bun install --frozen-lockfile
bun run dev
```

Then open `http://localhost:3000/docs`. Run tasks from the root so
Turborepo builds and stages the registry first; `next build` alone does not.

`bun run lint`, `bun run typecheck`, `bun run test` and `bun run format:check`
cover the quick checks. [docs/architecture.md](docs/architecture.md) describes
the registry boundaries and the consumer, browser and cache suites.

## License

OrganUI code is licensed under [MIT](LICENSE). Third-party dependencies, fonts,
and other upstream material retain their own licenses; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

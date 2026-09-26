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

and run `bunx shadcn@4.21.0 add @organui/anatomy-tree`. See
[the anatomy tree documentation](https://organui.com/docs/anatomy-tree).

## Repository

| Path                    | Contents                                                        |
| ----------------------- | --------------------------------------------------------------- |
| `apps/web`              | Website, component documentation and the staged registry (`/r`) |
| `packages/registry`     | Public component source, `registry.json` and the registry build |
| `packages/registry-e2e` | Generated Next.js/Vite consumers and Playwright browser tests   |
| `packages/ui`           | Private website foundation (theme, internal components)         |
| `packages/*-config`     | Shared ESLint and TypeScript configuration                      |

## Develop

Requires Bun 1.4.2 and Node 22.

```bash
bun install --frozen-lockfile
bun run dev
```

Then open `http://localhost:3000/docs/anatomy-tree`. Run tasks from the root so
Turborepo builds and stages the registry first; `next build` alone does not.

`bun run lint`, `bun run typecheck`, `bun run test` and `bun run format:check`
cover the quick checks. [docs/architecture.md](docs/architecture.md) describes
the registry boundaries and the consumer, browser and cache suites.

## License

[MIT](LICENSE)

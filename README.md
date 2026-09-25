# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Anatomy tree registry

See the [registry architecture and verification commands](docs/architecture.md).
Run `bun install --frozen-lockfile` and `bun run dev`, then open
`/docs/anatomy-tree` for installation instructions and the interactive example.
Registry JSON is built by `packages/registry` and staged by the website at `/r`.

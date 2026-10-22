# Contributing

Thanks for helping improve OrganUI. Open an issue before starting large
changes, such as a new component, so we can agree on the API first.

## Setup

Follow [Develop](README.md#develop) in the README: Bun 1.4.2, Node 22, then
`bun install --frozen-lockfile` and `bun run dev`.

[docs/architecture.md](docs/architecture.md) explains how the registry, the
site and the test suites fit together.

## Before you open a pull request

Run the quick checks from the repository root:

```bash
bun run format:check
bun run lint
bun run typecheck
bun run test
```

CI runs the build, the installed-consumer checks and the browser tests on
every pull request that changes more than prose, such as this file. They start several Chromium instances, so leave them to CI
rather than running them locally.

## Design

OrganUI is the healthcare and life-science layer on top of
[shadcn/ui](https://ui.shadcn.com), not a second copy of it.

- Compose shadcn's components and patterns (`Card`, `Chart`, `Item`,
  `HoverCard`, the AI Elements' `Message` and sources) before writing your
  own, and build only the clinical part on top: reference ranges and units,
  status shown with an icon and a label, and the forms clinicians read. The
  chart conventions are on [Clinical charts](https://organui.com/docs/clinical-charts).
- Show values computed from the data, or from the same constant the rest of
  the item uses, never typed in a second time.
- When an item looks generic, redesign it under the same name rather than
  deprecating it or adding a variant.
- To see how shadcn does something, read
  [its source](https://github.com/shadcn-ui/ui/tree/main/apps/v4); the site
  follows the commits pinned in [docs/architecture.md](docs/architecture.md).
- Follow shadcn's conventions: semantic tokens rather than raw colors, `flex`
  with `gap-*` for spacing, and existing components (`Empty`, `Alert`,
  `Table` and so on) before custom markup.
- Draw icons with `IconPlaceholder`, giving a name for each icon library, so
  `shadcn add` writes the installing project's own icons. Import it from
  `@/icons/icon-placeholder`: the CLI rewrites `@/registry`, `@/components`,
  `@/hooks` and `@/lib` imports before it replaces icons, so a placeholder
  imported from one of those leaves a broken import. Add new icons to
  `packages/ui/src/components/icon-placeholder.tsx`;
  `packages/registry/tests/icons.test.ts` checks every name.

## Adding or changing an item

When you add or change an item:

- Write it for Base UI in `registry/base-nova`. If it uses Base UI's own API,
  such as the `render` prop, add a Radix copy at the same path in
  `registry/radix-nova` (see [Base UI and Radix](docs/architecture.md#base-ui-and-radix)).
- Document every prop with a doc comment, then run `bun run component-api` in
  `packages/registry` so the docs' API Reference matches.
- For a new block, capture its phone pictures with
  `bun run screenshots --only <name>` in `apps/web`.
- For a model, run its build script and commit the output; see
  [Models built here](docs/architecture.md#models-built-here).

## Dependency updates

Dependabot proposes weekly updates for the workspace, the model scripts and
GitHub Actions. A major version waits until the tools around it support it,
such as ESLint plugins or typescript-eslint; say why on the pull request when
you hold one back.

## Pull requests

Keep pull requests focused on one change and write the title as an imperative
sentence, for example "Add a growth chart component".

If your change alters what the registry installs, add a changeset with
`bunx changeset`: pick `@workspace/registry`, the bump, and a line for the
release notes. CI asks for one when registry files change. See
[RELEASING.md](RELEASING.md) for how releases are made from them.

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
every pull request. They start several Chromium instances, so leave them to CI
rather than running them locally.

Registry components follow the [shadcn/ui](https://ui.shadcn.com) conventions:
semantic tokens rather than raw colors, `flex` with `gap-*` for spacing, and
existing components (`Empty`, `Alert`, `Table` and so on) before custom markup.
Icons in registry items use `IconPlaceholder` with a name for each icon
library, so `shadcn add` can write the installing project's own icons.

Keep pull requests focused on one change and write the title as an imperative
sentence, for example "Add a growth chart component".

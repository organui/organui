# Shared UI

This package contains all 63 source-bearing components from the official shadcn
Base UI registry installed with CLI 4.22.1, using the project's `base-nova` style
and Lucide icons. Components are available through `@workspace/ui/components/*`.
The official `form` registry entry contains no source files; forms compose
`Field`, `FieldGroup`, and the appropriate controls.

## Local patches

Keep upstream behavior and composition unless a patch is needed for integration
or a verified behavior issue. The additions retain these patches:

- `package.json` explicitly exports `lib/highlighter`, whose source is TSX rather
  than the TS extension used by the general library export.
- `badge`, `breadcrumb`, `bubble`, `marker`, `attachment`, `button-group`, and
  `item` have client boundaries because they call Base UI's `useRender` hook.
  The `use-mobile` and `use-highlighted-code` hooks also have client boundaries.
- `CalendarDayButton` attaches its focus ref to the rendered button so keyboard
  navigation can move focus.
- `Slider` derives its thumb count from numeric or array values, with one thumb
  for the primitive's default single-value mode.
- `CommandDialog` renders its title and description inside `DialogContent`.

The carousel and mobile hook retain upstream effect-based subscriptions. These
produce two `react-hooks/set-state-in-effect` lint warnings; avoid rewriting them
solely to eliminate those warnings. The command input retains upstream
composition.

## Updating

Run the CLI from this directory so components, hooks, helpers, and dependencies
remain in the shared package:

```sh
bunx --bun shadcn@latest add --all --dry-run
bunx --bun shadcn@latest add carousel --diff carousel.tsx
```

Review changes before applying updates, preserve the patches above, and avoid
blindly overwriting existing components. Import components individually rather
than introducing a barrel that loads the whole collection.

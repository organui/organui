<p align="center">
  <a href="https://organui.com">
    <img src="apps/web/app/icon.svg" alt="OrganUI" width="72" height="74" />
  </a>
</p>

<h1 align="center">OrganUI</h1>

<p align="center">
  The interfaces healthcare deserves.<br />
  Open-source components for healthcare and life sciences, installed as source with the shadcn CLI.
</p>

<p align="center">
  <a href="https://organui.com/docs">Docs</a> ·
  <a href="https://organui.com/docs/components">Components</a> ·
  <a href="https://organui.com/blocks">Blocks</a> ·
  <a href="https://organui.com/charts/area">Charts</a> ·
  <a href="https://organui.com/create">Create</a> ·
  <a href="https://organui.com/docs/changelog">Changelog</a>
</p>

<p align="center">
  <a href="https://github.com/organui/organui/actions/workflows/registry.yml"><img src="https://github.com/organui/organui/actions/workflows/registry.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/organui/organui/releases"><img src="https://img.shields.io/github/v/release/organui/organui?label=release" alt="Latest release" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT licence" /></a>
</p>

## Quick start

In a React 19 project set up with shadcn and Tailwind CSS 4, add any item by
name:

```bash
bunx shadcn@4.22.1 add @organui/heart
```

```tsx
import { Heart } from "@/components/heart"

export default function Page() {
  return <Heart className="h-[32rem]" />
}
```

`@organui` is listed in shadcn's registry directory, so no setup is needed.
The commands pin the shadcn version the registry is tested with.
The code lands in your project, yours to change. `npx`, `pnpm dlx` and
`yarn dlx` work the same way. New project? [Create](https://organui.com/create)
picks the library, theme and items, and gives you the commands.

### Base UI and Radix

Every item installs on shadcn's Base UI and Radix styles. Radix projects add
OrganUI to `components.json` once, so the CLI fetches the Radix build:

```json
{
  "registries": {
    "@organui": "https://organui.com/r/styles/{style}/{name}.json"
  }
}
```

See [Base UI and Radix](https://organui.com/docs/base-ui) for which items ship
a copy for each library.

## What's inside

| Area                                                                                                    | What you get                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Organs](https://organui.com/docs/components/organs)**                                                | 42 interactive 3D organs, from the heart and brain to the spinal cord and skin, on one shared [organ viewer](https://organui.com/docs/components/organ-viewer), with an [anatomy tree](https://organui.com/docs/components/anatomy-tree) to select and hide structures. |
| **[Clinical](https://organui.com/docs/components)**                                                     | Vital signs, lab results with trends, an ECG trace, a growth chart, a medication schedule with interaction warnings, a body map and a dermatome map.                                                                                                                    |
| **[Imaging and molecules](https://organui.com/docs/components)**                                        | A CT and MRI slice viewer with a DICOM reader, a PDB and mmCIF molecule viewer, a DNA helix and an animal cell.                                                                                                                                                         |
| **[AI Elements](https://organui.com/docs/ai-elements)**                                                 | The clinical side of an AI interface, on shadcn's components: AI disclaimers, record citations and sources, a differential list, clinician sign-off and AI-drafted notes.                                                                                               |
| **[Blocks](https://organui.com/blocks)**                                                                | Whole layouts that install a page and its components: organ explorers with an anatomy panel, and a patient dashboard of vitals, ECG, labs and medicines.                                                                                                                |
| **[Charts](https://organui.com/charts/area)**                                                           | 21 charts of health data on shadcn's chart component: vitals, labs, beds, adherence and outcomes.                                                                                                                                                                       |
| **[Helpers](https://organui.com/docs/helpers)** and **[utilities](https://organui.com/docs/utilities)** | Ages, z-scores, reference ranges, unit conversion and body measurements in TypeScript; heartbeat, ECG grid and severity colour classes in CSS.                                                                                                                          |

Components read your shadcn theme tokens and follow its dark mode. They are
keyboard and screen reader accessible, checked with axe in every pull request.

> [!IMPORTANT]
> OrganUI is for building interfaces. It is not a medical device: nothing in
> it diagnoses, alarms or replaces clinical judgement, and its example data is
> fictional.

### 3D models

Organ models load at runtime and keep their own licences (CC BY, CC BY-SA or
CC0); the viewer shows each model's credit. [Licences](https://organui.com/docs/licences)
lists every model and dataset.

### For AI assistants

The docs are available as Markdown (add `.md` to any docs address) and indexed
at [organui.com/llms.txt](https://organui.com/llms.txt). With the
[shadcn MCP server](https://organui.com/docs/mcp), assistants can browse and
install OrganUI items.

## Develop

Requires Bun 1.4.2 and Node 22.

```bash
bun install --frozen-lockfile
bun run dev
```

Then open `http://localhost:3000`. Run tasks from the root, so Turborepo
builds and stages the registry first.

| Path                       | Contents                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `apps/web`                 | The website and documentation, which serves the registry at `/r`                                                         |
| `packages/registry`        | `registry.json` and every item's source, for Base UI (`base-nova`) and Radix (`radix-nova`)                              |
| `packages/registry-e2e`    | Generated Next.js, Vite and Radix projects that install every item, and the Playwright browser tests                     |
| `packages/ui`              | The website's own components and theme                                                                                   |
| `models`, `scripts/models` | Build scripts and attribution for the organ models OrganUI hosts ([all of them](docs/architecture.md#models-built-here)) |

`bun run format:check`, `bun run lint`, `bun run typecheck` and `bun run test`
are the quick checks. CI also builds the registry, installs every item into the
generated projects and runs the browser tests.
[docs/architecture.md](docs/architecture.md) describes how the pieces fit.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md)
first; changes to what the registry installs come with a
[changeset](.changeset/README.md), which becomes their line in the release
notes. Report security issues as described in [SECURITY.md](SECURITY.md).

## License

OrganUI's code is [MIT](LICENSE). Models, datasets and other third-party
material keep their own licences; see
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and
[Licences](https://organui.com/docs/licences).

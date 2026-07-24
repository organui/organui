# Repository Guidelines

## Project Structure & Module Organization

OrganUI is a source-first shadcn registry for healthcare and life-science UI.
The root `registry.json` is the catalog and must list every distributable item.
Place item source under `registry/default/<item-name>/`. The Next.js showcase
lives in `src/app/`, preview primitives in `src/components/ui/`, and standards in
`docs/`. Generated JSON goes to ignored `public/r/`. Scripts live in
`package.json`; contributor examples belong in `README.md`.

## Build, Test, and Development Commands

- `npm run dev` starts the local component showcase.
- `npm run build` builds registry artifacts and the production showcase.
- `npm run lint` checks TypeScript and React source with ESLint.
- `npm test` runs component and accessibility tests once with Vitest.
- `npm run test:registry-install` installs the built item in a clean app.
- `npm install` installs dependencies using Node.js 20 or newer.
- `npm run registry:validate` checks the catalog against shadcn schemas.
- `npm run registry:build` compiles the catalog into installable files under
  `public/r/`.
- `npm run registry:check` runs validation followed by a full build. Run this
  before every pull request.

## Coding Style & Naming Conventions

Use two-space indentation in JSON, TypeScript, and TSX. Prefer semantic shadcn
tokens such as `bg-background` and `text-muted-foreground` over fixed colors.
Keep components accessible, themeable, and composable. Use kebab-case for item
names and directories, for example `lab-result-card`; use PascalCase for React
exports, such as `LabResultCard`. Include clear `title`, `description`, file
types, package dependencies, and registry dependencies in each catalog entry.

## Testing Guidelines

Vitest, Testing Library, and axe cover component behavior and accessibility.
Keep tests beside registry items using names such as
`lab-result-card.test.tsx`. Run `npm test` and `npm run registry:check` before
opening a PR. Test accessible names, empty and error states, keyboard behavior,
and realistic edge cases. Never use real patient or confidential research data
in fixtures.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects, for example `Add lab result card`.
Keep commits focused. Pull requests should explain the user need, list registry
items changed, and report `registry:check` results. Link relevant issues and add
screenshots or recordings for visual or interactive changes. Call out new
dependencies, accessibility decisions, and any breaking installation changes.

## Security & Domain Safety

Treat examples as public. Use synthetic data, avoid clinical claims, and do not
encode protected health information, credentials, or proprietary study data.

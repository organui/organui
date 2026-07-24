# OrganUI

Open UI building blocks for healthcare and life-science products, built on the
[shadcn registry](https://ui.shadcn.com/docs/registry).

## Getting started

```bash
npm install
npm run registry:validate
npm run registry:build
npm test
npm run dev
```

The showcase runs at `http://localhost:3000`. The source catalog lives in
`registry.json`. Registry item source files belong
under `registry/default/<item-name>/`. A production build is written to
`public/r/`.

Project standards for accessibility, data safety, clinical language, and design
tokens are documented in [`docs/foundations.md`](docs/foundations.md).

Run `npm run test:registry-install` to build the registry, install the item and
its dependencies into a clean temporary shadcn project, and build the consumer.

## Add a registry item

1. Create the component, hook, or block under
   `registry/default/<item-name>/`.
2. Add its metadata and files to `registry.json`.
3. Run `npm run registry:check`.

Use descriptive, domain-specific names such as `patient-status-badge`,
`lab-result-card`, or `clinical-timeline`. Components should be accessible,
themeable, and safe for realistic clinical data without embedding real patient
information in examples.

## Install from GitHub

Once this repository is public, users can install an item directly:

```bash
npx shadcn@latest add <github-owner>/organui/<item-name>
```

## Serve as a hosted registry

Publish the contents of `public/` at your website, then consumers can use:

```bash
npx shadcn@latest registry add @organui=https://your-domain.com/r/{name}.json
npx shadcn@latest add @organui/<item-name>
```

# OrganUI

Accessible, source-first UI building blocks for healthcare and life-science products, built on the [shadcn registry](https://ui.shadcn.com/docs/registry). Browse the live collection at [organui.com](https://organui.com).

## Install a component

Register the hosted namespace once, then add any item:

```bash
npx shadcn@latest registry add @organui=https://organui.com/r/{name}.json
npx shadcn@latest add @organui/lab-result-card
```

Available items: `patient-status-badge`, `lab-result-card`, `vital-sign-card`, `medication-status`, `specimen-status`, `clinical-alert`, `study-phase-badge`, and `patient-summary-header`.

## Develop locally

```bash
npm install
npm run dev
npm run check
npm run test:visual
npm run test:registry-install
```

Source belongs under `registry/default/<item-name>/` and every distributable item must appear in `registry.json`. `npm run registry:build` produces hosted artifacts under `public/r/`. Visual snapshots cover desktop, mobile, dark examples, and 200% zoom.

Read [OrganUI Foundations](docs/foundations.md), [Versioning and Registry Stability](VERSIONING.md), [Security Policy](SECURITY.md), and [Repository Guidelines](AGENTS.md) before contributing.

## Safety

All examples are synthetic. OrganUI components are presentational and do not provide diagnosis, urgency, treatment, authorization, auditing, retention, regulatory compliance, or clinical validation.

## License

MIT

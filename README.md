# OrganUI

Open-source interfaces for health and life science. Starting with interactive 3D anatomy, built for the web.

This repository contains the OrganUI showcase homepage: real previews of the independent Heart, Liver, and Lungs explorers, project information, attribution, and a GitHub contribution path. It does not embed WebGL viewers or depend on sibling repositories at runtime.

## Local setup

Use **Bun 1.4.2** and **Node.js 20.9 or newer** (Next.js requirement).

```sh
bun install --frozen-lockfile
bun run dev --filter=web -- --port 3100 --hostname 127.0.0.1
```

Open [http://127.0.0.1:3100](http://127.0.0.1:3100). If the port is occupied, choose another free port; don't stop another project. The equivalent direct command is `cd apps/web && bun run dev --port 3100 --hostname 127.0.0.1`.

No environment variables, API keys, external fonts, accounts, or anatomy model downloads are required. Dependencies require network access on first install. All runtime images and fonts are bundled here.

## Checks and production preview

From the repository root:

```sh
bun run lint
bun run typecheck
bun run build
cd apps/web
bun run start --port 3100 --hostname 127.0.0.1
```

`build` runs the existing Turborepo build and produces the Next.js production app in `apps/web/.next`. This uses Next's image optimization server, not a static export. Lint and typecheck cover both web and shared UI packages. See [verification evidence](docs/VERIFICATION.md) for viewport and interaction checks.

## Structure

- `apps/web/app/page.tsx`: server-rendered homepage and concise project copy.
- `apps/web/components/explorer-preview.tsx`: small client component for accessible native-dialog screenshot previews; uses the shared shadcn/Base UI Button.
- `apps/web/lib/explorers.ts`: showcase copy and screenshot view definitions.
- `apps/web/app/homepage.css`: responsive homepage styles, focus and reduced-motion treatments.
- `apps/web/public/previews`: compressed real explorer screenshots and cropped model views.
- `apps/web/app/fonts`: self-hosted Latin variable Manrope and DM Sans.
- `packages/ui`: existing Nova/shadcn shared library, retained without reinitialization.

The initial brand uses a warm paper canvas, forest-green actions, quiet sage typography, and a simple pulse wordmark. The homepage uses a deliberate light palette independent of OS theme. The scaffold's unused theme-provider remains available for future app work but is not mounted on this homepage. Canonical metadata is set to the intended `https://organui.com` domain; that is not evidence of a deployment. Favicon, Apple icon, and Open Graph artwork are included.

## Image and font attribution

See [the complete asset record](apps/web/public/licenses/ATTRIBUTION.txt), also served at `/licenses/ATTRIBUTION.txt`. Full copies of the source model provenance records are in that directory. Their relative links refer to the originating explorer repositories.

| Imagery | Source | License |
| --- | --- | --- |
| Heart | BodyParts3D 4.0, DBCLS; OrganUI Heart screenshots | CC BY 4.0 |
| Liver | BodyParts3D 4.0, DBCLS; OrganUI Liver screenshots | CC BY 4.0 |
| Lungs | BodyParts3D / Anatomography 4.3, DBCLS; OrganUI Lungs screenshots | CC BY-SA 2.1 Japan |

Credit: BodyParts3D / Anatomography, © The Database Center for Life Science. Adapted and rendered by OrganUI. The Lungs derivatives retain their share-alike license; the separate archive's CC BY 4.0 grant is not applied to them. These image licenses remain separate from application code. The authoritative source notices were checked on 2026-09-23: [LSDB archive](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html) and [original 4.3 service](https://lifesciencedb.jp/bp3d/info/index.html).

Screenshot source files were copied from the sibling explorers' `docs/screenshots` directories on 2026-09-23. Full screenshots were compressed to WebP quality 88; model detail crops were proportionally fitted to 720×720 with the original canvas color as padding. Crop rectangles in original pixels `(left, top, width, height)`: Heart `(440,200,560,560)`, Liver `(395,170,660,570)`, Lungs `(380,130,520,475)`. No anatomy was repainted or generated. The full-image links preserve each screenshot's original aspect ratio. All nine preview images total approximately 165 KiB.

Manrope and DM Sans come from Fontsource variable packages 5.3.0 under SIL OFL 1.1. Notices and the Lucide ISC license are included in `apps/web/public/licenses`.

These are educational demonstrations, with independent anatomical review still pending. No clinical validation is claimed.

## Launch dependencies

Verified on **2026-09-23**:

- `heart.organui.com`, `liver.organui.com`, and `lungs.organui.com` did not resolve. No live-demo links are enabled. The preview buttons open local screenshots and are explicitly labeled as previews.
- The public [Heart](https://github.com/organui/heart-3d), [Liver](https://github.com/organui/liver-3d), and [Lungs](https://github.com/organui/lungs-3d) repositories exist, but contain starter files rather than the working local implementations. The site's repository links are labeled truthfully; a nearby note says full source releases are on the way. Publishing those implementations is a separate task.
- [OrganUI Issues](https://github.com/organui/organui/issues) is the verified feedback destination; Issues are enabled. There is no invented contact address, X handle, signup service, or submission backend.
- The initial scaffold commit `e8a20ed` is deployed on Vercel in the `kernelius` team, with `apps/web` as its root and `master` as the production branch. `organui.com` is assigned to this project using its existing DNS. This homepage is proposed separately in a PR and is not the production version until merged. Publishing sibling implementations and final homepage launch review remain outstanding. Before adding “Explore demo,” verify each HTTPS destination and the actual explorer it serves. Update the pre-release copy after the code is publicly available.

Homepage changes are confined to this repository. The initial scaffold remains on production while the homepage PR is reviewed. No sibling repository was modified or published. `.github/workflows/checks.yml` runs the current lint, type-check, and build commands for pull requests and pushes to `master`; Vercel also builds branch previews through its GitHub integration.

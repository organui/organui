# Third-party notices

The root MIT license and workspace package metadata apply to OrganUI code.
They do not relicense third-party dependencies, fonts, or other upstream work.
Keep the license and copyright notices shipped with each dependency when
redistributing it. The package manager installs those notices with the packages.

## Runtime dependencies

The following licenses were checked in the installed packages used by this
repository. This list identifies direct runtime dependencies; transitive
packages retain their own accompanying licenses as well.

| Dependency                 | Version inspected | Upstream license                                |
| -------------------------- | ----------------- | ----------------------------------------------- |
| React and React DOM        | 19.2.4            | MIT                                             |
| Next.js                    | 16.3.3            | MIT                                             |
| Base UI (`@base-ui/react`) | 1.8.0             | MIT                                             |
| next-themes                | 0.4.6             | MIT                                             |
| lucide-react               | 1.47.0            | ISC, with inherited icon notices in its LICENSE |
| class-variance-authority   | 0.7.1             | Apache-2.0                                      |
| cn                         | 0.4.0             | MIT                                             |
| shadcn                     | 4.21.0            | MIT                                             |
| tw-animate-css             | 1.4.0             | MIT                                             |

## Fonts

Geist and Geist Mono, loaded through `next/font/google`, remain under the
[SIL Open Font License 1.1](https://github.com/vercel/geist-font/blob/main/OFL.txt),
Copyright 2024 The Geist Project Authors. The OrganUI MIT license does not
replace the font license.

## Anatomy assets

The independent organ explorer repositories document their source-specific
anatomy asset licenses and attribution. Models hosted from
`apps/web/public/models/` keep their own licenses (for example, the nerves
model is CC BY-SA 4.0), documented in the `<organ>.ATTRIBUTION.md` file beside
each GLB or, for nerves, in `models/nerves/ATTRIBUTION.md`. Those notices are
unaffected by the website code license.

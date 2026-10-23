import type { Metadata } from "next"
import bodySystems from "@workspace/registry/body-systems.json"
import catalog from "@workspace/registry/registry.json"
import { site } from "@/lib/site"

export const shadcn = "shadcn@4.22.1"

// Items that depend on other OrganUI items, such as an organ on the viewer,
// are shown installing by name; shadcn's registry directory resolves
// @organui without configuration.
function install(item: { name: string; registryDependencies?: string[] }) {
  return item.registryDependencies?.some((name) => name.startsWith("@organui/"))
    ? `bunx ${shadcn} add @organui/${item.name}`
    : `bunx ${shadcn} add ${site.url}/r/${item.name}.json`
}

// Sidebar and index groups, each made of registry categories. Every
// component carries exactly one of these categories (a registry test checks
// it), so a new item lands in its group without a site change.
export const componentGroups = [
  { id: "clinical", title: "Clinical", categories: ["clinical"] },
  { id: "imaging", title: "Imaging", categories: ["imaging"] },
  {
    id: "molecular",
    title: "Molecular & cellular",
    categories: ["molecular", "cell", "tissue"],
  },
  // The viewers and the tree the organs and diseases are built on, apart
  // from them, so their pages don't read as one more organ or disease.
  {
    id: "building-blocks",
    title: "Building blocks",
    categories: ["anatomy", "pathology"],
  },
  { id: "organs", title: "Organs", categories: ["organ"] },
  { id: "diseases", title: "Diseases", categories: ["disease"] },
] as const

export type ComponentGroupId = (typeof componentGroups)[number]["id"]

function groupOf(categories: readonly string[] = []) {
  const group = componentGroups.find((entry) =>
    entry.categories.some((category) => categories.includes(category))
  )
  if (!group) throw new Error(`No docs group for ${categories.join(", ")}`)
  return group.id
}

// The registry catalog is the single source for what the docs list, so a new
// item appears in the sidebar and the index once it has a page at its href.
// Blocks are listed on /blocks instead.
export const registryItems = catalog.items
  .filter(
    (item) =>
      item.type !== "registry:block" &&
      !item.categories?.includes("utility") &&
      !item.categories?.includes("helper") &&
      !item.categories?.includes("ai")
  )
  .map((item) => {
    const categories: readonly string[] =
      "categories" in item ? item.categories : []
    return {
      name: item.name,
      group: groupOf(categories),
      organ: categories.includes("organ"),
      disease: categories.includes("disease"),
      // Organs, tissues and diseases each carry one body system.
      system: bodySystems.find(({ id }) => categories.includes(id))?.id,
      // The organs or tissues a disease is drawn on, one per scale, the
      // default first: its OrganUI dependencies besides the viewer.
      bases: categories.includes("disease")
        ? (item.registryDependencies ?? [])
            .filter(
              (name) =>
                name.startsWith("@organui/") &&
                name !== "@organui/organ-viewer" &&
                name !== "@organui/disease-viewer"
            )
            .map((name) => name.replace("@organui/", ""))
        : [],
      // Items built on the organ viewer with a model: organs, diseases, the
      // cell and tissues.
      model:
        categories.includes("organ") ||
        categories.includes("disease") ||
        categories.includes("cell") ||
        categories.includes("tissue"),
      title: item.title ?? item.name,
      description: item.description,
      href: `/docs/components/${item.name}`,
      json: `/r/${item.name}.json`,
      install: install(item),
    }
  })
  // Grouped in sidebar order, then by title.
  .sort(
    (a, b) =>
      componentGroups.findIndex(({ id }) => id === a.group) -
        componentGroups.findIndex(({ id }) => id === b.group) ||
      a.title.localeCompare(b.title)
  )

export type RegistryItem = (typeof registryItems)[number]

export const organs = registryItems.filter(({ organ }) => organ)

export const diseases = registryItems.filter(({ disease }) => disease)

// TypeScript helpers that install in lib, under /docs/helpers.
export const helperItems = catalog.items
  .filter((item) => item.categories?.includes("helper"))
  .map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description,
    href: `/docs/helpers/${item.name}`,
    json: `/r/${item.name}.json`,
    install: install(item),
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

const utilitiesItem = catalog.items.find(({ name }) => name === "utilities")
if (!utilitiesItem) throw new Error("No utilities item in the registry")

// The CSS utilities install together, as shadcn's come in one stylesheet;
// each family of classes has its own page under /docs/utilities.
export const utilityItems = [
  {
    name: "ecg-grid",
    title: "ecg-grid",
    description: "Utilities for drawing ECG paper behind a trace.",
  },
  {
    name: "heartbeat",
    title: "heartbeat",
    description: "Utilities for pulsing an element like a heartbeat.",
  },
  {
    name: "severity",
    title: "severity",
    description:
      "Theme colours for clinical severity: normal, info, warning and critical.",
  },
].map((page) => ({
  ...page,
  href: `/docs/utilities/${page.name}`,
  install: install(utilitiesItem),
}))

// Patterns for AI in clinical interfaces, under /docs/ai-elements, in the
// order a reviewer meets them.
const aiOrder = [
  "ai-disclaimer",
  "ai-note",
  "clinical-citation",
  "clinical-sources",
  "differential-list",
  "clinician-review",
]

export const aiItems = catalog.items
  .filter((item) => item.categories?.includes("ai"))
  .map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description,
    href: `/docs/ai-elements/${item.name}`,
    json: `/r/${item.name}.json`,
    install: install(item),
  }))
  .sort((a, b) => aiOrder.indexOf(a.name) - aiOrder.indexOf(b.name))

// Where the CLI writes each file, relative to a Next.js app with the default
// aliases. Pages only install in frameworks with file routing.
export function installedPath(file: {
  path: string
  type: string
  target?: string
}) {
  if (file.target) return file.target
  const name = file.path.split("/").at(-1)
  if (file.type === "registry:lib") return `lib/${name}`
  return file.type === "registry:ui"
    ? `components/ui/${name}`
    : `components/${name}`
}

export const registryBlocks = catalog.items
  .filter(
    (item) =>
      item.type === "registry:block" && !item.categories?.includes("charts")
  )
  .map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description,
    href: `/blocks#${item.name}`,
    view: `/view/${item.name}`,
    // The height /blocks frames the block's page at on wide screens.
    frameHeight:
      ("meta" in item ? item.meta?.iframeHeight : undefined) ?? "44rem",
    json: `/r/${item.name}.json`,
    install: install(item),
    files: item.files.map((file) => ({
      path: file.path,
      installed: installedPath(file),
    })),
    // OrganUI items the block installs as dependencies, each documented on
    // its own page.
    uses: item.registryDependencies
      .filter((name) => name.startsWith("@organui/"))
      .map((name) => name.replace("@organui/", "")),
  }))

// The CLI fills {style} from components.json, so each project gets the
// build for its library: Radix styles need this, Base UI styles work with or
// without it.
// The chart types /charts shows, each a page of charts, as on shadcn/ui.
export const chartTypes = [
  { type: "area", title: "Area Charts" },
  { type: "bar", title: "Bar Charts" },
  { type: "line", title: "Line Charts" },
  { type: "pie", title: "Pie Charts" },
  { type: "radar", title: "Radar Charts" },
  { type: "radial", title: "Radial Charts" },
  { type: "tooltip", title: "Tooltips" },
] as const

export type ChartType = (typeof chartTypes)[number]["type"]

export const chartItems = catalog.items
  .filter((item) => item.categories?.includes("charts"))
  .map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description,
    type: (item.categories ?? [])
      .find((category) => category.startsWith("charts-"))!
      .replace("charts-", "") as ChartType,
    // Interactive charts span the grid, as on shadcn/ui.
    fullWidth: Boolean("meta" in item && item.meta?.fullWidth),
    install: install(item),
  }))

export const registryNamespace = JSON.stringify(
  { registries: { "@organui": `${site.url}/r/styles/{style}/{name}.json` } },
  null,
  2
)

export type NavLink = {
  title: string
  href: string
  /** Pages outside its address that belong to it, such as each disease. */
  pages?: string[]
}

export type DocsNavSection = { title: string; items: NavLink[] }

// The guides under /docs, in reading order.
export const guides: (NavLink & { description: string })[] = [
  {
    title: "Introduction",
    href: "/docs",
    description: "What OrganUI is and how its components reach your project.",
  },
  {
    title: "Installation",
    href: "/docs/installation",
    description: "Set up a project and install components by name or address.",
  },
  {
    title: "Theming",
    href: "/docs/theming",
    description: "The design tokens components read, and dark mode.",
  },
  {
    title: "Base UI and Radix",
    href: "/docs/base-ui",
    description:
      "Install on either library, and the items that ship a copy for each.",
  },
  {
    title: "Forms",
    href: "/docs/forms",
    description:
      "Use the clinical inputs in forms with React Hook Form, Zod and shadcn's Field.",
  },
  {
    title: "Clinical charts",
    href: "/docs/clinical-charts",
    description:
      "The conventions the charts follow, so health data reads the way clinicians expect.",
  },
  {
    title: "Licences",
    href: "/docs/licences",
    description: "MIT code, and the licence each model and dataset keeps.",
  },
  {
    title: "MCP",
    href: "/docs/mcp",
    description:
      "Browse and install components from an AI assistant, and read the docs as Markdown.",
  },
  {
    title: "Changelog",
    href: "/docs/changelog",
    description: "What each release added and changed.",
  },
]

// Setting up a new project in each framework the registry is tested with.
export const installationGuides: (NavLink & { description: string })[] = [
  {
    title: "Next.js",
    href: "/docs/installation/next",
    description: "Create a Next.js app with shadcn and add OrganUI components.",
  },
  {
    title: "Vite",
    href: "/docs/installation/vite",
    description: "Create a Vite app with shadcn and add OrganUI components.",
  },
]

export const componentsIndex: NavLink & { description: string } = {
  title: "Components",
  href: "/docs/components",
  description: "Every OrganUI component, grouped by category.",
}

export const aiIndex: NavLink & { description: string } = {
  title: "AI Elements",
  href: "/docs/ai-elements",
  description:
    "Patterns for AI in clinical interfaces: disclosure, sources, reasoning and sign-off.",
}

export const utilitiesIndex: NavLink & { description: string } = {
  title: "Utilities",
  href: "/docs/utilities",
  description: "Tailwind utilities for clinical interfaces, in one install.",
}

export const helpersIndex: NavLink & { description: string } = {
  title: "Helpers",
  href: "/docs/helpers",
  description:
    "Clinical calculations in TypeScript: ages, z-scores, reference ranges, units and body measurements.",
}

export const organsPage: NavLink & { description: string } = {
  title: "Organs",
  href: "/docs/components/organs",
  description: "Every organ as a picture, linking to its page.",
}

export const diseasesPage: NavLink & { description: string } = {
  title: "Diseases",
  href: "/docs/components/diseases",
  // The sidebar leaves the diseases out, so their gallery is their section.
  pages: diseases.map(({ href }) => href),
  description:
    "Every disease by body system, each shown on the organ or tissue it affects.",
}

export const mainNav: NavLink[] = [
  { title: "Docs", href: "/docs" },
  { title: "Components", href: componentsIndex.href },
  { title: organsPage.title, href: organsPage.href },
  {
    title: diseasesPage.title,
    href: diseasesPage.href,
    pages: diseasesPage.pages,
  },
  { title: "Blocks", href: "/blocks" },
  { title: "Charts", href: "/charts/area" },
  { title: "Create", href: "/create" },
]

// Pages added in the latest release, marked with a dot in the sidebar.
export const pagesNew: string[] = [
  "/docs/base-ui",
  "/docs/forms",
  "/docs/clinical-charts",
  aiIndex.href,
  helpersIndex.href,
  utilitiesIndex.href,
]

// The sidebar lists the guides and every component but the diseases, which
// grow one by one and are browsed in their gallery instead.
export const docsNav: DocsNavSection[] = [
  {
    title: "Sections",
    items: [
      ...guides,
      componentsIndex,
      diseasesPage,
      aiIndex,
      helpersIndex,
      utilitiesIndex,
    ],
  },
  { title: "Installation", items: installationGuides },
  ...componentGroups
    .filter(({ id }) => id !== "diseases")
    .flatMap(({ id, title }) => [
      // AI Elements and utilities come before the organs and what they're
      // built on.
      ...(id === "building-blocks"
        ? [
            {
              title: aiIndex.title,
              items: aiItems.map(({ title, href }) => ({ title, href })),
            },
            {
              title: helpersIndex.title,
              items: helperItems.map(({ title, href }) => ({ title, href })),
            },
            {
              title: utilitiesIndex.title,
              items: utilityItems.map(({ title, href }) => ({ title, href })),
            },
          ]
        : []),
      {
        title,
        items: registryItems
          .filter((item) => item.group === id)
          .map(({ title, href }) => ({ title, href })),
      },
    ]),
]

// Reading order for the previous and next links.
// The organs gallery comes before the organs and the diseases gallery before
// the diseases.
// The framework guides follow Installation. Every docs page is here once.
export const pageOrder: NavLink[] = [
  ...guides.flatMap((guide) =>
    guide.href === "/docs/installation"
      ? [guide, ...installationGuides]
      : [guide]
  ),
  componentsIndex,
  ...registryItems.flatMap(({ title, href, name }) => [
    ...(name === organs[0]?.name ? [organsPage] : []),
    ...(name === diseases[0]?.name ? [diseasesPage] : []),
    { title, href },
  ]),
  aiIndex,
  ...aiItems.map(({ title, href }) => ({ title, href })),
  helpersIndex,
  ...helperItems.map(({ title, href }) => ({ title, href })),
  utilitiesIndex,
  ...utilityItems.map(({ title, href }) => ({ title, href })),
]

export function neighbours(href: string) {
  const index = pageOrder.findIndex((page) => page.href === href)
  return {
    previous: index > 0 ? pageOrder[index - 1] : undefined,
    next: index >= 0 ? pageOrder[index + 1] : undefined,
  }
}

// Shared metadata for component pages.
export function docsMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  // Listed by hand on purpose: a page's own openGraph replaces the root
  // opengraph-image, so without this docs pages share no image (see #90).
  // Each page gets a card with its own title and summary.
  const query = new URLSearchParams({ title, description })
  const images = [
    {
      url: `/og?${query}`,
      alt: `${title} — OrganUI`,
      width: 1200,
      height: 630,
    },
  ]
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${title} — OrganUI`,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      site: "@organui",
      title: `${title} — OrganUI`,
      description,
      images,
    },
  }
}

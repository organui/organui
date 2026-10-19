import type { Metadata } from "next"
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
    categories: ["molecular", "cell"],
  },
  // The viewer and the tree come first: every organ is built on them.
  { id: "organs", title: "Organs", categories: ["anatomy", "organ"] },
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
  .filter((item) => item.type !== "registry:block")
  .map((item) => {
    const categories: readonly string[] =
      "categories" in item ? item.categories : []
    return {
      name: item.name,
      group: groupOf(categories),
      organ: categories.includes("organ"),
      // Items built on the organ viewer with a model: organs and the cell.
      model: categories.includes("organ") || categories.includes("cell"),
      title: item.title ?? item.name,
      description: item.description,
      href: `/docs/components/${item.name}`,
      json: `/r/${item.name}.json`,
      install: install(item),
    }
  })
  // Grouped in sidebar order; anatomy items lead the organs, then by title.
  .sort(
    (a, b) =>
      componentGroups.findIndex(({ id }) => id === a.group) -
        componentGroups.findIndex(({ id }) => id === b.group) ||
      Number(a.organ) - Number(b.organ) ||
      a.title.localeCompare(b.title)
  )

export type RegistryItem = (typeof registryItems)[number]

export const organs = registryItems.filter(({ organ }) => organ)

// Where the CLI writes each file, relative to a Next.js app with the default
// aliases. Pages only install in frameworks with file routing.
function installedPath(file: { path: string; type: string; target?: string }) {
  if (file.target) return file.target
  const name = file.path.split("/").at(-1)
  return file.type === "registry:ui"
    ? `components/ui/${name}`
    : `components/${name}`
}

export const registryBlocks = catalog.items
  .filter((item) => item.type === "registry:block")
  .map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description,
    href: `/blocks#${item.name}`,
    view: `/view/${item.name}`,
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

export const registryNamespace = JSON.stringify(
  { registries: { "@organui": `${site.url}/r/{name}.json` } },
  null,
  2
)

// Shared style for the scrollable, focusable code regions on docs pages.
export const codeBlock =
  "overflow-auto rounded-lg border bg-muted/30 p-4 text-sm focus-visible:outline-2 focus-visible:outline-ring"

export type NavLink = { title: string; href: string }

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
    title: "Base UI",
    href: "/docs/base-ui",
    description: "Why items with controls need one of shadcn's Base UI styles.",
  },
  {
    title: "Licences",
    href: "/docs/licences",
    description: "MIT code, and the licence each model and dataset keeps.",
  },
]

export const componentsIndex: NavLink & { description: string } = {
  title: "Components",
  href: "/docs/components",
  description: "Every OrganUI component, grouped by category.",
}

export const organsHref = "/docs/components#organs"

export const mainNav: NavLink[] = [
  { title: "Docs", href: "/docs" },
  { title: "Components", href: componentsIndex.href },
  { title: "Organs", href: organsHref },
  { title: "Blocks", href: "/blocks" },
]

// The sidebar lists the guides and every component except the organs, which
// are one link to their section of the index; each organ page is still in
// search and in the previous and next links.
export const docsNav: DocsNavSection[] = [
  { title: "Sections", items: [...guides, componentsIndex] },
  ...componentGroups.map(({ id, title }) => ({
    title,
    items: [
      ...registryItems
        .filter((item) => item.group === id && !item.organ)
        .map(({ title, href }) => ({ title, href })),
      ...(id === "organs"
        ? [{ title: `Browse all ${organs.length} organs`, href: organsHref }]
        : []),
    ],
  })),
]

// Reading order for the previous and next links.
const pageOrder: NavLink[] = [
  ...guides,
  componentsIndex,
  ...registryItems.map(({ title, href }) => ({ title, href })),
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
  const images = [
    { url: site.socialImage, alt: site.title, width: 1200, height: 630 },
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

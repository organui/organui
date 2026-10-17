import type { Metadata } from "next"
import catalog from "@workspace/registry/registry.json"
import { site } from "@/lib/site"

export const shadcn = "shadcn@4.21.0"

// The registry catalog is the single source for what the docs list, so a new
// item appears in the sidebar and the index once it has a page at its href.
// Blocks are listed on /blocks instead.
export const registryItems = catalog.items
  .filter((item) => item.type !== "registry:block")
  .map((item) => ({
    name: item.name,
    organ: "categories" in item && item.categories?.includes("organ") === true,
    title: item.title ?? item.name,
    description: item.description,
    href: `/docs/${item.name}`,
    json: `/r/${item.name}.json`,
    install: `bunx ${shadcn} add ${site.url}/r/${item.name}.json`,
  }))

// Where the CLI writes each file, relative to a Next.js app with the default
// aliases. Pages only install in frameworks with file routing.
function installedPath(file: { path: string; type: string; target?: string }) {
  if (file.target) return file.target
  const name = file.path.split("/").at(-1)
  return file.type === "registry:ui"
    ? `components/ui/${name}`
    : `components/${name}`
}

// Files a block shares with component items are documented on the first
// item that ships them, such as organ-viewer.tsx on the organ viewer.
const shared = new Map<string, string>()
for (const item of catalog.items)
  if (item.type !== "registry:block")
    for (const { path } of item.files)
      if (!shared.has(path)) shared.set(path, item.name)

export const registryBlocks = catalog.items
  .filter((item) => item.type === "registry:block")
  .map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description,
    href: `/blocks#${item.name}`,
    view: `/view/${item.name}`,
    json: `/r/${item.name}.json`,
    install: `bunx ${shadcn} add ${site.url}/r/${item.name}.json`,
    files: item.files.map((file) => ({
      path: file.path,
      installed: installedPath(file),
      // The registry item that documents a shared file, if any.
      item: shared.get(file.path) ?? null,
    })),
  }))

export const registryNamespace = JSON.stringify(
  { registries: { "@organui": `${site.url}/r/{name}.json` } },
  null,
  2
)

// Shared style for the scrollable, focusable code regions on docs pages.
export const codeBlock =
  "overflow-auto rounded-lg border bg-muted/30 p-4 text-sm focus-visible:outline-2 focus-visible:outline-ring"

export type DocsNavSection = {
  title: string
  items: { title: string; href: string }[]
}

export const docsNav: DocsNavSection[] = [
  {
    title: "Getting started",
    items: [{ title: "Introduction", href: "/docs" }],
  },
  {
    title: "Components",
    items: registryItems
      .filter(({ organ }) => !organ)
      .map(({ title, href }) => ({ title, href })),
  },
  {
    title: "Organs",
    items: registryItems
      .filter(({ organ }) => organ)
      .map(({ title, href }) => ({ title, href })),
  },
]

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

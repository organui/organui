import catalog from "@workspace/registry/registry.json"
import { site } from "@/lib/site"

export const shadcn = "shadcn@4.21.0"

// The registry catalog is the single source for what the docs list, so a new
// item appears in the sidebar and the index once it has a page at its href.
export const registryItems = catalog.items.map((item) => ({
  name: item.name,
  title: item.title,
  description: item.description,
  href: `/docs/${item.name}`,
  json: `/r/${item.name}.json`,
  install: `bunx ${shadcn} add ${site.url}/r/${item.name}.json`,
}))

export const registryNamespace = JSON.stringify(
  { registries: { "@organui": `${site.url}/r/{name}.json` } },
  null,
  2
)

export const docsNav = [
  {
    title: "Getting started",
    items: [{ title: "Introduction", href: "/docs" }],
  },
  {
    title: "Components",
    items: registryItems.map(({ title, href }) => ({ title, href })),
  },
]

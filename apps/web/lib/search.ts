import {
  componentGroups,
  componentsIndex,
  guides,
  mainNav,
  registryBlocks,
  registryItems,
} from "@/lib/registry"

export type SearchEntry = {
  title: string
  href: string
  description?: string
  // Copied with ⌘C, as on shadcn/ui's site.
  install?: string
}

export type SearchGroup = { heading: string; entries: SearchEntry[] }

// Everything the ⌘K menu can open. It is served as /search.json and fetched
// when the menu first opens, so pages don't carry the catalog.
export const searchIndex: SearchGroup[] = [
  {
    heading: "Pages",
    entries: mainNav.map(({ title, href }) => ({ title, href })),
  },
  { heading: "Docs", entries: [...guides, componentsIndex] },
  ...componentGroups.map(({ id, title }) => ({
    heading: title,
    entries: registryItems
      .filter((item) => item.group === id)
      .map(({ title, href, description, install }) => ({
        title,
        href,
        description,
        install,
      })),
  })),
  {
    heading: "Blocks",
    entries: registryBlocks.map(({ title, href, description, install }) => ({
      title,
      href,
      description,
      install,
    })),
  },
]

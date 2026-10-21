import { CreateStudio, type CreateGroup } from "@/components/create-studio"
import { SiteHeader } from "@/components/site-header"
import { ThemeShowcase } from "@/components/theme-showcase"
import {
  aiItems,
  componentGroups,
  docsMetadata,
  helperItems,
  registryItems,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Create",
  "Pick a library, framework, theme and icons, choose OrganUI items, and copy the commands that set up the project.",
  "/create"
)

const pick = (items: { name: string; title: string }[]) =>
  items.map(({ name, title }) => ({ name, title }))

const groups: CreateGroup[] = [
  ...componentGroups.map(({ id, title }) => ({
    title,
    items: pick(registryItems.filter((item) => item.group === id)),
  })),
  { title: "AI Elements", items: pick(aiItems) },
  { title: "Helpers", items: pick(helperItems) },
  { title: "Utilities", items: [{ name: "utilities", title: "Utilities" }] },
]

// A workspace rather than a page, as on shadcn/ui: no footer.
export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <h1 className="sr-only">Create a project</h1>
        <CreateStudio shadcn={shadcn} site={site.url} groups={groups}>
          <ThemeShowcase />
        </CreateStudio>
      </main>
    </div>
  )
}

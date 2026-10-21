import { CreateStudio, type CreateGroup } from "@/components/create-studio"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeShowcase } from "@/components/theme-showcase"
import {
  aiItems,
  componentGroups,
  docsMetadata,
  registryItems,
  shadcn,
  utilityItems,
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
  { title: "Utilities", items: pick(utilityItems) },
]

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          title="Create"
          description="Pick a library, framework, theme and icons, choose the OrganUI items you need, and copy two commands to set up the project."
        />
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 lg:px-8">
          <CreateStudio shadcn={shadcn} site={site.url} groups={groups}>
            <ThemeShowcase />
          </CreateStudio>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

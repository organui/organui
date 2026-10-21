import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeShowcase } from "@/components/theme-showcase"
import { ThemeStudio } from "@/components/theme-studio"
import { docsMetadata } from "@/lib/registry"

export const metadata = docsMetadata(
  "Themes",
  "OrganUI components in each of shadcn's colour themes, with the CSS to copy.",
  "/themes"
)

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          title="Themes"
          description="OrganUI components read your shadcn theme. Pick a base colour, an accent and a radius to see them in it, then copy the CSS."
        >
          <Link
            href="/create"
            className={cn(buttonVariants({ size: "sm" }), "h-[35px] px-4")}
          >
            Create a project
          </Link>
          <Link
            href="/colors"
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "h-[35px] px-4"
            )}
          >
            Colours
          </Link>
        </PageHeader>
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 lg:px-8">
          <ThemeStudio>
            <ThemeShowcase />
          </ThemeStudio>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

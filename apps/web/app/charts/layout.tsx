import type { ReactNode } from "react"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { ChartsNav } from "@/components/charts-nav"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

// /charts/<type>, laid out as shadcn/ui's charts: a header, the types, and
// a grid of charts built with its chart component.
export default function ChartsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          title="Charts for Health Data"
          description="Vitals, labs, beds and outcomes on shadcn's chart component, built with Recharts. Copy and paste them into your apps."
        >
          <a
            href="#charts"
            className={cn(buttonVariants({ size: "sm" }), "h-[35px] px-4")}
          >
            Browse Charts
          </a>
          <a
            href="https://ui.shadcn.com/docs/components/chart"
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "h-[35px] px-4"
            )}
          >
            Documentation
          </a>
        </PageHeader>
        <div
          id="charts"
          className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-4 py-4 lg:px-8"
        >
          <ChartsNav />
        </div>
        <div className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-16 lg:px-8">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

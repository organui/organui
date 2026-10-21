import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ChartCode } from "@/components/chart-code"
import { ComponentSource } from "@/components/component-source"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getRegistryExample } from "@/examples/_registry"
import { chartGroups } from "@/lib/charts"
import { docsMetadata } from "@/lib/registry"

export const metadata = docsMetadata(
  "Charts",
  "Growth curves, ECG strips, lab trends and vital signs, each with the code to copy.",
  "/charts"
)

async function ChartCard({
  name,
  title,
  description,
}: {
  name: string
  title: string
  description: string
}) {
  const example = await getRegistryExample(name)
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <ChartCode title={title}>
            <ComponentSource name={name} />
          </ChartCode>
        </CardAction>
      </CardHeader>
      <CardContent className="min-w-0">{example?.component}</CardContent>
    </Card>
  )
}

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          title="Charts"
          description="Growth curves, ECG strips, lab trends and vital signs, drawn by OrganUI components. Copy any of them into your app."
        >
          <a
            href="#charts"
            className={cn(buttonVariants({ size: "sm" }), "h-[35px] px-4")}
          >
            Browse Charts
          </a>
          <Link
            href="/docs/components"
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "h-[35px] px-4"
            )}
          >
            View Components
          </Link>
        </PageHeader>
        <div
          id="charts"
          className="mx-auto flex w-full max-w-[1400px] scroll-mt-24 flex-col gap-12 px-4 pb-16 lg:px-8"
        >
          <nav
            aria-label="Charts"
            className="flex flex-wrap items-center gap-1"
          >
            {chartGroups.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                {group.title}
              </a>
            ))}
          </nav>
          {chartGroups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              aria-label={`${group.title} charts`}
              className="flex scroll-mt-24 flex-col gap-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold tracking-tight">
                  {group.title}
                </h2>
                <Link
                  href={group.component.href}
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {group.component.title} docs
                </Link>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.charts.map((chart) => (
                  <ChartCard key={chart.name} {...chart} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

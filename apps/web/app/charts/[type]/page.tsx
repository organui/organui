import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { ChartDisplay } from "@/components/chart-display"
import { chartItems, chartTypes, docsMetadata } from "@/lib/registry"

type Props = { params: Promise<{ type: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return chartTypes.map(({ type }) => ({ type }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const found = chartTypes.find((entry) => entry.type === type)
  if (!found) return {}
  return docsMetadata(
    found.title,
    `${found.title} for health data, built with shadcn's chart component.`,
    `/charts/${found.type}`
  )
}

export default async function Page({ params }: Props) {
  const { type } = await params
  const found = chartTypes.find((entry) => entry.type === type)
  if (!found) notFound()
  // Full-width charts lead, so no row is left part-filled above them.
  const charts = chartItems
    .filter((chart) => chart.type === type)
    .sort((a, b) => Number(b.fullWidth) - Number(a.fullWidth))
  // Dashed cells complete the last row on wide screens, as on shadcn/ui.
  const cells = charts.reduce(
    (sum, chart) => sum + (chart.fullWidth ? 3 : 1),
    0
  )
  const empty = (3 - (cells % 3)) % 3
  return (
    <section aria-label={found.title} className="flex flex-col">
      <h2 className="sr-only">{found.title}</h2>
      <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
        {charts.map((chart) => (
          <ChartDisplay
            key={chart.name}
            chart={chart}
            className={cn(chart.fullWidth && "md:col-span-2 lg:col-span-3")}
          />
        ))}
        {Array.from({ length: empty }, (_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="hidden min-h-80 rounded-xl border border-dashed lg:block"
          />
        ))}
      </div>
    </section>
  )
}

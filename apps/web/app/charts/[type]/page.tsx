import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
  return (
    <section aria-label={found.title} className="flex flex-col">
      <h2 className="sr-only">{found.title}</h2>
      <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:gap-10">
        {chartItems
          .filter((chart) => chart.type === type)
          .map((chart) => (
            <ChartDisplay key={chart.name} chart={chart} />
          ))}
      </div>
    </section>
  )
}

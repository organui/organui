import type { ComponentType } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { ChartToolbar } from "@/components/chart-toolbar"
import { CodeSnippet } from "@/components/code-snippet"
import { readRegistryItem } from "@/lib/registry-item"
import type { chartItems } from "@/lib/registry"

// A chart and its toolbar, as on shadcn/ui's /charts. The code shown is the
// file the CLI installs.
export async function ChartDisplay({
  chart,
  className,
}: {
  chart: (typeof chartItems)[number]
  className?: string
}) {
  const exports = (await import(
    `@workspace/registry/charts/${chart.name}`
  )) as Record<string, unknown>
  const Chart = Object.entries(exports).find(
    ([name, value]) => name.startsWith("Chart") && typeof value === "function"
  )?.[1] as ComponentType | undefined
  const { files } = await readRegistryItem(chart.name)
  const code = files[0]?.content ?? ""
  return (
    <div
      id={chart.name}
      className={cn(
        "group relative flex scroll-mt-24 flex-col overflow-hidden rounded-xl",
        className
      )}
    >
      <ChartToolbar
        title={chart.title}
        type={chart.type}
        code={code}
        install={chart.install}
      >
        <CodeSnippet
          label={`${chart.title} code`}
          title={files[0]?.installed}
          code={code}
        />
      </ChartToolbar>
      <div className="relative overflow-hidden rounded-xl bg-background *:data-[slot=card]:h-full">
        {Chart && <Chart />}
      </div>
    </div>
  )
}

import type { ComponentProps, ComponentType } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { ChartToolbar } from "@/components/chart-toolbar"
import { CodeBlockCommand } from "@/components/code-block-command"
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
        deprecated={chart.deprecated}
      >
        {/* Laid out as shadcn/ui's chart code: a bar with the file's name,
            then numbered lines that scroll without a scrollbar. The install
            command follows, so the sheet says how to add the chart. */}
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <CodeSnippet
            label={`${chart.title} code`}
            title={files[0]?.installed}
            icon={<TypeScriptIcon className="fill-foreground" />}
            lineNumbers
            event="copy_chart_code"
            properties={{ chart: chart.title, from: "sheet" }}
            code={code}
            className="min-h-0 flex-1 rounded-xl"
            headerClassName="h-12 border-b pt-0 pe-12"
            contentClassName="min-h-0 flex-1 no-scrollbar!"
          />
          <CodeBlockCommand
            label={`${chart.title} install command`}
            command={chart.install}
          />
        </div>
      </ChartToolbar>
      {/* Cards in a row share its height, their footers at the bottom. */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl bg-background *:data-[slot=card]:flex-1 **:data-[slot=card-content]:flex-1">
        {Chart && <Chart />}
      </div>
    </div>
  )
}

// TypeScript's logo, as shadcn/ui marks its code files. From Simple Icons
// (CC0).
function TypeScriptIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
    </svg>
  )
}

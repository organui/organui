"use client"

import { useState, type ReactNode } from "react"
import {
  AreaChartIcon,
  BarChartBigIcon,
  CheckIcon,
  CopyIcon,
  HexagonIcon,
  LineChartIcon,
  MousePointer2Icon,
  PieChartIcon,
  RadarIcon,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer"
import { Separator } from "@workspace/ui/components/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { useIsMobile } from "@workspace/ui/hooks/use-mobile"
import type { ChartType } from "@/lib/registry"
import { copyText } from "@workspace/ui/lib/copy-text"
import { trackEvent } from "@/lib/events"

const kinds: Record<ChartType, { icon: LucideIcon; label: string }> = {
  area: { icon: AreaChartIcon, label: "Area Chart" },
  bar: { icon: BarChartBigIcon, label: "Bar Chart" },
  line: { icon: LineChartIcon, label: "Line Chart" },
  pie: { icon: PieChartIcon, label: "Pie Chart" },
  radar: { icon: HexagonIcon, label: "Radar Chart" },
  radial: { icon: RadarIcon, label: "Radial Chart" },
  tooltip: { icon: MousePointer2Icon, label: "Tooltip" },
}

// Above each chart, as on shadcn/ui: its kind, then copy and view its code.
// The code opens beside the page in a sheet, or from the bottom on phones.
// It holds only the code, as shadcn/ui's does, so it opens without drawing
// the chart a second time.
export function ChartToolbar({
  title,
  type,
  code,
  children,
}: {
  title: string
  type: ChartType
  code: string
  // The highlighted code.
  children: ReactNode
}) {
  const [copied, setCopied] = useState(false)
  const isMobile = useIsMobile()
  const { icon: Icon, label } = kinds[type]

  const button = (
    <Button variant="outline" size="xs" aria-label={`View code: ${title}`} />
  )
  const header = {
    title: `${title} code`,
    description: "The chart's code, as the CLI installs it.",
  }
  const content = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col p-4 *:min-h-0 *:flex-1">
      {children}
    </div>
  )

  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <div className="flex items-center gap-1.5 pl-1 text-[13px] text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Copy code: ${title}`}
                onClick={() =>
                  copyText(code).then((ok) => {
                    if (!ok) return
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                    trackEvent("copy_chart_code", {
                      chart: title,
                      from: "toolbar",
                    })
                  })
                }
              />
            }
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied" : "Copy code"}</TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="hidden md:block data-vertical:h-4 data-vertical:self-center"
        />
        {isMobile ? (
          <Drawer>
            <DrawerTrigger render={button}>View Code</DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader className="sr-only">
                <DrawerTitle>{header.title}</DrawerTitle>
                <DrawerDescription>{header.description}</DrawerDescription>
              </DrawerHeader>
              <div className="flex min-h-0 flex-col overflow-auto">
                {content}
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Sheet>
            <SheetTrigger render={button}>View Code</SheetTrigger>
            {/* Slides in from off screen like shadcn/ui's Radix sheet, slower
                to open than to close, rather than nova's short fade. Its
                close button sits at the end of the code's header bar. */}
            <SheetContent
              side="right"
              data-chart-code=""
              className="gap-0 bg-background p-0 duration-500 data-ending-style:opacity-100 data-ending-style:duration-300 data-starting-style:opacity-100 data-[side=right]:w-full data-[side=right]:data-ending-style:translate-x-full data-[side=right]:data-starting-style:translate-x-full **:data-[slot=sheet-close]:top-6 **:data-[slot=sheet-close]:right-6 data-[side=right]:sm:max-w-[700px]"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>{header.title}</SheetTitle>
                <SheetDescription>{header.description}</SheetDescription>
              </SheetHeader>
              {content}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, type ReactNode } from "react"
import {
  AreaChartIcon,
  BarChartBigIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  HexagonIcon,
  LineChartIcon,
  PieChartIcon,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Separator } from "@workspace/ui/components/separator"
import type { ChartType } from "@/lib/registry"
import { copyText } from "@workspace/ui/lib/copy-text"
import { trackEvent } from "@/lib/events"

const kinds: Record<ChartType, { icon: LucideIcon; label: string }> = {
  area: { icon: AreaChartIcon, label: "Area Chart" },
  bar: { icon: BarChartBigIcon, label: "Bar Chart" },
  line: { icon: LineChartIcon, label: "Line Chart" },
  pie: { icon: PieChartIcon, label: "Pie Chart" },
  radar: { icon: HexagonIcon, label: "Radar Chart" },
  radial: { icon: PieChartIcon, label: "Radial Chart" },
}

// Above each chart, as on shadcn/ui: its kind, then copy and view its code.
export function ChartToolbar({
  title,
  type,
  code,
  install,
  children,
}: {
  title: string
  type: ChartType
  code: string
  install: string
  // The highlighted code, for the dialog.
  children: ReactNode
}) {
  const [copied, setCopied] = useState(false)
  const { icon: Icon, label } = kinds[type]
  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      <div className="flex items-center gap-1.5 pl-1 text-[13px] text-muted-foreground">
        <Icon aria-hidden="true" className="size-3.5" />
        {label}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Copy code: ${title}`}
          onClick={() =>
            copyText(code).then((ok) => {
              if (!ok) return
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
              trackEvent("copy_chart_code", { chart: title })
            })
          }
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
        <Separator
          orientation="vertical"
          className="hidden md:block data-vertical:h-4 data-vertical:self-center"
        />
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="xs"
                aria-label={`View code: ${title}`}
              />
            }
          >
            <CodeIcon data-icon="inline-start" />
            View Code
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                Install it with <code>{install}</code>, or copy the code.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60svh] min-w-0 overflow-auto">
              {children}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

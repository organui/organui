"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

// Long code starts folded, with Expand to show all of it, as on shadcn/ui.
export function CodeCollapsible({
  label,
  className,
  children,
}: {
  // Names the code, for the button.
  label: string
  className?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const id = React.useId()
  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn("group/collapsible relative", className)}
    >
      <div
        id={id}
        className="overflow-hidden rounded-lg group-data-[state=closed]/collapsible:max-h-64"
      >
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center rounded-b-lg text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
          open
            ? "mt-2 w-full py-1"
            : "from-code/70 to-code absolute inset-x-px bottom-px h-20 bg-linear-to-b"
        )}
      >
        {open ? "Collapse" : "Expand"}
      </button>
    </div>
  )
}

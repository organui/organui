"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { copyText } from "@workspace/ui/lib/copy-text"
import { trackEvent } from "@/lib/events"

// A colour that copies its value on click, as on shadcn/ui's colors page.
export function ColorSwatch({
  name,
  value,
  className,
}: {
  name: string
  value: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      title={`Copy ${value}`}
      onClick={() =>
        copyText(value).then((ok) => {
          if (!ok) return
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
          trackEvent("copy_color", { name, value })
        })
      }
      className={cn(
        "group flex min-w-0 flex-col gap-1.5 rounded-md text-left text-xs outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <span
        className="flex aspect-[3/2] w-full items-center justify-center rounded-md border border-foreground/10 transition-transform group-hover:scale-105"
        style={{ background: value }}
      >
        {copied && (
          <CheckIcon className="size-4 text-white mix-blend-difference" />
        )}
      </span>
      <span className="truncate font-medium">
        <span className="sr-only">Copy </span>
        {name}
      </span>
      <span className="truncate font-mono text-muted-foreground">
        {copied ? "Copied" : value}
      </span>
    </button>
  )
}

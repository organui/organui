"use client"

import * as React from "react"
import { CodeBlockCopyButton } from "@workspace/ui/components/code-block"
import { trackEvent, type Event } from "@/lib/events"

// The code block's copy button, counting each copy, as shadcn/ui's does.
export function CopyButton({
  event,
  properties,
  onClick,
  ...props
}: React.ComponentProps<typeof CodeBlockCopyButton> & {
  event: Event
  properties?: Record<string, string>
}) {
  return (
    <CodeBlockCopyButton
      onClick={(clickEvent) => {
        onClick?.(clickEvent)
        trackEvent(event, properties)
      }}
      {...props}
    />
  )
}

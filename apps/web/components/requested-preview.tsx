"use client"

import { useState, type ReactNode } from "react"
import { examples } from "@/examples/_examples"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"

// A heavy example loaded in the browser only when asked for, for pages that
// list many of them: dozens of WebGL scenes would exceed browser context
// limits, and rendering them on the server would put every model in the page.
export function RequestedPreview({ name }: { name: string }) {
  const [preview, setPreview] = useState<ReactNode>(null)
  const [pending, setPending] = useState(false)
  const definition = examples[name]!
  if (preview) return <div className="w-full min-w-0">{preview}</div>
  return (
    <Button
      variant="outline"
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={async () => {
        setPending(true)
        setPreview(await definition.render())
      }}
      className="h-72 w-full"
    >
      {pending && <Spinner data-icon="inline-start" aria-hidden="true" />}
      {pending
        ? "Loading…"
        : `Load the ${definition.title.toLowerCase()} in 3D`}
    </Button>
  )
}

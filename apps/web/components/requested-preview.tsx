"use client"

import { useState, type ReactNode } from "react"
import { examples } from "@/examples/_examples"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"

// A heavy example loaded in the browser only when asked for, for pages that
// list many of them: dozens of WebGL scenes would exceed browser context
// limits, rendering them on the server would put every model in the page, and
// generated data such as the image viewer's phantom costs main-thread time.
// A failed load, such as a chunk that doesn't arrive offline, can be retried.
export function RequestedPreview({ name }: { name: string }) {
  const [preview, setPreview] = useState<ReactNode>(null)
  const [status, setStatus] = useState<"idle" | "pending" | "failed">("idle")
  const definition = examples[name]!
  if (preview) return <div className="w-full min-w-0">{preview}</div>
  const pending = status === "pending"
  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        variant="outline"
        type="button"
        disabled={pending}
        aria-busy={pending}
        onClick={async () => {
          setStatus("pending")
          try {
            setPreview(await definition.render())
            setStatus("idle")
          } catch {
            setStatus("failed")
          }
        }}
        className="h-72 w-full"
      >
        {pending && <Spinner data-icon="inline-start" aria-hidden="true" />}
        {pending
          ? "Loading…"
          : (definition.loadLabel ??
            `Load the ${definition.title.toLowerCase()} in 3D`)}
      </Button>
      {status === "failed" && (
        <p role="alert" className="text-sm text-destructive">
          The preview didn&apos;t load. Check your connection and try again.
        </p>
      )}
    </div>
  )
}

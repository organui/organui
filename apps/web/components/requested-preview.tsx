"use client"

import { useState, type ReactNode } from "react"
import { examples } from "@/examples/_examples"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"

// Loads an example's code on request. A failed load, such as a chunk that
// doesn't arrive offline, leaves the request button usable to try again.
export function useRequestedExample(name: string) {
  const [preview, setPreview] = useState<ReactNode>(null)
  const [status, setStatus] = useState<"idle" | "pending" | "failed">("idle")
  async function load() {
    if (preview || status === "pending") return
    setStatus("pending")
    try {
      setPreview(await examples[name]!.render())
      setStatus("idle")
    } catch {
      setStatus("failed")
    }
  }
  return {
    preview,
    pending: status === "pending",
    failed: status === "failed",
    load,
  }
}

export function RequestFailed() {
  return (
    <p role="alert" className="text-sm text-destructive">
      The preview didn&apos;t load. Check your connection and try again.
    </p>
  )
}

// A heavy example loaded in the browser only when asked for, for pages that
// list many of them: dozens of WebGL scenes would exceed browser context
// limits, rendering them on the server would put every model in the page, and
// generated data such as the image viewer's phantom costs main-thread time.
export function RequestedPreview({ name }: { name: string }) {
  const { preview, pending, failed, load } = useRequestedExample(name)
  const definition = examples[name]!
  if (preview) return <div className="w-full min-w-0">{preview}</div>
  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        variant="outline"
        type="button"
        disabled={pending}
        aria-busy={pending}
        onClick={load}
        className="h-72 w-full"
      >
        {pending && <Spinner data-icon="inline-start" aria-hidden="true" />}
        {pending
          ? "Loading…"
          : (definition.loadLabel ??
            `Load the ${definition.title.toLowerCase()} in 3D`)}
      </Button>
      {failed && <RequestFailed />}
    </div>
  )
}

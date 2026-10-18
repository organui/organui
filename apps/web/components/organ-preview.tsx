"use client"

import { createElement, useState, type ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"

// Index previews download a model only on request: thirty WebGL scenes on one
// page would exceed browser context limits and several hundred megabytes.
export function OrganPreview({ name, organ }: { name: string; organ: string }) {
  const [preview, setPreview] = useState<ReactNode>(null)
  const [pending, setPending] = useState(false)
  if (preview) return preview
  return (
    <Button
      variant="outline"
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={async () => {
        setPending(true)
        const [{ organModels }, { organComponents }] = await Promise.all([
          import("@/lib/organ-models"),
          import("@/lib/organ-components"),
        ])
        const [model, Component] = await Promise.all([
          organModels[name]!(),
          organComponents[name]!(),
        ])
        setPreview(
          createElement(Component, {
            src: model.src,
            controls: false,
            className: "h-72",
          })
        )
      }}
      className="h-72 w-full"
    >
      {pending && <Spinner data-icon="inline-start" aria-hidden="true" />}
      {pending ? "Loading…" : `Load the ${organ.toLowerCase()} in 3D`}
    </Button>
  )
}

"use client"

import { useState } from "react"
import {
  OrganViewer,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

// Index previews download a model only on request: thirty WebGL scenes on one
// page would exceed browser context limits and several hundred megabytes.
export function OrganPreview({ name, organ }: { name: string; organ: string }) {
  const [model, setModel] = useState<OrganModel | null>(null)
  const [pending, setPending] = useState(false)
  if (model)
    return <OrganViewer model={model} controls={false} className="h-72" />
  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        const { organModels } = await import("@/lib/organ-models")
        setModel(await organModels[name]!())
      }}
      className="flex h-72 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
    >
      {pending ? "Loading…" : `Load the ${organ.toLowerCase()} in 3D`}
    </button>
  )
}

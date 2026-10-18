"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Spinner } from "@workspace/ui/components/spinner"
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
    <Button
      variant="outline"
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={async () => {
        setPending(true)
        const { organModels } = await import("@/lib/organ-models")
        setModel(await organModels[name]!())
      }}
      className="h-72 w-full"
    >
      {pending && <Spinner data-icon="inline-start" aria-hidden="true" />}
      {pending ? "Loading…" : `Load the ${organ.toLowerCase()} in 3D`}
    </Button>
  )
}

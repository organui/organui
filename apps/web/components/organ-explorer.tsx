"use client"

import { useState } from "react"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import {
  OrganViewer,
  organAnatomyNodes,
  organDefaultVisibility,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

// The pairing documented on every organ page: the anatomy tree drives the
// viewer, and picks in 3D flow back to the tree.
export function OrganExplorer({ model }: { model: OrganModel }) {
  const [data] = useState(() => organAnatomyNodes(model))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibility, setVisibility] = useState(() =>
    organDefaultVisibility(model)
  )
  const [view, setView] = useState<string | null>(model.defaultView)
  const selected = model.structures.find(({ id }) => id === selectedId)
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="flex min-w-0 flex-col gap-3">
        <OrganViewer
          model={model}
          selectedId={selectedId}
          onSelectionChange={setSelectedId}
          visibility={visibility}
          onViewChange={setView}
          className="h-[28rem]"
        />
        <p className="text-sm text-muted-foreground" role="status">
          {selected
            ? `${selected.label}: ${selected.description ?? selected.group}`
            : `View: ${view ?? "Custom view"}. Select a structure in 3D or in the tree.`}
        </p>
      </div>
      <AnatomyTree
        data={data}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        label={`${model.name} anatomy`}
        // Small organs open fully; the skeleton and muscles start collapsed.
        defaultExpandedIds={
          model.structures.length <= 40 ? data.map(({ id }) => id) : []
        }
        className="max-h-[28rem] overflow-auto"
      />
    </div>
  )
}

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

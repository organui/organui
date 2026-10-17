"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import {
  OrganViewer,
  organAnatomyNodes,
  organDefaultVisibility,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

// The pairing documented on every organ page: the anatomy tree drives the
// viewer, and picks in 3D flow back to the tree. Like the explorers, the
// panel starts closed so the 3D view stands alone.
export function OrganExplorer({ model }: { model: OrganModel }) {
  const [data] = useState(() => organAnatomyNodes(model))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibility, setVisibility] = useState(() =>
    organDefaultVisibility(model)
  )
  const [view, setView] = useState<string | null>(model.defaultView)
  const selected = model.structures.find(({ id }) => id === selectedId)
  const [open, setOpen] = useState(false)
  const panel = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("input")?.focus()
  }, [open])
  const close = () => {
    setOpen(false)
    toggle.current?.focus()
  }
  return (
    <div
      className={
        open ? "grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]" : "grid gap-4"
      }
    >
      <div className="flex min-w-0 flex-col gap-3">
        <OrganViewer
          model={model}
          selectedId={selectedId}
          onSelectionChange={setSelectedId}
          visibility={visibility}
          onViewChange={setView}
          className="h-[28rem]"
        />
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted-foreground" role="status">
            {selected
              ? `${selected.label}: ${selected.description ?? selected.group}`
              : `View: ${view ?? "Custom view"}. Select a structure to learn about it.`}
          </p>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls={panel}
            onClick={() => (open ? close() : setOpen(true))}
            className="shrink-0 rounded-md border px-3 py-1.5 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
          >
            Anatomy
          </button>
        </div>
      </div>
      {open && (
        <div
          id={panel}
          ref={panelRef}
          onKeyDown={(event) => {
            if (event.key === "Escape") close()
          }}
        >
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
      )}
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

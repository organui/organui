"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { SearchEntry, SearchGroup } from "@/lib/search"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"
import { Kbd } from "@workspace/ui/components/kbd"

// Lowercase, as cmdk reports it; the href keeps values unique.
function itemValue(group: SearchGroup, entry: SearchEntry) {
  return `${group.heading} ${entry.title} ${entry.href}`.toLowerCase()
}

let index: Promise<SearchGroup[]> | undefined

// One request per visit, shared by every later opening.
function loadIndex() {
  index ??= fetch("/search.json").then((response) => {
    if (!response.ok) throw new Error(`Search index: ${response.status}`)
    return response.json() as Promise<SearchGroup[]>
  })
  index.catch(() => (index = undefined))
  return index
}

export default function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [groups, setGroups] = useState<SearchGroup[]>()
  const [failed, setFailed] = useState(false)
  // cmdk's value is the highlighted item's value.
  const [value, setValue] = useState("")
  const [copied, setCopied] = useState(false)
  const highlighted = groups
    ?.flatMap((group) =>
      group.entries.map((entry) => ({ entry, value: itemValue(group, entry) }))
    )
    .find((item) => item.value === value)?.entry

  useEffect(() => {
    if (!open || groups) return
    let current = true
    loadIndex().then(
      (value) => current && setGroups(value),
      () => current && setFailed(true)
    )
    // Closing after a failure lets the next opening try again.
    return () => {
      current = false
      setFailed(false)
    }
  }, [open, groups])

  function go(entry: SearchEntry) {
    onOpenChange(false)
    router.push(entry.href)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search components, docs and blocks"
      className="sm:max-w-lg"
    >
      <Command
        value={value}
        onValueChange={(next) => {
          setValue(next)
          setCopied(false)
        }}
        onKeyDown={(event) => {
          if (
            event.key === "c" &&
            (event.metaKey || event.ctrlKey) &&
            highlighted?.install &&
            !window.getSelection()?.toString()
          ) {
            event.preventDefault()
            navigator.clipboard
              .writeText(highlighted.install)
              .then(() => setCopied(true))
              .catch(() => {})
          }
        }}
      >
        <CommandInput placeholder="Search components, docs and blocks…" />
        <CommandList className="max-h-[min(24rem,60svh)]">
          {groups ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <div role="status" className="py-6 text-center text-sm">
              {failed
                ? "Search couldn't load. Close and try again."
                : "Loading…"}
            </div>
          )}
          {groups?.map((group) => (
            <CommandGroup key={group.heading} heading={group.heading}>
              {group.entries.map((entry) => (
                <CommandItem
                  key={entry.href}
                  value={itemValue(group, entry)}
                  keywords={entry.description ? [entry.description] : undefined}
                  onSelect={() => go(entry)}
                >
                  {entry.title}
                  {entry.install && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {group.heading === "Blocks" ? "Block" : "Component"}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <div className="flex h-10 items-center gap-4 border-t px-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Kbd>↵</Kbd> Go to page
          </span>
          {highlighted?.install && (
            <span className="flex items-center gap-1.5" aria-live="polite">
              <Kbd>⌘</Kbd>
              <Kbd>C</Kbd> {copied ? "Copied" : "Copy install command"}
            </span>
          )}
        </div>
      </Command>
    </CommandDialog>
  )
}

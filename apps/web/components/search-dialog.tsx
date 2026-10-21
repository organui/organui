"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CornerDownLeftIcon } from "lucide-react"
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
import { Separator } from "@workspace/ui/components/separator"
import { copyText } from "@workspace/ui/lib/copy-text"
import { trackEvent } from "@/lib/events"

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
      className="rounded-xl! border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 sm:max-w-lg dark:bg-neutral-900 dark:ring-neutral-800"
    >
      <Command
        className="rounded-none bg-transparent **:data-[slot=command-input-wrapper]:p-0 **:data-[slot=input-group]:h-9! **:data-[slot=input-group]:rounded-md! **:data-[slot=input-group]:border-input **:data-[slot=input-group]:bg-input/50"
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
            const command = highlighted.install
            copyText(command).then((ok) => {
              setCopied(ok)
              if (ok) trackEvent("copy_install_command", { command })
            })
          }
        }}
      >
        <CommandInput placeholder="Search components, docs and blocks…" />
        <CommandList className="no-scrollbar max-h-[min(24rem,60svh)] min-h-[min(20rem,50svh)] scroll-pt-2 scroll-pb-1.5">
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
            <CommandGroup
              key={group.heading}
              heading={group.heading}
              className="p-0! **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
            >
              {group.entries.map((entry) => (
                <CommandItem
                  key={entry.href}
                  value={itemValue(group, entry)}
                  keywords={entry.description ? [entry.description] : undefined}
                  onSelect={() => go(entry)}
                  className="h-9 rounded-md border border-transparent px-3! font-medium data-selected:border-input data-selected:bg-input/50 [&>svg:last-child]:hidden"
                >
                  {entry.title}
                  {entry.install && (
                    <span className="ml-auto text-xs font-normal text-muted-foreground">
                      {group.heading === "Blocks" ? "Block" : "Component"}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium text-muted-foreground dark:border-t-neutral-700 dark:bg-neutral-800">
          <span className="flex shrink-0 items-center gap-2">
            <Kbd className="border bg-background">
              <CornerDownLeftIcon />
            </Kbd>
            Go to Page
          </span>
          {highlighted?.install && (
            <>
              <Separator
                orientation="vertical"
                className="data-vertical:h-4 data-vertical:self-center"
              />
              <span
                className="flex min-w-0 items-center gap-1"
                aria-live="polite"
              >
                <Kbd className="border bg-background">⌘</Kbd>
                <Kbd className="border bg-background">C</Kbd>
                <span className="truncate font-mono">
                  {copied ? "Copied" : highlighted.install}
                </span>
              </span>
            </>
          )}
        </div>
      </Command>
    </CommandDialog>
  )
}

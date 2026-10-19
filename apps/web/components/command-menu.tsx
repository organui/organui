"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Kbd, KbdGroup } from "@workspace/ui/components/kbd"

// The dialog, cmdk and the index load on first use, so the header costs
// pages one button.
const loadSearchDialog = () => import("@/components/search-dialog")
const SearchDialog = dynamic(loadSearchDialog, { ssr: false })

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  )
}

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [used, setUsed] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !isTypingTarget(event.target))
      ) {
        event.preventDefault()
        setUsed(true)
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setUsed(true)
          setOpen(true)
        }}
        // Start fetching the dialog as soon as the pointer or focus arrives.
        onPointerEnter={loadSearchDialog}
        onFocus={loadSearchDialog}
        aria-keyshortcuts="Meta+K Control+K /"
        className="h-9 w-9 justify-start gap-2 bg-muted/50 px-0 font-normal text-muted-foreground sm:w-48 sm:px-3 lg:w-60 dark:bg-muted/30"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="mx-auto size-4 sm:mx-0"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="sr-only sm:not-sr-only">Search…</span>
        <KbdGroup className="ml-auto hidden sm:inline-flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      {used && <SearchDialog open={open} onOpenChange={setOpen} />}
    </>
  )
}

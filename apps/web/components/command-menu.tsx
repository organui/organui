"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"

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
        className="relative h-8 w-full justify-start rounded-lg border-none bg-muted pl-3 font-normal text-foreground shadow-none transition-colors hover:bg-muted/50 md:w-48 lg:w-40 xl:w-64 dark:bg-card"
      >
        <span className="hidden xl:inline-flex">Search documentation...</span>
        <span className="inline-flex xl:hidden">Search...</span>
      </Button>
      {used && <SearchDialog open={open} onOpenChange={setOpen} />}
    </>
  )
}

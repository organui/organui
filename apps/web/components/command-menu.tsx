"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, useSyncExternalStore } from "react"
import { SearchIcon } from "lucide-react"
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

// Apple keyboards say ⌘; others say Ctrl. The server can't tell, so it
// renders ⌘ and the browser corrects it after hydration.
const subscribeNothing = () => () => {}

function useIsApple() {
  return useSyncExternalStore(
    subscribeNothing,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => true
  )
}

export function CommandMenu() {
  const apple = useIsApple()
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
        className="size-8 justify-start gap-2 rounded-lg border-none bg-muted px-0 font-normal text-muted-foreground shadow-none hover:bg-muted/60 sm:w-48 sm:px-3 lg:w-56 xl:w-72 dark:bg-card dark:hover:bg-card/60"
      >
        <SearchIcon data-icon="inline-start" className="mx-auto sm:mx-0" />
        <span className="sr-only sm:not-sr-only sm:truncate">
          Search<span className="hidden xl:inline"> documentation</span>…
        </span>
        <KbdGroup className="ml-auto hidden sm:inline-flex">
          <Kbd className="border bg-background">{apple ? "⌘" : "Ctrl"}</Kbd>
          <Kbd className="border bg-background">K</Kbd>
        </KbdGroup>
      </Button>
      {used && <SearchDialog open={open} onOpenChange={setOpen} />}
    </>
  )
}

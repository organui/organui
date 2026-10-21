"use client"

import type { ReactNode } from "react"
import { useLibrary } from "@/hooks/use-library"
import { libraries, libraryNames } from "@/lib/libraries"

// The library the page's install commands and source are for, under a
// component's title. The choice holds on every page.
export function LibrarySwitcher() {
  const [library, setLibrary] = useLibrary()
  return (
    <div
      role="group"
      aria-label="Primitive library"
      data-copy-skip
      className="inline-flex w-full items-center gap-6"
    >
      {libraries.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={library === option}
          onClick={() => setLibrary(option)}
          className="relative inline-flex items-center justify-center gap-1 rounded-sm pt-1 pb-0.5 text-base font-medium text-muted-foreground transition-colors outline-none after:absolute after:inset-x-0 after:bottom-[-4px] after:h-0.5 after:bg-foreground after:opacity-0 after:transition-opacity hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:text-foreground aria-pressed:after:opacity-100"
        >
          {libraryNames[option]}
        </button>
      ))}
    </div>
  )
}

// Shows the version of its content for the chosen library.
export function LibraryView({
  base,
  radix,
}: {
  base: ReactNode
  radix: ReactNode
}) {
  const [library] = useLibrary()
  return library === "radix" ? radix : base
}

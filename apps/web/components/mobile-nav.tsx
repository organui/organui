"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { DocsNav } from "@/components/docs-nav"
import { isCurrentSection } from "@/components/main-nav"
import type { DocsNavSection, NavLink } from "@/lib/registry"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

// Below md the header's links and the docs sidebar share one menu, as on
// shadcn/ui's site. Choosing any link, the current page included, closes it.
export function MobileNav({
  items,
  sections,
  className,
}: {
  items: NavLink[]
  sections: DocsNavSection[]
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" className={cn("h-9 gap-2 px-2", className)} />
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          className="size-5"
        >
          {open ? (
            <path d="M6 18 18 6M6 6l12 12" />
          ) : (
            <path d="M4 9h16M4 15h16" />
          )}
        </svg>
        Menu
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={10}
        className="max-h-[calc(100svh-5rem)] w-[calc(100vw-2rem)] gap-6 overflow-y-auto p-4"
      >
        <nav aria-label="Main" className="flex flex-col gap-1 text-base">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={
                isCurrentSection(item.href, pathname) ? "page" : undefined
              }
              className="rounded-md px-2 py-1.5 font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <DocsNav sections={sections} onNavigate={close} />
      </PopoverContent>
    </Popover>
  )
}

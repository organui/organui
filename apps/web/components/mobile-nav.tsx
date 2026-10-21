"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { DocsNav } from "@/components/docs-nav"
import { currentSection } from "@/components/main-nav"
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
  const current = currentSection(items, usePathname())
  const close = () => setOpen(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "extend-touch-target h-9 touch-manipulation gap-2 px-2 hover:bg-transparent dark:hover:bg-transparent",
              className
            )}
          />
        }
      >
        <span aria-hidden="true" className="relative size-4">
          <span
            className={cn(
              "absolute left-0 h-0.5 w-4 rounded-full bg-foreground transition-all duration-100",
              open ? "top-[0.4375rem] -rotate-45" : "top-1"
            )}
          />
          <span
            className={cn(
              "absolute left-0 h-0.5 w-4 rounded-full bg-foreground transition-all duration-100",
              open ? "top-[0.4375rem] rotate-45" : "top-2.5"
            )}
          />
        </span>
        Menu
      </PopoverTrigger>
      {/* Fills the screen below the header. */}
      <PopoverContent
        align="start"
        alignOffset={-16}
        sideOffset={11}
        className="h-[calc(100svh-var(--header-height)-1px)] w-screen gap-8 overflow-y-auto overscroll-contain rounded-none bg-background/95 p-6 shadow-none ring-0 backdrop-blur data-open:zoom-in-100 data-closed:zoom-out-100"
      >
        <nav aria-label="Main" className="flex flex-col gap-1 text-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              aria-current={item.href === current ? "page" : undefined}
              className="rounded-md px-2 py-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:text-foreground"
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

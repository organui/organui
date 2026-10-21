"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"
import { currentSection } from "@/components/main-nav"
import type { DocsNavItem, DocsNavSection } from "@/lib/registry"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { cn } from "@workspace/ui/lib/utils"

const link =
  "flex h-[30px] items-center rounded-md border border-transparent px-2.5 text-[0.8rem] font-medium text-foreground/80 transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:text-foreground"

// Sections come from the server so the catalog stays out of the client bundle.
export function DocsNav({
  sections,
  onNavigate,
  className,
}: {
  sections: DocsNavSection[]
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()
  // The longest matching link, so pages the sidebar leaves out keep their
  // section current.
  const current = currentSection(
    sections.flatMap(({ items }) =>
      items.flatMap((item) => [item, ...(item.items ?? [])])
    ),
    pathname
  )
  const nav = useRef<HTMLElement>(null)

  // On arrival, scroll the sidebar so the current page is in view.
  useEffect(() => {
    const list = nav.current?.parentElement
    const active = nav.current?.querySelector("[aria-current=page]")
    if (!list || !active) return
    const box = list.getBoundingClientRect()
    const item = active.getBoundingClientRect()
    if (item.top < box.top || item.bottom > box.bottom)
      list.scrollTop += item.top - box.top - (box.height - item.height) / 2
  }, [])

  return (
    <nav
      ref={nav}
      aria-label="Documentation"
      className={cn("flex flex-col gap-6 text-sm", className)}
    >
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <h2 className="px-2.5 text-xs font-medium text-muted-foreground">
            {section.title}
          </h2>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                {item.items ? (
                  <DocsNavGroup
                    item={item}
                    items={item.items}
                    current={current}
                    onNavigate={onNavigate}
                  />
                ) : (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={item.href === current ? "page" : undefined}
                    className={link}
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

// A link with a list under it, closed unless the current page is in it.
function DocsNavGroup({
  item,
  items,
  current,
  onNavigate,
}: {
  item: DocsNavItem
  items: DocsNavItem[]
  current?: string
  onNavigate?: () => void
}) {
  const inside =
    item.href === current || items.some(({ href }) => href === current)
  const [open, setOpen] = useState(inside)
  // Arriving on one of its pages opens the group again.
  const [wasInside, setWasInside] = useState(inside)
  if (inside !== wasInside) {
    setWasInside(inside)
    if (inside) setOpen(true)
  }
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="relative flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={item.href === current ? "page" : undefined}
          className={cn(link, "flex-1 pe-8")}
        >
          {item.title}
        </Link>
        <CollapsibleTrigger
          aria-label={`${item.title} list`}
          className="absolute end-1 flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <ChevronRightIcon
            aria-hidden="true"
            className={cn("size-3.5 transition-transform", open && "rotate-90")}
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <ul className="ms-3 mt-0.5 flex flex-col gap-0.5 border-s ps-2">
          {items.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                aria-current={child.href === current ? "page" : undefined}
                className={link}
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

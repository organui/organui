"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { currentSection } from "@/components/main-nav"
import type { DocsNavSection } from "@/lib/registry"
import { cn } from "@workspace/ui/lib/utils"

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
  // The longest matching link, so pages the sidebar leaves out, such as each
  // organ, keep their section current.
  const current = currentSection(
    sections.flatMap(({ items }) => items),
    usePathname()
  )
  const nav = useRef<HTMLElement>(null)

  // On arrival, scroll the sidebar so the current page is in view.
  useEffect(() => {
    const list = nav.current?.parentElement
    const link = nav.current?.querySelector("[aria-current=page]")
    if (!list || !link) return
    const box = list.getBoundingClientRect()
    const item = link.getBoundingClientRect()
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
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={item.href === current ? "page" : undefined}
                  className="flex h-[30px] items-center rounded-md border border-transparent px-2.5 text-[0.8rem] font-medium text-foreground/80 transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:text-foreground"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

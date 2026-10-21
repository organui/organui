"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { currentSection } from "@/components/main-nav"
import { pagesNew, type DocsNavSection } from "@/lib/registry"
import { cn } from "@workspace/ui/lib/utils"

const storageKey = "docs-sidebar-scroll"

const link =
  "flex h-[30px] gap-2 w-fit max-w-full items-center rounded-md border border-transparent px-2.5 text-[0.8rem] font-medium text-foreground/80 transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=page]:border-accent aria-[current=page]:bg-accent aria-[current=page]:text-foreground"

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
  // The longest matching link, so pages the sidebar leaves out, such as the
  // organs gallery, keep their section current.
  const current = currentSection(
    sections.flatMap(({ items }) => items),
    pathname
  )
  const nav = useRef<HTMLElement>(null)
  // Only the desktop sidebar keeps its place; the phone menu opens fresh.
  const persist = !onNavigate

  // A reload of the same page keeps the sidebar where it was. Otherwise,
  // scroll it so the current page is in view.
  useEffect(() => {
    const list = nav.current?.parentElement
    if (!list) return
    const saved = persist ? readScroll() : null
    if (saved?.pathname === pathname) {
      list.scrollTop = saved.scrollTop
    } else {
      const active = nav.current?.querySelector("[aria-current=page]")
      if (active) {
        const box = list.getBoundingClientRect()
        const item = active.getBoundingClientRect()
        if (item.top < box.top || item.bottom > box.bottom)
          list.scrollTop += item.top - box.top - (box.height - item.height) / 2
      }
    }
    if (!persist) return
    const save = () => saveScroll(pathname, list.scrollTop)
    save()
    list.addEventListener("scroll", save, { passive: true })
    return () => list.removeEventListener("scroll", save)
  }, [pathname, persist])

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
                  className={link}
                >
                  {item.title}
                  {pagesNew.includes(item.href) && (
                    <>
                      <span className="sr-only">(new)</span>
                      <span
                        aria-hidden="true"
                        className="size-2 shrink-0 rounded-full bg-blue-500"
                      />
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function readScroll() {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey) ?? "") as {
      pathname: string
      scrollTop: number
    }
  } catch {
    return null
  }
}

function saveScroll(pathname: string, scrollTop: number) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({ pathname, scrollTop }))
  } catch {
    // Storage can be blocked; the sidebar just starts at the current page.
  }
}

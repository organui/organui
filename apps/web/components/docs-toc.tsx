"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

type Heading = { id: string; title: string; depth: 2 | 3 }

// Read from the rendered page rather than declared per page: every section
// heading has an id, or sits in a section that has one. Subheadings are
// listed when they have their own id.
function readHeadings(): Heading[] {
  return [
    ...document.querySelectorAll("[data-docs-content] :is(h2, h3)"),
  ].flatMap((heading) => {
    const depth = heading.tagName === "H3" ? 3 : 2
    const id =
      heading.id || (depth === 2 ? heading.closest("section")?.id : undefined)
    const title = heading.textContent?.trim()
    return id && title ? [{ id, title, depth }] : []
  })
}

export function DocsTableOfContents({ className }: { className?: string }) {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive] = useState<string>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: "0% 0% -80% 0%" }
    )
    // After the new page has painted, so its headings are in the document.
    const frame = requestAnimationFrame(() => {
      const found = readHeadings()
      setHeadings(found)
      setActive(undefined)
      for (const { id } of found) {
        const element = document.getElementById(id)
        if (element) observer.observe(element)
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname])

  if (headings.length < 2) return null
  return (
    <nav
      aria-label="On this page"
      className={cn("flex flex-col gap-2 text-[0.8rem]", className)}
    >
      <p className="text-xs font-medium text-muted-foreground">On This Page</p>
      <ul className="flex flex-col gap-2">
        {headings.map(({ id, title, depth }) => (
          <li key={id} className={cn(depth === 3 && "ps-4")}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className="rounded-sm text-muted-foreground no-underline transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=location]:font-medium aria-[current=location]:text-foreground"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

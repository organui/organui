"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

type Heading = { id: string; title: string }

// Read from the rendered page rather than declared per page: every section
// heading has an id, or sits in a section that has one.
function readHeadings(): Heading[] {
  return [...document.querySelectorAll("[data-docs-content] h2")].flatMap(
    (heading) => {
      const id = heading.id || heading.closest("section")?.id
      const title = heading.textContent?.trim()
      return id && title ? [{ id, title }] : []
    }
  )
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
    <nav aria-label="On this page" className={cn("text-sm", className)}>
      <p className="mb-2 font-medium">On this page</p>
      <ul className="flex flex-col gap-2">
        {headings.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className="text-muted-foreground hover:text-foreground aria-[current=location]:text-foreground"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

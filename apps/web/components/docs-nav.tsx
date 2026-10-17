"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import type { DocsNavSection } from "@/lib/registry"
import { cn } from "@workspace/ui/lib/utils"

// Sections come from the server layout so the catalog stays out of the client bundle.
export function DocsNav({
  sections,
  onNavigate,
}: {
  sections: DocsNavSection[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6 text-sm">
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <h2 className="px-2 text-xs font-medium text-muted-foreground">
            {section.title}
          </h2>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-1.5 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",
                      active && "bg-muted font-medium"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function MobileDocsNav({ sections }: { sections: DocsNavSection[] }) {
  const [open, setOpen] = useState(false)
  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="border-b py-3 md:hidden"
    >
      <summary className="cursor-pointer rounded-md px-2 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
        Menu
      </summary>
      <div className="pt-3 pb-1">
        <DocsNav sections={sections} onNavigate={() => setOpen(false)} />
      </div>
    </details>
  )
}

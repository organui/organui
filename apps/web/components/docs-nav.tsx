"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  const pathname = usePathname()
  return (
    <nav
      aria-label="Documentation"
      className={cn("flex flex-col gap-6 text-sm", className)}
    >
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

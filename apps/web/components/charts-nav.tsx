"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { chartTypes } from "@/lib/registry"

// The chart types, as links under /charts' header.
export function ChartsNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Chart types"
      className="no-scrollbar flex items-center overflow-x-auto"
    >
      {chartTypes.map(({ type, title }) => {
        const href = `/charts/${type}`
        return (
          <Link
            key={type}
            href={`${href}#charts`}
            aria-current={pathname === href ? "page" : undefined}
            className="flex h-7 shrink-0 items-center justify-center rounded-md px-4 text-center text-base font-medium text-muted-foreground transition-colors outline-none hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 aria-[current=page]:text-primary"
          >
            {title}
          </Link>
        )
      })}
    </nav>
  )
}

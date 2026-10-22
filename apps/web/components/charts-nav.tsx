"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { chartTypes } from "@/lib/registry"

// The chart types, as links under /charts' header. As on shadcn/ui, they
// scroll sideways in a scroll area on narrow screens, with no scrollbar: Base
// UI's viewport hides the native one, and none is drawn horizontally.
export function ChartsNav() {
  const pathname = usePathname()
  return (
    <div className="relative overflow-hidden">
      <ScrollArea>
        <nav aria-label="Chart types" className="flex items-center">
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
      </ScrollArea>
    </div>
  )
}

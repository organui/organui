"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { docsNav } from "@/lib/registry"
import { cn } from "@workspace/ui/lib/utils"

export function DocsNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Documentation" className="space-y-6 text-sm">
      {docsNav.map((section) => (
        <div key={section.title} className="space-y-1">
          <h2 className="px-2 text-xs font-medium text-muted-foreground">
            {section.title}
          </h2>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
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

// Keyed by path so the menu closes after a client-side navigation.
export function MobileDocsNav() {
  const pathname = usePathname()
  return (
    <details key={pathname} className="group border-b py-3 md:hidden">
      <summary className="cursor-pointer rounded-md px-2 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
        Menu
      </summary>
      <div className="pt-3 pb-1">
        <DocsNav />
      </div>
    </details>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavLink } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// Docs covers the guides; Components covers the index and every component
// page. Organs points into the index, so it is never the current page.
export function isCurrentSection(href: string, pathname: string) {
  if (href.includes("#")) return false
  if (href === "/docs")
    return (
      pathname === "/docs" ||
      (pathname.startsWith("/docs/") &&
        !pathname.startsWith("/docs/components"))
    )
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function MainNav({
  items,
  className,
}: {
  items: NavLink[]
  className?: string
}) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main" className={cn("items-center", className)}>
      {items.map((item) => {
        const active = isCurrentSection(item.href, pathname)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground aria-[current=page]:text-foreground"
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

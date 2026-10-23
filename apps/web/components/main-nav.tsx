"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavLink } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// The section a page belongs to: the item that lists it among its pages, or
// else whose address is the longest prefix of it, so the organs gallery is
// Organs rather than Components, a disease is Diseases, and Docs covers the
// guides.
export function currentSection(items: NavLink[], pathname: string) {
  const rank = ({ href, pages }: NavLink) =>
    pages?.includes(pathname) ? Infinity : href.length
  return items
    .filter(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(`${item.href}/`) ||
        item.pages?.includes(pathname)
    )
    .sort((a, b) => rank(b) - rank(a))[0]?.href
}

export function MainNav({
  items,
  className,
}: {
  items: NavLink[]
  className?: string
}) {
  const current = currentSection(items, usePathname())
  return (
    <nav aria-label="Main" className={cn("items-center", className)}>
      {items.map((item) => {
        const active = item.href === current
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "px-2.5"
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

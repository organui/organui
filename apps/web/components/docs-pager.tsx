import Link from "next/link"
import { neighbours } from "@/lib/registry"

// Previous and next pages in sidebar order, organs included.
export function DocsPager({ href }: { href: string }) {
  const { previous, next } = neighbours(href)
  if (!previous && !next) return null
  return (
    <nav
      aria-label="Previous and next pages"
      className="flex flex-wrap justify-between gap-4 border-t pt-6 text-sm"
    >
      {previous ? (
        <Link
          href={previous.href}
          className="flex flex-col gap-1 rounded-md hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="text-muted-foreground">Previous</span>
          <span className="font-medium">← {previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className="ml-auto flex flex-col items-end gap-1 rounded-md text-right hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span className="text-muted-foreground">Next</span>
          <span className="font-medium">{next.title} →</span>
        </Link>
      )}
    </nav>
  )
}

import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { neighbours } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// Previous and next pages in sidebar order, organs included. Links shrink
// and truncate long titles, such as a disease's, to fit a phone.
export function DocsPager({ href }: { href: string }) {
  const { previous, next } = neighbours(href)
  if (!previous && !next) return null
  return (
    <nav
      aria-label="Previous and next pages"
      className="flex items-center justify-between gap-4 border-t pt-6"
    >
      {previous ? (
        <Link
          href={previous.href}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "min-w-0 shrink shadow-none"
          )}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          <span className="sr-only">Previous: </span>
          <span className="truncate">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "ms-auto min-w-0 shrink shadow-none"
          )}
        >
          <span className="sr-only">Next: </span>
          <span className="truncate">{next.title}</span>
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      )}
    </nav>
  )
}

// The same neighbours as small icon buttons beside a page's title.
export function DocsPagerIcons({ href }: { href: string }) {
  const { previous, next } = neighbours(href)
  const button = cn(
    buttonVariants({ variant: "secondary", size: "icon-sm" }),
    "extend-touch-target size-8 shadow-none md:size-7"
  )
  return (
    <div className="ms-auto flex shrink-0 items-center gap-2">
      {previous && (
        <Link
          href={previous.href}
          aria-label={`Previous: ${previous.title}`}
          title={previous.title}
          className={button}
        >
          <ArrowLeftIcon />
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          aria-label={`Next: ${next.title}`}
          title={next.title}
          className={button}
        >
          <ArrowRightIcon />
        </Link>
      )}
    </div>
  )
}

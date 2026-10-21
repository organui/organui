import type { ReactNode } from "react"

// A section heading that links to itself, so a reader can copy its address.
export function DocsHeading({
  id,
  children,
}: {
  id: string
  children: ReactNode
}) {
  return (
    <h2
      id={id}
      className="group/heading scroll-m-20 text-2xl font-semibold tracking-tight"
    >
      <a
        href={`#${id}`}
        className="rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {children}
        {/* Drawn by CSS so the heading's text stays its title. */}
        <span
          aria-hidden="true"
          className="ms-2 text-muted-foreground opacity-0 transition-opacity group-hover/heading:opacity-100 after:content-['#']"
        />
      </a>
    </h2>
  )
}

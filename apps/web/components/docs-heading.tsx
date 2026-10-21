import type { ReactNode } from "react"

// A section heading that links to itself, so a reader can copy its address.
// Level 3 for a subsection, such as one example.
export function DocsHeading({
  id,
  level = 2,
  children,
}: {
  id: string
  level?: 2 | 3
  children: ReactNode
}) {
  const Heading = level === 3 ? "h3" : "h2"
  return (
    <Heading
      id={id}
      className={
        level === 3
          ? "group/heading scroll-m-20 text-lg font-semibold tracking-tight"
          : "group/heading scroll-m-20 text-xl font-semibold tracking-tight"
      }
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
    </Heading>
  )
}

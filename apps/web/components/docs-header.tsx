import type { ReactNode } from "react"
import { DocsPagerIcons } from "@/components/docs-pager"

// The top of every docs page: where it sits, its title and a summary, with
// the previous and next pages beside the title.
export function DocsHeader({
  href,
  eyebrow,
  title,
  children,
}: {
  href: string
  eyebrow?: ReactNode
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-3">
          {eyebrow && (
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
        </div>
        <DocsPagerIcons href={href} />
      </div>
      {children}
    </header>
  )
}

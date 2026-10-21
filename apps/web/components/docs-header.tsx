import type { ReactNode } from "react"
import { DocsCopyPage } from "@/components/docs-copy-page"
import { DocsPagerIcons } from "@/components/docs-pager"

// The top of every docs page: its title and a summary, with Copy Page and
// the previous and next pages beside the title.
export function DocsHeader({
  href,
  title,
  children,
}: {
  href: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <DocsCopyPage />
          <DocsPagerIcons href={href} />
        </div>
      </div>
      {children}
    </header>
  )
}

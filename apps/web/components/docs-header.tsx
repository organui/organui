import type { ReactNode } from "react"
import { DocsCopyPage } from "@/components/docs-copy-page"
import { DocsPagerIcons } from "@/components/docs-pager"
import { LibrarySwitcher } from "@/components/library-switcher"
import { aiItems, registryItems } from "@/lib/registry"

// The top of every docs page: its title and a summary, with Copy Page and
// the previous and next pages beside the title. A component's page also
// picks the library its install steps are for.
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
      <div className="flex items-center justify-between gap-4 md:items-start">
        <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          <DocsCopyPage href={href} />
          <DocsPagerIcons href={href} />
        </div>
      </div>
      {children}
      {[...registryItems, ...aiItems].some((item) => item.href === href) && (
        <LibrarySwitcher />
      )}
    </header>
  )
}

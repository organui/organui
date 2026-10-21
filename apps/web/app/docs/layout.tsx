import { DocsNav } from "@/components/docs-nav"
import { DocsTableOfContents } from "@/components/docs-toc"
import { SiteHeader } from "@/components/site-header"
import { docsNav } from "@/lib/registry"

// shadcn/ui's docs layout, the full width of the window: a sticky sidebar at
// the left edge, the page in a centred reading column, and its contents at
// the right edge on wide screens. Below md the sidebar moves into the
// header's menu.
export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <div className="group/docs w-full px-4 sm:px-6 md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_18rem] xl:has-data-docs-wide:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))] md:flex">
          <div className="no-scrollbar min-w-0 flex-1 scroll-fade overflow-y-auto overscroll-contain py-8 pe-4">
            <DocsNav sections={docsNav} />
          </div>
          {/* A hairline that fades out at both ends. */}
          <div
            aria-hidden="true"
            className="w-px shrink-0 bg-linear-to-b from-transparent via-border to-transparent"
          />
        </div>
        {/* A reading column; wide pages such as the organs gallery fill. */}
        <main
          id="main"
          data-docs-content
          className="min-w-0 py-8 text-[1.05rem] sm:text-[15px] md:py-10"
        >
          <div className="mx-auto w-full max-w-160 group-has-data-docs-wide/docs:max-w-none">
            {children}
          </div>
        </main>
        {/* Pages with nothing to list, such as the organs gallery, mark
            themselves data-docs-wide and take this column's width. */}
        <div className="sticky top-(--header-height) no-scrollbar hidden h-[calc(100svh-var(--header-height))] scroll-fade overflow-y-auto px-8 py-10 xl:block xl:group-has-data-docs-wide/docs:hidden">
          <DocsTableOfContents />
        </div>
      </div>
    </div>
  )
}

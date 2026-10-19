import { DocsNav } from "@/components/docs-nav"
import { DocsTableOfContents } from "@/components/docs-toc"
import { SiteHeader } from "@/components/site-header"
import { docsNav } from "@/lib/registry"

// shadcn/ui's docs layout: a sticky sidebar, the page, and its contents on
// wide screens. Below md the sidebar moves into the header's menu.
export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10 xl:grid-cols-[13rem_minmax(0,1fr)_12rem]">
        <div className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-y-auto overscroll-contain py-8 md:block">
          <DocsNav sections={docsNav} />
        </div>
        <main data-docs-content className="min-w-0 py-8 md:py-10">
          {children}
        </main>
        <div className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-y-auto py-10 xl:block">
          <DocsTableOfContents />
        </div>
      </div>
    </div>
  )
}

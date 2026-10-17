import { DocsNav, MobileDocsNav } from "@/components/docs-nav"
import { SiteHeader } from "@/components/site-header"
import { docsNav } from "@/lib/registry"

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-5 sm:px-10 md:grid md:grid-cols-[12rem_minmax(0,1fr)] md:gap-10">
        <div className="sticky top-14 hidden h-[calc(100svh-3.5rem)] overflow-y-auto py-10 md:block">
          <DocsNav sections={docsNav} />
        </div>
        <MobileDocsNav sections={docsNav} />
        <main className="min-w-0 py-10">{children}</main>
      </div>
    </div>
  )
}

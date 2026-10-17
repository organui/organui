import Link from "next/link"
import { DocsNav, MobileDocsNav } from "@/components/docs-nav"
import { GitHubIcon } from "@/components/social-icons"
import { docsNav } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { OrganUIMark } from "@workspace/ui/components/organui-mark"
import { cn } from "@workspace/ui/lib/utils"

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5 sm:px-10">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md font-medium focus-visible:outline-2 focus-visible:outline-ring"
          >
            <OrganUIMark className="h-6 w-6" />
            organui
          </Link>
          <Link
            href="/docs"
            className="rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            Components
          </Link>
          <a
            href="https://github.com/organui/organui"
            aria-label="OrganUI on GitHub"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "ml-auto size-10"
            )}
          >
            <GitHubIcon />
          </a>
        </div>
      </header>
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

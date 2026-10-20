import type { Metadata } from "next"
import Link from "next/link"
import { explorers, site } from "@/lib/site"
import { OrganUIMark } from "@workspace/ui/components/organui-mark"

import { SiteHeader } from "@/components/site-header"
import { GitHubIcon, XIcon } from "@/components/social-icons"

export const metadata: Metadata = {
  title: { absolute: site.title },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
  },
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-6"
      >
        <div className="flex max-w-md min-w-0 flex-col items-center gap-4 text-center text-sm leading-loose">
          <h1 className="flex items-center gap-4 text-4xl font-medium">
            <OrganUIMark />
            <span>organui</span>
          </h1>
          <p>The interfaces healthcare deserves.</p>
          <Link
            href="/docs/components"
            className="font-medium underline underline-offset-4 hover:text-muted-foreground"
          >
            Browse components
          </Link>
          <nav aria-label="3D anatomy explorers">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {explorers.map((explorer) => (
                <li key={explorer.name}>
                  <a
                    href={explorer.href}
                    className="underline-offset-4 hover:text-muted-foreground hover:underline"
                  >
                    {explorer.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex gap-4">
            <a
              href="https://github.com/organui"
              aria-label="OrganUI on GitHub"
              className="inline-flex size-11 items-center justify-center rounded-lg outline-none hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <GitHubIcon className="size-[22px]" />
            </a>
            <a
              href="https://x.com/organui"
              aria-label="OrganUI on X"
              className="inline-flex size-11 items-center justify-center rounded-lg outline-none hover:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <XIcon className="size-[22px]" />
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

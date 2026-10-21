import Link from "next/link"
import { GitHubIcon, XIcon } from "@/components/social-icons"
import { site } from "@/lib/site"

// Pages outside the docs end with the credits and the project's links.
export function SiteFooter() {
  return (
    <footer>
      <div className="flex w-full flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 sm:text-sm">
        <p className="text-center text-balance sm:text-start">
          MIT code; each model keeps its own licence, listed in{" "}
          <Link
            href="/docs/licences"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            Licences
          </Link>
          . The source is on{" "}
          <a
            href={site.repository}
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            GitHub
          </a>
          .
        </p>
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/organui"
            aria-label="OrganUI on GitHub"
            className="inline-flex size-9 items-center justify-center rounded-lg outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <GitHubIcon className="size-4.5" />
          </a>
          <a
            href="https://x.com/organui"
            aria-label="OrganUI on X"
            className="inline-flex size-9 items-center justify-center rounded-lg outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <XIcon className="size-4.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

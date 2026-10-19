import Link from "next/link"
import { GitHubIcon } from "@/components/social-icons"
import { buttonVariants } from "@workspace/ui/components/button"
import { OrganUIMark } from "@workspace/ui/components/organui-mark"
import { cn } from "@workspace/ui/lib/utils"

const link =
  "rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"

// Shared by the docs and the blocks gallery.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-medium focus-visible:outline-2 focus-visible:outline-ring"
        >
          <OrganUIMark className="size-6" />
          organui
        </Link>
        <Link href="/docs" className={link}>
          Components
        </Link>
        <Link href="/blocks" className={link}>
          Blocks
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
  )
}

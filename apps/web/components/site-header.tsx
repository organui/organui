import Link from "next/link"
import { GitHubIcon } from "@/components/social-icons"
import { buttonVariants } from "@workspace/ui/components/button"
import { OrganUIMark } from "@workspace/ui/components/organui-mark"
import { cn } from "@workspace/ui/lib/utils"

const link =
  "rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"

// Shared by the docs and the blocks gallery. The homepage floats it over the
// body model as a pill.
export function SiteHeader({ floating = false }: { floating?: boolean }) {
  return (
    <header
      className={cn(
        "z-10 bg-background/95 backdrop-blur",
        floating
          ? "fixed inset-x-3 top-3 mx-auto max-w-3xl rounded-xl border bg-background/80 shadow-sm sm:inset-x-6"
          : "sticky top-0 border-b"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center gap-6",
          floating ? "px-4" : "px-5 sm:px-10"
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md font-medium focus-visible:outline-2 focus-visible:outline-ring"
        >
          <OrganUIMark className="h-6 w-6" />
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

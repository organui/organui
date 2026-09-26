import type { Metadata } from "next"
import { site } from "@/lib/site"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { OrganUIMark } from "@workspace/ui/components/organui-mark"

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
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md min-w-0 flex-col items-center gap-4 text-center text-sm leading-loose">
        <h1 className="flex items-center gap-4 text-4xl font-medium">
          <OrganUIMark />
          <span>organui</span>
        </h1>
        <p>The interfaces healthcare deserves.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/organui"
            aria-label="OrganUI on GitHub"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-11 hover:bg-transparent hover:text-muted-foreground dark:hover:bg-transparent"
            )}
          >
            <GitHubIcon />
          </a>
          <a
            href="https://x.com/organui"
            aria-label="OrganUI on X"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-11 hover:bg-transparent hover:text-muted-foreground dark:hover:bg-transparent"
            )}
          >
            <XIcon />
          </a>
        </div>
      </div>
    </main>
  )
}

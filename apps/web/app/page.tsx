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
    <main className="grid min-h-svh place-items-center px-6 pt-12 pb-28">
      <div className="flex w-full flex-col items-center text-center">
        <h1 className="m-0 flex items-center gap-3.5 text-4xl leading-none font-[550] tracking-[-1.3px]">
          <OrganUIMark />
          <span>organui</span>
        </h1>
        <p className="mt-7.5 text-[26px] leading-[1.4] font-normal tracking-[-0.65px] text-balance max-[480px]:max-w-80 max-[480px]:text-2xl max-[480px]:leading-[1.4]">
          The interfaces healthcare deserves.
        </p>
        <div className="mt-6 flex gap-4">
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

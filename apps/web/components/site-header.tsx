import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { CommandMenu } from "@/components/command-menu"
import { GitHubLink } from "@/components/github-link"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { docsNav, mainNav } from "@/lib/registry"
import { OrganUIMark } from "@workspace/ui/components/organui-mark"
import { buttonVariants } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"

// Shared by every page. Laid out after shadcn/ui's site header: navigation,
// then search, the repository, the theme toggle and a link to start a project.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4 sm:px-6">
        <MobileNav items={mainNav} sections={docsNav} className="lg:hidden" />
        <Link
          href="/"
          className="mr-2 flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-ring"
        >
          <OrganUIMark className="size-6" />
          organui
        </Link>
        <MainNav items={mainNav} className="hidden lg:flex" />
        <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <Separator
            orientation="vertical"
            className="ml-2 hidden lg:block data-vertical:h-4 data-vertical:self-center"
          />
          <GitHubLink />
          <Separator
            orientation="vertical"
            className="data-vertical:h-4 data-vertical:self-center"
          />
          <ModeSwitcher />
          {/* Phones have no room for it beside the menu and logo. */}
          <Separator
            orientation="vertical"
            className="hidden sm:block data-vertical:h-4 data-vertical:self-center"
          />
          <Link
            href="/create"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden h-[31px] rounded-lg sm:inline-flex"
            )}
          >
            <PlusIcon data-icon="inline-start" />
            New
          </Link>
        </div>
      </div>
    </header>
  )
}

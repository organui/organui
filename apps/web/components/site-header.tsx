import Link from "next/link"
import { CommandMenu } from "@/components/command-menu"
import { GitHubLink } from "@/components/github-link"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { docsNav, mainNav } from "@/lib/registry"
import { OrganUIMark } from "@workspace/ui/components/organui-mark"

// Shared by every page. Laid out after shadcn/ui's site header: navigation,
// then search, the repository and the theme toggle.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <MobileNav items={mainNav} sections={docsNav} className="md:hidden" />
        <Link
          href="/"
          className="mr-2 flex items-center gap-2 rounded-md font-medium focus-visible:outline-2 focus-visible:outline-ring"
        >
          <OrganUIMark className="size-6" />
          organui
        </Link>
        <MainNav items={mainNav} className="hidden md:flex" />
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <CommandMenu />
          <div
            aria-hidden="true"
            className="hidden h-4 w-px bg-border sm:block"
          />
          <GitHubLink />
          <div
            aria-hidden="true"
            className="hidden h-4 w-px bg-border sm:block"
          />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  )
}

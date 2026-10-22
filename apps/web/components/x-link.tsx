import { XIcon } from "@/components/social-icons"
import { site } from "@/lib/site"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// Sits beside the GitHub link and shares its ghost button styling.
export function XLink() {
  return (
    <a
      href={site.x}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-8 px-2 shadow-none"
      )}
    >
      <XIcon data-icon="inline-start" />
      <span className="sr-only">OrganUI on X</span>
    </a>
  )
}

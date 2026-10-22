import { XIcon } from "@/components/social-icons"
import { site } from "@/lib/site"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// An icon button the size of the theme toggle, beside the GitHub link. The X
// glyph fills its whole box, so it is drawn a step smaller than GitHub's to
// look the same size.
export function XLink() {
  return (
    <a
      href={site.x}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "size-8 shadow-none"
      )}
    >
      <XIcon className="size-3.5" />
      <span className="sr-only">OrganUI on X</span>
    </a>
  )
}

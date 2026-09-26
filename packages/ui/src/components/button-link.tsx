import type { ComponentProps } from "react"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// Navigation keeps native anchor semantics while sharing the button design system.
export function ButtonLink({
  className,
  variant = "default",
  size = "default",
  ...props
}: ComponentProps<"a"> & VariantProps<typeof buttonVariants>) {
  return (
    <a
      data-slot="button-link"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

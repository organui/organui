"use client"

// Adapted from shadcn/ui, apps/v4/components/component-preview-tabs.tsx
// at daaf156ee00ed91cc7e6bdd937c1b4973152d141. See SHADCN-LICENSE.txt.
import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

export function ComponentPreviewTabs({
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  component,
  source,
  sourcePreview,
  ...props
}: React.ComponentProps<"div"> & {
  previewClassName?: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  component: React.ReactNode
  source: React.ReactNode
  sourcePreview?: React.ReactNode
}) {
  const [isMobileCodeVisible, setIsMobileCodeVisible] = React.useState(false)
  const codeRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (isMobileCodeVisible) codeRef.current?.querySelector("pre")?.focus()
  }, [isMobileCodeVisible])

  return (
    <div
      data-slot="component-preview"
      data-not-typeset
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border",
        className
      )}
      {...props}
    >
      <div data-slot="preview" dir="ltr">
        <div
          data-align={align}
          className={cn(
            "preview relative flex h-72 w-full justify-center p-4 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start sm:p-6",
            previewClassName
          )}
        >
          {component}
        </div>
      </div>
      {!hideCode && (
        <div
          ref={codeRef}
          data-slot="code"
          data-mobile-code-visible={isMobileCodeVisible}
          className="relative min-w-0 overflow-hidden [&_pre]:max-h-72"
        >
          {isMobileCodeVisible ? (
            source
          ) : (
            <div className="relative">
              <div aria-hidden="true" className="pointer-events-none">
                {sourcePreview}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-background via-background/70 to-transparent">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsMobileCodeVisible(true)}
                >
                  View Code
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import { useId, type ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { themeVars, type ThemeChoice } from "@/lib/themes"

function declarations(vars: Record<string, string>) {
  return Object.entries(vars)
    .map(([name, value]) => `--${name}:${value};`)
    .join("")
}

// Applies a theme to its children: its light tokens on a wrapper, and its
// dark ones under the site's .dark class, so the server's HTML matches
// whichever mode the reader has.
export function ThemeScope({
  choice,
  className,
  children,
}: {
  choice: ThemeChoice
  className?: string
  children: ReactNode
}) {
  const scope = `theme-scope-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`
  const css = `.${scope}{${declarations(themeVars(choice, "light"))}}.dark .${scope}{${declarations(themeVars(choice, "dark"))}}`
  return (
    <div className={cn(scope, "bg-background text-foreground", className)}>
      <style>{css}</style>
      {children}
    </div>
  )
}

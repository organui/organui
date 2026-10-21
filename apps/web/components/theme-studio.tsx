"use client"

import { useState, type ReactNode } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { ThemePicker } from "@/components/theme-picker"
import { ThemeScope } from "@/components/theme-scope"
import { defaultThemeChoice, themeCss, type ThemeChoice } from "@/lib/themes"

// /themes: pick a theme, see the components in it, and copy its CSS.
export function ThemeStudio({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<ThemeChoice>(defaultThemeChoice)
  const [copied, setCopied] = useState(false)
  const css = themeCss(choice)
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-xl border p-4 md:p-6">
        <ThemePicker value={choice} onValueChange={setChoice} />
        <Dialog>
          <DialogTrigger render={<Button className="w-fit" />}>
            <CopyIcon data-icon="inline-start" />
            Copy code
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Theme</DialogTitle>
              <DialogDescription>
                Paste over <code>:root</code> and <code>.dark</code> in your
                global CSS file.
              </DialogDescription>
            </DialogHeader>
            <pre
              tabIndex={0}
              role="region"
              aria-label="Theme CSS"
              className="max-h-80 overflow-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs leading-relaxed outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {css}
            </pre>
            <Button
              onClick={() =>
                navigator.clipboard
                  .writeText(css)
                  .then(() => {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  })
                  .catch(() => {})
              }
            >
              {copied ? (
                <CheckIcon data-icon="inline-start" />
              ) : (
                <CopyIcon data-icon="inline-start" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <ThemeScope choice={choice} className="rounded-xl">
        {children}
      </ThemeScope>
    </div>
  )
}

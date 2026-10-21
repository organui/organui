"use client"

import type { ReactNode } from "react"
import { CodeIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"

// A chart's source in a dialog, from the card's View Code button.
export function ChartCode({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`View code: ${title}`}
          />
        }
      >
        <CodeIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Copy it into a page after installing the component.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60svh] overflow-auto rounded-lg border [&_pre]:max-h-none">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

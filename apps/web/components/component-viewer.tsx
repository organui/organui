"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"

// One named demo per preview, matching shadcn's ComponentPreview structure.
export function ComponentViewer({
  name,
  title,
  preview,
  code,
  lazy = false,
}: {
  name: string
  title: string
  preview: ReactNode
  code: string
  lazy?: boolean
}) {
  const [codeVisible, setCodeVisible] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(!lazy)
  const viewport = useRef<HTMLDivElement>(null)
  const source = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (!lazy || !viewport.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(({ isIntersecting }) => isIntersecting)) {
          setPreviewVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "160px" }
    )
    observer.observe(viewport.current)
    return () => observer.disconnect()
  }, [lazy])

  useEffect(() => {
    if (codeVisible) source.current?.focus()
  }, [codeVisible])

  return (
    <div
      role="group"
      aria-label={`${title} example`}
      data-slot="component-preview"
      data-example={name}
      className="min-w-0 overflow-hidden rounded-2xl border"
    >
      <div ref={viewport} data-slot="preview" className="min-w-0 p-4 sm:p-6">
        {!lazy || previewVisible ? (
          preview
        ) : (
          <div aria-hidden="true" className="h-[28rem]" />
        )}
      </div>
      {codeVisible ? (
        <CodeBlock className="rounded-none border-x-0 border-b-0">
          <CodeBlockHeader>
            <CodeBlockTitle>{name}.tsx</CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton value={code} />
            </CodeBlockActions>
          </CodeBlockHeader>
          <CodeBlockContent
            ref={source}
            aria-label={`${title} code`}
            className="max-h-72"
          >
            {code}
          </CodeBlockContent>
        </CodeBlock>
      ) : (
        <div className="relative overflow-hidden border-t bg-muted/30">
          <pre
            aria-hidden="true"
            className="pointer-events-none overflow-hidden p-4 font-mono text-xs text-muted-foreground"
          >
            {code.split("\n").slice(0, 3).join("\n")}
          </pre>
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-background via-background/70 to-transparent">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCodeVisible(true)}
            >
              View Code
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

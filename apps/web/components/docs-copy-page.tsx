"use client"

import { useEffect, useState } from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileTextIcon,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { pageMarkdown } from "@/lib/page-markdown"

function currentMarkdown() {
  const content = document.querySelector("[data-docs-content]")
  return content ? pageMarkdown(content, location.href) : ""
}

function promptUrl(base: string) {
  const page = location.href.split("#")[0]
  return `${base}?q=${encodeURIComponent(
    `I'm looking at this OrganUI documentation: ${page}\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`
  )}`
}

// Copies the page as Markdown, or opens it in an assistant.
export function DocsCopyPage() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <ButtonGroup data-copy-skip className="hidden sm:flex">
      <Button
        variant="secondary"
        size="sm"
        className="shadow-none"
        onClick={() =>
          navigator.clipboard
            .writeText(currentMarkdown())
            .then(() => setCopied(true))
            .catch(() => {})
        }
      >
        {copied ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <CopyIcon data-icon="inline-start" />
        )}
        Copy Page
        <span aria-live="polite" className="sr-only">
          {copied ? "Copied" : ""}
        </span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label="More ways to use this page"
              className="border-s border-background/60 shadow-none"
            />
          }
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() =>
              window.open(
                `${location.pathname.replace(/\/$/, "")}.md`,
                "_blank",
                "noopener"
              )
            }
          >
            <FileTextIcon />
            View as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.open(
                promptUrl("https://chatgpt.com/"),
                "_blank",
                "noopener"
              )
            }
          >
            <ExternalLinkIcon />
            Open in ChatGPT
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              window.open(
                promptUrl("https://claude.ai/new"),
                "_blank",
                "noopener"
              )
            }
          >
            <ExternalLinkIcon />
            Open in Claude
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

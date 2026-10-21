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
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { pageMarkdown } from "@/lib/page-markdown"
import { site } from "@/lib/site"
import { copyText } from "@workspace/ui/lib/copy-text"
import { trackEvent } from "@/lib/events"

function currentMarkdown() {
  const content = document.querySelector("[data-docs-content]")
  return content ? pageMarkdown(content, location.href) : ""
}

function promptUrl(base: string, page: string) {
  return `${base}?q=${encodeURIComponent(
    `I'm looking at this OrganUI documentation: ${page}\nHelp me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`
  )}`
}

// Copies the page as Markdown, or opens it in an assistant.
export function DocsCopyPage({ href }: { href: string }) {
  const page = `${site.url}${href}`
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
        className="h-8 shadow-none md:h-7 md:text-[0.8rem]"
        onClick={() =>
          copyText(currentMarkdown()).then((ok) => {
            setCopied(ok)
            if (ok) trackEvent("copy_page", { page: location.pathname })
          })
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
              className="size-8 border-s border-background/60 shadow-none md:size-7"
            />
          }
        >
          <ChevronDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLinkItem
            href={`${href}.md`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileTextIcon />
            View as Markdown
          </DropdownMenuLinkItem>
          <DropdownMenuLinkItem
            href={promptUrl("https://chatgpt.com/", page)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLinkIcon />
            Open in ChatGPT
          </DropdownMenuLinkItem>
          <DropdownMenuLinkItem
            href={promptUrl("https://claude.ai/new", page)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLinkIcon />
            Open in Claude
          </DropdownMenuLinkItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

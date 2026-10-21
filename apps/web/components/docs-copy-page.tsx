"use client"

import { useEffect, useState } from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

// Docs pages are components rather than Markdown files, so the Markdown is
// read from the rendered page: headings, text, lists, tables and code.
// Previews, navigation and controls are left out.
const skipped =
  "nav, button, iframe, canvas, svg, [aria-hidden=true], [role=tablist], [data-slot=component-preview], [data-copy-skip]"

function inline(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? ""
  if (!(node instanceof HTMLElement) || node.matches(skipped)) return ""
  const text = [...node.childNodes].map(inline).join("")
  switch (node.tagName) {
    case "CODE":
      return `\`${node.textContent}\``
    case "A": {
      const href = node.getAttribute("href")
      return href && !href.startsWith("#")
        ? `[${text.trim()}](${new URL(href, location.href).href})`
        : text
    }
    case "STRONG":
    case "B":
      return `**${text}**`
    default:
      return text
  }
}

function line(node: Element) {
  return inline(node).replace(/\s+/g, " ").trim()
}

function blocks(node: Element): string[] {
  if (!(node instanceof HTMLElement) || node.matches(skipped)) return []
  if (node.hidden) return []
  const heading = /^H([1-6])$/.exec(node.tagName)
  if (heading) return [`${"#".repeat(Number(heading[1]))} ${line(node)}`]
  switch (node.tagName) {
    case "P":
      return line(node) ? [line(node)] : []
    case "PRE":
      return [`\`\`\`\n${node.textContent?.trimEnd()}\n\`\`\``]
    case "UL":
    case "OL":
      return [
        [...node.children]
          .map((item, index) =>
            node.tagName === "OL"
              ? `${index + 1}. ${line(item)}`
              : `- ${line(item)}`
          )
          .join("\n"),
      ]
    case "TABLE": {
      const rows = [...node.querySelectorAll("tr")].map(
        (row) => `| ${[...row.children].map(line).join(" | ")} |`
      )
      const columns = node.querySelector("tr")?.children.length ?? 0
      return rows.length
        ? [
            [rows[0], `|${" --- |".repeat(columns)}`, ...rows.slice(1)].join(
              "\n"
            ),
          ]
        : []
    }
    default:
      return [...node.children].flatMap(blocks)
  }
}

function pageMarkdown() {
  const content = document.querySelector("[data-docs-content]")
  return content
    ? `${blocks(content).join("\n\n")}\n\nSource: ${location.href.split("#")[0]}\n`
    : ""
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
            .writeText(pageMarkdown())
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

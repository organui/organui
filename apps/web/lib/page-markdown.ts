// Docs pages are components rather than Markdown files, so their Markdown is
// read from the rendered page: headings, text, lists, tables and code.
// Previews, navigation and controls are left out. It runs on the page in the
// browser for Copy Page, and on the server for /docs/*.md.

const skipped =
  "nav, button, iframe, canvas, svg, [hidden], [aria-hidden=true], [role=tablist], [data-slot=component-preview], [data-copy-skip]"

const ELEMENT = 1
const TEXT = 3

type Context = { base: string }

function isElement(node: Node): node is Element {
  return node.nodeType === ELEMENT
}

function inline(node: Node, context: Context): string {
  if (node.nodeType === TEXT) return node.textContent ?? ""
  if (!isElement(node) || node.matches(skipped)) return ""
  const text = [...node.childNodes]
    .map((child) => inline(child, context))
    .join("")
  switch (node.tagName) {
    case "CODE":
      return `\`${node.textContent}\``
    case "A": {
      const href = node.getAttribute("href")
      return href && !href.startsWith("#")
        ? `[${text.trim()}](${new URL(href, context.base).href})`
        : text
    }
    case "STRONG":
    case "B":
      return `**${text}**`
    default:
      return text
  }
}

function line(node: Element, context: Context) {
  return inline(node, context).replace(/\s+/g, " ").trim()
}

function blocks(node: Element, context: Context): string[] {
  if (node.matches(skipped)) return []
  const heading = /^H([1-6])$/.exec(node.tagName)
  if (heading)
    return [`${"#".repeat(Number(heading[1]))} ${line(node, context)}`]
  switch (node.tagName) {
    case "P": {
      const text = line(node, context)
      return text ? [text] : []
    }
    case "PRE":
      return [`\`\`\`\n${node.textContent?.trimEnd()}\n\`\`\``]
    case "UL":
    case "OL":
      return [
        [...node.children]
          .map((item, index) =>
            node.tagName === "OL"
              ? `${index + 1}. ${line(item, context)}`
              : `- ${line(item, context)}`
          )
          .join("\n"),
      ]
    case "TABLE": {
      const rows = [...node.querySelectorAll("tr")].map(
        (row) =>
          `| ${[...row.children].map((cell) => line(cell, context)).join(" | ")} |`
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
      return [...node.children].flatMap((child) => blocks(child, context))
  }
}

// The Markdown for a docs page, given its [data-docs-content] element and
// its address, which links resolve against.
export function pageMarkdown(content: Element, url: string) {
  const page = url.split("#")[0]!
  return `${blocks(content, { base: page }).join("\n\n")}\n\nSource: ${page}\n`
}

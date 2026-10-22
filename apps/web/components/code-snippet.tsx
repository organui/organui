import type { ReactNode } from "react"
import { highlightCode, type CodeLanguage } from "@/lib/highlight-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"
import { CopyButton } from "@/components/copy-button"
import type { Event } from "@/lib/events"

// A highlighted, copyable code example, with an optional file name above it.
// The code is a scrollable region named by its label, so keyboard users can
// reach and scroll it. A file can show line numbers and an icon by its name,
// as the charts' code does.
export async function CodeSnippet({
  code,
  label,
  title,
  lang = "tsx",
  icon,
  lineNumbers = false,
  event = "copy_code",
  properties,
  className,
  headerClassName,
  contentClassName,
}: {
  code: string
  label: string
  title?: string
  lang?: CodeLanguage
  icon?: ReactNode
  lineNumbers?: boolean
  // What a copy counts as.
  event?: Event
  properties?: Record<string, string>
  className?: string
  headerClassName?: string
  contentClassName?: string
}) {
  const lines = await highlightCode(code, lang)
  return (
    <CodeBlock className={className}>
      {title ? (
        <CodeBlockHeader className={headerClassName}>
          <CodeBlockTitle>
            {icon}
            {title}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CopyButton event={event} properties={properties} value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
      ) : (
        <CodeBlockActions>
          <CopyButton event={event} properties={properties} value={code} />
        </CodeBlockActions>
      )}
      <CodeBlockContent
        lineNumbers={lineNumbers}
        role="region"
        aria-label={label}
        className={contentClassName}
      >
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>
            {line}
            {index < lines.length - 1 ? "\n" : null}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

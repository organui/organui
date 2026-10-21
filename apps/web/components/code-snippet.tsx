import { highlightCode, type CodeLanguage } from "@/lib/highlight-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"

// A highlighted, copyable code example, with an optional file name above it.
// The code is a scrollable region named by its label, so keyboard users can
// reach and scroll it.
export async function CodeSnippet({
  code,
  label,
  title,
  lang = "tsx",
  className,
  contentClassName,
}: {
  code: string
  label: string
  title?: string
  lang?: CodeLanguage
  className?: string
  contentClassName?: string
}) {
  const lines = await highlightCode(code, lang)
  return (
    <CodeBlock className={className}>
      {title ? (
        <CodeBlockHeader>
          <CodeBlockTitle>{title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
      ) : (
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      )}
      <CodeBlockContent
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

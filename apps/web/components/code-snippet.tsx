import { highlightCode, type CodeLanguage } from "@/lib/highlight-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockLine,
} from "@workspace/ui/components/code-block"

// A highlighted, copyable code example. The code is a scrollable region
// named by its label, so keyboard users can reach and scroll it.
export async function CodeSnippet({
  code,
  label,
  lang = "tsx",
  className,
}: {
  code: string
  label: string
  lang?: CodeLanguage
  className?: string
}) {
  const lines = await highlightCode(code, lang)
  return (
    <CodeBlock>
      <CodeBlockActions>
        <CodeBlockCopyButton value={code} />
      </CodeBlockActions>
      <CodeBlockContent role="region" aria-label={label} className={className}>
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

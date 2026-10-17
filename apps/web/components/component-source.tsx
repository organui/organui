// Adapted from shadcn/ui, apps/v4/components/component-source.tsx.
// See SHADCN-LICENSE.txt for the upstream MIT notice.
import { cache } from "react"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { getRegistryExample } from "@/examples/_registry"
import { highlightCode } from "@/lib/highlight-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"

const readExampleSource = cache(async (file: string) => {
  const source = await readFile(join(process.cwd(), "examples", file), "utf8")
  return source
    .replaceAll("@workspace/ui/components/", "@/components/ui/")
    .replaceAll("@workspace/registry/organ-viewer", "@/components/organ-viewer")
    .replaceAll(
      "@workspace/registry/blocks/explorer-01/components/organ-explorer",
      "@/components/organ-explorer"
    )
    .replace(
      /@workspace\/registry\/(anatomy-tree|ecg-trace|vital-signs|medication-schedule|dermatome-map)/g,
      "@/components/ui/$1"
    )
    .replaceAll("@workspace/registry/", "@/components/")
    .trimEnd()
})

export async function ComponentSource({
  name,
  maxLines,
}: {
  name: string
  maxLines?: number
}) {
  const item = await getRegistryExample(name)
  if (!item) return null
  const fullCode = await readExampleSource(item.file)
  const code = maxLines
    ? fullCode.split("\n").slice(0, maxLines).join("\n")
    : fullCode
  const lines = await highlightCode(code)
  return (
    <CodeBlock className="rounded-none border-x-0 border-b-0">
      {!maxLines && (
        <CodeBlockHeader>
          <CodeBlockTitle>{name}.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={fullCode} />
          </CodeBlockActions>
        </CodeBlockHeader>
      )}
      <CodeBlockContent
        aria-label={maxLines ? undefined : `${item.title} code`}
        tabIndex={maxLines ? -1 : 0}
      >
        {lines
          ? lines.map((line, index) => (
              <CodeBlockLine key={index}>
                {line}
                {index < lines.length - 1 ? "\n" : null}
              </CodeBlockLine>
            ))
          : code}
      </CodeBlockContent>
    </CodeBlock>
  )
}

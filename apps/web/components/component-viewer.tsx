"use client"

import { useState, type ReactNode } from "react"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

export type ComponentExample = {
  id: string
  label: string
  description?: string
  preview: ReactNode
  code: string
}

// Components supply examples; this shell owns their navigation and code view.
// Only the active preview mounts, including when examples contain WebGL scenes.
export function ComponentViewer({
  title,
  examples,
}: {
  title: string
  examples: readonly [ComponentExample, ...ComponentExample[]]
}) {
  const [selected, setSelected] = useState(examples[0].id)
  const example = examples.find(({ id }) => id === selected) ?? examples[0]

  return (
    <div role="group" aria-label={`${title} examples`} className="min-w-0">
      <div className="flex min-w-0 flex-col gap-4">
        {examples.length > 1 && (
          <ToggleGroup
            aria-label={`${title} example`}
            variant="outline"
            size="sm"
            spacing={2}
            className="max-w-full flex-wrap"
            value={[example.id]}
            onValueChange={(values) => {
              if (values[0]) setSelected(values[0])
            }}
          >
            {examples.map(({ id, label }) => (
              <ToggleGroupItem key={id} value={id}>
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        {example.description && (
          <p className="text-sm text-muted-foreground">{example.description}</p>
        )}
        <Tabs defaultValue="preview" className="min-w-0">
          <TabsList aria-label={`${title} preview and code`}>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div key={example.id} className="min-w-0">
              {example.preview}
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock>
              <CodeBlockHeader>
                <CodeBlockTitle>{example.label} usage</CodeBlockTitle>
                <CodeBlockActions>
                  <CodeBlockCopyButton value={example.code} />
                </CodeBlockActions>
              </CodeBlockHeader>
              <CodeBlockContent aria-label={`${example.label} code`}>
                {example.code}
              </CodeBlockContent>
            </CodeBlock>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

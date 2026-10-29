import type { ReactNode } from "react"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeading } from "@/components/docs-heading"

export type ComponentExample = {
  // The example's name in examples/_examples.tsx.
  name: string
  title: string
  description: string
}

// One example, as on shadcn/ui: its own top-level section with a heading,
// the text that explains it and a live preview with its code.
export function ExampleSection({
  example,
  children,
}: {
  example: ComponentExample
  // Defaults to the example's description.
  children?: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <DocsHeading id={example.name}>{example.title}</DocsHeading>
      {children ?? <p>{example.description}</p>}
      <ComponentPreview name={example.name} />
    </section>
  )
}

// A component's examples, each its own section, so they list flat in the
// page's contents.
export function ComponentExamples({
  examples,
}: {
  examples: readonly ComponentExample[]
}) {
  return examples.map((example) => (
    <ExampleSection key={example.name} example={example} />
  ))
}

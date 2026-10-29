import { ComponentPreview } from "@/components/component-preview"
import { DocsHeading } from "@/components/docs-heading"

export type ComponentExample = {
  // The example's name in examples/_examples.tsx.
  name: string
  title: string
  description: string
}

// A component's examples, as on shadcn/ui: each its own top-level section
// with a heading, a sentence and a live preview with its code, so they list
// flat in the page's contents.
export function ComponentExamples({
  examples,
}: {
  examples: readonly ComponentExample[]
}) {
  return examples.map((example) => (
    <section key={example.name} className="flex flex-col gap-4">
      <DocsHeading id={example.name}>{example.title}</DocsHeading>
      <p>{example.description}</p>
      <ComponentPreview name={example.name} />
    </section>
  ))
}

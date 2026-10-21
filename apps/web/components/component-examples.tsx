import { ComponentPreview } from "@/components/component-preview"
import { DocsHeading } from "@/components/docs-heading"

export type ComponentExample = {
  // The example's name in examples/_examples.tsx.
  name: string
  title: string
  description: string
}

// A component's Examples section, as on shadcn/ui: a heading, a sentence
// and a live preview with its code for each.
export function ComponentExamples({
  examples,
}: {
  examples: readonly ComponentExample[]
}) {
  return (
    <section className="flex flex-col gap-6">
      <DocsHeading id="examples">Examples</DocsHeading>
      {examples.map((example) => (
        <div key={example.name} className="flex flex-col gap-4">
          <DocsHeading id={example.name} level={3}>
            {example.title}
          </DocsHeading>
          <p>{example.description}</p>
          <ComponentPreview name={example.name} />
        </div>
      ))}
    </section>
  )
}

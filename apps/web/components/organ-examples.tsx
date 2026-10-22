import { DocsHeading } from "@/components/docs-heading"
import { organExampleVariants } from "@/examples/_registry"
import { ComponentPreview } from "@/components/component-preview"

// Page sections describe recipes; the shared shadcn preview renders each one.
export function OrganExamples({ name }: { name: string }) {
  return (
    <>
      {organExampleVariants.map(({ suffix, title, description }) => (
        <section key={suffix} className="flex min-w-0 flex-col gap-4">
          <DocsHeading id={title.toLowerCase().replaceAll(" ", "-")}>
            {title}
          </DocsHeading>
          <p className="text-sm text-muted-foreground">{description}</p>
          <ComponentPreview name={`${name}-${suffix}`} />
        </section>
      ))}
    </>
  )
}

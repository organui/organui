import { organExampleVariants } from "@/examples/_registry"
import { ComponentPreview } from "@/components/component-preview"

// Page sections describe recipes; the shared shadcn preview renders each one.
export function OrganExamples({ name }: { name: string }) {
  return (
    <>
      {organExampleVariants.map(({ suffix, title, description }) => (
        <section
          key={suffix}
          id={title.toLowerCase().replaceAll(" ", "-")}
          className="flex min-w-0 flex-col gap-4"
        >
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
          <ComponentPreview name={`${name}-${suffix}`} />
        </section>
      ))}
    </>
  )
}

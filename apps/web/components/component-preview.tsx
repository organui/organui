// Adapted from shadcn/ui, apps/v4/components/component-preview.tsx
// at daaf156ee00ed91cc7e6bdd937c1b4973152d141. See SHADCN-LICENSE.txt.
import type { ComponentProps } from "react"
import { getRegistryExample } from "@/examples/_registry"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { ComponentSource } from "@/components/component-source"
import { DeferredPreview } from "@/components/deferred-preview"

export async function ComponentPreview({
  name,
  align = "center",
  hideCode = false,
  previewClassName = "h-auto *:w-full *:min-w-0",
  caption,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  name: string
  align?: "center" | "start" | "end"
  hideCode?: boolean
  previewClassName?: string
  caption?: string
}) {
  const item = await getRegistryExample(name)
  if (!item)
    return (
      <p className="text-sm text-muted-foreground">
        Example <code>{name}</code> not found in registry.
      </p>
    )
  const content = (
    <ComponentPreviewTabs
      role="group"
      aria-label={`${item.title} example`}
      data-example={name}
      previewClassName={previewClassName}
      align={align}
      hideCode={hideCode}
      component={
        item.lazy ? (
          <DeferredPreview>{item.component}</DeferredPreview>
        ) : (
          item.component
        )
      }
      source={<ComponentSource name={name} />}
      sourcePreview={<ComponentSource name={name} maxLines={3} />}
      {...props}
    />
  )
  return caption ? (
    <figure className="flex flex-col gap-4">
      {content}
      <figcaption className="text-center text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  ) : (
    content
  )
}

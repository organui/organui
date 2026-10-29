import { cache } from "react"
import { examples } from "./_examples"

export const organExampleVariants = [
  {
    suffix: "controls",
    title: "Controls",
    description:
      "By default the stage has a view menu, zoom and reset. The demo at the top hides them with controls={false}, keeping camera interaction and attribution.",
  },
  {
    suffix: "controlled",
    title: "Controlled Selection",
    description:
      "Connect selection to your application state with selectedId and onSelectionChange.",
  },
  {
    suffix: "with-anatomy",
    title: "With Anatomy Panel",
    description:
      "Pair this component with AnatomyTree for shared selection and visibility. For a complete layout with a mobile sheet, see the Explorer 01 block.",
  },
] as const

// Private documentation examples, separate from installable registry components.
export const getRegistryExample = cache(async (name: string) => {
  const definition = Object.hasOwn(examples, name) ? examples[name] : undefined
  if (definition)
    return {
      name,
      title: definition.title,
      file: definition.file,
      component: await definition.render(),
      lazy: definition.lazy ?? false,
    }

  return null
})

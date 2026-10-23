// Each component's props, read from its source: the name, type and doc
// comment from its exported Props type, and the default from its signature.
// write-component-api.ts writes them to component-api.json, which the docs
// site shows as each component's API Reference.
import ts from "typescript"
import { readFileSync } from "node:fs"

export type ComponentProp = {
  name: string
  type: string
  required: boolean
  default: string | null
  description: string
}

export type ComponentApi = {
  component: string
  props: ComponentProp[]
  /** The element that receives every other prop, from React.ComponentProps. */
  element: string | null
}

// Registry item, its file, and the component documented there.
export const documented = {
  "anatomy-tree": ["anatomy-tree/anatomy-tree.tsx", "AnatomyTree"],
  "body-map": ["body-map/body-map.tsx", "BodyMap"],
  "dermatome-map": ["dermatome-map/dermatome-map.tsx", "DermatomeMap"],
  "disease-viewer": ["disease-viewer/disease-viewer.tsx", "DiseaseViewer"],
  "dna-helix": ["dna-helix/dna-helix.tsx", "DnaHelix"],
  "ecg-trace": ["ecg-trace/ecg-trace.tsx", "EcgTrace"],
  "growth-chart": ["growth-chart/growth-chart.tsx", "GrowthChart"],
  "image-viewer": ["image-viewer/image-viewer.tsx", "ImageViewer"],
  "lab-results": ["lab-results/lab-results.tsx", "LabResultsTable"],
  "medication-schedule": [
    "medication-schedule/medication-schedule.tsx",
    "MedicationSchedule",
  ],
  "molecule-viewer": ["molecule-viewer/molecule-viewer.tsx", "MoleculeViewer"],
  "organ-viewer": ["organ-viewer/organ-viewer.tsx", "OrganViewer"],
  "vital-signs": ["vital-signs/vital-signs.tsx", "VitalSigns"],
} as const

function readApi(file: string, component: string): ComponentApi {
  const path = new URL(`../registry/base-nova/${file}`, import.meta.url)
  const source = ts.createSourceFile(
    file,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  let members: ts.NodeArray<ts.TypeElement> | undefined
  let element: string | null = null
  const defaults = new Map<string, string>()
  source.forEachChild((node) => {
    if (
      ts.isTypeAliasDeclaration(node) &&
      node.name.text === `${component}Props`
    ) {
      // Either { ... } or, as shadcn types its components,
      // React.ComponentProps<"div"> & { ... }, possibly inside Omit<>.
      const parts = ts.isIntersectionTypeNode(node.type)
        ? node.type.types
        : [node.type]
      for (const part of parts) {
        if (ts.isTypeLiteralNode(part)) members = part.members
        const match = /ComponentProps<"(\w+)">/.exec(part.getText(source))
        if (match) element = match[1]!
      }
    }
    if (ts.isFunctionDeclaration(node) && node.name?.text === component) {
      const binding = node.parameters[0]?.name
      if (binding && ts.isObjectBindingPattern(binding))
        for (const element of binding.elements)
          if (element.initializer)
            defaults.set(
              (element.propertyName ?? element.name).getText(source),
              element.initializer.getText(source)
            )
    }
  })
  if (!members) throw new Error(`${file}: no ${component}Props type literal`)
  return {
    component,
    element,
    props: members.filter(ts.isPropertySignature).map((member) => {
      const name = member.name.getText(source)
      const description = ts
        .getJSDocCommentsAndTags(member)
        .map((doc) => ts.getTextOfJSDocComment(doc.comment) ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
      return {
        name,
        type: (member.type?.getText(source) ?? "unknown").replace(/\s+/g, " "),
        required: !member.questionToken,
        default: defaults.get(name) ?? null,
        description,
      }
    }),
  }
}

export function componentApi() {
  return Object.fromEntries(
    Object.entries(documented).map(([item, [file, component]]) => [
      item,
      readApi(file, component),
    ])
  ) as Record<keyof typeof documented, ComponentApi>
}

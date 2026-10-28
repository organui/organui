import Link from "next/link"
import type { Condition } from "@workspace/registry/condition-model"
import { DocsHeading } from "@/components/docs-heading"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

type Prop = { type: string; default: string; description: string }

const union = (ids: readonly string[]) =>
  ids.length ? ids.map((id) => `"${id}"`).join(" | ") : "string"

// The condition viewer's own props. With a condition, the scale and stage types
// are its own IDs; without one (the viewer's page), the condition is a prop.
function propsFor(condition?: Condition): Record<string, Prop> {
  const scales = condition?.scales.map(({ id }) => id) ?? []
  const stages = condition?.stages?.map(({ id }) => id) ?? []
  return {
    ...(condition
      ? {}
      : {
          condition: {
            type: "Condition",
            default: "—",
            description:
              "The condition: its scales, stages, findings and investigations.",
          },
        }),
    scale: {
      type: union(scales),
      default: "—",
      description: "Control the scale shown.",
    },
    defaultScale: {
      type: union(scales),
      default: scales[0] ? `"${scales[0]}"` : "First scale",
      description: "Choose the scale shown first.",
    },
    onScaleChange: {
      type: "(scale: string) => void",
      default: "—",
      description: "Receive the scale a reader chooses.",
    },
    stage: {
      type: union(stages),
      default: "—",
      description: "Control the stage shown.",
    },
    defaultStage: {
      type: union(stages),
      default: stages[0] ? `"${stages[0]}"` : "First stage",
      description: "Choose the stage shown first.",
    },
    onStageChange: {
      type: "(stage: string) => void",
      default: "—",
      description: "Receive the stage a reader chooses.",
    },
    selectedId: {
      type: "string | null",
      default: "null",
      description: "Control the selected structure ID.",
    },
    onSelectionChange: {
      type: "(id: string | null) => void",
      default: "—",
      description: "Receive selections from the model and the panel.",
    },
    panel: {
      type: "boolean",
      default: "true",
      description:
        "Show the scales, findings and investigations beside the model.",
    },
    timeline: {
      type: "boolean",
      default: "true",
      description:
        "Show the course under the model, with its events and a play button. A condition with one stage has none.",
    },
    className: {
      type: "string",
      default: "—",
      description: "Set the layout of the model and the panel.",
    },
  }
}

export function ConditionApi({
  component,
  condition,
}: {
  component: string
  condition?: Condition
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <DocsHeading id="api-reference">API Reference</DocsHeading>
      <p>
        Import <code>{component}Props</code> from the same file as{" "}
        <code>{component}</code>.
      </p>
      <Table
        tabIndex={0}
        className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <TableCaption>{component} props</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Prop</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(propsFor(condition)).map(([name, prop]) => (
            <TableRow key={name}>
              <TableCell>
                <code>{name}</code>
              </TableCell>
              <TableCell className="whitespace-normal">
                <code>{prop.type}</code>
              </TableCell>
              <TableCell>{prop.default}</TableCell>
              <TableCell className="whitespace-normal">
                {prop.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-muted-foreground">
        Other props, such as <code>visibility</code>, <code>controls</code>,{" "}
        <code>defaultView</code> and <code>ref</code>, go to the{" "}
        <Link href="/docs/components/organ-viewer" className="underline">
          organ viewer
        </Link>
        .
      </p>
    </section>
  )
}

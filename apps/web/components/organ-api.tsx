import type { OrganViewerProps } from "@workspace/registry/organ-viewer"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

const props = {
  src: {
    type: "string",
    default: "Organ model URL",
    description: "Override the model URL to host the GLB yourself.",
  },
  selectedId: {
    type: "string | null",
    default: "null",
    description: "Control the selected structure ID.",
  },
  onSelectionChange: {
    type: "(id: string) => void",
    default: "—",
    description: "Receive selection changes from the model.",
  },
  visibility: {
    type: "Readonly<Record<string, boolean>>",
    default: "Model defaults",
    description: "Set structure visibility by ID; missing IDs are visible.",
  },
  defaultView: {
    type: "string",
    default: "Organ default view",
    description: "Choose the initial named view.",
  },
  onViewChange: {
    type: "(view: string | null) => void",
    default: "—",
    description: "Receive the view name, or null after free rotation.",
  },
  controls: {
    type: "boolean",
    default: "true",
    description: "Show view, zoom and reset controls.",
  },
  attribution: {
    type: "boolean",
    default: "true",
    description:
      "Show model credit and licence. Credit it elsewhere if hidden.",
  },
  label: {
    type: "string",
    default: "Interactive [organ] model",
    description: "Accessible name for the viewer region.",
  },
  className: {
    type: "string",
    default: "—",
    description: "Set the component's layout and dimensions.",
  },
  ref: {
    type: "React.Ref<OrganViewerHandle>",
    default: "—",
    description: "Access setView, zoom, rotate and reset methods.",
  },
} satisfies Record<
  keyof Omit<OrganViewerProps, "model">,
  { type: string; default: string; description: string }
>

export function OrganApi({ component }: { component: string }) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <h2 id="api-reference" className="text-2xl font-semibold">
        API Reference
      </h2>
      <p>
        Import <code>{component}Props</code> from the same file as{" "}
        <code>{component}</code>. The organ model is already configured.
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
          {Object.entries(props).map(([name, prop]) => (
            <TableRow key={name}>
              <TableCell>
                <code>{name}</code>
              </TableCell>
              <TableCell>
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
    </section>
  )
}

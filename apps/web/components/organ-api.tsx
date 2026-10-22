import api from "@workspace/registry/component-api.json"
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

// Read shared props from the generated API so every organ stays in sync.
const props = api["organ-viewer"].props.filter(({ name }) => name !== "model")
const defaults: Record<string, string> = {
  src: "Organ model URL",
  defaultView: "Organ default view",
  visibility: "Model defaults",
  label: "Interactive [organ] model",
}

export function OrganApi({ component }: { component: string }) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <DocsHeading id="api-reference">API Reference</DocsHeading>
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
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>
                <code>{prop.name}</code>
              </TableCell>
              <TableCell>
                <code>{prop.type}</code>
              </TableCell>
              <TableCell>
                {defaults[prop.name] ?? prop.default ?? "—"}
              </TableCell>
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

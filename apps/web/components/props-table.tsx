import api from "@workspace/registry/component-api.json"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { DocsHeading } from "@/components/docs-heading"

// A component's API Reference, as shadcn/ui ends its component pages with:
// every prop, read from the component's own types, doc comments and
// defaults (packages/registry/component-api.json).
export function PropsTable({ item }: { item: keyof typeof api }) {
  const { component, props, element } = api[item]
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell className="align-top">
                <code>{prop.name}</code>
              </TableCell>
              <TableCell className="whitespace-normal">
                <code className="break-words">{prop.type}</code>
                <p className="mt-1 text-muted-foreground">{prop.description}</p>
              </TableCell>
              <TableCell className="align-top">
                {prop.required ? (
                  "Required"
                ) : prop.default ? (
                  <code>{prop.default}</code>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {element && (
        <p className="text-muted-foreground">
          Any other prop, such as <code>className</code>, <code>id</code> or{" "}
          <code>aria-*</code>, is passed to the root{" "}
          <code>{`<${element}>`}</code>.
        </p>
      )}
    </section>
  )
}

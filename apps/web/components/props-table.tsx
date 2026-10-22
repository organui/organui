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
export function PropsTable({
  item,
  component = api[item].component,
  description,
  exclude = [],
  defaults = {},
}: {
  item: keyof typeof api
  component?: string
  description?: string
  exclude?: readonly string[]
  defaults?: Readonly<Record<string, string>>
}) {
  const props = api[item].props.filter(({ name }) => !exclude.includes(name))
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <DocsHeading id="api-reference">API Reference</DocsHeading>
      <p>
        Import <code>{component}Props</code> from the same file as{" "}
        <code>{component}</code>.{description ? ` ${description}` : null}
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
          {props.map((prop) => {
            const defaultValue = defaults[prop.name] ?? prop.default
            return (
              <TableRow key={prop.name}>
                <TableCell className="align-top">
                  <code>{prop.name}</code>
                </TableCell>
                <TableCell className="whitespace-normal">
                  <code className="break-words">{prop.type}</code>
                  <p className="mt-1 text-muted-foreground">
                    {prop.description}
                  </p>
                </TableCell>
                <TableCell className="align-top">
                  {prop.required ? (
                    "Required"
                  ) : defaultValue ? (
                    <code>{defaultValue}</code>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

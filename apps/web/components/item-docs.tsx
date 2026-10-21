import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { CodeSnippet } from "@/components/code-snippet"
import { ComponentInstallation } from "@/components/component-installation"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"

export type ItemDoc = {
  usage: string
  usageLang: "tsx" | "css"
  // Functions, props or classes, by `name`.
  reference: { name: string; description: string }[]
  notes: string[]
}

// A utility's or AI element's page, laid out like shadcn/ui's: a live
// example, the install command, how to use it, a reference table and notes.
export function ItemDocs({
  item,
  doc,
  reference,
  installNote,
  css,
  oneLibrary,
}: {
  item: {
    name: string
    title: string
    description?: string
    href: string
    install: string
  }
  doc: ItemDoc
  // The reference table's heading and first column, such as "Props".
  reference: { heading: string; column: string; caption: string }
  installNote: string
  // CSS the item adds, for its manual installation.
  css?: string
  oneLibrary?: boolean
}) {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={item.href} title={item.title}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          {item.description}
        </p>
      </DocsHeader>
      <ComponentPreview name={`${item.name}-demo`} />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <ComponentInstallation
          name={item.name}
          command={item.install}
          css={css}
          oneLibrary={oneLibrary}
        />
        <p className="text-sm text-muted-foreground">{installNote}</p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet
          label="Usage example"
          code={doc.usage}
          lang={doc.usageLang}
        />
      </section>
      <section className="flex min-w-0 flex-col gap-4">
        <DocsHeading id="reference">{reference.heading}</DocsHeading>
        <Table
          tabIndex={0}
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <TableCaption>{reference.caption}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{reference.column}</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doc.reference.map((row) => (
              <TableRow key={row.name}>
                <TableCell>
                  <code>{row.name}</code>
                </TableCell>
                <TableCell className="whitespace-normal">
                  {row.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="notes">Notes</DocsHeading>
        {doc.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </section>
      <DocsPager href={item.href} />
    </div>
  )
}

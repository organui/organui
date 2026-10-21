import type { Metadata } from "next"
import { notFound } from "next/navigation"
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
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { UtilitiesInstallation } from "@/components/utilities-installation"
import { docsMetadata, utilityItems } from "@/lib/registry"
import { utilityDocs } from "@/lib/utility-docs"

type Props = { params: Promise<{ name: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return utilityItems.map(({ name }) => ({ name }))
}

function find(name: string) {
  const item = utilityItems.find((entry) => entry.name === name)
  const doc = utilityDocs[name]
  return item && doc ? { item, doc } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = find((await params).name)
  if (!found) return {}
  const { item } = found
  return docsMetadata(item.title, item.description, item.href)
}

// A family of classes, as shadcn/ui documents its scroll-fade and shimmer:
// a preview, how to get them, then each class and the styles it sets.
export default async function Page({ params }: Props) {
  const { name } = await params
  const found = find(name)
  if (!found) notFound()
  const { item, doc } = found
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={item.href} title={item.title}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          {item.description}
        </p>
      </DocsHeader>
      <ComponentPreview name={`${name}-demo`} />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <UtilitiesInstallation name={item.title} />
      </section>
      <section className="flex min-w-0 flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <Table
          tabIndex={0}
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <TableCaption>{item.title} classes</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Styles</TableHead>
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
        <CodeSnippet
          label="Usage example"
          code={doc.usage}
          lang={doc.usageLang}
        />
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

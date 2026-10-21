import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ItemDocs } from "@/components/item-docs"
import { helperDocs } from "@/lib/helper-docs"
import { docsMetadata, helperItems } from "@/lib/registry"

type Props = { params: Promise<{ name: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return helperItems.map(({ name }) => ({ name }))
}

function find(name: string) {
  const item = helperItems.find((entry) => entry.name === name)
  const doc = helperDocs[name]
  return item && doc ? { item, doc } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = find((await params).name)
  if (!found) return {}
  const { item } = found
  return docsMetadata(item.title, item.description ?? "", item.href)
}

export default async function Page({ params }: Props) {
  const { name } = await params
  const found = find(name)
  if (!found) notFound()
  const { item, doc } = found
  return (
    <ItemDocs
      item={item}
      doc={doc}
      reference={{
        heading: "API Reference",
        column: "Export",
        caption: `${item.title} exports`,
      }}
      installNote={`This adds lib/${name}.ts, with no dependencies.`}
      oneLibrary
    />
  )
}

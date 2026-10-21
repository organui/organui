import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ItemDocs } from "@/components/item-docs"
import { aiDocs } from "@/lib/ai-docs"
import { aiItems, docsMetadata } from "@/lib/registry"

type Props = { params: Promise<{ name: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return aiItems.map(({ name }) => ({ name }))
}

function find(name: string) {
  const item = aiItems.find((entry) => entry.name === name)
  const doc = aiDocs[name]
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
        column: "Prop",
        caption: `${item.title} props`,
      }}
      installNote={`This adds components/ui/${name}.tsx, built on shadcn's components in your project's Base UI or Radix style.`}
    />
  )
}

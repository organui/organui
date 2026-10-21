import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { utilitiesCss } from "@workspace/registry/utilities-css"
import { ItemDocs } from "@/components/item-docs"
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
  return docsMetadata(item.title, item.description ?? "", item.href)
}

export default async function Page({ params }: Props) {
  const { name } = await params
  const found = find(name)
  if (!found) notFound()
  const { item, doc } = found
  const css = item.kind === "css"
  return (
    <ItemDocs
      item={item}
      doc={doc}
      reference={
        css
          ? {
              heading: "Classes",
              column: "Class",
              caption: `${item.title} classes`,
            }
          : {
              heading: "API Reference",
              column: "Export",
              caption: `${item.title} exports`,
            }
      }
      installNote={
        css
          ? "The CLI adds the CSS to your global CSS file, after your theme."
          : `This adds lib/${name}.ts, with no dependencies.`
      }
      css={css ? utilitiesCss([name]) : undefined}
      oneLibrary
    />
  )
}

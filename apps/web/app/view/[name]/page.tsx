import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { blockPages } from "@/lib/blocks"
import { registryBlocks } from "@/lib/registry"

type Props = { params: Promise<{ name: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return registryBlocks.map(({ name }) => ({ name }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const block = registryBlocks.find((entry) => entry.name === name)
  // Previews are framed by /blocks; the listing is the page to index.
  return block
    ? {
        title: block.title,
        alternates: { canonical: block.href },
        robots: { index: false },
      }
    : {}
}

export default async function Page({ params }: Props) {
  const { name } = await params
  const Block = blockPages[name]
  if (!Block) notFound()
  return <Block />
}

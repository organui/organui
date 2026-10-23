import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { organModels } from "@/lib/organ-models"
import { diseases, organs } from "@/lib/registry"
import { OrganViewer } from "@workspace/registry/organ-viewer"

type Props = { params: Promise<{ name: string }> }

// A bare organ or disease at its default view, for scripts/organ-thumbnails.ts to
// screenshot. It renders without the model credit, so it exists only under
// `next dev` with ORGANUI_THUMBNAILS=1, as the script runs it. A production
// build has no such pages even with the variable set; the gallery credits
// every thumbnail.
const enabled =
  process.env.ORGANUI_THUMBNAILS === "1" &&
  process.env.NODE_ENV === "development"

export const dynamicParams = false

export const metadata: Metadata = { robots: { index: false, follow: false } }

export function generateStaticParams() {
  return enabled ? [...organs, ...diseases].map(({ name }) => ({ name })) : []
}

export default async function Page({ params }: Props) {
  const { name } = await params
  const load = organModels[name]
  if (!enabled || !load) notFound()
  const model = await load()
  return (
    <>
      {/* Transparent behind the model; the hint, the progress text and the
          dev server's indicator stay out of the picture. */}
      <style>{`html, body { background: transparent !important; }
[data-thumbnail] p, nextjs-portal { display: none; }`}</style>
      <div data-thumbnail={name} style={{ width: 640, height: 480 }}>
        <OrganViewer
          model={model}
          controls={false}
          attribution={false}
          className="size-full rounded-none border-0 bg-transparent"
        />
      </div>
    </>
  )
}

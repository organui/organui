import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { conditionData } from "@/lib/conditions"
import { organModels } from "@/lib/organ-models"
import { conditions, organs } from "@/lib/registry"
import { ClipStage } from "./clip-stage"

type Props = { params: Promise<{ name: string }> }

// One item filling the window, for scripts/clips.ts to film frame by frame
// for social posts. Like /thumbnail it renders without the model credit (the
// post carries it), so it exists only under `next dev` with ORGANUI_CLIPS=1.
const enabled =
  process.env.ORGANUI_CLIPS === "1" && process.env.NODE_ENV === "development"

export const dynamicParams = false

export function generateStaticParams() {
  return enabled
    ? [...organs, ...conditions, { name: "ecg-trace" }].map(({ name }) => ({
        name,
      }))
    : []
}

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function Page({ params }: Props) {
  const { name } = await params
  if (!enabled) notFound()
  if (name === "ecg-trace") return <ClipStage kind="ecg" name={name} />
  const loadCondition = conditionData[name]
  if (loadCondition)
    return (
      <ClipStage
        kind="condition"
        name={name}
        condition={await loadCondition()}
      />
    )
  const loadModel = organModels[name]
  if (loadModel)
    return <ClipStage kind="organ" name={name} model={await loadModel()} />
  notFound()
}

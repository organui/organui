"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import type { Condition } from "@workspace/registry/condition-model"
import { ConditionViewer } from "@workspace/registry/condition-viewer"
import { EcgTrace, syntheticEcgStream } from "@workspace/registry/ecg-trace"
import {
  OrganViewer,
  type OrganModel,
  type OrganViewerHandle,
} from "@workspace/registry/organ-viewer"

// What scripts/clips.ts drives: how many frames the clip has, and how to set
// the scene for frame i before it advances the page's fake clock one frame.
export type Clip = { frames: number; step: (frame: number) => void }

declare global {
  interface Window {
    clip?: Clip
  }
}

export const FPS = 30
const ORGAN_SECONDS = 8 // one full turn
const STAGE_SECONDS = 2.5 // as long as the timeline's play button holds a stage
const ECG_SECONDS = 8

type Props =
  | { kind: "organ"; name: string; model: OrganModel }
  | { kind: "condition"; name: string; condition: Condition }
  | { kind: "ecg"; name: string }

export function ClipStage(props: Props) {
  const viewer = React.useRef<OrganViewerHandle>(null)
  const condition = props.kind === "condition" ? props.condition : undefined
  const stages = React.useMemo(() => condition?.stages ?? [], [condition])
  const [stage, setStage] = React.useState(stages[0]?.id)
  const stream = React.useMemo(() => syntheticEcgStream(), [])

  React.useEffect(() => {
    let clip: Clip
    if (props.kind === "organ") {
      const frames = ORGAN_SECONDS * FPS
      // Frame i is i/frames of a turn, so the last frame leads back into the
      // first and the clip loops.
      clip = {
        frames,
        step: (i) => {
          // A little closer than the default fit, which leaves room for
          // the toolbar the clip hides.
          if (i === 0) viewer.current?.zoom(0.85)
          else viewer.current?.rotate((2 * Math.PI) / frames)
        },
      }
    } else if (props.kind === "condition") {
      const perStage = STAGE_SECONDS * FPS
      const frames = Math.max(1, stages.length) * perStage + FPS
      // A gentle sway rather than a full turn, so the affected side stays in
      // view while each stage recolours the model.
      const sway = (i: number) => 0.35 * Math.sin((2 * Math.PI * i) / frames)
      clip = {
        frames,
        step: (i) => {
          const next =
            stages[Math.min(Math.floor(i / perStage), stages.length - 1)]
          if (next) setStage(next.id)
          if (i > 0) viewer.current?.rotate(sway(i) - sway(i - 1))
        },
      }
    } else {
      clip = { frames: ECG_SECONDS * FPS, step: () => {} }
    }
    window.clip = clip
    return () => {
      delete window.clip
    }
  }, [props.kind, stages])

  return (
    <>
      {/* The viewer's drag hint and the dev server's indicator stay out of
          the picture. */}
      <style>{`[data-slot="organ-viewer"] > p, nextjs-portal { display: none !important; }`}</style>
      <div
        data-clip={props.name}
        className={cn(
          "flex h-svh w-svw flex-col bg-background p-8",
          // A condition's caption changes length with the stage, so it is
          // pinned to the top rather than re-centred each stage.
          props.kind !== "condition" && "justify-center"
        )}
      >
        {props.kind === "organ" && (
          <OrganViewer
            ref={viewer}
            model={props.model}
            controls={false}
            attribution={false}
            className="min-h-0 flex-1 rounded-none border-0 bg-transparent"
          />
        )}
        {props.kind === "condition" && (
          <ConditionViewer
            ref={viewer}
            condition={props.condition}
            stage={stage}
            onStageChange={setStage}
            panel={false}
            controls={false}
            attribution={false}
            className="w-full"
          />
        )}
        {props.kind === "ecg" && <EcgTrace stream={stream} />}
      </div>
    </>
  )
}

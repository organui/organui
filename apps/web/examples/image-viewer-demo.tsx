"use client"
import { ImageViewer, ctWindowPresets } from "@workspace/registry/image-viewer"
import { createHeadPhantom } from "@workspace/registry/image-viewer/head-phantom"

const phantom = createHeadPhantom()

export function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <ImageViewer
        {...phantom}
        presets={ctWindowPresets}
        defaultSlice={15}
        defaultWindow={ctWindowPresets[0]}
      />
      <p className="text-xs text-muted-foreground">
        A generated Shepp–Logan head phantom in Hounsfield units. No patient
        data or clinical validation.
      </p>
    </div>
  )
}

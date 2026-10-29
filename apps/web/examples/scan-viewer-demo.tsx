"use client"
import { ScanViewer, ctWindowPresets } from "@workspace/registry/scan-viewer"
import { createHeadPhantom } from "@workspace/registry/scan-viewer/head-phantom"

const phantom = createHeadPhantom()

export function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <ScanViewer
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

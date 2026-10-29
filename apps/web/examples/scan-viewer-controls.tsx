"use client"
import { ScanViewer, ctWindowPresets } from "@workspace/registry/scan-viewer"
import { createHeadPhantom } from "@workspace/registry/scan-viewer/head-phantom"

const phantom = createHeadPhantom()

// The default: a toolbar with window presets, tools and zoom, and a slider.
export function Example() {
  return (
    <ScanViewer
      {...phantom}
      presets={ctWindowPresets}
      defaultSlice={15}
      defaultWindow={ctWindowPresets[0]}
      label="Phantom with controls"
    />
  )
}

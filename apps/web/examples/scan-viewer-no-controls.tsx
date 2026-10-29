"use client"
import { ScanViewer } from "@workspace/registry/scan-viewer"
import { createHeadPhantom } from "@workspace/registry/scan-viewer/head-phantom"

const phantom = createHeadPhantom()

// No toolbar or slider: the image still scrolls, zooms and windows.
export function Example() {
  return (
    <ScanViewer
      {...phantom}
      defaultSlice={15}
      controls={false}
      label="Phantom without controls"
    />
  )
}

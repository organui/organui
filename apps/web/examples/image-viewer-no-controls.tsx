"use client"
import { ImageViewer } from "@workspace/registry/image-viewer"
import { createHeadPhantom } from "@workspace/registry/image-viewer/head-phantom"

const phantom = createHeadPhantom()

// No toolbar or slider: the image still scrolls, zooms and windows.
export function Example() {
  return (
    <ImageViewer
      {...phantom}
      defaultSlice={15}
      controls={false}
      label="Phantom without controls"
    />
  )
}

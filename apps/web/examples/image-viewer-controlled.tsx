"use client"
import { useState } from "react"
import {
  ImageViewer,
  ctWindowPresets,
  type ImageWindow,
} from "@workspace/registry/image-viewer"
import { createHeadPhantom } from "@workspace/registry/image-viewer/head-phantom"
import { Button } from "@workspace/ui/components/button"

const phantom = createHeadPhantom()

// Slice and window come from your state, so your own controls drive them.
export function Example() {
  const [slice, setSlice] = useState(15)
  const [window, setWindow] = useState<ImageWindow>(ctWindowPresets[0]!)
  return (
    <div className="flex w-full flex-col gap-3">
      <ImageViewer
        {...phantom}
        slice={slice}
        onSliceChange={setSlice}
        window={window}
        onWindowChange={setWindow}
        presets={ctWindowPresets}
        label="Phantom with your controls"
      />
      <div className="flex flex-wrap gap-2">
        {ctWindowPresets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => setWindow(preset)}
          >
            {preset.name}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={() => setSlice(0)}>
          First slice
        </Button>
      </div>
    </div>
  )
}

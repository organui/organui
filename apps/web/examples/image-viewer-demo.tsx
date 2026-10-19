"use client"
import { useId, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  ImageViewer,
  ctWindowPresets,
  type ImageSlice,
  type ImageWindow,
} from "@workspace/registry/image-viewer"
import { dicomSeries, parseDicom } from "@workspace/registry/image-viewer/dicom"
import { createHeadPhantom } from "@workspace/registry/image-viewer/head-phantom"

type Series = {
  name: string
  slices: readonly ImageSlice[]
  pixelSpacing?: readonly [number, number]
  unit?: string
}

function phantomSeries(): Series {
  return { name: "Head phantom", ...createHeadPhantom() }
}

export function Example() {
  const [series, setSeries] = useState(phantomSeries)
  const [slice, setSlice] = useState(15)
  const [window, setWindow] = useState<ImageWindow>(ctWindowPresets[0]!)
  const [error, setError] = useState<string | null>(null)
  const input = useId()

  async function open(files: FileList | null) {
    if (!files?.length) return
    try {
      const images = await Promise.all(
        [...files].map(async (file) => parseDicom(await file.arrayBuffer()))
      )
      const { slices, pixelSpacing, unit, window: stored } = dicomSeries(images)
      let min = Infinity
      let max = -Infinity
      for (const value of slices[0]!.data) {
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
      setSeries({
        name: `${slices.length} DICOM file${slices.length === 1 ? "" : "s"}`,
        slices,
        pixelSpacing,
        unit,
      })
      setSlice(Math.floor(slices.length / 2))
      setWindow(
        stored ?? { center: (min + max) / 2, width: Math.max(max - min, 1) }
      )
      setError(null)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ImageViewer
        slices={series.slices}
        pixelSpacing={series.pixelSpacing}
        unit={series.unit}
        presets={series.unit === "HU" ? ctWindowPresets : []}
        slice={slice}
        onSliceChange={setSlice}
        window={window}
        onWindowChange={setWindow}
        label={series.name}
      />
      <aside className="grid gap-4 rounded-xl border bg-muted/30 p-5 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 font-medium">Your viewer state</h2>
          <p className="text-sm" role="status">
            Slice {slice + 1} of {series.slices.length} · Window{" "}
            {Math.round(window.width)} / level {Math.round(window.center)}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {series.name === "Head phantom"
              ? "A generated Shepp–Logan head phantom in Hounsfield units. No patient data or clinical validation."
              : "Read in your browser; nothing is uploaded."}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <label htmlFor={input} className="text-sm font-medium">
            Open DICOM files
          </label>
          <input
            id={input}
            type="file"
            multiple
            accept=".dcm,application/dicom"
            onChange={(event) => open(event.currentTarget.files)}
            className="max-w-full text-sm file:mr-3 file:rounded-md file:border file:bg-background file:px-3 file:py-1.5 file:text-sm"
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {series.name !== "Head phantom" && (
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={() => {
                setSeries(phantomSeries())
                setSlice(15)
                setWindow(ctWindowPresets[0]!)
              }}
            >
              Back to the phantom
            </Button>
          )}
        </div>
      </aside>
    </div>
  )
}

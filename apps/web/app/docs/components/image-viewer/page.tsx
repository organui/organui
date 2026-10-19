import { ComponentPreview } from "@/components/component-preview"
import { DocsPager } from "@/components/docs-pager"
import Link from "next/link"
import { codeBlock, docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Medical image viewer",
  "A CT and MRI slice viewer with window and level, zoom, pan and an in-browser DICOM reader, for healthcare interfaces.",
  "/docs/components/image-viewer"
)

const usage = `"use client"
import { useState } from "react"
import { ImageViewer, ctWindowPresets } from "@/components/ui/image-viewer"
import { createHeadPhantom } from "@/lib/head-phantom"

const phantom = createHeadPhantom()

export function Scan() {
  const [slice, setSlice] = useState(15)
  return <ImageViewer {...phantom}
    presets={ctWindowPresets}
    slice={slice} onSliceChange={setSlice} />
}`

const dicom = `import { dicomSeries, parseDicom } from "@/lib/dicom"

async function openFiles(files: FileList) {
  const images = await Promise.all(
    [...files].map(async (file) => parseDicom(await file.arrayBuffer()))
  )
  // { slices, pixelSpacing, window, unit }, ordered head to foot
  return dicomSeries(images)
}`

const images = `<ImageViewer slices={[
  { src: "/scans/axial-001.png", label: "Axial 1" },
  { src: "/scans/axial-002.png", label: "Axial 2" },
]} />`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Imaging
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Medical image viewer
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Scroll through a stack of CT or MRI slices, adjust window and level,
          zoom and pan, and read uncompressed DICOM files in the browser.
        </p>
      </header>
      <ComponentPreview name="image-viewer-demo" />
      <section className="flex flex-col gap-4">
        <h2 id="installation" className="text-2xl font-semibold">
          Installation
        </h2>
        <p>
          In a project set up as in{" "}
          <Link href="/docs/installation" className="underline">
            Installation
          </Link>
          , run:
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/image-viewer.json`}
        </pre>
        <p>
          Or by name: <code>bunx {shadcn} add @organui/image-viewer</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The viewer installs into your configured UI directory, with the DICOM
          reader and sample phantom in <code>lib/dicom.ts</code> and{" "}
          <code>lib/head-phantom.ts</code>. shadcn&apos;s alert, button,
          progress, select, slider, toggle and tooltip come with it if you do
          not have them yet. It draws on a 2D canvas and adds no imaging
          packages.
        </p>
        <a className="underline" href="/r/image-viewer.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="usage" className="text-2xl font-semibold">
          Usage
        </h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Usage example"
          className={codeBlock}
        >
          {usage}
        </pre>
        <p>
          Each slice is either raw values with their size, such as Hounsfield
          units in an <code>Int16Array</code> or <code>Float32Array</code> in
          row-major order, or an image URL. Image pixels become their luminance
          from 0 to 255; serve them from your own origin or with CORS so the
          viewer can read them. Pass <code>pixelSpacing</code> as [row, column]
          to keep non-square pixels in proportion, and <code>unit</code> to
          label values under the pointer.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Image URL example"
          className={codeBlock}
        >
          {images}
        </pre>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="window-and-level" className="text-2xl font-semibold">
          Window and level
        </h2>
        <p>
          The window maps values from <code>center - width / 2</code> to{" "}
          <code>center + width / 2</code> onto black through white, using the
          DICOM linear function. Drag across the image to change it: right
          widens the window and down raises the level. Pass <code>presets</code>
          , such as the included brain, soft tissue, lung and bone{" "}
          <code>ctWindowPresets</code>, to offer named windows. Without a window
          or presets the viewer starts from the first slice&apos;s range.
        </p>
        <p>
          Slice and window can each be controlled with <code>slice</code> and{" "}
          <code>window</code> plus their change callbacks, or left to the
          component with <code>defaultSlice</code> and{" "}
          <code>defaultWindow</code>. A ref exposes <code>setSlice</code>,{" "}
          <code>zoom</code> and <code>reset</code>.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="dicom-files" className="text-2xl font-semibold">
          DICOM files
        </h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="DICOM example"
          className={codeBlock}
        >
          {dicom}
        </pre>
        <p>
          <code>parseDicom</code> reads single-frame grayscale Part 10 files in
          implicit or explicit little endian, applies rescale slope and
          intercept, and returns the stored window, pixel spacing and patient
          position. <code>dicomSeries</code> orders a series from head to foot.
          Compressed transfer syntaxes, color and multi-frame images throw a
          readable error; use a full DICOM toolkit for those.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="keyboard-and-pointer" className="text-2xl font-semibold">
          Keyboard and pointer
        </h2>
        <p>
          Tab focuses the image. Up and Down move one slice, Page Up and Page
          Down move ten, and Home and End jump to the first and last. Plus and
          minus zoom and zero resets the view. Scrolling moves through slices;
          ctrl or a trackpad pinch zooms at the pointer, as does a two-finger
          pinch on touch screens. Drag adjusts the window, or pans with the pan
          tool, shift or the middle button. The slice slider below the image
          works with the keyboard too.
        </p>
        <p className="text-sm text-muted-foreground">
          For education and interface prototyping. It is not a medical device
          and is not validated for diagnosis. Keyboard and browser checks do not
          replace a screen-reader usability audit.
        </p>
      </section>
      <DocsPager href="/docs/components/image-viewer" />
    </div>
  )
}

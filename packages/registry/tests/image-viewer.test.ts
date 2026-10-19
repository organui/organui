import { expect, test } from "bun:test"
import registry from "../registry.json"
import {
  dicomSeries,
  parseDicom,
} from "../registry/base-nova/image-viewer/dicom"
import { createHeadPhantom } from "../registry/base-nova/image-viewer/head-phantom"
import {
  ctWindowPresets,
  windowLevel,
} from "../registry/base-nova/image-viewer/image-viewer"
import { dicomFile } from "./fixture-dicom"

test("the item ships the viewer with its DICOM reader and phantom", () => {
  const item = registry.items.find(({ name }) => name === "image-viewer")
  expect(item?.files.map(({ path }) => path)).toEqual([
    "registry/base-nova/image-viewer/image-viewer.tsx",
    "registry/base-nova/image-viewer/dicom.ts",
    "registry/base-nova/image-viewer/head-phantom.ts",
  ])
})

test("window level follows the DICOM linear function", () => {
  const brain = ctWindowPresets.find(({ name }) => name === "Brain")!
  expect(windowLevel(-1000, brain)).toBe(0)
  expect(windowLevel(0, brain)).toBe(0)
  expect(windowLevel(1000, brain)).toBe(255)
  expect(windowLevel(40, brain)).toBeCloseTo(129.6, 0)
  expect(windowLevel(20, { center: 40, width: 80 })).toBeLessThan(
    windowLevel(60, { center: 40, width: 80 })
  )
  // Widths below one behave as a threshold instead of dividing by zero.
  expect(windowLevel(9, { center: 10, width: 0 })).toBe(0)
  expect(windowLevel(10, { center: 10, width: 0 })).toBe(255)
})

for (const explicit of [true, false])
  test(`reads ${explicit ? "explicit" : "implicit"} little endian files`, () => {
    // 12-bit stored values with garbage in the high bits, which must be masked.
    const pixels = new Int16Array([0, 1024, 1064, 4095 | 0x7000, 0, 0])
    const image = parseDicom(
      dicomFile({ explicit, pixels, width: 3, height: 2, z: 10 })
    )
    expect(image.width).toBe(3)
    expect(image.height).toBe(2)
    expect([...image.data]).toEqual([-1024, 0, 40, 3071, -1024, -1024])
    expect(image.pixelSpacing).toEqual([0.5, 0.75])
    expect(image.window).toEqual({ center: 40, width: 80 })
    expect(image.position).toEqual([-120, -120, 10])
    expect(image.modality).toBe("CT")
    expect(image.label).toBe("Head phantom")
  })

test("MONOCHROME1 values are inverted", () => {
  const image = parseDicom(
    dicomFile({
      explicit: true,
      pixels: new Int16Array([1024, 1064]),
      width: 2,
      height: 1,
      z: 0,
      photometric: "MONOCHROME1",
    })
  )
  expect([...image.data]).toEqual([-0, -40])
  expect(image.window).toEqual({ center: -40, width: 80 })
})

test("rejects files it cannot read", () => {
  expect(() => parseDicom(new ArrayBuffer(200))).toThrow("not a DICOM")
  const bytes = new Uint8Array(
    dicomFile({
      explicit: true,
      pixels: new Int16Array(1),
      width: 1,
      height: 1,
      z: 0,
    })
  )
  // Swap the transfer syntax for RLE lossless, which has the same length.
  const syntax = new TextEncoder().encode("1.2.840.10008.1.2.5")
  bytes.set(syntax, 140)
  expect(() => parseDicom(bytes.buffer)).toThrow("not supported")
})

test("series sort from head to foot", () => {
  const images = [5, 20, 10].map((z) =>
    parseDicom(
      dicomFile({
        explicit: true,
        pixels: new Int16Array([z]),
        width: 1,
        height: 1,
        z,
      })
    )
  )
  const series = dicomSeries(images)
  expect(series.slices.map(({ position }) => position?.[2])).toEqual([
    20, 10, 5,
  ])
  expect(series.pixelSpacing).toEqual([0.5, 0.75])
  expect(series.window).toEqual({ center: 40, width: 80 })
  expect(series.unit).toBe("HU")
})

test("the head phantom has air, bone, brain and fluid where expected", () => {
  const { slices, pixelSpacing, unit } = createHeadPhantom({ noise: 0 })
  expect(slices).toHaveLength(32)
  expect(pixelSpacing).toEqual([1.875, 1.875])
  expect(unit).toBe("HU")
  const middle = slices[16]!
  const at = (column: number, row: number) =>
    middle.data[row * middle.width + column]!
  expect(at(0, 0)).toBe(-1000)
  // Brain behind the centre, and skull at the front of the head.
  expect(at(64, 90)).toBe(40)
  const front = Array.from({ length: 64 }, (_, row) => at(64, row))
  expect(Math.max(...front)).toBe(800)
  // A ventricle.
  expect(at(64 + 17, 64)).toBe(8)
  expect(createHeadPhantom().slices[16]!.data).toEqual(
    createHeadPhantom().slices[16]!.data
  )
})

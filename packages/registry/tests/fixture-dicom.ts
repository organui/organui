// Writes minimal DICOM files for tests, without a DICOM toolkit.

type Field = [group: number, element: number, vr: string, value: Uint8Array]

const ascii = (text: string) => {
  const padded = text.length % 2 ? `${text} ` : text
  return new TextEncoder().encode(padded)
}
const us = (value: number) => new Uint8Array(new Uint16Array([value]).buffer)
const LONG = new Set(["OB", "OW", "SQ", "UN", "UT"])

function element(
  [group, element, vr, value]: Field,
  explicit: boolean,
  undefinedLength = false
) {
  const header = new DataView(
    new ArrayBuffer(explicit && LONG.has(vr) ? 12 : 8)
  )
  header.setUint16(0, group, true)
  header.setUint16(2, element, true)
  const length = undefinedLength ? 0xffffffff : value.length
  if (!explicit) header.setUint32(4, length, true)
  else if (LONG.has(vr)) {
    header.setUint8(4, vr.charCodeAt(0))
    header.setUint8(5, vr.charCodeAt(1))
    header.setUint32(8, length, true)
  } else {
    header.setUint8(4, vr.charCodeAt(0))
    header.setUint8(5, vr.charCodeAt(1))
    header.setUint16(6, length, true)
  }
  return [new Uint8Array(header.buffer), value]
}

// A minimal Part 10 file: preamble, meta group and a dataset that includes an
// undefined-length sequence before the image, as scanners often write.
export function dicomFile({
  explicit,
  pixels,
  width,
  height,
  z,
  photometric = "MONOCHROME2",
}: {
  explicit: boolean
  pixels: Int16Array
  width: number
  height: number
  z: number
  photometric?: string
}) {
  const syntax = explicit ? "1.2.840.10008.1.2.1" : "1.2.840.10008.1.2"
  const parts: Uint8Array[] = [new Uint8Array(128), ascii("DICM")]
  parts.push(...element([0x0002, 0x0010, "UI", ascii(syntax)], true))
  parts.push(...element([0x0008, 0x0060, "CS", ascii("CT")], explicit))
  // Sequence of one undefined-length item holding a nested element.
  parts.push(
    ...element([0x0008, 0x1140, "SQ", new Uint8Array()], explicit, true)
  )
  const item = new DataView(new ArrayBuffer(8))
  item.setUint16(0, 0xfffe, true)
  item.setUint16(2, 0xe000, true)
  item.setUint32(4, 0xffffffff, true)
  parts.push(new Uint8Array(item.buffer))
  parts.push(...element([0x0008, 0x1150, "UI", ascii("1.2.3")], explicit))
  for (const [tag, last] of [
    [0xe00d, 0],
    [0xe0dd, 0],
  ]) {
    const delimiter = new DataView(new ArrayBuffer(8))
    delimiter.setUint16(0, 0xfffe, true)
    delimiter.setUint16(2, tag!, true)
    delimiter.setUint32(4, last!, true)
    parts.push(new Uint8Array(delimiter.buffer))
  }
  const fields: Field[] = [
    [0x0008, 0x103e, "LO", ascii("Head phantom")],
    [0x0020, 0x0032, "DS", ascii(`-120\\-120\\${z}`)],
    [0x0028, 0x0002, "US", us(1)],
    [0x0028, 0x0004, "CS", ascii(photometric)],
    [0x0028, 0x0010, "US", us(height)],
    [0x0028, 0x0011, "US", us(width)],
    [0x0028, 0x0030, "DS", ascii("0.5\\0.75")],
    [0x0028, 0x0100, "US", us(16)],
    [0x0028, 0x0101, "US", us(12)],
    [0x0028, 0x0103, "US", us(0)],
    [0x0028, 0x1050, "DS", ascii("40\\400")],
    [0x0028, 0x1051, "DS", ascii("80\\1500")],
    [0x0028, 0x1052, "DS", ascii("-1024")],
    [0x0028, 0x1053, "DS", ascii("1")],
    [0x7fe0, 0x0010, "OW", new Uint8Array(pixels.buffer)],
  ]
  for (const field of fields) parts.push(...element(field, explicit))
  const bytes = new Uint8Array(
    parts.reduce((sum, part) => sum + part.length, 0)
  )
  let offset = 0
  for (const part of parts) {
    bytes.set(part, offset)
    offset += part.length
  }
  return bytes.buffer
}

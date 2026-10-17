// A tiny stand-in for an organ GLB so tests never download real models: one
// box per structure ID, the first at the centre and the rest in a ring around
// it, so a click in the middle of a fitted view always picks the first ID.
export function fixtureGlb(ids: readonly string[]): Uint8Array {
  const faces: [number[], number[], number[]][] = [
    [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    [
      [-1, 0, 0],
      [0, 0, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [0, 0, 1],
      [1, 0, 0],
    ],
    [
      [0, -1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ],
    [
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, -1],
      [0, 1, 0],
      [1, 0, 0],
    ],
  ]
  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []
  for (const [normal, u, v] of faces) {
    const base = positions.length / 3
    for (const [a, b] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ] as const)
      for (let axis = 0; axis < 3; axis++) {
        positions.push((normal[axis]! + a * u[axis]! + b * v[axis]!) * 0.5)
        if (axis === 2) normals.push(...normal)
      }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3)
  }
  const position = new Float32Array(positions)
  const normal = new Float32Array(normals)
  const index = new Uint16Array(indices)
  const binary = new Uint8Array(
    position.byteLength + normal.byteLength + index.byteLength
  )
  binary.set(new Uint8Array(position.buffer), 0)
  binary.set(new Uint8Array(normal.buffer), position.byteLength)
  binary.set(
    new Uint8Array(index.buffer),
    position.byteLength + normal.byteLength
  )
  const json = {
    asset: { version: "2.0" },
    scene: 0,
    scenes: [{ nodes: ids.map((_, i) => i) }],
    nodes: ids.map((id, i) => {
      const angle = (i / Math.max(1, ids.length - 1)) * Math.PI * 2
      return {
        name: id,
        mesh: 0,
        translation:
          i === 0 ? [0, 0, 0] : [Math.cos(angle) * 2, Math.sin(angle) * 2, 0],
        scale: i === 0 ? [1.5, 1.5, 1.5] : [0.6, 0.6, 0.6],
      }
    }),
    meshes: [
      {
        primitives: [
          { attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 },
        ],
      },
    ],
    materials: [{ pbrMetallicRoughness: { metallicFactor: 0 } }],
    buffers: [{ byteLength: binary.byteLength }],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: position.byteLength },
      {
        buffer: 0,
        byteOffset: position.byteLength,
        byteLength: normal.byteLength,
      },
      {
        buffer: 0,
        byteOffset: position.byteLength + normal.byteLength,
        byteLength: index.byteLength,
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: 24,
        type: "VEC3",
        min: [-0.5, -0.5, -0.5],
        max: [0.5, 0.5, 0.5],
      },
      { bufferView: 1, componentType: 5126, count: 24, type: "VEC3" },
      { bufferView: 2, componentType: 5123, count: 36, type: "SCALAR" },
    ],
  }
  const pad = (bytes: Uint8Array, fill: number) => {
    const padded = new Uint8Array(Math.ceil(bytes.length / 4) * 4).fill(fill)
    padded.set(bytes)
    return padded
  }
  const text = pad(new TextEncoder().encode(JSON.stringify(json)), 0x20)
  const bin = pad(binary, 0)
  const glb = new Uint8Array(12 + 8 + text.length + 8 + bin.length)
  const view = new DataView(glb.buffer)
  view.setUint32(0, 0x46546c67, true)
  view.setUint32(4, 2, true)
  view.setUint32(8, glb.length, true)
  view.setUint32(12, text.length, true)
  view.setUint32(16, 0x4e4f534a, true)
  glb.set(text, 20)
  view.setUint32(20 + text.length, bin.length, true)
  view.setUint32(24 + text.length, 0x004e4942, true)
  glb.set(bin, 28 + text.length)
  return glb
}

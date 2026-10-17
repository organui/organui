import { expect, test } from "bun:test"
import {
  bodyMapRegions,
  nextRegion,
  regionCenter,
  toggleRegion,
  type BodyMapRegion,
} from "../registry/base-nova/body-map/body-map.js"

const front = bodyMapRegions.filter(({ view }) => view === "front")
const back = bodyMapRegions.filter(({ view }) => view === "back")
const region = (id: string) => bodyMapRegions.find((item) => item.id === id)!

test("region IDs and labels are unique", () => {
  const ids = bodyMapRegions.map(({ id }) => id)
  expect(new Set(ids).size).toBe(ids.length)
  const labels = bodyMapRegions.map(({ label }) => label)
  expect(new Set(labels).size).toBe(labels.length)
  for (const { id, label } of bodyMapRegions) {
    expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/)
    expect(label).toMatch(/^[A-Z]/)
  }
  expect(front.length).toBeGreaterThan(20)
  expect(back.length).toBeGreaterThan(20)
})

test("paths use absolute coordinate pairs inside the body space", () => {
  for (const { d } of bodyMapRegions) {
    expect(d).toMatch(/^M[\d .MLCZ]+$/)
    for (const command of d.match(/[MLC][^MLCZ]*/g)!) {
      const numbers = command.slice(1).trim().split(/\s+/).map(Number)
      expect(numbers.length % 2).toBe(0)
    }
    const [x, y] = regionCenter({ id: "", label: "", view: "front", d })
    expect(x).toBeGreaterThan(0)
    expect(x).toBeLessThan(200)
    expect(y).toBeGreaterThan(0)
    expect(y).toBeLessThan(440)
  }
})

test("the person's right is on the viewer's left from the front only", () => {
  expect(regionCenter(region("right-shoulder"))[0]).toBeLessThan(100)
  expect(regionCenter(region("left-shoulder"))[0]).toBeGreaterThan(100)
  expect(regionCenter(region("right-shoulder-back"))[0]).toBeGreaterThan(100)
  expect(regionCenter(region("left-shoulder-back"))[0]).toBeLessThan(100)
  expect(region("right-calf").label).toBe("Right calf")
  expect(region("left-thigh").label).toBe("Front of left thigh")
})

test("arrow keys move to the nearest region in that direction", () => {
  const move = (from: string, key: string, items = front) =>
    nextRegion(items, region(from), key)?.id
  expect(move("head", "ArrowDown")).toBe("neck")
  expect(move("right-chest", "ArrowDown")).toBe("right-upper-abdomen")
  expect(move("right-chest", "ArrowRight")).toBe("left-chest")
  expect(move("right-chest", "ArrowLeft")).toBe("right-shoulder")
  expect(move("right-knee", "ArrowDown")).toBe("right-shin")
  expect(move("right-shin", "ArrowDown")).toBe("right-foot")
  expect(move("right-forearm", "ArrowDown")).toBe("right-palm")
  expect(move("neck", "ArrowUp")).toBe("head")
  expect(move("head", "ArrowUp")).toBeUndefined()
  expect(move("head", "Tab")).toBeUndefined()
  expect(move("left-buttock", "ArrowDown", back)).toBe("left-thigh-back")
  expect(move("left-upper-back", "ArrowRight", back)).toBe("right-upper-back")
})

test("every region is reachable with arrow keys", () => {
  for (const items of [front, back]) {
    const seen = new Set<BodyMapRegion>([items[0]!])
    const queue = [items[0]!]
    while (queue.length) {
      const from = queue.shift()!
      for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
        const to = nextRegion(items, from, key)
        if (to && !seen.has(to)) {
          seen.add(to)
          queue.push(to)
        }
      }
    }
    expect(seen.size).toBe(items.length)
  }
})

test("toggling keeps selection order and drops unknown IDs", () => {
  expect(toggleRegion([], "neck")).toEqual(["neck"])
  expect(toggleRegion(["neck", "groin"], "head")).toEqual([
    "neck",
    "groin",
    "head",
  ])
  expect(toggleRegion(["neck", "groin"], "neck")).toEqual(["groin"])
  expect(toggleRegion(["gone", "neck"], "groin")).toEqual(["neck", "groin"])
  const custom = [{ id: "x", label: "X", view: "front", d: "M0 0Z" }] as const
  expect(toggleRegion(["neck"], "x", custom)).toEqual(["x"])
})

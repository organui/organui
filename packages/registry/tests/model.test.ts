import { expect, test } from "bun:test"
import {
  anatomyIndex,
  anatomyRows,
  focusTarget,
  leafIds,
  nextVisibility,
  visibilityState,
  type AnatomyNode,
} from "../src/anatomy-tree.js"
const node = {
  id: "root",
  label: "Root",
  children: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
}
const heart: AnatomyNode[] = [
  {
    id: "heart",
    label: "Heart",
    children: [
      {
        id: "left",
        label: "Left heart",
        children: [
          { id: "la", label: "Left atrium" },
          { id: "lv", label: "Left ventricle" },
        ],
      },
      {
        id: "right",
        label: "Right heart",
        children: [
          { id: "ra", label: "Right atrium" },
          { id: "rv", label: "Right ventricle" },
        ],
      },
    ],
  },
]
const ids = (rows: { node: AnatomyNode }[]) => rows.map(({ node }) => node.id)
test("IDs must be unique even across branches", () => {
  expect(() => anatomyIndex([node, { id: "a", label: "Other" }])).toThrow(
    "unique"
  )
  expect(() => anatomyIndex([node, { id: "a", label: "Other" }])).toThrow('"a"')
  expect(() => anatomyIndex([{ id: "", label: "Empty" }])).toThrow("nonempty")
})
test("branch visibility derives from leaves, including missing defaults", () => {
  expect(leafIds(node)).toEqual(["a", "b"])
  expect(visibilityState(node, { root: false })).toBe(true)
  expect(visibilityState(node, { a: false })).toBe("mixed")
  expect(visibilityState(node, { a: false, b: false })).toBe(false)
  expect(anatomyIndex([node]).parents.get("b")).toBe("root")
  expect(anatomyIndex(heart).leaves.get("heart")).toEqual([
    "la",
    "lv",
    "ra",
    "rv",
  ])
})
test("rows follow expansion and report sibling positions", () => {
  const index = anatomyIndex(heart)
  expect(ids(anatomyRows(heart, index, new Set(), ""))).toEqual(["heart"])
  const rows = anatomyRows(heart, index, new Set(["heart", "right"]), "")
  expect(ids(rows)).toEqual(["heart", "left", "right", "ra", "rv"])
  expect(rows[3]).toMatchObject({ level: 3, size: 2, position: 1 })
})
test("search keeps matches and ancestors, ignoring case and expansion", () => {
  const index = anatomyIndex(heart)
  expect(ids(anatomyRows(heart, index, new Set(), " VENTRICLE "))).toEqual([
    "heart",
    "left",
    "lv",
    "right",
    "rv",
  ])
  // A matching branch does not bring its nonmatching children along.
  expect(ids(anatomyRows(heart, index, new Set(), "left heart"))).toEqual([
    "heart",
    "left",
  ])
  expect(anatomyRows(heart, index, new Set(), "absent")).toEqual([])
})
test("visibility toggles every leaf and drops unknown IDs", () => {
  const index = anatomyIndex(heart)
  const left = index.nodes.get("left")!
  expect(nextVisibility(left, index, { gone: false })).toEqual({
    la: false,
    lv: false,
  })
  // Mixed branches become fully visible.
  expect(nextVisibility(left, index, { la: false, rv: false })).toEqual({
    la: true,
    lv: true,
    rv: false,
  })
  // Branch entries are kept but never override their leaves.
  expect(nextVisibility(left, index, { left: false })).toEqual({
    left: false,
    la: false,
    lv: false,
  })
})
test("special IDs are stored as ordinary keys", () => {
  const data = [{ id: "__proto__", label: "Special" }]
  const next = nextVisibility(data[0]!, anatomyIndex(data), {})
  expect(Object.hasOwn(next, "__proto__")).toBe(true)
  expect(visibilityState(data[0]!, next)).toBe(false)
})
test("focus falls back to the nearest visible ancestor, then the first row", () => {
  const index = anatomyIndex(heart)
  const collapsed = anatomyRows(heart, index, new Set(["heart"]), "")
  expect(focusTarget(collapsed, ["lv", "left", "heart"], index.parents)).toBe(
    "left"
  )
  expect(focusTarget(collapsed, ["missing"], index.parents)).toBe("heart")
  expect(focusTarget([], ["lv"], index.parents)).toBeUndefined()
})

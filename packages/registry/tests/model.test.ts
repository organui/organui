import { expect, test } from "bun:test"
import { anatomyIndex, leafIds, visibilityState } from "../src/anatomy-tree.js"
const node = {
  id: "root",
  label: "Root",
  children: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
}
test("IDs must be unique even across branches", () => {
  expect(() => anatomyIndex([node, { id: "a", label: "Other" }])).toThrow(
    "unique"
  )
  expect(() => anatomyIndex([{ id: "", label: "Empty" }])).toThrow("nonempty")
})
test("branch visibility derives from leaves, including missing defaults", () => {
  expect(leafIds(node)).toEqual(["a", "b"])
  expect(visibilityState(node, { root: false })).toBe(true)
  expect(visibilityState(node, { a: false })).toBe("mixed")
  expect(visibilityState(node, { a: false, b: false })).toBe(false)
  expect(anatomyIndex([node]).parents.get("b")).toBe("root")
})

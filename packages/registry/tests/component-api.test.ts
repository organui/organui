import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { componentApi } from "../scripts/component-api"

// The docs show these as each component's API Reference.
test("component-api.json matches the components' props", async () => {
  expect(
    JSON.parse(
      await readFile(new URL("../component-api.json", import.meta.url), "utf8")
    )
  ).toEqual(componentApi())
})

test("every documented prop has a description", () => {
  for (const [item, api] of Object.entries(componentApi()))
    for (const prop of api.props)
      expect(prop.description, `${item}: ${prop.name}`).not.toBe("")
})

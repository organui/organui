import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import registry from "../registry.json"
import {
  DermatomeMap,
  dermatomeColor,
  dermatomes,
  type DermatomeId,
  type DermatomeView,
} from "../registry/base-nova/dermatome-map/dermatome-map"

const source = new URL(
  "../registry/base-nova/dermatome-map/dermatome-map.tsx",
  import.meta.url
)

function render(
  selectedId: DermatomeId | null,
  views?: DermatomeView[],
  colors?: Partial<Record<DermatomeId, string>>
) {
  return renderToStaticMarkup(
    createElement(DermatomeMap, {
      selectedId,
      onSelectionChange: () => {},
      views,
      colors,
    })
  )
}

test("lists the 28 ISNCSCI sensory levels in order", () => {
  expect(dermatomes.map(({ id }) => id)).toEqual([
    ...["C2", "C3", "C4", "C5", "C6", "C7", "C8"],
    ...Array.from({ length: 12 }, (_, index) => `T${index + 1}`),
    ...["L1", "L2", "L3", "L4", "L5", "S1", "S2", "S3", "S4-5"],
  ] as DermatomeId[])
  for (const { area, keyPoint } of dermatomes) {
    expect(area.length).toBeGreaterThan(0)
    expect(keyPoint.length).toBeGreaterThan(0)
  }
})

test("the item ships its one file and declares the shadcn components it imports", async () => {
  const item = registry.items.find(({ name }) => name === "dermatome-map")!
  expect(item.files.map(({ path }) => path)).toEqual([
    "registry/base-nova/dermatome-map/dermatome-map.tsx",
  ])
  const imports = [
    ...(await Bun.file(source).text()).matchAll(/from "([^"]+)"/g),
  ].map(([, path]) => path!)
  expect(imports.filter((path) => path.startsWith("@/components/ui/"))).toEqual(
    item.registryDependencies.map((name) => `@/components/ui/${name}`)
  )
  for (const path of imports.filter((path) => !path.startsWith("@/")))
    expect(["react", "cn"]).toContain(path)
})

test("every level is drawn on both halves and stays inside the figure", () => {
  const markup = render(null)
  const drawn = [...markup.matchAll(/data-dermatome="([^"]+)"/g)].map(
    ([, id]) => id
  )
  for (const { id } of dermatomes) expect(drawn).toContain(id)
  // Each shape is drawn twice per view it appears in: once and mirrored.
  for (const id of new Set(drawn))
    expect(drawn.filter((other) => other === id).length % 2).toBe(0)
  for (const [, d] of markup.matchAll(/ d="([^"]+)"/g)) {
    expect(d).toMatch(/^(M[\d. ]+Z)+$/)
    const numbers = d!.match(/[\d.]+/g)!.map(Number)
    for (let index = 0; index < numbers.length; index += 2) {
      expect(numbers[index]!).toBeLessThanOrEqual(220)
      expect(numbers[index + 1]!).toBeLessThanOrEqual(480)
    }
  }
})

test("selecting a level outlines it and shows its key sensory point", () => {
  expect(render(null)).not.toContain("<circle")
  for (const { id, keyPoint } of dermatomes) {
    const markup = render(id)
    // One point per side of the body, in the view where it is tested.
    expect(markup.match(/<circle/g)).toHaveLength(2)
    expect(markup).toContain(keyPoint)
    expect(markup).toContain('aria-selected="true"')
  }
})

test("views and colors are configurable", () => {
  const front = render(null, ["front"])
  expect(front).toContain("Front view of the dermatomes")
  expect(front).not.toContain("Back view of the dermatomes")
  expect(render(null, undefined, { C6: "rgb(1, 2, 3)" })).toContain(
    'data-dermatome="C6" fill="rgb(1, 2, 3)"'
  )
  expect(dermatomeColor("C5")).not.toBe(dermatomeColor("C6"))
})

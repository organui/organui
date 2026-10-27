import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  groupProblems,
  ProblemList,
  type Problem,
} from "../registry/base-nova/problem-list/problem-list"

const problems: Problem[] = [
  { id: "knee", name: "Osteoarthritis of knee", onset: "2018" },
  {
    id: "diabetes",
    name: "Type 2 diabetes mellitus",
    code: { system: "SNOMED CT", value: "44054006" },
    significance: "major",
    onset: "2012-03-06",
  },
  {
    id: "pneumonia",
    name: "Community acquired pneumonia",
    status: "resolved",
    onset: "2024-01-08",
    resolved: "2024-02-01",
  },
  { id: "rash", name: "Rash", status: "inactive", resolved: "2020-05-01" },
]

test("active problems lead, major ones first in each group", () => {
  const { active, past } = groupProblems(problems)
  expect(active.map(({ id }) => id)).toEqual(["diabetes", "knee"])
  expect(past.map(({ id }) => id)).toEqual(["pneumonia", "rash"])
})

const render = (props: Parameters<typeof ProblemList>[0]) =>
  renderToStaticMarkup(createElement(ProblemList, props))

test("groups are labelled row groups with their counts", () => {
  const html = render({ problems })
  expect(html).toContain('scope="rowgroup"')
  expect(html).toMatch(/Active.*· 2/)
  expect(html).toMatch(/Past.*· 2/)
  expect(html).toContain("SNOMED CT 44054006")
  expect(html).toContain('data-significance="major"')
})

test("full dates are formatted and other text reads as written", () => {
  const html = render({ problems })
  expect(html).toContain("Since Mar 6, 2012")
  expect(html).toContain("Since 2018")
  expect(html).toContain("Jan 8, 2024 – Feb 1, 2024")
  expect(html).toContain("Until May 1, 2020")
})

test("codes can be hidden and an empty list says so", () => {
  expect(render({ problems, showCodes: false })).not.toContain("44054006")
  expect(render({ problems: [] })).toContain("No problems recorded.")
})

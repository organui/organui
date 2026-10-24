import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  AllergyList,
  allergySummary,
  type Allergy,
} from "../registry/base-nova/allergy-list/allergy-list"

const allergies: Allergy[] = [
  {
    id: "penicillin",
    substance: "Penicillin",
    reactions: ["Anaphylaxis", "Wheeze"],
    severity: "severe",
    verification: "confirmed",
    recordedDate: "2003-05-14",
  },
  {
    id: "codeine",
    substance: "Codeine",
    type: "intolerance",
    reactions: ["Vomiting"],
    severity: "mild",
    verification: "unconfirmed",
  },
  { id: "egg", substance: "Egg", status: "resolved" },
]

test("the summary keeps active allergies with their first reaction", () => {
  expect(allergySummary(allergies)).toEqual([
    "Penicillin (Anaphylaxis)",
    "Codeine (Vomiting)",
  ])
  expect(allergySummary("none-known")).toBe("none-known")
  expect(allergySummary(undefined)).toBeUndefined()
  expect(allergySummary([])).toBeUndefined()
  // Every recorded allergy resolved: none are known now.
  expect(allergySummary([allergies[2]!])).toBe("none-known")
})

const render = (props: Parameters<typeof AllergyList>[0]) =>
  renderToStaticMarkup(createElement(AllergyList, props))

test("rows show reaction, severity, type, verification and status", () => {
  const html = render({ allergies })
  expect(html).toContain("Anaphylaxis, Wheeze")
  expect(html).toContain('data-severity="severe"')
  expect(html).toContain("Severe")
  expect(html).toContain("Intolerance · Unconfirmed")
  expect(html).toContain('data-status="resolved"')
  expect(html).toContain("Resolved")
  expect(html).toContain("May 14, 2003")
  // Missing details are announced, not left blank.
  expect(html).toContain("Not recorded")
})

test("not recorded and none known read differently", () => {
  expect(render({})).toContain("Allergies not recorded")
  expect(render({ allergies: [] })).toContain("Allergies not recorded")
  const none = render({ allergies: "none-known" })
  expect(none).toContain("No known allergies")
  expect(none).toContain('data-state="none-known"')
})

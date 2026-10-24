import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed lab results table, rendered by the consumer script's harness.
test("installed lab results flag values and describe the trend", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/lab")
  const table = page.getByRole("table", { name: "Electrolytes" })
  const potassium = table
    .getByRole("row")
    .filter({ has: page.getByRole("rowheader", { name: /^Potassium/ }) })
  await expect(potassium).toContainText("6.4 mmol/L")
  await expect(potassium).toContainText("Critical high")
  await expect(
    potassium.getByRole("img", {
      name: "Potassium trend, 2 results from Jan 12, 2026 to Oct 1, 2026: 4.2 to 6.4 mmol/L, rising",
    })
  ).toBeVisible()
  await expect(
    table
      .getByRole("row")
      .filter({ has: page.getByRole("rowheader", { name: /^Sodium/ }) })
  ).toContainText("Normal")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  expect(errors).toEqual([])
})

test("the installed patient banner names the patient and their allergies", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/lab")
  const banner = page.getByRole("region", {
    name: "Patient: BRENNAN, Tom (Mr)",
  })
  await expect(
    banner.getByRole("heading", { name: "BRENNAN, Tom (Mr)" })
  ).toBeVisible()
  await expect(banner).toContainText("03-Jun-1979 (47 years)")
  await expect(banner).toContainText("999 654 3218")
  await expect(banner).toContainText("Allergies: Codeine")
  await expect(banner).toContainText("Falls risk")
  expect(errors).toEqual([])
})

test("the installed allergy and problem lists show their rows", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/lab")
  await expect(page.getByRole("table", { name: "Allergies" })).toContainText(
    "Intolerance"
  )
  const problems = page.getByRole("table", { name: "Problems" })
  await expect(problems).toContainText("SNOMED CT 44054006")
  await expect(problems).toContainText("Since Mar 6, 2012")
  expect(errors).toEqual([])
})

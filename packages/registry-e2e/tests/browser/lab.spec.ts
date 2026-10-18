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

import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed growth chart on the consumer harness's made-up tables.
test("installed growth chart plots measurements on percentile curves", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/growth")
  const chart = page.getByRole("group", { name: "Weight-for-age, girls" })
  await expect(chart).toBeVisible()
  const points = chart.getByRole("img", { name: /^\d+ months?: .* kg/ })
  await expect(points).toHaveCount(3)
  await points.nth(1).focus()
  await expect(points.nth(1)).toBeFocused()
  await expect(points.nth(1)).toHaveAccessibleName(/^6 months: 5\.6 kg, /)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  expect(errors).toEqual([])
})

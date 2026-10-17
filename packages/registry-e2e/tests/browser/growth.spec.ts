import { expect, test } from "@playwright/test"

test("installed growth chart plots measurements with percentiles", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/growth")
  const chart = page.getByRole("group", { name: "Weight-for-age, girls" })
  await expect(chart).toBeVisible()
  const points = chart.getByRole("img")
  await expect(points).toHaveCount(3)
  await expect(points.first()).toHaveAccessibleName(
    /^2 months: 5 kg, \d+(st|nd|rd|th) percentile$/
  )
  await points.nth(1).focus()
  await expect(
    page.getByText(/^12 months · \d+(st|nd|rd|th) percentile/)
  ).toBeVisible()
  await page.getByRole("button", { name: "Show length" }).click()
  await expect(
    page.getByRole("group", { name: "Length/height-for-age, girls" })
  ).toBeVisible()
  await expect(
    page
      .getByRole("group", { name: "Length/height-for-age, girls" })
      .getByRole("img")
      .first()
  ).toHaveAccessibleName(/^2 months: 57 cm, /)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  expect(errors).toEqual([])
})

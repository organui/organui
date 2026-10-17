import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/dermatome")
  await expect(page.getByRole("option")).toHaveCount(28)
})

test("keyboard moves through levels without selecting until Enter", async ({
  page,
}) => {
  const selected = page.getByLabel("Selected", { exact: true })
  await page.getByRole("option", { name: "C2", exact: true }).focus()
  for (let step = 0; step < 4; step++) await page.keyboard.press("ArrowRight")
  const c6 = page.getByRole("option", { name: "C6", exact: true })
  await expect(c6).toBeFocused()
  await expect(selected).toHaveText("none")
  await page.keyboard.press("Enter")
  await expect(selected).toHaveText("C6")
  await expect(c6).toHaveAttribute("aria-selected", "true")
  await expect(page.getByText("Outer forearm and thumb")).toBeVisible()
  // The thumb's key point is tested on the back of the hand, on both sides.
  await expect(page.locator("circle")).toHaveCount(2)
  await page.keyboard.press("End")
  await expect(
    page.getByRole("option", { name: "S4-5", exact: true })
  ).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(selected).toHaveText("none")
  await expect(page.locator("circle")).toHaveCount(0)
  // The list is one tab stop.
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("button", { name: "Select T10", exact: true })
  ).toBeFocused()
})

test("clicking the body selects a level and outside state reaches the list", async ({
  page,
}) => {
  await page.locator('[data-dermatome="L2"]').first().click()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("L2")
  await expect(
    page.getByRole("option", { name: "L2", exact: true })
  ).toHaveAttribute("aria-selected", "true")
  await page.getByRole("button", { name: "Select T10", exact: true }).click()
  await expect(
    page.getByRole("option", { name: "T10", exact: true })
  ).toHaveAttribute("aria-selected", "true")
  await expect(page.getByText("Umbilicus, midclavicular line")).toBeVisible()
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("none")
  await expect(page.locator('[data-dermatome="L4"]').first()).toHaveAttribute(
    "fill",
    "rgb(10, 20, 30)"
  )
})

test("passes an accessibility scan without horizontal overflow", async ({
  page,
}, info) => {
  await page.getByRole("option", { name: "S1", exact: true }).click()
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await page.screenshot({
    path: info.outputPath("dermatome.png"),
    fullPage: true,
  })
})

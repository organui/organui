import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed heart component, loading the stand-in GLB written by the consumer
// script: the right atrium is the box in the middle of every fitted view.
test.beforeEach(async ({ page }) => {
  await page.goto("/organ")
  await expect(
    page.getByRole("toolbar", { name: "View controls" })
  ).toBeVisible()
})

test("picks, views and keyboard rotation report through callbacks", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const selected = page.getByLabel("Selected", { exact: true })
  const view = page.getByLabel("View", { exact: true }).last()
  await expect(selected).toHaveText("none")
  await viewer.click()
  await expect(selected).toHaveText("right-atrium")
  const menu = page.getByRole("combobox", { name: "View" })
  await menu.click()
  await page.getByRole("option", { name: "Posterior" }).click()
  await expect(view).toHaveText("Posterior")
  await expect(menu).toContainText("Posterior")
  await page.getByRole("button", { name: "Left lateral" }).click()
  await expect(view).toHaveText("Left lateral")
  await viewer.focus()
  await page.keyboard.press("ArrowRight")
  await expect(view).toHaveText("custom")
  await expect(menu).toContainText("Custom view")
  const zoomIn = page.getByRole("button", { name: "Zoom in" })
  await zoomIn.hover()
  await expect(page.locator('[data-slot="tooltip-content"]')).toHaveText(
    "Zoom in"
  )
  await zoomIn.click()
  await expect(view).toHaveText("custom")
  await page.getByRole("button", { name: "Reset view" }).click()
  await expect(view).toHaveText("Anterior")
  // The view menu also works from the keyboard.
  await menu.focus()
  await page.keyboard.press("Enter")
  await page.getByRole("option", { name: "Left lateral" }).press("Enter")
  await expect(view).toHaveText("Left lateral")
  await expect(menu).toBeFocused()
  expect(errors).toEqual([])
})

test("hidden structures cannot be picked and the credit links its licence", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await page.getByRole("button", { name: "Hide right atrium" }).click()
  await viewer.click()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("none")
  await expect(viewer.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute(
    "href",
    "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
  )
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations).toEqual([])
})

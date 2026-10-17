import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed image viewer showing the installed head phantom.
test("scrolls slices, applies presets and stays accessible", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/image")
  const viewer = page.getByRole("region", { name: "Head phantom" })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  const slice = page.locator(`output[aria-label="Slice"]`)
  const window = page.getByLabel("Window", { exact: true })
  await expect(slice).toHaveText("15")
  await viewer.focus()
  await page.keyboard.press("ArrowDown")
  await expect(slice).toHaveText("16")
  await viewer.hover()
  await page.mouse.wheel(0, 120)
  await expect(slice).toHaveText("19")
  await page.getByRole("slider", { name: "Slice" }).focus()
  await page.keyboard.press("Home")
  await expect(slice).toHaveText("0")
  await page.getByRole("combobox", { name: "Window preset" }).click()
  await page.getByRole("option", { name: "Lung" }).click()
  await expect(window).toHaveText("1500/-600")
  await page.getByRole("button", { name: "Pan tool" }).click()
  await expect(page.getByRole("button", { name: "Pan tool" })).toHaveAttribute(
    "aria-pressed",
    "true"
  )
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  expect(errors).toEqual([])
})

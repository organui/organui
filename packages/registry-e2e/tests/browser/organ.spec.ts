import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed heart component, loading the stand-in GLB written by the consumer
// script: the right atrium is the box in the middle of every fitted view.
test.beforeEach(async ({ page }) => {
  await page.goto("/organ")
  await expect(page.getByRole("group", { name: "View controls" })).toBeVisible()
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
  await viewer.getByRole("button", { name: "Model credit" }).click()
  await expect(
    page
      .getByRole("dialog", { name: "Model credit" })
      .getByRole("link", { name: "CC BY 4.0" })
  ).toHaveAttribute(
    "href",
    "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
  )
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations).toEqual([])
})

test("keyboard selection follows controlled state and excludes hidden structures", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const menu = viewer.getByRole("combobox", { name: "Structure" })
  await menu.focus()
  await page.keyboard.press("Enter")
  await page
    .getByRole("option", { name: "Right atrium", exact: true })
    .press("Enter")
  await expect(menu).toBeFocused()
  await expect(menu).toContainText("Right atrium")
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText(
    "right-atrium"
  )
  await expect(viewer.getByRole("status")).toHaveText("Selected: Right atrium")
  await page.getByRole("button", { name: "Hide right atrium" }).click()
  await expect(menu).toContainText("Select structure")
  await expect(viewer.getByRole("status")).toHaveText("No structure selected.")
  await menu.click()
  await expect(
    page.getByRole("option", { name: "Right atrium", exact: true })
  ).toBeDisabled()
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Select left atrium" }).click()
  await expect(menu).toContainText("Left atrium")
})

test("secondary clicks and cancelled or returning drags do not select anatomy", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const selected = page.getByLabel("Selected", { exact: true })
  await viewer.click({ button: "right" })
  await expect(selected).toHaveText("none")
  const canvas = viewer.locator("canvas")
  const bounds = (await canvas.boundingBox())!
  const x = bounds.x + bounds.width / 2
  const y = bounds.y + bounds.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 30, y, { steps: 5 })
  await page.mouse.move(x, y, { steps: 5 })
  await page.mouse.up()
  await expect(selected).toHaveText("none")
  await page.mouse.down()
  await canvas.dispatchEvent("pointercancel")
  await page.mouse.up()
  await expect(selected).toHaveText("none")
})

test("controls fit a narrow container and do not submit a surrounding form", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await viewer.evaluate((element) => {
    element.style.width = "240px"
    const form = document.createElement("form")
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      form.dataset.submitted = "true"
    })
    element.before(form)
    form.append(element)
  })
  await page.getByRole("button", { name: "Zoom in" }).click()
  await page.getByRole("button", { name: "Zoom out" }).click()
  await page.getByRole("button", { name: "Reset view" }).click()
  await viewer.getByRole("button", { name: "Model credit" }).click()
  await page.keyboard.press("Escape")
  await expect(page.locator("form")).not.toHaveAttribute(
    "data-submitted",
    "true"
  )
  const bounds = (await viewer.boundingBox())!
  for (const control of await viewer.locator("button").all()) {
    const box = (await control.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(bounds.x)
    expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width)
  }
})

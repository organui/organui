import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed body map inside a form, from the consumer script's harness.
test.beforeEach(async ({ page }) => {
  await page.goto("/body-map")
  await expect(
    page.getByRole("group", { name: "Where does it hurt?" })
  ).toBeVisible()
})

test("pointer, keyboard and form submission share one value", async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const value = page.getByLabel("Value", { exact: true })
  // The harness outputs are status regions too.
  const status = page.locator('p[role="status"]')
  const front = page.getByRole("group", { name: "Front of body" })
  const back = page.getByRole("group", { name: "Back of body" })
  const knee = front.getByRole("checkbox", { name: "Right knee" })
  await knee.click()
  await expect(knee).toHaveAttribute("aria-checked", "true")
  await expect(value).toHaveText("right-knee")
  await back.getByRole("checkbox", { name: "Left buttock" }).click()
  await expect(value).toHaveText("right-knee,left-buttock")
  await expect(status).toHaveText("2 regions selected")

  // Each view is one tab stop, starting at its first selected region.
  await page.getByRole("checkbox", { name: "Head and face" }).focus()
  await expect(front.locator('[tabindex="0"]')).toHaveCount(1)
  await page.keyboard.press("ArrowDown")
  const neck = front.getByRole("checkbox", { name: "Neck", exact: true })
  await expect(neck).toBeFocused()
  // The focus outline is drawn over the region's neighbors.
  await expect(front.locator("path.stroke-ring")).toHaveCount(1)
  await page.keyboard.press("Space")
  await expect(value).toHaveText("right-knee,left-buttock,neck")
  await page.keyboard.press("Tab")
  await expect(
    back.getByRole("checkbox", { name: "Left buttock" })
  ).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(
    back.getByRole("checkbox", { name: "Back of left thigh" })
  ).toBeFocused()
  await page.keyboard.press("Enter")
  await page.keyboard.press("End")
  await expect(back.getByRole("checkbox", { name: "Left heel" })).toBeFocused()
  await expect(value).toHaveText("right-knee,left-buttock,neck,left-thigh-back")

  await page.getByRole("button", { name: "Remove Right knee" }).click()
  await expect(knee).toHaveAttribute("aria-checked", "false")
  await page.getByRole("button", { name: "Submit" }).click()
  await expect(page.getByLabel("Submitted", { exact: true })).toHaveText(
    "left-buttock,neck,left-thigh-back"
  )
  await page.getByRole("button", { name: "Clear all" }).click()
  await expect(value).toHaveText("")
  await expect(status).toHaveText("No regions selected")

  // Unknown IDs render nothing and are dropped on the next change.
  await page.getByRole("button", { name: "Unknown ID" }).click()
  await expect(status).toHaveText("1 region selected")
  await front.getByRole("checkbox", { name: "Groin" }).click()
  await expect(value).toHaveText("neck,groin")

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await page.screenshot({ path: info.outputPath("body-map.png") })
  expect(errors).toEqual([])
})

test("accessibility scan with and without a selection", async ({ page }) => {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await page.getByRole("checkbox", { name: "Right calf" }).click()
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

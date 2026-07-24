import { expect, test } from "@playwright/test"

const components = [
  "patient-status-badge",
  "lab-result-card",
  "vital-sign-card",
  "medication-status",
  "specimen-status",
  "clinical-alert",
  "study-phase-badge",
  "patient-summary-header",
]

for (const component of components) {
  test(`${component} visual states`, async ({ page }) => {
    await page.goto(`/components/${component}`)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page).toHaveScreenshot(`${component}.png`, {
      fullPage: true,
      animations: "disabled",
    })
  })
}

test("collection remains usable at 200% zoom", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle")
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2"
  })
  await expect(page.getByRole("heading", { name: /health products/i })).toBeVisible()
  await expect(page).toHaveScreenshot("collection-zoom-200.png", {
    fullPage: true,
    animations: "disabled",
  })
})

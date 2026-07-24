import { expect, test } from "@playwright/test"

const components = [
  "patient-status-badge",
  "lab-result-card",
  "lab-results-panel",
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

test("patient context handles long identifiers", async ({ page }) => {
  await page.goto("/components/patient-summary-header")
  await page.waitForLoadState("networkidle")
  const identifier = page.getByText("Record SYN-2048")
  await expect(identifier).toHaveCount(2)
  await identifier.evaluateAll((elements) => {
    for (const element of elements) {
      element.textContent =
        "Record SYN-2048-LONG-SYNTHETIC-IDENTIFIER-WITHOUT-SPACES-0000000001"
    }
  })
  await expect(page).toHaveScreenshot("patient-summary-long-identifier.png", {
    fullPage: true,
    animations: "disabled",
  })
})


test("catalog search and category filters are shareable", async ({ page }) => {
  await page.goto("/?q=critical&category=laboratory")
  await page.waitForLoadState("networkidle")
  await expect(
    page.getByRole("searchbox", { name: "Search components" })
  ).toHaveValue("critical")
  await expect(page.getByText("2 items")).toBeVisible()
  await expect(page.getByRole("link", { name: "Lab Result Card" })).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Lab Results Panel" })
  ).toBeVisible()
  await expect(page.getByRole("link", { name: "Clinical Alert" })).toHaveCount(0)
  await expect(page).toHaveScreenshot("catalog-filtered.png", {
    fullPage: true,
    animations: "disabled",
  })
})

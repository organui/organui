import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("installed vital signs flag readings in text, not colour alone", async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/vitals")
  const panel = page.getByRole("region", { name: "Vital signs", exact: true })
  const card = (vital: string) => panel.locator(`[data-vital="${vital}"]`)
  await expect(card("heartRate")).toHaveAttribute("data-status", "high")
  await expect(card("heartRate")).toContainText("112bpmHighNormal 60–100 bpm")
  await expect(card("bloodPressure")).toContainText("150/76mmHgHigh systolic")
  await expect(card("spo2")).toHaveAttribute("data-status", "missing")
  await expect(card("spo2")).toContainText("No reading")
  await expect(card("temperature")).toContainText("38.6°CHigh")
  await expect(panel.getByText("Example readings")).toBeVisible()
  // Each status has its own icon beside the text.
  await expect(card("heartRate").locator("svg path")).toHaveAttribute(
    "d",
    "m5 12 7-7 7 7M12 19V5"
  )
  const custom = page.getByRole("region", { name: "Fahrenheit", exact: true })
  await expect(custom.locator("[data-vital]")).toHaveCount(3)
  await expect(custom.locator('[data-vital="temperature"]')).toContainText(
    "98.6°FNormalNormal 97.0–99.0 °F"
  )
  await expect(custom.locator('[data-vital="spo2"]')).toContainText(
    "90%NormalNormal 88–92 %"
  )
  await expect(
    custom.locator('[data-vital="respiratoryRate"]')
  ).toHaveAttribute("data-status", "low")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({ path: info.outputPath("vitals.png"), fullPage: true })
  expect(errors).toEqual([])
})

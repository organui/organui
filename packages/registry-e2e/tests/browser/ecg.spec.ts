import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/ecg")
})

test("a recorded strip labels its waves and summarizes the rhythm", async ({
  page,
}) => {
  const strip = page.getByRole("img", { name: /^Recorded ECG,/ })
  await expect(strip).toHaveAccessibleName(
    "Recorded ECG, lead II, 5 seconds at 25 mm/s and 10 mm/mV, about 72 beats per minute"
  )
  // Beats at 0.3 s and every 0.83 s after fit six complexes in 5 seconds.
  await expect(strip.locator("text", { hasText: /^QRS$/ })).toHaveCount(6)
  await expect(strip.locator("text", { hasText: /^P$/ })).toHaveCount(6)
  await expect(strip.locator("text", { hasText: /^T$/ })).toHaveCount(6)
  await expect(page.getByText("Not for diagnostic use.").first()).toBeVisible()
})

test("a live strip sweeps until paused and resumes", async ({ page }) => {
  const live = page.getByRole("img", { name: /^Live ECG,/ })
  await expect(live).toHaveAccessibleName(/about 90 beats per minute, live$/, {
    timeout: 10_000,
  })
  const trace = live.locator("[data-slot=ecg-trace-line]")
  const before = await trace.getAttribute("d")
  await expect.poll(() => trace.getAttribute("d")).not.toBe(before)
  await page.getByRole("button", { name: "Pause", exact: true }).click()
  await expect(live).toHaveAccessibleName(/, paused$/)
  const frozen = await trace.getAttribute("d")
  await page.waitForTimeout(500)
  expect(await trace.getAttribute("d")).toBe(frozen)
  await page.getByRole("button", { name: "Resume", exact: true }).click()
  await expect(live).toHaveAccessibleName(/, live$/)
  await expect.poll(() => trace.getAttribute("d")).not.toBe(frozen)
})

test("theme preserved, strips scroll inside the page, no errors", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.reload()
  await expect(page.getByRole("img", { name: /^Live ECG,/ })).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(244, 247, 251)"
  )
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations).toEqual([])
  expect(errors).toEqual([])
})

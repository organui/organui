import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed medication schedule. 2026-10-19 is a Monday, the only day the
// weekly tablet is due.
test.beforeEach(async ({ page }) => {
  await page.goto("/medication")
  await expect(
    page.getByRole("region", { name: /^Medication schedule, Monday/ })
  ).toBeVisible()
})

test("doses, warnings and status report through callbacks", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const doses = page.getByRole("list", { name: "Doses" }).getByRole("listitem")
  await expect(doses).toHaveCount(4)
  await expect(doses.first()).toContainText("07:00Levothyroxine 75 mcg")
  await expect(doses.first()).toContainText(
    "Within the separation window of Calcium at 08:00"
  )
  const schedule = page.getByRole("region", { name: /^Medication schedule/ })
  const alerts = schedule.getByRole("alert")
  await expect(alerts).toHaveCount(2)
  await expect(alerts.first()).toContainText(
    "Major interaction: Weekly tablet and Levothyroxine"
  )
  await expect(alerts.last()).toContainText(
    "Keep doses at least 4 hours apart. Levothyroxine at 07:00 and Calcium at 08:00 is closer than that."
  )
  await expect(page.getByText(/This is not medical advice/)).toBeVisible()

  const levo = page.getByRole("button", {
    name: "Levothyroxine at 07:00: To take",
  })
  await levo.click()
  const status = page.getByLabel("Dose status", { exact: true })
  await expect(status).toHaveText('{"levo@2026-10-19T07:00":"taken"}')
  await page
    .getByRole("button", { name: "Levothyroxine at 07:00: Taken" })
    .click()
  await expect(status).toHaveText('{"levo@2026-10-19T07:00":"skipped"}')
  await page
    .getByRole("button", { name: "Levothyroxine at 07:00: Skipped" })
    .press("Enter")
  await expect(status).toHaveText("{}")

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  expect(errors).toEqual([])
})

test("stepping days follows weekdays and hides warnings that no longer apply", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Next day" }).click()
  await expect(page.getByLabel("Date", { exact: true })).toHaveText(
    "2026-10-20"
  )
  await expect(
    page.getByRole("list", { name: "Doses" }).getByRole("listitem")
  ).toHaveCount(3)
  await expect(
    page
      .getByRole("region", { name: /^Medication schedule/ })
      .getByRole("alert")
  ).toHaveCount(1)
  await page.getByRole("button", { name: "Previous day" }).click()
  await page.getByRole("button", { name: "Previous day" }).click()
  await expect(page.getByLabel("Date", { exact: true })).toHaveText(
    "2026-10-18"
  )
  await expect(
    page.getByRole("region", { name: /^Medication schedule, Sunday/ })
  ).toBeVisible()
})

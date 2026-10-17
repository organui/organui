import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { registryItemSchema } from "shadcn/schema"

test("growth chart documentation", async ({ page, request }, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("/docs/growth-chart")
  await expect(
    page.getByRole("heading", { name: "Growth chart", level: 1 })
  ).toBeVisible()
  await expect(
    page.getByRole("region", { name: "Installation command" })
  ).toHaveText("bunx shadcn@4.21.0 add https://organui.com/r/growth-chart.json")
  const main = page.getByRole("main")
  const chart = main.getByRole("group", { name: "Weight-for-age, girls" })
  await expect(chart.getByRole("img")).toHaveCount(10)
  await chart.getByRole("img").nth(6).hover()
  await expect(main.getByText("8.8 kg", { exact: true })).toBeVisible()

  await main.getByRole("button", { name: "Length/height" }).click()
  await main.getByRole("button", { name: "Boys" }).click()
  await main.getByRole("button", { name: "0–5 years" }).click()
  const length = main.getByRole("group", {
    name: "Length/height-for-age, boys",
  })
  await expect(length).toBeVisible()
  await main.getByLabel("Age (months)").fill("30")
  await main.getByLabel("Value (cm)").fill("91")
  await main.getByRole("button", { name: "Add measurement" }).click()
  await expect(length.getByRole("img")).toHaveCount(11)
  await expect(length.getByRole("img").last()).toHaveAccessibleName(
    /^2 y 6 mo: 91 cm, \d+(st|nd|rd|th) percentile$/
  )
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({ path: info.outputPath("growth.png"), fullPage: true })

  const item = registryItemSchema.parse(
    await (await request.get("/r/growth-chart.json")).json()
  )
  for (const file of item.files ?? [])
    expect(file.content).toBe(
      await readFile(
        new URL(`../../../registry/${file.path}`, import.meta.url),
        "utf8"
      )
    )
  expect(errors).toEqual([])
})

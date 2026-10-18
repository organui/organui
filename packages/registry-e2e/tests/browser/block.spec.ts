import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { heartModel } from "@workspace/registry/heart"
import { kidneysModel } from "@workspace/registry/kidneys"
import { pancreasModel } from "@workspace/registry/pancreas"
import { stomachModel } from "@workspace/registry/stomach"
import { fixtureGlb } from "../../scripts/fixture-glb.js"

// Installed blocks: Next.js serves the pages the CLI installed, Vite a harness
// rendering the same components. Models are stand-in GLBs where the first
// structure is the box in the middle of every fitted view.
const errors: string[] = []
test.beforeEach(async ({ page }) => {
  errors.length = 0
  page.on("pageerror", (error) => errors.push(error.message))
  for (const model of [heartModel, kidneysModel, stomachModel, pancreasModel])
    await page.route(model.src, (route) =>
      route.fulfill({
        body: Buffer.from(fixtureGlb(model.structures.map(({ id }) => id))),
        contentType: "model/gltf-binary",
      })
    )
})
test.afterEach(() => expect(errors).toEqual([]))

const phone = (width = 0) => width < 1024

test("explorer-01 pairs the viewer with a panel or sheet", async ({ page }) => {
  await page.goto("/explorer")
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  const anatomy = page.getByRole("button", { name: "Anatomy", exact: true })
  await anatomy.click()
  if (phone(page.viewportSize()?.width))
    await expect(
      page.getByRole("dialog", { name: "Heart anatomy" })
    ).toBeVisible()
  await expect(page.getByRole("searchbox")).toBeFocused()
  await page.getByRole("button", { name: "Left atrium", exact: true }).click()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("tree")).toHaveCount(0)
  await expect(anatomy).toBeFocused()
  await expect(page.getByRole("status").last()).toContainText("Left atrium:")
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test("explorer-02 hides, isolates and shows structures", async ({ page }) => {
  await page.goto("/workspace")
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  if (phone(page.viewportSize()?.width)) {
    await expect(page.getByRole("complementary")).toHaveCount(0)
    await page.getByRole("button", { name: "Open anatomy" }).click()
    const sheet = page.getByRole("dialog", { name: "Heart anatomy" })
    await expect(sheet.getByRole("searchbox")).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(sheet).toHaveCount(0)
  } else {
    await expect(
      page
        .getByRole("complementary", { name: "Anatomy" })
        .getByRole("tree", { name: "Heart anatomy" })
    ).toBeVisible()
  }
  const title = page.locator('[data-slot="card-title"]')
  await expect(title).toHaveText("No structure selected")
  await viewer.click()
  await expect(title).toHaveText("Right atrium")
  const count = heartModel.structures.length
  await page.getByRole("button", { name: "Isolate" }).click()
  await expect(
    page.getByText(`${count} structures, ${count - 1} hidden`)
  ).toBeVisible()
  await page.getByRole("button", { name: "Hide", exact: true }).click()
  await expect(page.getByText(`${count} hidden`)).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Show", exact: true })
  ).toBeVisible()
  const all = page.getByRole("button", { name: "Show all" })
  await all.click()
  await expect(all).toBeDisabled()
  await page.getByRole("button", { name: "Clear" }).click()
  await expect(title).toHaveText("No structure selected")
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

test("explorer-03 switches organs and resets the selection", async ({
  page,
}) => {
  await page.goto("/organs")
  await expect(
    page
      .getByRole("region", { name: "Interactive heart model" })
      .getByRole("toolbar")
  ).toBeVisible()
  await page.getByRole("region", { name: "Interactive heart model" }).click()
  await expect(page.getByRole("status").last()).toContainText("Right atrium:")
  await page.getByRole("combobox", { name: "Organ" }).click()
  await page.getByRole("option", { name: "Kidneys" }).click()
  await expect(page.getByRole("heading", { name: "Kidneys" })).toBeVisible()
  const kidneys = page.getByRole("region", {
    name: "Interactive kidneys model",
  })
  await expect(kidneys.getByRole("toolbar")).toBeVisible()
  await expect(page.getByRole("status").last()).toHaveText(
    "Select a structure of the kidneys to learn about it."
  )
  await kidneys.click()
  await expect(page.getByRole("status").last()).toContainText(
    `${kidneysModel.structures[0]!.label}:`
  )
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

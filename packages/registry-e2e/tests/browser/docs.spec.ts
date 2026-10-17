import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { registrySchema, registryItemSchema } from "shadcn/schema"

test("documentation interaction, styling and registry serving", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("/docs/anatomy-tree")
  await expect(
    page.getByRole("heading", { name: "Anatomy tree", exact: true })
  ).toBeVisible()
  const heart = page.getByRole("treeitem", { name: "Heart", exact: true })
  await expect(heart).toHaveCSS("display", "flex")
  await page.getByRole("searchbox").focus()
  await page.keyboard.press("Tab")
  await expect(heart).toBeFocused()
  expect(
    await heart.evaluate((element) =>
      parseFloat(getComputedStyle(element).outlineWidth)
    )
  ).toBeGreaterThan(0)
  await page.keyboard.press("Space")
  await expect(heart).toHaveAttribute("aria-checked", "false")
  await page.getByRole("searchbox").fill("ventricle")
  await page
    .getByRole("button", { name: "Left ventricle", exact: true })
    .click()
  await expect(page.getByRole("status")).toHaveText("Selected: lv")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const command = page.getByRole("region", { name: "Installation command" })
  await expect(command).toHaveText(
    "bunx shadcn@4.21.0 add https://organui.com/r/anatomy-tree.json"
  )
  await command.focus()
  await expect(command).toBeFocused()
  if (
    await command.evaluate(
      (element) => element.scrollWidth > element.clientWidth
    )
  ) {
    await command.press("ArrowRight")
    await expect
      .poll(() => command.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0)
  }
  await page.screenshot({ path: info.outputPath("docs.png"), fullPage: true })
  const itemResponse = await request.get("/r/anatomy-tree.json")
  expect(itemResponse.ok()).toBe(true)
  expect(itemResponse.headers()["content-type"]).toContain("application/json")
  const item = registryItemSchema.parse(await itemResponse.json())
  expect(item.files?.[0]?.content).toBe(
    await readFile(
      new URL(import.meta.resolve("@workspace/registry/anatomy-tree")),
      "utf8"
    )
  )
  const catalogResponse = await request.get("/r/registry.json")
  expect(catalogResponse.ok()).toBe(true)
  expect(
    registrySchema
      .parse(await catalogResponse.json())
      .items.map((item) => item.name)
  ).toEqual(["anatomy-tree"])
  expect(errors).toEqual([])
})

test("accessibility scan covers expanded, mixed and filtered states", async ({
  page,
}, info) => {
  await page.goto("/docs/anatomy-tree")
  for (const state of ["expanded", "mixed", "filtered"]) {
    if (state === "mixed")
      await page
        .getByRole("button", { name: "Visible: hide Left atrium", exact: true })
        .click()
    if (state === "filtered")
      await page.getByRole("searchbox").fill("ventricle")
    const result = await new AxeBuilder({ page }).analyze()
    await info.attach(`axe-${state}`, {
      body: JSON.stringify(result, null, 2),
      contentType: "application/json",
    })
    expect(result.violations).toEqual([])
  }
})

test("homepage explorer links support keyboard navigation without overflow", async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/")
  const navigation = page.getByRole("navigation", {
    name: "3D anatomy explorers",
  })
  const names = [
    "Adrenals",
    "Bladder",
    "Brain",
    "Ear",
    "Esophagus",
    "Eye",
    "Gallbladder",
    "Heart",
    "Intestines",
    "Kidneys",
    "Larynx",
    "Liver",
    "Lungs",
    "Lymph",
    "Muscles",
    "Nose",
    "Pancreas",
    "Pharynx",
    "Prostate",
    "Skeleton",
    "Skin",
    "Spinal cord",
    "Spleen",
    "Stomach",
    "Teeth",
    "Thymus",
    "Thyroid",
    "Tongue",
    "Uterus",
    "Vessels",
  ]
  await expect(navigation.getByRole("link")).toHaveCount(names.length)
  for (const [index, name] of names.entries()) {
    const link = navigation.getByRole("link", { name, exact: true })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute(
      "href",
      `https://github.com/organui/${name.toLowerCase().replaceAll(" ", "-")}-3d`
    )
    if (index === 0) await link.focus()
    else await page.keyboard.press("Tab")
    await expect(link).toBeFocused()
    expect(
      await link.evaluate((element) =>
        parseFloat(getComputedStyle(element).outlineWidth)
      )
    ).toBeGreaterThan(0)
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await page.screenshot({
    path: info.outputPath("homepage.png"),
    fullPage: true,
  })
  expect(errors).toEqual([])
})

test("registry index lists every catalog item inside the docs layout", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const catalog = registrySchema.parse(
    await (await request.get("/r/registry.json")).json()
  )
  await page.goto("/docs")
  await expect(
    page.getByRole("heading", { name: "Components", level: 1 })
  ).toBeVisible()
  for (const item of catalog.items) {
    const title = item.title ?? item.name
    await expect(
      page.getByRole("heading", { name: title, level: 3 }).getByRole("link")
    ).toHaveAttribute("href", `/docs/${item.name}`)
    await expect(
      page.getByRole("region", { name: `Install ${title}` })
    ).toHaveText(
      `bunx shadcn@4.21.0 add https://organui.com/r/${item.name}.json`
    )
    await expect(
      page
        .getByRole("region", { name: `${title} preview` })
        .locator(":scope > *")
    ).toBeVisible()
    expect((await request.get(`/docs/${item.name}`)).ok()).toBe(true)
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({ path: info.outputPath("index.png"), fullPage: true })

  const docs = page.getByRole("navigation", { name: "Documentation" })
  if ((page.viewportSize()?.width ?? 0) < 768) {
    await expect(docs).toBeHidden()
    await page.getByText("Menu", { exact: true }).click()
  }
  await expect(
    docs.getByRole("link", { name: "Introduction" })
  ).toHaveAttribute("aria-current", "page")
  if ((page.viewportSize()?.width ?? 0) < 768) {
    // Tapping the current page still closes the menu.
    await docs.getByRole("link", { name: "Introduction" }).click()
    await expect(docs).toBeHidden()
    await page.getByText("Menu", { exact: true }).click()
  }
  await docs.getByRole("link", { name: "Anatomy tree" }).click()
  await expect(page).toHaveURL(/\/docs\/anatomy-tree$/)
  await expect(
    page.getByRole("heading", { name: "Anatomy tree", level: 1 })
  ).toBeVisible()
  if ((page.viewportSize()?.width ?? 0) < 768) {
    await expect(docs).toBeHidden()
    await page.getByText("Menu", { exact: true }).click()
  }
  await expect(
    docs.getByRole("link", { name: "Anatomy tree" })
  ).toHaveAttribute("aria-current", "page")
  expect(errors).toEqual([])
})

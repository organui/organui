import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { registrySchema, registryItemSchema } from "shadcn/schema"
import { heartModel } from "@workspace/registry/organ-viewer/heart"
import { fixtureGlb } from "../../scripts/fixture-glb.js"

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
  ).toEqual(
    registrySchema
      .parse(
        JSON.parse(
          await readFile(
            new URL(import.meta.resolve("@workspace/registry/registry.json")),
            "utf8"
          )
        )
      )
      .items.map((item) => item.name)
  )
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
      page
        .getByRole("heading", { name: title, level: 3, exact: true })
        .getByRole("link")
    ).toHaveAttribute("href", `/docs/${item.name}`)
    await expect(
      page.getByRole("region", { name: `Install ${title}`, exact: true })
    ).toHaveText(
      `bunx shadcn@4.21.0 add https://organui.com/r/${item.name}.json`
    )
    await expect(
      page
        .getByRole("region", { name: `${title} preview`, exact: true })
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

test("organ pages pair the viewer with the anatomy tree", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  // Serve a stand-in for the commit-pinned model instead of the CDN.
  await page.route(heartModel.src, (route) =>
    route.fulfill({
      body: Buffer.from(fixtureGlb(heartModel.structures.map(({ id }) => id))),
      contentType: "model/gltf-binary",
    })
  )
  await page.goto("/docs/heart")
  await expect(
    page.getByRole("heading", { name: "Heart", level: 1 })
  ).toBeVisible()
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  // The panel starts closed; opening it moves focus to its search field.
  // Phones get a sheet, which covers the viewer until it is closed.
  const phone = (page.viewportSize()?.width ?? 0) < 1024
  await expect(page.getByRole("tree")).toHaveCount(0)
  const anatomy = page.getByRole("button", { name: "Anatomy", exact: true })
  await expect(anatomy).toHaveAttribute("aria-pressed", "false")
  await anatomy.click()
  // A modal sheet hides the rest of the page, the toggle included.
  if (phone)
    await expect(
      page.getByRole("dialog", { name: "Heart anatomy" })
    ).toBeVisible()
  else await expect(anatomy).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("searchbox")).toBeFocused()
  await page.getByRole("button", { name: "Left atrium", exact: true }).click()
  if (phone) {
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).toHaveCount(0)
    await expect(anatomy).toBeFocused()
  }
  await expect(page.getByRole("status").last()).toContainText("Left atrium:")
  await viewer.click()
  if (phone) await anatomy.click()
  await expect(
    page.getByRole("treeitem", { name: "Right atrium", exact: true })
  ).toHaveAttribute("aria-selected", "true")
  await page.getByRole("searchbox").focus()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("tree")).toHaveCount(0)
  await expect(anatomy).toBeFocused()
  await expect(anatomy).toHaveAttribute("aria-pressed", "false")
  await expect(
    page.getByRole("region", { name: "Installation command" })
  ).toHaveText("bunx shadcn@4.21.0 add https://organui.com/r/heart.json")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({ path: info.outputPath("organ.png"), fullPage: true })
  const item = registryItemSchema.parse(
    await (await request.get("/r/heart.json")).json()
  )
  expect(item.files?.map((file) => file.path)).toEqual([
    "registry/base-nova/organ-viewer/organ-viewer.tsx",
    "registry/base-nova/organ-viewer/heart.tsx",
  ])
  expect(errors).toEqual([])
})

test("a model that fails to load explains itself and retries", async ({
  page,
}) => {
  let requests = 0
  await page.route(heartModel.src, (route) => {
    requests++
    return route.fulfill({ status: 404 })
  })
  await page.goto("/docs/heart")
  const alert = page
    .getByRole("region", { name: "Interactive heart model" })
    .getByRole("alert")
  await expect(alert).toContainText("The heart model couldn’t load")
  await expect(alert).toContainText("HTTP 404")
  await alert.getByRole("button", { name: "Try again" }).click()
  await expect.poll(() => requests).toBe(2)
})

test("a model the site serves itself loads from its own origin", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  // Installs in other apps fetch organui.com/models cross-origin.
  const model = await request.get("/models/breast.glb")
  expect(model.ok()).toBe(true)
  expect(model.headers()["access-control-allow-origin"]).toBe("*")
  const loaded = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/models/breast.glb" && response.ok()
  )
  await page.goto("/docs/breast")
  await loaded
  const viewer = page.getByRole("region", { name: "Interactive breast model" })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  await expect(viewer.getByRole("alert")).toHaveCount(0)
  await expect(
    viewer.getByRole("link", { name: "CC BY 4.0", exact: true })
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath("breast.png"), fullPage: true })
  expect(errors).toEqual([])
})

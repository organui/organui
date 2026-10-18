import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { registrySchema, registryItemSchema } from "shadcn/schema"
import { heartModel } from "@workspace/registry/heart"
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

test("registry index lists every component inside the docs layout", async ({
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
  // Blocks are listed on /blocks.
  for (const item of catalog.items.filter(
    ({ type }) => type !== "registry:block"
  )) {
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
  const menu = page.getByRole("button", { name: "Menu", exact: true })
  if ((page.viewportSize()?.width ?? 0) < 768) {
    await expect(docs).toBeHidden()
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await menu.focus()
    await menu.press("Enter")
    await expect(menu).toHaveAttribute("aria-expanded", "true")
  }
  await expect(
    docs.getByRole("link", { name: "Introduction" })
  ).toHaveAttribute("aria-current", "page")
  if ((page.viewportSize()?.width ?? 0) < 768) {
    // Tapping the current page still closes the menu.
    await docs.getByRole("link", { name: "Introduction" }).click()
    await expect(docs).toBeHidden()
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await menu.click()
  }
  await docs.getByRole("link", { name: "Anatomy tree" }).click()
  await expect(page).toHaveURL(/\/docs\/anatomy-tree$/)
  await expect(
    page.getByRole("heading", { name: "Anatomy tree", level: 1 })
  ).toBeVisible()
  if ((page.viewportSize()?.width ?? 0) < 768) {
    await expect(docs).toBeHidden()
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await menu.click()
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
  const demo = page.getByRole("group", { name: "Heart example", exact: true })
  await expect(
    demo.getByRole("toolbar", { name: "View controls" })
  ).toBeVisible()
  await demo.getByRole("button", { name: "View Code", exact: true }).click()
  await expect(demo.getByLabel("Heart code")).toContainText(
    'from "@/components/heart"'
  )
  await expect(demo.getByLabel("Heart code")).toContainText("<Heart")
  await expect(demo.getByLabel("Heart code")).not.toContainText(
    "controls={false}"
  )
  // Revealing code preserves the live default demo and its context.
  await expect(demo.locator("canvas")).toHaveCount(1)
  const headings = await page
    .getByRole("heading", { level: 2 })
    .allTextContents()
  expect(headings.indexOf("Installation")).toBeLessThan(
    headings.indexOf("Usage")
  )
  expect(headings.indexOf("Usage")).toBeLessThan(
    headings.indexOf("Without Controls")
  )
  const withoutControls = page.getByRole("group", {
    name: "Heart Without Controls example",
    exact: true,
  })
  await withoutControls.scrollIntoViewIfNeeded()
  await expect(
    withoutControls.getByRole("region", {
      name: "Heart without controls example",
    })
  ).toBeVisible()
  await expect(withoutControls.getByRole("toolbar")).toHaveCount(0)
  await withoutControls
    .getByRole("button", { name: "View Code", exact: true })
    .click()
  await expect(
    withoutControls.getByLabel("Heart Without Controls code")
  ).toContainText("controls={false}")
  const controlled = page.getByRole("group", {
    name: "Heart Controlled Selection example",
    exact: true,
  })
  await controlled.scrollIntoViewIfNeeded()
  await expect(
    controlled.getByRole("toolbar", { name: "View controls" })
  ).toBeVisible()
  await controlled
    .getByRole("button", { name: "View Code", exact: true })
    .click()
  await expect(
    controlled.getByLabel("Heart Controlled Selection code")
  ).toContainText("onSelectionChange={setSelectedId}")
  const examples = page.getByRole("group", {
    name: "Heart With Anatomy Panel example",
    exact: true,
  })
  await examples.scrollIntoViewIfNeeded()
  const viewer = examples.getByRole("region", {
    name: "Heart with anatomy example",
  })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  await expect(examples.locator("canvas")).toHaveCount(1)
  const tree = examples.getByRole("tree", { name: "Heart anatomy" })
  await expect(tree).toBeVisible()
  await examples
    .getByRole("button", { name: "Left atrium", exact: true })
    .click()
  await expect(
    tree.getByRole("treeitem", { name: "Left atrium", exact: true })
  ).toHaveAttribute("aria-selected", "true")
  await viewer.click()
  await expect(
    tree.getByRole("treeitem", { name: "Right atrium", exact: true })
  ).toHaveAttribute("aria-selected", "true")
  await examples.getByRole("button", { name: "View Code", exact: true }).click()
  await expect(
    examples.getByLabel("Heart With Anatomy Panel code")
  ).toContainText("<Heart")
  await expect(
    page.getByRole("region", { name: "Installation command" })
  ).toHaveText("bunx shadcn@4.21.0 add https://organui.com/r/heart.json")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const api = page.getByRole("table", { name: "Heart props" })
  await api.focus()
  await expect(api).toBeFocused()
  if ((page.viewportSize()?.width ?? 0) < 768) {
    await api.press("ArrowRight")
    await expect
      .poll(() => api.evaluate((table) => table.parentElement!.scrollLeft))
      .toBeGreaterThan(0)
  }
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({ path: info.outputPath("organ.png"), fullPage: true })
  const item = registryItemSchema.parse(
    await (await request.get("/r/heart.json")).json()
  )
  expect(item.files?.map((file) => file.path)).toEqual([
    "registry/base-nova/organ-viewer/organ-viewer.tsx",
    "registry/base-nova/heart/heart.tsx",
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
    .getByRole("region", { name: "Heart default example" })
    .getByRole("alert")
  await expect(alert).toContainText("The heart model couldn’t load")
  await expect(alert).toContainText("HTTP 404")
  await alert.getByRole("button", { name: "Try again" }).click()
  await expect.poll(() => requests).toBe(2)
})

test("blocks gallery previews and installs every block", async ({
  page,
  request,
}, info) => {
  // Each block preview is its own page with a WebGL scene.
  test.setTimeout(90_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.route(heartModel.src, (route) =>
    route.fulfill({
      body: Buffer.from(fixtureGlb(heartModel.structures.map(({ id }) => id))),
      contentType: "model/gltf-binary",
    })
  )
  const blocks = registrySchema
    .parse(await (await request.get("/r/registry.json")).json())
    .items.filter(({ type }) => type === "registry:block")
  expect(blocks.length).toBeGreaterThan(0)
  await page.goto("/docs")
  await page.getByRole("link", { name: "Blocks", exact: true }).first().click()
  await expect(page).toHaveURL(/\/blocks$/)
  await expect(
    page.getByRole("heading", { name: "Blocks", level: 1 })
  ).toBeVisible()
  for (const block of blocks) {
    const title = block.title ?? block.name
    const section = page.getByRole("region", { name: title, exact: true })
    await expect(section).toHaveAttribute("id", block.name)
    await expect(
      section.getByRole("region", { name: `Install ${title}`, exact: true })
    ).toHaveText(
      `bunx shadcn@4.21.0 add https://organui.com/r/${block.name}.json`
    )
    const preview = section.getByTitle(`${title} preview`)
    await preview.scrollIntoViewIfNeeded()
    await expect(
      preview.contentFrame().getByRole("toolbar", { name: "View controls" })
    ).toBeVisible()
    const item = registryItemSchema.parse(
      await (await request.get(`/r/${block.name}.json`)).json()
    )
    const installedPage = item.files?.find(
      ({ type }) => type === "registry:page"
    )
    // The gallery shows each block's own files and links the shared ones.
    await section
      .getByText(installedPage?.target ?? "", { exact: true })
      .click()
    await expect(
      section.getByRole("region", { name: `${installedPage?.target} source` })
    ).toHaveText(installedPage?.content ?? "")
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  // axe merges framed pages into this one, so their own main and header read
  // as duplicate landmarks. block.spec.ts scans the installed pages alone.
  const axe = await new AxeBuilder({ page }).exclude("iframe").analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({ path: info.outputPath("blocks.png"), fullPage: true })
  expect(errors).toEqual([])
})

test("a public organ component loads its attributed hosted model", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  // The public Breast component uses its canonical model URL. Serve the
  // committed asset in this test instead of fetching the deployed website.
  await page.route("https://organui.com/models/breast.glb", async (route) => {
    const response = await request.get("/models/breast.glb")
    await route.fulfill({
      body: await response.body(),
      contentType: "model/gltf-binary",
    })
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
  const viewer = page.getByRole("region", { name: "Breast default example" })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  await expect(viewer.getByRole("alert")).toHaveCount(0)
  await expect(
    viewer.getByRole("link", { name: "CC BY 4.0", exact: true })
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath("breast.png"), fullPage: true })
  expect(errors).toEqual([])
})

test("vital signs example switches readings and states each status", async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/docs/vital-signs")
  await expect(
    page.getByRole("heading", { name: "Vital signs", level: 1 })
  ).toBeVisible()
  const panel = page.getByRole("region", { name: "Vital signs", exact: true })
  const spo2 = panel.locator('[data-vital="spo2"]')
  await expect(spo2).toHaveAttribute("data-status", "normal")
  await page.getByRole("button", { name: "Low oxygen", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Low oxygen", exact: true })
  ).toHaveAttribute("aria-pressed", "true")
  await expect(spo2).toHaveAttribute("data-status", "low")
  await expect(spo2).toContainText("89%Low")
  await expect(
    page.getByRole("region", { name: "Installation command" })
  ).toHaveText("bunx shadcn@4.21.0 add https://organui.com/r/vital-signs.json")
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

test("lab results flag values in words and fit a phone", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/docs/lab-results")
  const table = page
    .getByRole("region", { name: "Lab results example" })
    .getByRole("table")
  const row = (name: string) =>
    table.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: new RegExp(`^${name}`) }),
    })
  await expect(row("Potassium")).toContainText("Critical high")
  await expect(row("Glucose, fasting")).toContainText("High")
  await expect(row("Sodium")).toContainText("Low")
  await expect(row("Creatinine")).toContainText("Normal")
  // A lab-reported flag wins over a text result that cannot be compared.
  await expect(row("Urine protein")).toContainText("Normal")
  await expect(
    row("Glucose, fasting").getByRole("img", {
      name: "Glucose, fasting trend, 4 results from Oct 6, 2025 to Oct 1, 2026: 92 to 118 mg/dL, rising",
    })
  ).toBeVisible()
  await expect(row("HDL cholesterol")).toContainText("No earlier results")
  // Below 32rem the range moves under the test name instead of scrolling.
  const narrow = (page.viewportSize()?.width ?? 0) < 768
  await expect(
    table.getByRole("columnheader", { name: "Reference range" })
  ).toBeVisible({ visible: !narrow })
  await expect(row("Sodium").getByText("Range: 135–145 mmol/L")).toBeVisible({
    visible: narrow,
  })
  for (const path of ["/docs/lab-results", "/docs"]) {
    await page.goto(path)
    expect(
      await page.evaluate(() =>
        [
          document.documentElement,
          ...document.querySelectorAll("[data-slot=lab-results] > *"),
        ].every((element) => element.scrollWidth <= element.clientWidth)
      )
    ).toBe(true)
  }
  await page.goto("/docs/lab-results")
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({
    path: info.outputPath("lab-results.png"),
    fullPage: true,
  })
  const item = registryItemSchema.parse(
    await (await request.get("/r/lab-results.json")).json()
  )
  expect(item.registryDependencies).toEqual(["table"])
  expect(item.files?.[0]?.content).toBe(
    await readFile(
      new URL(import.meta.resolve("@workspace/registry/lab-results")),
      "utf8"
    )
  )
  expect(errors).toEqual([])
})

test("the ECG trace page runs a live strip at the chosen rate", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/docs/ecg-trace")
  await expect(
    page.getByRole("heading", { name: "ECG trace", level: 1 })
  ).toBeVisible()
  const live = page.getByRole("img", { name: /^Live ECG,/ })
  await expect(live).toHaveAccessibleName(/about 72 beats per minute, live$/, {
    timeout: 10_000,
  })
  await page.getByRole("button", { name: "Fast 110", exact: true }).click()
  await expect(
    page.getByRole("button", { name: "Fast 110", exact: true })
  ).toHaveAttribute("aria-pressed", "true")
  await expect(live).toHaveAccessibleName(/about 110 beats per minute, live$/, {
    timeout: 10_000,
  })
  // Re-activating the current choice must not leave the monitor unselected.
  const fast = page.getByRole("button", { name: "Fast 110", exact: true })
  await fast.click()
  await expect(fast).toHaveAttribute("aria-pressed", "true")
  await fast.press("ArrowLeft")
  const normal = page.getByRole("button", { name: "Normal 72", exact: true })
  await expect(normal).toBeFocused()
  await normal.press("Space")
  await expect(normal).toHaveAttribute("aria-pressed", "true")
  await expect(fast).toHaveAttribute("aria-pressed", "false")
  await expect(
    page.getByRole("img", { name: /^Recorded ECG,/ })
  ).toHaveAccessibleName(/about 72 beats per minute$/)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  expect(errors).toEqual([])
})

test("tree, sequence field and option groups remain usable in dark mode", async ({
  page,
}, info) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ colorScheme: "dark" })
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  for (const name of [
    "anatomy-tree",
    "dna-helix",
    "ecg-trace",
    "vital-signs",
  ]) {
    await page.goto(`/docs/${name}`)
    await expect(page.locator("html")).toHaveClass(/dark/)
    if (name === "anatomy-tree") {
      await page.getByRole("searchbox").fill("no such structure")
      await expect(page.getByRole("status").first()).toContainText(
        "No matching anatomy."
      )
      await page.getByRole("searchbox").fill("")
      // Filtering is deferred. Wait for the tree's tab stop to return before
      // pressing Tab, otherwise a slower render legitimately skips the tree.
      await expect(page.getByRole("treeitem")).toHaveCount(7)
      await page.getByRole("searchbox").press("Tab")
      const heart = page.getByRole("treeitem", { name: "Heart", exact: true })
      await expect(heart).toBeFocused()
      await heart.press("Enter")
      await expect(heart).toHaveAttribute("aria-selected", "true")
    } else if (name === "dna-helix") {
      const sequence = page.getByRole("textbox", { name: "Sequence, 5′ to 3′" })
      await sequence.fill("ATGC")
      await expect(sequence).toHaveValue("ATGC")
    } else {
      const choice = page.getByRole("button", {
        name: name === "ecg-trace" ? "Fast 110" : "Low oxygen",
        exact: true,
      })
      await choice.click()
      await expect(choice).toHaveAttribute("aria-pressed", "true")
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
    await page.screenshot({
      path: info.outputPath(`${name}-dark.png`),
      fullPage: true,
    })
  }
  expect(errors).toEqual([])
})

test("component previews reveal copyable code without resetting the demo", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/docs/anatomy-tree")
  const example = page.getByRole("group", {
    name: "Anatomy tree example",
    exact: true,
  })
  await example
    .getByRole("button", { name: "Left ventricle", exact: true })
    .click()
  const state = example.getByRole("status")
  await expect(state).toHaveText("Selected: lv")
  const reveal = example.getByRole("button", { name: "View Code", exact: true })
  await reveal.focus()
  await reveal.press("Enter")
  const snippet = example.getByLabel("Anatomy tree code")
  await expect(snippet).toBeFocused()
  const expectedSource = (
    await readFile(
      new URL(
        "examples/anatomy-tree-demo.tsx",
        import.meta.resolve("web/package.json")
      ),
      "utf8"
    )
  )
    .replaceAll(
      "@workspace/registry/anatomy-tree",
      "@/components/ui/anatomy-tree"
    )
    .trimEnd()
  await expect(snippet).toHaveText(expectedSource, { useInnerText: false })
  await expect(example.getByRole("tree")).toBeVisible()
  await expect(state).toHaveText("Selected: lv")
  await example.getByRole("button", { name: "Copy", exact: true }).click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(expectedSource)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
})

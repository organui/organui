import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { readFile } from "node:fs/promises"
import { registrySchema, registryItemSchema } from "shadcn/schema"
import { heartModel } from "@workspace/registry/heart"
import { fixtureGlb } from "../../scripts/fixture-glb.js"
import { dicomFile } from "../../../registry/tests/fixture-dicom.js"

test("documentation interaction, styling and registry serving", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("/docs/components/anatomy-tree")
  // The main demo; the examples below it have their own.
  const demo = page.locator('[data-example="anatomy-tree-demo"]')
  await expect(
    page.getByRole("heading", { name: "Anatomy tree", exact: true })
  ).toBeVisible()
  const heart = demo.getByRole("treeitem", { name: /^Heart, / })
  await expect(heart).toHaveCSS("display", "flex")
  await demo.getByRole("searchbox").focus()
  await page.keyboard.press("Tab")
  await expect(heart).toBeFocused()
  expect(
    await heart.evaluate((element) =>
      parseFloat(getComputedStyle(element).outlineWidth)
    )
  ).toBeGreaterThan(0)
  await page.keyboard.press("Space")
  await expect(heart).toHaveAttribute("aria-checked", "false")
  await demo.getByRole("searchbox").fill("ventricle")
  await demo
    .getByRole("button", { name: "Left ventricle", exact: true })
    .click()
  await expect(demo.getByRole("status")).toHaveText("Selected: lv")
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const command = page.getByRole("region", { name: "Installation command" })
  await expect(command).toHaveText(
    "bunx shadcn@4.22.1 add https://organui.com/r/anatomy-tree.json"
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
  await page.goto("/docs/components/anatomy-tree")
  // The main demo; the examples below it have their own.
  const demo = page.locator('[data-example="anatomy-tree-demo"]')
  for (const state of ["expanded", "mixed", "filtered"]) {
    if (state === "mixed")
      await demo
        .getByRole("button", { name: "Visible: hide Left atrium", exact: true })
        .click()
    if (state === "filtered")
      await demo.getByRole("searchbox").fill("ventricle")
    const result = await new AxeBuilder({ page }).analyze()
    await info.attach(`axe-${state}`, {
      body: JSON.stringify(result, null, 2),
      contentType: "application/json",
    })
    expect(result.violations).toEqual([])
  }
})

test("docs are served as Markdown and listed in llms.txt and RSS", async ({
  request,
}) => {
  const index = await request.get("/llms.txt")
  expect(index.ok()).toBe(true)
  expect(await index.text()).toContain(
    "(https://organui.com/docs/components/ecg-trace.md)"
  )
  const page = await request.get("/docs/components/ecg-trace.md")
  expect(page.headers()["content-type"]).toContain("text/markdown")
  const markdown = await page.text()
  expect(markdown.startsWith("# ECG trace\n")).toBe(true)
  expect(markdown).toContain("## Installation")
  expect(markdown).toContain(
    "bunx shadcn@4.22.1 add https://organui.com/r/ecg-trace.json"
  )
  // Previews and controls stay out.
  expect(markdown).not.toContain("View Code")
  expect((await request.get("/docs.md")).ok()).toBe(true)
  expect((await request.get("/docs/not-a-page.md")).status()).toBe(404)
  const feed = await request.get("/rss.xml")
  expect(feed.headers()["content-type"]).toContain("application/rss+xml")
  expect(await feed.text()).toContain("<title>OrganUI changelog</title>")
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

test("guides and the component index pass an accessibility scan without overflow", async ({
  page,
}, info) => {
  // A scan per guide, a dozen of them.
  test.setTimeout(90_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  for (const [path, title] of [
    ["/docs", "Introduction"],
    ["/docs/installation", "Installation"],
    ["/docs/theming", "Theming"],
    ["/docs/base-ui", "Base UI and Radix"],
    ["/docs/forms", "Forms"],
    ["/docs/clinical-charts", "Clinical charts"],
    ["/docs/licences", "Licences"],
    ["/docs/mcp", "MCP"],
    ["/docs/changelog", "Changelog"],
    ["/docs/installation/next", "Next.js"],
    ["/docs/installation/vite", "Vite"],
    ["/docs/components", "Components"],
    ["/docs/utilities", "Utilities"],
    ["/docs/helpers", "Helpers"],
    ["/docs/ai-elements", "AI Elements"],
  ] as const) {
    await page.goto(path)
    await expect(
      page.getByRole("heading", { name: title, level: 1 })
    ).toBeVisible()
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true)
    const axe = await new AxeBuilder({ page }).analyze()
    expect(axe.violations).toEqual([])
  }
  await page.screenshot({ path: info.outputPath("index.png"), fullPage: true })
  expect(errors).toEqual([])
})

test("the forms guide validates the body map with React Hook Form", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/docs/forms")
  const form = page.locator('[data-example="form-rhf-demo"]')
  await form.getByRole("button", { name: "Submit" }).click()
  await expect(form.getByText("Select at least one region.")).toBeVisible()
  await expect(form.getByLabel("Main complaint")).toHaveAttribute(
    "aria-invalid",
    "true"
  )

  await form.getByLabel("Main complaint").fill("Knee pain")
  await form
    .getByRole("group", { name: "Front of body" })
    .getByRole("checkbox", { name: "Right knee" })
    .click()
  await expect(form.getByText("Select at least one region.")).toHaveCount(0)
  await form.getByRole("button", { name: "Submit" }).click()
  await expect(
    form.getByRole("status", { name: "Submitted values" })
  ).toContainText('"right-knee"')
  expect(errors).toEqual([])
})

test("component index lists every component inside the docs layout", async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const catalog = registrySchema.parse(
    await (await request.get("/r/registry.json")).json()
  )
  await page.goto("/docs/components")
  await expect(
    page.getByRole("heading", { name: "Components", level: 1 })
  ).toBeVisible()
  // Blocks are listed on /blocks, AI Elements and utilities on their own
  // pages.
  const components = catalog.items.filter(
    ({ type, categories }) =>
      type !== "registry:block" &&
      !categories?.includes("utility") &&
      !categories?.includes("helper") &&
      !categories?.includes("ai")
  )
  const organs = components.filter(({ categories }) =>
    categories?.includes("organ")
  )
  // An A–Z list of links, as on shadcn/ui; the organs share one gallery link.
  const index = page.getByRole("main").getByRole("list").first()
  for (const item of components.filter((item) => !organs.includes(item)))
    await expect(
      index.getByRole("link", { name: item.title ?? item.name, exact: true })
    ).toHaveAttribute("href", `/docs/components/${item.name}`)
  for (const item of organs)
    await expect(
      index.getByRole("link", { name: item.title ?? item.name, exact: true })
    ).toHaveCount(0)
  await expect(
    index.getByRole("link", { name: "Organs", exact: true })
  ).toHaveAttribute("href", "/docs/components/organs")
  const titles = await index.getByRole("link").allTextContents()
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)))
  const pages = await Promise.all(
    components.map(({ name }) => request.get(`/docs/components/${name}`))
  )
  expect(pages.map((response) => response.ok())).not.toContain(false)

  const docs = page.getByRole("navigation", { name: "Documentation" })
  const menu = page.getByRole("button", { name: "Menu", exact: true })
  const narrow = (page.viewportSize()?.width ?? 0) < 768
  if (narrow) {
    await expect(docs).toBeHidden()
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await menu.focus()
    await menu.press("Enter")
    await expect(menu).toHaveAttribute("aria-expanded", "true")
  }
  await expect(
    docs.getByRole("link", { name: "Components", exact: true })
  ).toHaveAttribute("aria-current", "page")
  // The sidebar lists every component, the organs among them.
  for (const item of components)
    await expect(
      docs.getByRole("link", { name: item.title ?? item.name, exact: true })
    ).toHaveAttribute("href", `/docs/components/${item.name}`)
  if (narrow) {
    // Tapping the current page still closes the menu.
    await docs.getByRole("link", { name: "Components", exact: true }).click()
    await expect(docs).toBeHidden()
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await menu.click()
  }
  await docs.getByRole("link", { name: "Anatomy tree" }).click()
  await expect(page).toHaveURL(/\/docs\/components\/anatomy-tree$/)
  await expect(
    page.getByRole("heading", { name: "Anatomy tree", level: 1 })
  ).toBeVisible()
  if (narrow) {
    await expect(docs).toBeHidden()
    await expect(menu).toHaveAttribute("aria-expanded", "false")
    await menu.click()
  }
  await expect(
    docs.getByRole("link", { name: "Anatomy tree" })
  ).toHaveAttribute("aria-current", "page")

  // An organ's own page is current in the sidebar.
  const [organ] = organs
  await page.goto(`/docs/components/${organ!.name}`)
  if (narrow) await menu.click()
  await expect(
    docs.getByRole("link", { name: organ!.title ?? organ!.name, exact: true })
  ).toHaveAttribute("aria-current", "page")
  expect(errors).toEqual([])
})

// Items installed from v0.3.0 and earlier print /docs/<name> after install.
test("old component addresses redirect permanently", async ({ request }) => {
  const catalog = registrySchema.parse(
    await (await request.get("/r/registry.json")).json()
  )
  for (const { name, type, categories } of catalog.items) {
    // Only components had those addresses.
    if (
      type === "registry:block" ||
      ["ai", "helper", "utility"].some((category) =>
        categories?.includes(category)
      )
    )
      continue
    const response = await request.get(`/docs/${name}`, { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(
      new URL(response.headers().location!, "http://localhost").pathname
    ).toBe(`/docs/components/${name}`)
  }
  // The organs gallery's first address.
  const organs = await request.get("/organs", { maxRedirects: 0 })
  expect(organs.status()).toBe(308)
  expect(new URL(organs.headers().location!, "http://localhost").pathname).toBe(
    "/docs/components/organs"
  )
})

test("the header links each section and searches the whole site", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  let indexRequests = 0
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/search.json") indexRequests++
  })
  await page.goto("/")
  const narrow = (page.viewportSize()?.width ?? 0) < 768
  const main = page.getByRole("navigation", { name: "Main" })
  if (narrow)
    await page.getByRole("button", { name: "Menu", exact: true }).click()
  await expect(main.getByRole("link")).toHaveText([
    "Docs",
    "Components",
    "Organs",
    "Blocks",
    "Charts",
    "Create",
  ])
  await main.getByRole("link", { name: "Organs", exact: true }).click()
  await expect(page).toHaveURL(/\/docs\/components\/organs$/)
  await expect(
    page.getByRole("heading", { name: "Organs", level: 1 })
  ).toBeVisible()
  // Choosing a link closes the phone menu, so reopen it to read the header.
  if (narrow)
    await page.getByRole("button", { name: "Menu", exact: true }).click()
  await expect(
    main.getByRole("link", { name: "Organs", exact: true })
  ).toHaveAttribute("aria-current", "page")
  // The gallery is under Components, but only its own section is current.
  await expect(
    main.getByRole("link", { name: "Components", exact: true })
  ).not.toHaveAttribute("aria-current")
  if (narrow) await page.keyboard.press("Escape")
  await expect(
    page.getByRole("link", { name: "GitHub repository", exact: false })
  ).toHaveAttribute("href", "https://github.com/organui/organui")

  // Pages don't fetch the index until search opens.
  expect(indexRequests).toBe(0)
  await page.keyboard.press("ControlOrMeta+K")
  const dialog = page.getByRole("dialog", { name: "Search" })
  await expect(dialog).toBeVisible()
  await expect.poll(() => indexRequests).toBe(1)
  const input = dialog.getByRole("combobox")
  // Organs are searchable though the sidebar leaves them out.
  await input.fill("spinal")
  await expect(
    dialog.getByRole("option", { name: /Spinal cord/ })
  ).toBeVisible()
  await input.fill("licen")
  await expect(dialog.getByRole("option", { name: /Licences/ })).toBeVisible()
  await input.fill("explorer 02")
  await expect(
    dialog.getByRole("option", { name: /Explorer 02/ })
  ).toBeVisible()
  await input.fill("vital")
  await dialog.getByRole("option", { name: /^Vital signs/ }).click()
  await expect(page).toHaveURL(/\/docs\/components\/vital-signs$/)
  await expect(dialog).toBeHidden()
  await expect(
    page.getByRole("heading", { name: "Vital signs", level: 1 })
  ).toBeVisible()

  // As on shadcn/ui, phones search from the keyboard shortcut only.
  if (!narrow) {
    await page.getByRole("button", { name: /^Search/ }).click()
    await expect(dialog).toBeVisible()
    await page.keyboard.press("Escape")
  }
  await expect(dialog).toBeHidden()
  expect(indexRequests).toBe(1)

  // The theme toggle switches the document between light and dark.
  const dark = () =>
    page.evaluate(() => document.documentElement.classList.contains("dark"))
  const before = await dark()
  await page.getByRole("button", { name: "Toggle theme" }).click()
  await expect.poll(dark).toBe(!before)
  expect(errors).toEqual([])
})

test("the organs gallery shows every organ as a picture and a link", async ({
  page,
  request,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const organs = registrySchema
    .parse(await (await request.get("/r/registry.json")).json())
    .items.filter(({ categories }) => categories?.includes("organ"))
  await page.goto("/docs/components/organs")
  await expect(
    page.getByRole("heading", { name: "Organs", level: 1 })
  ).toBeVisible()
  const main = page.getByRole("main")
  // One grid, A to Z, with no sections to list beside it.
  await expect(main.getByRole("heading", { level: 2 })).toHaveCount(0)
  await expect(
    page.getByRole("navigation", { name: "On this page" })
  ).toHaveCount(0)
  const titles = organs.map(({ title, name }) => title ?? name)
  await expect(main.getByRole("listitem")).toHaveText(
    [...titles].sort((a, b) => a.localeCompare(b))
  )
  for (const item of organs) {
    const card = main.getByRole("link", {
      name: item.title ?? item.name,
      exact: true,
    })
    await expect(card).toHaveAttribute("href", `/docs/components/${item.name}`)
    // Served through the image optimizer, sized for the grid column.
    await expect(card.locator("img")).toHaveAttribute(
      "src",
      new RegExp(`url=%2Forgans%2F${item.name}\\.webp`)
    )
  }
  const first = main.getByRole("listitem").first().locator("img")
  await first.scrollIntoViewIfNeeded()
  await expect
    .poll(() => first.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0)
  // The pictures keep their models' licences, credited in Licences.
  await expect(
    main.getByRole("link", { name: "Licences", exact: true })
  ).toHaveAttribute("href", "/docs/licences")
  // The gallery is pictures and links: nothing loads in 3D.
  await expect(page.locator("canvas")).toHaveCount(0)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({ path: info.outputPath("organs.png"), fullPage: true })
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
  await page.goto("/docs/components/heart")
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
    tree.getByRole("treeitem", { name: /^Left atrium, / })
  ).toHaveAttribute("aria-selected", "true")
  await viewer.click()
  await expect(
    tree.getByRole("treeitem", { name: /^Right atrium, / })
  ).toHaveAttribute("aria-selected", "true")
  await examples.getByRole("button", { name: "View Code", exact: true }).click()
  await expect(
    examples.getByLabel("Heart With Anatomy Panel code")
  ).toContainText("<Heart")
  await expect(
    page.getByRole("region", { name: "Installation command" })
  ).toHaveText("bunx shadcn@4.22.1 add @organui/heart")
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
    "registry/base-nova/heart/heart.tsx",
  ])
  expect(item.registryDependencies).toEqual(["@organui/organ-viewer"])
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
  await page.goto("/docs/components/heart")
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
    // Charts are blocks too, shown on /charts.
    .items.filter(
      ({ type, categories }) =>
        type === "registry:block" && !categories?.includes("charts")
    )
  expect(blocks.length).toBeGreaterThan(0)
  await page.goto("/docs")
  if ((page.viewportSize()?.width ?? 0) < 768)
    await page.getByRole("button", { name: "Menu", exact: true }).click()
  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Blocks", exact: true })
    .click()
  await expect(page).toHaveURL(/\/blocks$/)
  await expect(
    page.getByRole("heading", { name: "Blocks", level: 1 })
  ).toBeVisible()
  for (const block of blocks) {
    const title = block.title ?? block.name
    const section = page.getByRole("region", { name: title, exact: true })
    await expect(section).toHaveAttribute("id", block.name)
    await expect(
      section.getByRole("button", {
        name: `bunx shadcn@4.22.1 add @organui/${block.name}`,
        exact: true,
      })
    ).toBeVisible()
    // Wide screens frame the page; phones show a picture of it.
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      const preview = section.getByTitle(`${title} preview`)
      await preview.scrollIntoViewIfNeeded()
      await expect(preview.contentFrame().getByRole("main")).toBeVisible()
    } else
      await expect(
        section.getByRole("img", { name: `${title} preview`, exact: true })
      ).toBeVisible()
    const item = registryItemSchema.parse(
      await (await request.get(`/r/${block.name}.json`)).json()
    )
    const installedPage = item.files?.find(
      ({ type }) => type === "registry:page"
    )
    // The code view lists the block's own files and links the items it uses.
    await section.getByRole("tab", { name: "Code", exact: true }).click()
    for (const dependency of item.registryDependencies ?? [])
      if (dependency.startsWith("@organui/"))
        await expect(
          section.getByRole("link", {
            name: dependency.replace("@organui/", ""),
            exact: true,
          })
        ).toHaveAttribute(
          "href",
          `/docs/components/${dependency.replace("@organui/", "")}`
        )
    await section
      .getByRole("button", { name: installedPage?.target ?? "", exact: true })
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
  await page.goto("/docs/components/breast")
  await loaded
  const viewer = page.getByRole("region", { name: "Breast default example" })
  await expect(viewer.getByRole("toolbar")).toBeVisible()
  await expect(viewer.getByRole("alert")).toHaveCount(0)
  await viewer.getByRole("button", { name: "Model credit" }).click()
  await expect(
    page
      .getByRole("dialog", { name: "Model credit" })
      .getByRole("link", { name: "CC BY 4.0", exact: true })
  ).toBeVisible()
  await page.screenshot({ path: info.outputPath("breast.png"), fullPage: true })
  expect(errors).toEqual([])
})

test("vital signs example switches readings and states each status", async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/docs/components/vital-signs")
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
  ).toHaveText("bunx shadcn@4.22.1 add https://organui.com/r/vital-signs.json")
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
  await page.goto("/docs/components/lab-results")
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
  await page.goto("/docs/components/lab-results")
  expect(
    await page.evaluate(() =>
      [
        document.documentElement,
        ...document.querySelectorAll("[data-slot=lab-results] > *"),
      ].every((element) => element.scrollWidth <= element.clientWidth)
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])
  await page.screenshot({
    path: info.outputPath("lab-results.png"),
    fullPage: true,
  })
  const item = registryItemSchema.parse(
    await (await request.get("/r/lab-results.json")).json()
  )
  expect(item.registryDependencies).toEqual([
    "table",
    "@organui/reference-ranges",
  ])
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
  await page.goto("/docs/components/ecg-trace")
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

// Made-up tables in WHO's anthro layout, served in place of WHO's files so the
// test neither fetches nor depends on the real standards.
function anthroTable(median: (day: number) => number, loh = false) {
  const lines = [`sex\tage\tl\tm\ts${loh ? "\tloh" : ""}`]
  for (const sex of [1, 2])
    for (let day = 0; day <= 1856; day++)
      lines.push(
        [
          sex,
          day,
          1,
          median(day),
          0.1,
          ...(loh ? [day < 731 ? "L" : "H"] : []),
        ].join("\t")
      )
  return lines.join("\n")
}

test("the growth chart demo loads its tables and switches measures", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const tables: Record<string, string> = {
    "weianthro.txt": anthroTable((day) => 3.2 + day / 120),
    "lenanthro.txt": anthroTable((day) => 50 + day / 30, true),
    "hcanthro.txt": anthroTable((day) => 34 + day / 150),
  }
  await page.route(
    "https://raw.githubusercontent.com/WorldHealthOrganization/anthro/**",
    (route) => {
      const name = new URL(route.request().url()).pathname.split("/").at(-1)!
      return tables[name]
        ? route.fulfill({
            body: tables[name],
            headers: { "access-control-allow-origin": "*" },
          })
        : route.abort()
    }
  )
  await page.goto("/docs/components/growth-chart")
  await expect(
    page.getByRole("heading", { name: "Growth chart", level: 1 })
  ).toBeVisible()
  const chart = page.getByRole("group", { name: "Weight-for-age, girls" })
  const points = chart.getByRole("img", { name: /^\d+ (months?|years): / })
  await expect(points).toHaveCount(10)
  await page.getByRole("button", { name: "Boys", exact: true }).click()
  await page.getByRole("button", { name: "Head", exact: true }).click()
  await expect(
    page.getByRole("group", { name: "Head circumference-for-age, boys" })
  ).toBeVisible()
  await page.getByRole("button", { name: "Length/height", exact: true }).click()
  await page.getByRole("button", { name: "0–5 years", exact: true }).click()
  const length = page.getByRole("group", {
    name: "Length/height-for-age, boys",
  })
  await length.getByRole("img", { name: /^6 months: 65\.5 cm, / }).focus()
  await expect(
    length.getByRole("img", { name: /^6 months: 65\.5 cm, / })
  ).toBeFocused()
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
    await page.goto(`/docs/components/${name}`)
    await expect(page.locator("html")).toHaveClass(/dark/)
    if (name === "anatomy-tree") {
      const demo = page.locator('[data-example="anatomy-tree-demo"]')
      await demo.getByRole("searchbox").fill("no such structure")
      await expect(demo.getByRole("status").first()).toContainText(
        "No matching anatomy."
      )
      await demo.getByRole("searchbox").fill("")
      // Filtering is deferred. Wait for the tree's tab stop to return before
      // pressing Tab, otherwise a slower render legitimately skips the tree.
      await expect(demo.getByRole("treeitem")).toHaveCount(7)
      await demo.getByRole("searchbox").press("Tab")
      const heart = demo.getByRole("treeitem", { name: /^Heart, / })
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
  await page.goto("/docs/components/anatomy-tree")
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

test("image viewer docs scroll slices, window and read DICOM files", async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.goto("/docs/components/image-viewer")
  // The main demo; the examples below it have their own.
  const demo = page.locator('[data-example="image-viewer-demo"]')
  const state = page.getByRole("status").filter({ hasText: "Slice" })
  await expect(state).toHaveText("Slice 16 of 32 · Window 80 / level 40")
  const stage = page.getByRole("region", { name: "Head phantom" })
  await expect(
    stage.getByRole("img", { name: "Head phantom, slice 16 of 32, Axial 16" })
  ).toBeVisible()
  await stage.focus()
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("End")
  await expect(state).toContainText("Slice 32 of 32")
  const slider = demo.getByRole("slider", { name: "Slice" })
  await slider.focus()
  await page.keyboard.press("Home")
  await expect(state).toContainText("Slice 1 of 32")
  await demo.getByRole("combobox", { name: "Window preset" }).click()
  await page.getByRole("option", { name: "Bone" }).click()
  await expect(state).toContainText("Window 1800 / level 400")
  // Dragging right widens the window and down raises the level.
  const box = (await stage.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(
    box.x + box.width / 2 + 60,
    box.y + box.height / 2 + 20,
    {
      steps: 4,
    }
  )
  await page.mouse.up()
  await expect(
    demo.getByRole("combobox", { name: "Window preset" })
  ).toContainText("Custom")
  const [width, level] = (await state.textContent())!
    .match(/Window (\d+) \/ level (\d+)/)!
    .slice(1)
    .map(Number)
  expect(width).toBeGreaterThan(1800)
  expect(level).toBeGreaterThan(400)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  const axe = await new AxeBuilder({ page }).analyze()
  expect(axe.violations).toEqual([])

  const files = [30, 10, 20].map((z) => ({
    name: `slice-${z}.dcm`,
    mimeType: "application/dicom",
    buffer: Buffer.from(
      dicomFile({
        explicit: true,
        pixels: new Int16Array(16 * 16).fill(1024 + z),
        width: 16,
        height: 16,
        z,
      })
    ),
  }))
  await page.getByLabel("Open DICOM files").setInputFiles(files)
  await expect(state).toHaveText("Slice 2 of 3 · Window 80 / level 40")
  await expect(
    page
      .getByRole("region", { name: "3 DICOM files" })
      .getByRole("img", { name: "3 DICOM files, slice 2 of 3, Head phantom" })
  ).toBeVisible()
  await page.getByLabel("Open DICOM files").setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  })
  // Next.js adds its own route announcer alert.
  await expect(page.getByRole("alert").filter({ hasText: "DICOM" })).toHaveText(
    "This is not a DICOM Part 10 file."
  )
  await page.screenshot({
    path: info.outputPath("image-viewer.png"),
    fullPage: true,
  })
  expect(errors).toEqual([])
})

test("component pages switch library, and each library gets its own build", async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  // A {style} registry URL picks the build for the project's library.
  const base = await (
    await request.get("/r/styles/base-nova/organ-viewer.json")
  ).json()
  const radix = await (
    await request.get("/r/styles/radix-nova/organ-viewer.json")
  ).json()
  expect(base.files[0].content).toContain("render={")
  expect(radix.files[0].content).toContain("asChild")
  expect(radix.files[0].content).not.toContain("render={")

  await page.goto("/docs/components/organ-viewer")
  const library = page.getByRole("group", { name: "Primitive library" })
  const command = page.getByRole("region", { name: "Installation command" })
  await expect(
    library.getByRole("button", { name: "Base UI" })
  ).toHaveAttribute("aria-pressed", "true")
  // The viewer depends on no OrganUI item, so it installs by address.
  await expect(command).toContainText("/r/organ-viewer.json")
  await expect(
    page.getByRole("region", { name: "Registry namespace configuration" })
  ).toHaveCount(0)

  await library.getByRole("button", { name: "Radix UI" }).click()
  await expect(
    page.getByRole("region", { name: "Registry namespace configuration" })
  ).toContainText("/r/styles/{style}/{name}.json")
  await page.getByRole("tab", { name: "Manual" }).click()
  await expect(
    page.getByRole("region", { name: "components/organ-viewer.tsx source" })
  ).toContainText("asChild")
  // Long files start folded.
  const expand = page.getByRole("button", {
    name: "Expand components/organ-viewer.tsx",
  })
  await expect(expand).toHaveAttribute("aria-expanded", "false")
  await expand.click()
  await expect(
    page.getByRole("button", { name: "Collapse components/organ-viewer.tsx" })
  ).toHaveAttribute("aria-expanded", "true")

  // The choice holds on the next component page.
  await page.goto("/docs/components/heart")
  await expect(
    page
      .getByRole("group", { name: "Primitive library" })
      .getByRole("button", { name: "Radix UI" })
  ).toHaveAttribute("aria-pressed", "true")
  expect(errors).toEqual([])
})

test("helper and utility pages show a working example and pass an accessibility scan", async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const helpers = registrySchema
    .parse(await (await request.get("/r/registry.json")).json())
    .items.filter(({ categories }) => categories?.includes("helper"))
  expect(helpers.length).toBeGreaterThan(0)
  const pages = [
    ...helpers.map((item) => ({
      path: `/docs/helpers/${item.name}`,
      title: item.title ?? item.name,
      command: item.name,
    })),
    // The CSS utilities install together, so every page gives one command.
    ...["heartbeat", "ecg-grid", "severity"].map((name) => ({
      path: `/docs/utilities/${name}`,
      title: name,
      command: "utilities",
    })),
  ]
  for (const { path, title, command } of pages) {
    await page.goto(path)
    await expect(
      page.getByRole("heading", { name: title, level: 1 })
    ).toBeVisible()
    await expect(
      page.getByRole("group", { name: `${title} example` })
    ).toBeVisible()
    await expect(
      page.getByRole("region", { name: "Installation command" })
    ).toContainText(command)
    const axe = await new AxeBuilder({ page }).analyze()
    expect(axe.violations).toEqual([])
  }
  // The CSS utilities are compiled into the site, as they are for a project.
  await page.goto("/docs/utilities/heartbeat")
  expect(
    await page
      .locator(".animate-heartbeat")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName)
  ).toBe("heartbeat")
  await page.goto("/docs/helpers/clinical-units")
  const units = page.getByRole("group", { name: "Clinical units example" })
  await units.getByLabel(/^Value/).fill("18")
  // 18 mg/dL of glucose is 1 mmol/L.
  await expect(units.locator("p[aria-live]")).toHaveText(/^1\s+mmol\/L$/)
  expect(errors).toEqual([])
})

test("AI Elements cite sources, mark unsupported claims and record review", async ({
  page,
  request,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const elements = registrySchema
    .parse(await (await request.get("/r/registry.json")).json())
    .items.filter(({ categories }) => categories?.includes("ai"))
  expect(elements.length).toBeGreaterThan(0)
  for (const item of elements) {
    await page.goto(`/docs/ai-elements/${item.name}`)
    await expect(
      page.getByRole("heading", { name: item.title, level: 1 })
    ).toBeVisible()
    await expect(
      page.getByRole("group", { name: `${item.title} example` })
    ).toBeVisible()
    const axe = await new AxeBuilder({ page }).analyze()
    expect(axe.violations).toEqual([])
  }

  await page.goto("/docs/ai-elements")
  const example = page.getByRole("group", {
    name: "A clinical assistant example",
  })
  const note = example.getByRole("article", { name: "AI-drafted note" })
  // A claim without a source says so to screen readers.
  await expect(note.getByText("(no source)").first()).toBeAttached()
  // A citation opens on focus, as shadcn's Inline Citation does. The note
  // cites the troponin result twice.
  await note.getByRole("button", { name: "Troponin" }).first().focus()
  await expect(page.getByText("99th percentile 26 ng/L")).toBeVisible()
  await page.keyboard.press("Escape")
  // The records it used open from one line, as shadcn's Sources do.
  await note.getByRole("button", { name: /Used 4 records/ }).click()
  await expect(note.getByText(/Chest pain pathway/)).toBeVisible()

  await expect(example.getByRole("note")).toContainText("AI-generated draft")
  // Rejecting needs a reason; approving records the reviewer.
  await example.getByRole("button", { name: "Reject" }).click()
  const reason = example.getByRole("textbox", { name: "Reason for rejecting" })
  await expect(reason).toBeFocused()
  await expect(
    example.getByRole("button", { name: "Reject", exact: true })
  ).toBeDisabled()
  await example.getByRole("button", { name: "Cancel" }).click()
  await example.getByRole("button", { name: "Approve" }).click()
  await expect(example).toContainText("Approved by Dr A. Rivera")
  await expect(example.getByRole("note")).toContainText(
    "AI-generated, reviewed"
  )
  await example.getByRole("button", { name: "Undo" }).click()
  await expect(example).toContainText("Awaiting review")
  expect(errors).toEqual([])
})

test("themes redirect to create, which gives the commands", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/themes")
  await expect(page).toHaveURL(/\/create$/)
  const settings = page.getByRole("complementary", { name: "Project settings" })
  await expect(settings).toContainText("--preset b0")
  // Get Code shows the commands for the settings.
  const getCode = page.getByRole("button", { name: "Get Code" })
  await getCode.click()
  const dialog = page.getByRole("dialog", { name: "Create the project" })
  await expect(
    dialog.getByRole("region", { name: "Create the project" })
  ).toContainText("init -t next -b base -p b0")
  await expect(
    dialog.getByRole("region", { name: "Registry namespace" })
  ).toHaveCount(0)
  await page.keyboard.press("Escape")

  await settings.getByRole("combobox", { name: "Library" }).click()
  await page.getByRole("option", { name: "Radix UI" }).click()
  await settings.getByRole("combobox", { name: "Theme" }).click()
  await page.getByRole("option", { name: "Blue" }).click()
  await settings.getByRole("button", { name: /OrganUI items/ }).click()
  await page.getByRole("checkbox", { name: "Lab results table" }).click()
  await page.keyboard.press("Escape")
  await expect(settings).not.toContainText("--preset b0")
  await getCode.click()
  await expect(
    dialog.getByRole("region", { name: "Create the project" })
  ).toContainText("-b radix")
  await expect(
    dialog.getByRole("region", { name: "Registry namespace" })
  ).toContainText("/r/styles/{style}/{name}.json")
  await expect(
    dialog.getByRole("region", { name: "Add OrganUI items" })
  ).toContainText("@organui/vital-signs @organui/lab-results")
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  expect(errors).toEqual([])
})

test("the colours page lists every organ's structure colours to copy", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/colors")
  await expect(
    page.getByRole("heading", { name: "Colours", level: 1 })
  ).toBeVisible()
  const heart = page.getByRole("region", { name: "Heart" })
  await expect(
    heart.getByRole("button", { name: "Copy Right atrium #a96d70" })
  ).toBeVisible()
  await expect(
    page.getByRole("region", { name: "Dermatome regions" }).getByRole("button")
  ).toHaveCount(4)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  expect(errors).toEqual([])
})

test("charts show health data on shadcn's chart, with their code", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/charts")
  await expect(page).toHaveURL(/\/charts\/area$/)
  await expect(
    page.getByRole("heading", { name: "Charts for Health Data", level: 1 })
  ).toBeVisible()
  const types = page.getByRole("navigation", { name: "Chart types" })
  await expect(types.getByRole("link")).toHaveText([
    "Area Charts",
    "Bar Charts",
    "Line Charts",
    "Pie Charts",
    "Radar Charts",
    "Radial Charts",
    "Tooltips",
  ])
  await page
    .getByRole("button", { name: "View code: Admissions area chart" })
    .click()
  await expect(page.getByRole("dialog")).toContainText(
    "export function ChartAreaAdmissions"
  )
  await page.keyboard.press("Escape")
  // Scan once the dialog has faded out.
  await expect(page.getByRole("dialog")).toHaveCount(0)
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  await types.getByRole("link", { name: "Radial Charts" }).click()
  await expect(page).toHaveURL(/\/charts\/radial/)
  await expect(
    page.getByRole("button", { name: "View code: Steps radial chart" })
  ).toBeVisible()
  expect(errors).toEqual([])
})

test("component pages end with examples and an API reference", async ({
  page,
}) => {
  test.setTimeout(120_000)
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  for (const [name, component] of [
    ["anatomy-tree", "AnatomyTree"],
    ["body-map", "BodyMap"],
    ["dermatome-map", "DermatomeMap"],
    ["ecg-trace", "EcgTrace"],
    ["growth-chart", "GrowthChart"],
    ["lab-results", "LabResultsTable"],
    ["medication-schedule", "MedicationSchedule"],
    ["vital-signs", "VitalSigns"],
  ] as const) {
    await page.goto(`/docs/components/${name}`)
    await expect(
      page.getByRole("heading", { name: "Examples", level: 2 })
    ).toBeVisible()
    // Each example has a linkable heading and a live preview.
    expect(
      await page.getByRole("heading", { level: 3 }).count()
    ).toBeGreaterThanOrEqual(2)
    const props = page.getByRole("table", { name: `${component} props` })
    await expect(props).toBeVisible()
    expect(await props.getByRole("row").count()).toBeGreaterThan(2)
  }
  expect(errors).toEqual([])
})

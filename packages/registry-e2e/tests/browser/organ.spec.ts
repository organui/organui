import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed heart component, loading the stand-in GLB written by the consumer
// script: the right atrium is the box in the middle of every fitted view.
test.beforeEach(async ({ page }) => {
  await page.goto("/organ")
  await expect(page.getByRole("group", { name: "View controls" })).toBeVisible()
})

test("picks, views and keyboard rotation report through callbacks", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const selected = page.getByLabel("Selected", { exact: true })
  const view = page.getByLabel("View", { exact: true }).last()
  await expect(selected).toHaveText("none")
  await viewer.click()
  await expect(selected).toHaveText("right-atrium")
  const menu = page.getByRole("combobox", { name: "View" })
  await menu.click()
  await page.getByRole("option", { name: "Posterior" }).click()
  await expect(view).toHaveText("Posterior")
  await expect(menu).toContainText("Posterior")
  await page.getByRole("button", { name: "Left lateral" }).click()
  await expect(view).toHaveText("Left lateral")
  await viewer.focus()
  await page.keyboard.press("ArrowRight")
  await expect(view).toHaveText("custom")
  await expect(menu).toContainText("Custom view")
  const zoomIn = page.getByRole("button", { name: "Zoom in" })
  await zoomIn.hover()
  await expect(page.locator('[data-slot="tooltip-content"]')).toHaveText(
    "Zoom in"
  )
  await zoomIn.click()
  await expect(view).toHaveText("custom")
  await page.getByRole("button", { name: "Reset view" }).click()
  await expect(view).toHaveText("Anterior")
  // The view menu also works from the keyboard.
  await menu.focus()
  await page.keyboard.press("Enter")
  await page.getByRole("option", { name: "Left lateral" }).press("Enter")
  await expect(view).toHaveText("Left lateral")
  await expect(menu).toBeFocused()
  expect(errors).toEqual([])
})

test("hidden structures cannot be picked and the credit links its licence", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await page.getByRole("button", { name: "Hide right atrium" }).click()
  await viewer.click()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("none")
  await viewer.getByRole("button", { name: "Model credit" }).click()
  await expect(
    page
      .getByRole("dialog", { name: "Model credit" })
      .getByRole("link", { name: "CC BY 4.0" })
  ).toHaveAttribute(
    "href",
    "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
  )
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations).toEqual([])
})

test("keyboard selection follows controlled state and excludes hidden structures", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const menu = viewer.getByRole("combobox", { name: "Structure" })
  await menu.focus()
  await page.keyboard.press("Enter")
  await page
    .getByRole("option", { name: "Right atrium", exact: true })
    .press("Enter")
  await expect(menu).toBeFocused()
  await expect(menu).toContainText("Right atrium")
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText(
    "right-atrium"
  )
  // Controlled consumers can supply their own live selection summary.
  await expect(viewer.getByRole("status")).toHaveCount(0)
  await page.getByRole("button", { name: "Announce selection" }).click()
  await expect(viewer.getByRole("status")).toHaveText("Selected: Right atrium")
  await page.getByRole("button", { name: "Hide right atrium" }).click()
  await expect(menu).toContainText("Select structure")
  await expect(viewer.getByRole("status")).toBeEmpty()
  await menu.click()
  await expect(
    page.getByRole("option", { name: "Right atrium", exact: true })
  ).toBeDisabled()
  await page.keyboard.press("Escape")
  await page.getByRole("button", { name: "Select left atrium" }).click()
  await expect(menu).toContainText("Left atrium")
  await page.getByRole("button", { name: "Hide ventricular cavities" }).click()
  await menu.click()
  await expect(
    page.getByRole("option", { name: "Right atrium", exact: true })
  ).toBeEnabled()
  await expect(
    page.getByText("Ventricular cavities", { exact: true })
  ).toHaveCount(0)
  await expect(
    page.getByRole("option", { name: "Right ventricular cavity", exact: true })
  ).toHaveCount(0)
  await page.keyboard.press("Escape")
})

test("secondary clicks and cancelled or returning drags do not select anatomy", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const selected = page.getByLabel("Selected", { exact: true })
  await viewer.click({ button: "right" })
  await expect(selected).toHaveText("none")
  const canvas = viewer.locator("canvas")
  await canvas.evaluate((element) => {
    element.addEventListener("pointerdown", (event) => {
      element.dataset.pointerId = String((event as PointerEvent).pointerId)
    })
  })
  const bounds = (await canvas.boundingBox())!
  const x = bounds.x + bounds.width / 2
  const y = bounds.y + bounds.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 30, y, { steps: 5 })
  await page.mouse.move(x, y, { steps: 5 })
  await page.mouse.up()
  await expect(selected).toHaveText("none")
  await page.mouse.down()
  await canvas.dispatchEvent("pointercancel", {
    pointerId: Number(await canvas.getAttribute("data-pointer-id")),
  })
  await page.mouse.up()
  await expect(selected).toHaveText("none")
})

test("another pointer's movement does not cancel a primary tap", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const canvas = viewer.locator("canvas")
  const bounds = (await canvas.boundingBox())!
  const x = bounds.x + bounds.width / 2
  const y = bounds.y + bounds.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await canvas.dispatchEvent("pointermove", {
    pointerId: 10000,
    pointerType: "touch",
    isPrimary: false,
    clientX: x + 100,
    clientY: y + 100,
    bubbles: false,
  })
  await page.mouse.up()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText(
    "right-atrium"
  )
})

test("uncontrolled selection resets with its source and survives a recreated model object", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const menu = viewer.getByRole("combobox", { name: "Structure" })
  await page.getByRole("button", { name: "Use uncontrolled selection" }).click()
  await expect(menu).toContainText("Left atrium")
  await menu.click()
  await page.getByRole("option", { name: "Right atrium", exact: true }).click()
  await expect(menu).toContainText("Right atrium")
  await expect(viewer.getByRole("status")).toHaveText("Selected: Right atrium")
  for (let change = 0; change < 2; change++) {
    await page.getByRole("button", { name: "Toggle source" }).click()
    await expect(menu).toContainText("Left atrium")
  }
  await page.getByRole("button", { name: "Use custom model" }).click()
  await expect(menu).toContainText("Left atrium receiving")
  await menu.click()
  await page.getByRole("option", { name: "Right atrium", exact: true }).click()
  await expect(menu).toContainText("Right atrium")
  // A copied model object with the same name keeps the reader's selection.
  await page.getByRole("button", { name: "Replace model metadata" }).click()
  await expect(menu).toContainText("Right atrium")
})

test("selection mode stays fixed and explicit undefined remains controlled", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const menu = viewer.getByRole("combobox", { name: "Structure" })
  await page
    .getByRole("button", { name: "Use undefined controlled selection" })
    .click()
  await expect(menu).toContainText("Select structure")
  await menu.click()
  await page.getByRole("option", { name: "Right atrium", exact: true }).click()
  await expect(menu).toContainText("Right atrium")
  await page.getByRole("button", { name: "Clear controlled selection" }).click()
  await expect(menu).toContainText("Select structure")
  await page.getByRole("button", { name: "Toggle selectedId prop" }).click()
  await menu.click()
  await page.getByRole("option", { name: "Right atrium", exact: true }).click()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText(
    "right-atrium"
  )
  await expect(menu).toContainText("Select structure")
  await page.getByRole("button", { name: "Use uncontrolled selection" }).click()
  await expect(menu).toContainText("Left atrium")
  await menu.click()
  await page.getByRole("option", { name: "Right atrium", exact: true }).click()
  await page.getByRole("button", { name: "Toggle selectedId prop" }).click()
  await page.getByRole("button", { name: "Select left atrium" }).click()
  await expect(menu).toContainText("Right atrium")
})

test("selection announcements stay silent while loading or after a load failure", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await page.getByRole("button", { name: "Use uncontrolled selection" }).click()
  await expect(
    viewer.getByRole("combobox", { name: "Structure" })
  ).toContainText("Left atrium")
  let finishRequest!: () => void
  const pending = new Promise<void>((resolve) => {
    finishRequest = resolve
  })
  await page.route("**/heart.glb?source=b", async (route) => {
    await pending
    await route.abort()
  })
  await page.getByRole("button", { name: "Toggle source" }).click()
  try {
    await expect(viewer.getByRole("status")).toHaveCount(1)
    await expect(viewer.getByRole("status")).toContainText("Loading anatomy")
  } finally {
    finishRequest()
  }
  await expect(viewer.getByRole("button", { name: "Try again" })).toBeVisible()
  await expect(viewer.getByRole("status")).toHaveCount(0)
})

test("long structure names wrap in the menu and stay on one line in a narrow trigger", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.getByRole("button", { name: "Use custom model" }).click()
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  const menu = viewer.getByRole("combobox", { name: "Structure" })
  await expect(menu).toContainText("Left atrium receiving")
  await viewer.evaluate((element) => {
    element.style.width = "240px"
  })
  const value = menu.locator('[data-slot="select-value"]')
  await expect(value).toHaveCSS("text-overflow", "ellipsis")
  const lineCount = await value.evaluate((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
    const tops = new Set<number>()
    while (walker.nextNode()) {
      const range = document.createRange()
      range.selectNodeContents(walker.currentNode)
      for (const rect of range.getClientRects()) tops.add(Math.round(rect.top))
    }
    return tops.size
  })
  expect(lineCount).toBe(1)
  expect(
    await value.evaluate((element) => element.scrollWidth > element.clientWidth)
  ).toBe(true)
  await menu.click()
  const option = page.getByRole("option", {
    name: "Left atrium receiving oxygen-rich blood from the pulmonary veins",
    exact: true,
  })
  const layout = await option.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
  }))
  expect(layout.height).toBeGreaterThan(layout.lineHeight * 1.5)
})

test("controls fit a narrow container and do not submit a surrounding form", async ({
  page,
}) => {
  const viewer = page.getByRole("region", { name: "Interactive heart model" })
  await viewer.evaluate((element) => {
    element.style.width = "240px"
    const form = document.createElement("form")
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      form.dataset.submitted = "true"
    })
    element.before(form)
    form.append(element)
  })
  await page.getByRole("button", { name: "Zoom in" }).click()
  await page.getByRole("button", { name: "Zoom out" }).click()
  await page.getByRole("button", { name: "Reset view" }).click()
  await viewer.getByRole("button", { name: "Model credit" }).click()
  await page.keyboard.press("Escape")
  await expect(page.locator("form")).not.toHaveAttribute(
    "data-submitted",
    "true"
  )
  const bounds = (await viewer.boundingBox())!
  for (const control of await viewer.locator("button").all()) {
    const box = (await control.boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(bounds.x)
    expect(box.x + box.width).toBeLessThanOrEqual(bounds.x + bounds.width)
  }
})

import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("treeitem")).toHaveCount(7)
})

test("navigation, expansion and selection are separate from visibility", async ({
  page,
}) => {
  const heart = page.getByRole("treeitem", { name: "Heart", exact: true })
  await page.getByRole("searchbox").focus()
  await page.keyboard.press("Tab")
  await expect(heart).toBeFocused()
  await page.keyboard.press("ArrowDown")
  const left = page.getByRole("treeitem", { name: "Left heart", exact: true })
  await expect(left).toBeFocused()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("none")
  await page.keyboard.press("Enter")
  await expect(left).toHaveAttribute("aria-selected", "true")
  await expect(left).toHaveAttribute("aria-checked", "true")
  await page.keyboard.press("ArrowLeft")
  await expect(page.getByRole("treeitem")).toHaveCount(5)
  await page.keyboard.press("Space")
  await expect(left).toHaveAttribute("aria-checked", "false")
  await expect(heart).toHaveAttribute("aria-checked", "mixed")
  await expect(page.getByLabel("Visibility", { exact: true })).toHaveText(
    '{"la":false,"lv":false}'
  )
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowRight")
  await expect(
    page.getByRole("treeitem", { name: "Left atrium", exact: true })
  ).toBeFocused()
  await page.keyboard.press("End")
  await expect(
    page.getByRole("treeitem", { name: "Right ventricle", exact: true })
  ).toBeFocused()
  await page.keyboard.press("Home")
  await expect(heart).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(
    page.getByRole("button", { name: "Replace data", exact: true })
  ).toBeFocused()
})

test("filtered ancestors affect all leaves and clearing restores collapse", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Collapse Left heart", exact: true })
    .click()
  await page.getByRole("searchbox").fill("VENTRICLE")
  await expect(page.getByRole("treeitem")).toHaveCount(5)
  await expect(
    page.getByRole("button", { name: "Collapse Heart", exact: true })
  ).toBeDisabled()
  await page.getByRole("button", { name: "Hide Heart", exact: true }).click()
  await expect(page.getByLabel("Visibility", { exact: true })).toHaveText(
    '{"la":false,"lv":false,"ra":false,"rv":false}'
  )
  await page
    .getByRole("button", { name: "Left ventricle", exact: true })
    .click()
  await page.getByRole("searchbox").fill("no such structure")
  await expect(
    page.getByRole("status").filter({ hasText: "No matching anatomy." })
  ).toBeVisible()
  await expect(page.getByLabel("Selected", { exact: true })).toHaveText("lv")
  await page.getByRole("searchbox").fill("")
  await expect(page.getByRole("treeitem")).toHaveCount(5)
  await expect(
    page.getByRole("treeitem", { name: "Left heart", exact: true })
  ).toHaveAttribute("aria-expanded", "false")
})

test("data replacement recovers focus and new leaves default visible", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Hide Left atrium", exact: true })
    .click()
  await page
    .getByRole("button", { name: "Schedule replacement", exact: true })
    .click()
  await page.getByRole("treeitem", { name: "Left atrium", exact: true }).focus()
  await expect(page.getByRole("treeitem")).toHaveCount(2)
  await expect(
    page.getByRole("treeitem", { name: "Heart", exact: true })
  ).toBeFocused()
  await expect(
    page.getByRole("treeitem", { name: "New structure", exact: true })
  ).toHaveAttribute("aria-checked", "true")
  await page
    .getByRole("button", { name: "Hide New structure", exact: true })
    .click()
  await expect(page.getByLabel("Visibility", { exact: true })).toHaveText(
    '{"new":false}'
  )
  await page.getByRole("button", { name: "Empty data", exact: true }).click()
  await expect(page.getByRole("treeitem")).toHaveCount(0)
  await expect(page.getByText("No anatomy available.")).toBeVisible()
})

test("theme preserved, no runtime errors or horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.reload()
  await page.getByRole("button", { name: "Hide Heart", exact: true }).click()
  expect(errors).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true)
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(244, 247, 251)"
  )
})

test("Right does not move into a sibling when search excludes children", async ({
  page,
}) => {
  await page.getByRole("searchbox").fill("heart")
  const left = page.getByRole("treeitem", { name: "Left heart", exact: true })
  await left.focus()
  await page.keyboard.press("ArrowRight")
  await expect(left).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(
    page.getByRole("treeitem", { name: "Heart", exact: true })
  ).toBeFocused()
})

test("empty updates restore search focus and arbitrary IDs retain visibility", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Schedule empty", exact: true })
    .click()
  await page
    .getByRole("treeitem", { name: "Right atrium", exact: true })
    .focus()
  await expect(page.getByRole("searchbox")).toBeFocused()
  await page.getByRole("button", { name: "Special IDs", exact: true }).click()
  await page
    .getByRole("button", { name: "Hide Special ID", exact: true })
    .click()
  await expect(page.getByLabel("Visibility", { exact: true })).toHaveText(
    '{"__proto__":false}'
  )
  await expect(
    page.getByRole("treeitem", { name: "Special ID", exact: true })
  ).toHaveAttribute("aria-checked", "false")
})

test("accessibility scan covers expanded, mixed and filtered states", async ({
  page,
}, info) => {
  await page.goto("/")
  for (const state of ["expanded", "mixed", "filtered"]) {
    if (state === "mixed")
      await page
        .getByRole("button", { name: "Hide Left atrium", exact: true })
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

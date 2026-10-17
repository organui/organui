import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

// Installed molecule viewer and DNA helix. The molecule viewer loads the
// crambin sample the consumer script copies from the docs site.
test.beforeEach(async ({ page }) => {
  await page.goto("/molecule")
  await expect(
    page.getByRole("button", { name: "Thr 1 · chain A" })
  ).toBeVisible()
})

test("residues are picked on the stage and in the sequence", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const viewer = page.getByRole("region", {
    name: "Interactive molecular structure",
  })
  const residue = page.getByLabel("Residue", { exact: true })
  await expect(residue).toHaveText("none")
  await expect(viewer.getByRole("link", { name: "PDB 1CRN" })).toHaveAttribute(
    "href",
    "https://www.rcsb.org/structure/1CRN"
  )
  // Spacefill fills the middle of the stage, so a click there hits an atom.
  await viewer.getByRole("combobox", { name: "Style" }).click()
  await page.getByRole("option", { name: "Spacefill" }).click()
  await expect(viewer.getByRole("combobox", { name: "Style" })).toContainText(
    "Spacefill"
  )
  await viewer.click()
  await expect(residue).toHaveText(/^A:\d+$/)

  const sequence = page.getByRole("toolbar", { name: "Sequence" })
  await sequence.getByRole("button", { name: "Thr 1 · chain A" }).click()
  await expect(residue).toHaveText("A:1")
  await expect(viewer).toContainText("Thr 1 · chain A · sheet")
  // The sequence is one tab stop moved with the arrow keys.
  await page.keyboard.press("ArrowRight")
  const second = sequence.getByRole("button", { name: "Thr 2 · chain A" })
  await expect(second).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(residue).toHaveText("A:2")
  await expect(second).toHaveAttribute("aria-pressed", "true")
  await page.keyboard.press("End")
  await expect(
    sequence.getByRole("button", { name: "Asn 46 · chain A" })
  ).toBeFocused()

  // Selection set by the app shows in the sequence.
  await page.getByRole("button", { name: "Select Cys 3" }).click()
  await expect(
    sequence.getByRole("button", { name: "Cys 3 · chain A" })
  ).toHaveAttribute("aria-pressed", "true")

  await viewer.getByRole("combobox", { name: "Colour" }).click()
  await page.getByRole("option", { name: "Chain" }).click()
  await expect(viewer.getByRole("combobox", { name: "Colour" })).toContainText(
    "Chain"
  )
  await viewer.focus()
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("+")
  expect(errors).toEqual([])
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations).toEqual([])
})

test("base pairs are picked on the helix and in the strands", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  const helix = page.getByRole("region", {
    name: "Interactive DNA double helix",
  })
  const pair = page.getByLabel("Pair", { exact: true })
  await expect(helix).toContainText("4 base pairs")
  await expect(helix.getByRole("button", { name: /rotation/ })).toHaveCount(0)
  const strands = page.getByRole("toolbar", { name: "Base pairs" })
  await strands.getByRole("button", { name: "Pair 3: G–C" }).click()
  await expect(pair).toHaveText("2")
  await expect(helix).toContainText(
    "Pair 3 of 4 · Guanine–cytosine · 3 hydrogen bonds"
  )
  await page.keyboard.press("ArrowLeft")
  await page.keyboard.press("Enter")
  await expect(pair).toHaveText("1")

  // Some point in the middle of the stage lands on a base or phosphate.
  const box = (await helix.boundingBox())!
  search: for (const y of [0.5, 0.45, 0.55, 0.4, 0.6])
    for (let x = 0.3; x <= 0.7; x += 0.02) {
      await page.mouse.click(box.x + box.width * x, box.y + box.height * y)
      if ((await pair.textContent()) !== "1") break search
    }
  await expect(pair).not.toHaveText("1")
  expect(errors).toEqual([])
})

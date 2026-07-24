import { readFile } from "node:fs/promises"

const registry = JSON.parse(await readFile(new URL("../registry.json", import.meta.url)))
const errors = []
const names = new Set()

for (const item of registry.items ?? []) {
  if (names.has(item.name)) errors.push(`${item.name}: duplicate item name`)
  names.add(item.name)

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name)) {
    errors.push(`${item.name}: name must use kebab-case`)
  }

  for (const key of ["title", "description"]) {
    if (!item[key]?.trim()) errors.push(`${item.name}: missing ${key}`)
  }

  if (!item.files?.length) errors.push(`${item.name}: must declare source files`)
  if (!item.categories?.length) errors.push(`${item.name}: must declare categories`)

  const standards = item.meta?.organui
  if (!standards?.accessibility?.trim()) errors.push(`${item.name}: missing accessibility guidance`)
  if (!standards?.safety?.trim()) errors.push(`${item.name}: missing safety guidance`)
  if (!standards?.states?.length) errors.push(`${item.name}: missing supported states`)
}

if (errors.length) {
  console.error(`OrganUI registry metadata failed:\n- ${errors.join("\n- ")}`)
  process.exit(1)
}

console.log(`OrganUI metadata valid for ${registry.items.length} items.`)

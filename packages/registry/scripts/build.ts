import { registrySchema, registryItemSchema } from "shadcn/schema"
import { access, readdir, readFile, rm, writeFile } from "node:fs/promises"
import packageJson from "../package.json"
const output = new URL("../dist/", import.meta.url)
// shadcn build does not clear its output, so removed items would linger.
await rm(output, { recursive: true, force: true })
// The range of radix-ui the Radix build installs, as the Radix consumer tests.
const radixUi = `radix-ui@^${packageJson.devDependencies["radix-ui"]}`
// Items that use Base UI's API say so in their docs; the Radix copies don't.
const baseOnly =
  " Built for shadcn's Base UI styles; Radix projects get the Radix version through a {style} registry URL (https://organui.com/docs/base-ui#radix)."
async function shadcn(args: string[], cwd: URL) {
  const command = Bun.spawn(["shadcn", ...args], {
    cwd: cwd.pathname,
    stdio: ["ignore", "inherit", "inherit"],
  })
  if ((await command.exited) !== 0)
    throw new Error(`shadcn ${args.join(" ")} failed`)
}
// The repository root registry.json includes this one, so GitHub addresses
// such as organui/organui/anatomy-tree resolve the same items.
await shadcn(
  ["registry", "validate", "registry.json"],
  new URL("../../../", import.meta.url)
)
const root = new URL("../", import.meta.url)
await shadcn(["build", "registry.json", "--output", "dist"], root)

// The Radix registry is the same items, with the files that use Base UI's
// own API swapped for their copies in registry/radix-nova. The site serves it
// at /r/styles/radix-*/, which a {style} registry URL resolves to.
const source = registrySchema.parse(
  JSON.parse(await readFile(new URL("registry.json", root), "utf8"))
)
const exists = (path: string) =>
  access(new URL(path, root)).then(
    () => true,
    () => false
  )
const radixSource = {
  ...source,
  items: await Promise.all(
    source.items.map(async (item) => ({
      ...item,
      // shadcn's components don't list their primitives, so items do: the
      // Radix build swaps Base UI for the radix-ui package.
      dependencies: item.dependencies?.map((dependency) =>
        dependency.startsWith("@base-ui/react@") ? radixUi : dependency
      ),
      docs: item.docs?.replace(baseOnly, ""),
      files: await Promise.all(
        (item.files ?? []).map(async (file) => {
          const radix = file.path.replace(
            "registry/base-nova/",
            "registry/radix-nova/"
          )
          return (await exists(radix)) ? { ...file, path: radix } : file
        })
      ),
    }))
  ),
}
const radixRegistry = new URL(".radix-registry.json", root)
await writeFile(radixRegistry, JSON.stringify(radixSource, null, 2))
try {
  await shadcn(
    ["build", ".radix-registry.json", "--output", "dist/radix"],
    root
  )
} finally {
  await rm(radixRegistry)
}

for (const directory of [output, new URL("radix/", output)]) {
  const registry = registrySchema.parse(
    JSON.parse(await readFile(new URL("registry.json", directory), "utf8"))
  )
  const expected = [
    "registry.json",
    ...registry.items.map((item) => `${item.name}.json`),
    ...(directory === output ? ["radix"] : []),
  ]
  const written = await readdir(directory)
  if (written.sort().join() !== expected.sort().join())
    throw new Error(`Unexpected registry output: ${written.join(", ")}`)
  for (const { name } of registry.items) {
    const item = registryItemSchema.parse(
      JSON.parse(await readFile(new URL(`${name}.json`, directory), "utf8"))
    )
    for (const file of item.files ?? []) {
      if (!file.content) throw new Error(`${name}: ${file.path} has no content`)
      if (file.content.includes("@workspace/"))
        throw new Error(`${name}: private workspace import in ${file.path}`)
      if (directory !== output && file.content.includes("@base-ui/react"))
        throw new Error(`${name}: Base UI import in the Radix ${file.path}`)
    }
  }
}

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import catalog from "@workspace/registry/registry.json"

// Install through the GitHub source-registry path, independently of HTTP JSON.
// CI pins the PR commit; local runs without a ref smoke-test the default branch.
export async function githubConsumer(directory: string, cli: string) {
  await rm(directory, { recursive: true, force: true })
  await mkdir(resolve(directory, "src"), { recursive: true })
  const put = (path: string, value: unknown) =>
    writeFile(
      resolve(directory, path),
      typeof value === "string" ? value : JSON.stringify(value, null, 2)
    )
  async function run(command: string[]) {
    const child = Bun.spawn(command, {
      cwd: directory,
      stdio: ["ignore", "inherit", "inherit"],
    })
    if ((await child.exited) !== 0)
      throw new Error(`GitHub consumer: ${command.join(" ")} failed`)
  }
  await put("package.json", {
    name: "organui-github-consumer",
    private: true,
    type: "module",
    dependencies: {
      react: "19.2.4",
      "react-dom": "19.2.4",
      "lucide-react": "1.47.0",
      tailwindcss: "4.2.2",
    },
    devDependencies: {
      typescript: "5.9.3",
      "@types/react": "19.2.14",
      "@types/react-dom": "19.2.3",
    },
  })
  await put("components.json", {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "base-nova",
    rsc: true,
    tsx: true,
    iconLibrary: "lucide",
    // Organs reach the viewer through @organui/organ-viewer. shadcn does not
    // pass a #ref on to dependencies, so it comes from the published site.
    registries: { "@organui": "https://organui.com/r/{name}.json" },
    tailwind: {
      config: "",
      css: "src/globals.css",
      baseColor: "neutral",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      lib: "@/lib",
      utils: "@/lib/utils",
      hooks: "@/hooks",
    },
  })
  await put("tsconfig.json", {
    compilerOptions: {
      target: "ES2022",
      lib: ["DOM", "ES2022"],
      module: "ESNext",
      moduleResolution: "Bundler",
      jsx: "react-jsx",
      strict: true,
      skipLibCheck: true,
      noEmit: true,
      esModuleInterop: true,
      paths: { "@/*": ["./src/*"] },
    },
    include: ["src"],
  })
  const css = '@import "tailwindcss";\n'
  await put("src/globals.css", css)
  const ref = process.env.REGISTRY_GITHUB_REF
  if (ref && !/^[0-9a-f]{40}$/.test(ref))
    throw new Error("REGISTRY_GITHUB_REF must be a full commit SHA")
  const organs = catalog.items.filter(
    (item) => "categories" in item && item.categories?.includes("organ")
  )
  if (ref)
    await put(
      "src/all-organs.tsx",
      organs
        .map(({ name }) => {
          const component = name
            .split("-")
            .map((word) => word[0]!.toUpperCase() + word.slice(1))
            .join("")
          return `import { ${component}, type ${component}Props } from "@/components/${name}"\nexport function ${component}Demo(props: ${component}Props) { return <${component} {...props} /> }`
        })
        .join("\n")
    )
  await put(
    "src/smoke.tsx",
    `import { AnatomyTree } from "@/components/ui/anatomy-tree"
import { Heart } from "@/components/heart"
export function Smoke() {
  return <><AnatomyTree data={[{id:"heart",label:"Heart"}]} selectedId={null} onSelectionChange={()=>{}} visibility={{}} onVisibilityChange={()=>{}}/><Heart /></>
}`
  )
  await run(["bun", "install"])
  await run([
    "node",
    cli,
    "add",
    ...[
      "anatomy-tree",
      ...(ref ? organs.map(({ name }) => name) : ["heart"]),
    ].map((name) => `organui/organui/${name}${ref ? `#${ref}` : ""}`),
    "--yes",
  ])
  // These imports force the root registry include and the organ's viewer
  // dependency to resolve through the CLI. Compile the actual installed sources.
  for (const name of ["ui/anatomy-tree", "heart", "organ-viewer"])
    await readFile(resolve(directory, `src/components/${name}.tsx`), "utf8")
  for (const entry of await readdir(resolve(directory, "src"), {
    recursive: true,
  })) {
    if (!entry.endsWith(".tsx")) continue
    const source = await readFile(resolve(directory, "src", entry), "utf8")
    if (source.includes("@workspace/"))
      throw new Error(`GitHub consumer: private import in ${entry}`)
  }
  if ((await readFile(resolve(directory, "src/globals.css"), "utf8")) !== css)
    throw new Error("GitHub consumer theme modified")
  await run(["bun", "run", "--bun", "tsc", "--noEmit"])
}

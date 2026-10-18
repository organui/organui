import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

// This deliberately installs the published GitHub source, not the local HTTP
// build. The Next/Vite consumers above test the current working tree.
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
    "organui/organui/anatomy-tree",
    "organui/organui/heart",
    "--yes",
  ])
  // These imports force the root registry include and the shared organ file
  // to resolve through the CLI. Compile the actual installed sources.
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

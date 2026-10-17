import { mkdir, writeFile, readFile, rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { heartModel } from "@workspace/registry/organ-viewer/heart"
import { fixtureGlb } from "./fixture-glb.js"
const out = resolve(import.meta.dirname, "../.consumers")
const shadcn = resolve(
  import.meta.dirname,
  "../node_modules/shadcn/dist/index.js"
)
const registry = dirname(
  fileURLToPath(import.meta.resolve("@workspace/registry/dist/registry.json"))
)
const server = Bun.serve({
  port: 0,
  hostname: "127.0.0.1",
  fetch(request) {
    const name = new URL(request.url).pathname.split("/").at(-1) ?? ""
    const file = Bun.file(resolve(registry, name))
    if (!/^[a-z-]+\.json$/.test(name))
      return new Response(null, { status: 404 })
    return file
      .exists()
      .then((found) =>
        found ? new Response(file) : new Response(null, { status: 404 })
      )
  },
})
async function run(command: string[], cwd: string) {
  const process = Bun.spawn(command, {
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  })
  if (await process.exited) throw new Error(`${command.join(" ")} failed`)
}
async function put(directory: string, path: string, value: unknown) {
  const target = resolve(directory, path)
  await mkdir(resolve(target, ".."), { recursive: true })
  await writeFile(
    target,
    typeof value === "string" ? value : JSON.stringify(value, null, 2)
  )
}
const harness = `"use client"
import { useState } from "react"
import { AnatomyTree, type AnatomyNode } from "@/components/ui/anatomy-tree"
const original: AnatomyNode[] = [{id:"heart",label:"Heart",children:[{id:"left",label:"Left heart",children:[{id:"la",label:"Left atrium"},{id:"lv",label:"Left ventricle"}]},{id:"right",label:"Right heart",children:[{id:"ra",label:"Right atrium"},{id:"rv",label:"Right ventricle"}]}]}]
export default function Harness(){
 const [data,setData]=useState(original)
 const [selectedId,select]=useState<string|null>(null)
 const [visibility,show]=useState<Record<string,boolean>>({})
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed anatomy tree</h1><AnatomyTree data={data} selectedId={selectedId} onSelectionChange={select} visibility={visibility} onVisibilityChange={show} defaultExpandedIds={["heart","left","right"]}/><output aria-label="Selected">{selectedId??"none"}</output><canvas role="img" aria-label="Viewer" width={240} height={40} onClick={()=>select("rv")}/><output aria-label="Visibility">{JSON.stringify(visibility)}</output><button onClick={()=>setData([{id:"heart",label:"Heart",children:[{id:"new",label:"New structure"}]}])}>Replace data</button><button onClick={()=>setData([])}>Empty data</button><button onClick={()=>setTimeout(()=>setData([{id:"heart",label:"Heart",children:[{id:"new",label:"New structure"}]}]),500)}>Schedule replacement</button><button onClick={()=>setTimeout(()=>setData([]),500)}>Schedule empty</button><button onClick={()=>setData([{id:"__proto__",label:"Special ID"}])}>Special IDs</button><button onClick={()=>setData([{id:"chambers",label:"Chambers",selectable:false,children:[{id:"la",label:"Left atrium",color:"rgb(183, 124, 118)"},{id:"lv",label:"Left ventricle"}]}])}>Grouped data</button></main>
}`
// The organ harness loads a local stand-in GLB instead of the real model.
const organHarness = `"use client"
import { useRef, useState } from "react"
import { Heart } from "@/components/heart"
import type { OrganViewerHandle } from "@/components/organ-viewer"
export default function OrganHarness(){
 const viewer=useRef<OrganViewerHandle>(null)
 const [selectedId,select]=useState<string|null>(null)
 const [view,setView]=useState<string|null>("Anterior")
 const [visibility,show]=useState<Record<string,boolean>>({})
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed heart</h1><Heart ref={viewer} src="/heart.glb" selectedId={selectedId} onSelectionChange={select} onViewChange={setView} visibility={visibility}/><output aria-label="Selected">{selectedId??"none"}</output><output aria-label="View">{view??"custom"}</output><button onClick={()=>select("left-atrium")}>Select left atrium</button><button onClick={()=>show({"right-atrium":false})}>Hide right atrium</button><button onClick={()=>viewer.current?.setView("Left lateral")}>Left lateral</button></main>
}`
// Deliberately use distinct theme values to detect accidental theme overwrites.
const css = `@import "tailwindcss";
@theme inline { --color-background:var(--background);--color-foreground:var(--foreground);--color-muted:var(--muted);--color-muted-foreground:var(--muted-foreground);--color-accent:var(--accent);--color-border:var(--border);--color-ring:var(--ring); }
:root{--background:#f4f7fb;--foreground:#142d45;--muted:#e5edf4;--muted-foreground:#48627a;--accent:#d7e8f5;--border:#94a9ba;--ring:#225d9b;}body{background:var(--background);color:var(--foreground);font-family:system-ui;}button{cursor:pointer;}`
try {
  for (const framework of ["next", "vite"]) {
    const dir = resolve(out, framework)
    await rm(dir, { recursive: true, force: true })
    await mkdir(dir, { recursive: true })
    const dependencies = {
      react: "19.2.4",
      "react-dom": "19.2.4",
      tailwindcss: "4.2.2",
      "@tailwindcss/postcss": "4.2.2",
      ...(framework === "next" ? { next: "16.3.3" } : { vite: "7.3.1" }),
    }
    await put(dir, "package.json", {
      name: `anatomy-consumer-${framework}`,
      private: true,
      type: "module",
      scripts: {
        build:
          framework === "next" ? "next build" : "tsc --noEmit && vite build",
        start:
          framework === "next"
            ? "next start --port 4318"
            : "vite preview --host 127.0.0.1 --port 4319 --strictPort",
      },
      dependencies,
      devDependencies: {
        typescript: "5.9.3",
        "@types/react": "19.2.14",
        "@types/react-dom": "19.2.3",
        "@types/node": "22.19.15",
      },
    })
    await put(dir, "tsconfig.json", {
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
        allowJs: true,
        resolveJsonModule: true,
        paths: { "@/*": ["./src/*"] },
        ...(framework === "next" ? { plugins: [{ name: "next" }] } : {}),
      },
      include: ["src", "next-env.d.ts", ".next/types/**/*.ts"],
    })
    await put(dir, "components.json", {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "base-nova",
      rsc: framework === "next",
      tsx: true,
      tailwind: {
        config: "",
        css: "src/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      iconLibrary: "lucide",
      registries: {
        "@organui": `http://127.0.0.1:${server.port}/{name}.json`,
      },
      aliases: {
        components: "@/components",
        ui: "@/components/ui",
        utils: "@/lib/utils",
        lib: "@/lib",
        hooks: "@/hooks",
      },
    })
    await put(dir, "src/globals.css", css)
    await put(
      dir,
      "postcss.config.mjs",
      "export default {plugins:{'@tailwindcss/postcss':{}}}"
    )
    await put(dir, "src/harness.tsx", harness)
    await put(dir, "src/organ-harness.tsx", organHarness)
    await mkdir(resolve(dir, "public"), { recursive: true })
    await writeFile(
      resolve(dir, "public/heart.glb"),
      fixtureGlb(heartModel.structures.map(({ id }) => id))
    )
    if (framework === "next") {
      await put(dir, "src/app/page.tsx", 'export {default} from "../harness"')
      await put(
        dir,
        "src/app/organ/page.tsx",
        'export {default} from "../../organ-harness"'
      )
      await put(
        dir,
        "src/app/layout.tsx",
        'import "../globals.css"; export const metadata = {title:"Anatomy tree consumer"}; export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}'
      )
      await put(dir, "next.config.mjs", "export default {}")
    } else {
      await put(
        dir,
        "index.html",
        '<html lang="en"><head><title>Consumer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>'
      )
      await put(
        dir,
        "src/main.tsx",
        'import React from "react";import {createRoot} from "react-dom/client";import Harness from "./harness";import OrganHarness from "./organ-harness";import "./globals.css";createRoot(document.getElementById("root")!).render(location.pathname==="/organ"?<OrganHarness/>:<Harness/>);'
      )
      await put(
        dir,
        "vite.config.ts",
        'import {defineConfig} from "vite";import {fileURLToPath} from "node:url";export default defineConfig({resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}},esbuild:{jsx:"automatic"}})'
      )
    }
    await run(["bun", "install"], dir)
    await run(
      [
        "node",
        shadcn,
        "add",
        // Vite exercises the documented namespace; Next installs by URL.
        framework === "vite"
          ? "@organui/anatomy-tree"
          : `http://127.0.0.1:${server.port}/anatomy-tree.json`,
        "--yes",
      ],
      dir
    )
    await run(
      [
        "node",
        shadcn,
        "add",
        framework === "vite"
          ? "@organui/heart"
          : `http://127.0.0.1:${server.port}/heart.json`,
        "--yes",
      ],
      dir
    )
    const viewer = await readFile(
      resolve(dir, "src/components/organ-viewer.tsx"),
      "utf8"
    )
    if (
      viewer.includes("@workspace/") ||
      (framework === "next" && !viewer.includes('"use client"'))
    )
      throw new Error("Invalid installed organ viewer")
    const installed = await readFile(
      resolve(dir, "src/components/ui/anatomy-tree.tsx"),
      "utf8"
    )
    if (
      installed.includes("@workspace/") ||
      (framework === "next" && !installed.includes('"use client"'))
    )
      throw new Error("Invalid installed source")
    if ((await readFile(resolve(dir, "src/globals.css"), "utf8")) !== css)
      throw new Error("Consumer theme modified")
    await run(["bun", "run", "build"], dir)
  }
} finally {
  server.stop()
}

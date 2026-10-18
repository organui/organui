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
    if (!/^[a-z0-9-]+\.json$/.test(name))
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
// No client directive: the panel has no state, so Next.js renders it on the server.
const vitalsHarness = `import { VitalSigns } from "@/components/ui/vital-signs"
export default function VitalsHarness(){
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed vital signs</h1><VitalSigns readings={{heartRate:112,systolic:150,diastolic:76,spo2:null,temperature:38.6}} description="Example readings"/><VitalSigns title="Fahrenheit" temperatureUnit="fahrenheit" ranges={{spo2:{low:88,high:92}}} vitals={["temperature","spo2","respiratoryRate"]} readings={{temperature:98.6,spo2:90,respiratoryRate:8}}/></main>
}`
// Lab results hold no state, so the Next.js page renders them on the server.
const labHarness = `import { LabResultsTable } from "@/components/lab-results"
export default function LabHarness(){
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed lab results</h1><LabResultsTable caption="Electrolytes" results={[{id:"k",name:"Potassium",value:6.4,unit:"mmol/L",decimals:1,referenceRange:{low:3.5,high:5.1,criticalHigh:6},history:[{value:4.2,date:"2026-01-12"},{value:6.4,date:"2026-10-01"}]},{id:"na",name:"Sodium",value:140,unit:"mmol/L",referenceRange:{low:135,high:145}}]}/></main>
}`
const medicationHarness = `"use client"
import { useState } from "react"
import { MedicationSchedule, type DoseStatus } from "@/components/ui/medication-schedule"
const medications=[{id:"levo",name:"Levothyroxine",dose:"75 mcg",times:["07:00"]},{id:"calcium",name:"Calcium",times:["08:00","20:00"]},{id:"weekly",name:"Weekly tablet",times:["12:00"],days:[1]}]
const interactions=[{id:"levo-calcium",medicationIds:["levo","calcium"],severity:"moderate" as const,summary:"Calcium reduces absorption.",separationHours:4},{id:"weekly-levo",medicationIds:["weekly","levo"],severity:"major" as const,summary:"Example warning."}]
export default function MedicationHarness(){
 const [date,setDate]=useState("2026-10-19")
 const [doseStatus,setDoseStatus]=useState<Record<string,DoseStatus>>({})
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed medication schedule</h1><MedicationSchedule medications={medications} interactions={interactions} date={date} onDateChange={setDate} doseStatus={doseStatus} onDoseStatusChange={setDoseStatus} now="09:30"/><output aria-label="Date">{date}</output><output aria-label="Dose status">{JSON.stringify(doseStatus)}</output></main>
}`
// The molecule harness loads the docs site's crambin sample from its own origin.
const moleculeHarness = `"use client"
import { useState } from "react"
import { MoleculeViewer } from "@/components/molecule-viewer"
import { DnaHelix } from "@/components/dna-helix"
export default function MoleculeHarness(){
 const [residue,setResidue]=useState<string|null>(null)
 const [pair,setPair]=useState<number|null>(null)
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed molecules</h1><MoleculeViewer src="/crambin.pdb" selectedId={residue} onSelectionChange={setResidue}/><output aria-label="Residue">{residue??"none"}</output><button onClick={()=>setResidue("A:3")}>Select Cys 3</button><DnaHelix sequence="ATGC" selectedIndex={pair} onSelectionChange={setPair} autoRotate={false}/><output aria-label="Pair">{pair??"none"}</output></main>
}`
// Vite has no file routing, so the CLI skips block pages there; these stand in
// for them. Next.js serves the installed pages at the same paths.
const blockHarness = `import { OrganExplorer } from "@/components/organ-explorer"
import { AnatomyWorkspace } from "@/components/anatomy-workspace"
import { OrganSwitcher } from "@/components/organ-switcher"
import { heartModel } from "@/components/heart"
import { kidneysModel } from "@/components/kidneys"
import { pancreasModel } from "@/components/pancreas"
import { stomachModel } from "@/components/stomach"
export default function BlockHarness({path}:{path:string}){
 if(path==="/workspace")return <AnatomyWorkspace model={heartModel}/>
 return <main style={{padding:24}}><h1>{path==="/organs"?"Organs":"Heart"}</h1>{path==="/organs"?<OrganSwitcher models={[heartModel,kidneysModel,stomachModel,pancreasModel]}/>:<OrganExplorer model={heartModel}/>}</main>
}`
const blocks = ["explorer-01", "explorer-02", "explorer-03"]
const pages = ["explorer", "workspace", "organs"]
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
      // shadcn init installs the configured icon library, which shadcn's own
      // components (such as select) import.
      "lucide-react": "1.47.0",
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
    await put(dir, "src/vitals-harness.tsx", vitalsHarness)
    await put(dir, "src/lab-harness.tsx", labHarness)
    await put(dir, "src/molecule-harness.tsx", moleculeHarness)
    await put(dir, "src/medication-harness.tsx", medicationHarness)
    await mkdir(resolve(dir, "public"), { recursive: true })
    await writeFile(
      resolve(dir, "public/heart.glb"),
      fixtureGlb(heartModel.structures.map(({ id }) => id))
    )
    await writeFile(
      resolve(dir, "public/crambin.pdb"),
      await readFile(
        fileURLToPath(import.meta.resolve("web/public/models/crambin.pdb"))
      )
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
        "src/app/vitals/page.tsx",
        'export {default} from "../../vitals-harness"'
      )
      await put(
        dir,
        "src/app/lab/page.tsx",
        'export {default} from "../../lab-harness"'
      )
      await put(
        dir,
        "src/app/molecule/page.tsx",
        'export {default} from "../../molecule-harness"'
      )
      await put(
        dir,
        "src/app/medication/page.tsx",
        'export {default} from "../../medication-harness"'
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
        'import React from "react";import {createRoot} from "react-dom/client";import Harness from "./harness";import OrganHarness from "./organ-harness";import MoleculeHarness from "./molecule-harness";import BlockHarness from "./block-harness";import LabHarness from "./lab-harness";import MedicationHarness from "./medication-harness";import VitalsHarness from "./vitals-harness";import "./globals.css";const path=location.pathname;createRoot(document.getElementById("root")!).render(path==="/organ"?<OrganHarness/>:path==="/molecule"?<MoleculeHarness/>:path==="/lab"?<LabHarness/>:path==="/medication"?<MedicationHarness/>:path==="/vitals"?<VitalsHarness/>:["/explorer","/workspace","/organs"].includes(path)?<BlockHarness path={path}/>:<Harness/>);'
      )
      await put(dir, "src/block-harness.tsx", blockHarness)
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
    await run(
      [
        "node",
        shadcn,
        "add",
        framework === "vite"
          ? "@organui/lab-results"
          : `http://127.0.0.1:${server.port}/lab-results.json`,
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
          ? "@organui/medication-schedule"
          : `http://127.0.0.1:${server.port}/medication-schedule.json`,
        "--yes",
      ],
      dir
    )
    // These share shadcn components installed above; see the note on blocks
    // below for why Vite overwrites.
    for (const item of ["molecule-viewer", "dna-helix", "vital-signs"])
      await run(
        [
          "node",
          shadcn,
          "add",
          ...(framework === "vite"
            ? [`@organui/${item}`, "--overwrite"]
            : [`http://127.0.0.1:${server.port}/${item}.json`]),
          "--yes",
        ],
        dir
      )
    // Blocks reuse the files installed above. Without RSC, shadcn 4.21 strips
    // "use client" from every other file it writes (a global regex keeps its
    // lastIndex), so a reinstall differs and prompts; overwrite instead.
    for (const block of blocks)
      await run(
        [
          "node",
          shadcn,
          "add",
          ...(framework === "vite"
            ? [`@organui/${block}`, "--overwrite"]
            : [`http://127.0.0.1:${server.port}/${block}.json`]),
          "--yes",
        ],
        dir
      )
    // Pages install only where the framework has file routing.
    for (const page of pages) {
      const installed = await Bun.file(
        resolve(dir, `src/app/${page}/page.tsx`)
      ).exists()
      if (installed !== (framework === "next"))
        throw new Error(`Unexpected ${page} page in ${framework}`)
    }
    for (const name of ["organ-viewer", "molecule-viewer", "dna-helix"]) {
      const viewer = await readFile(
        resolve(dir, `src/components/${name}.tsx`),
        "utf8"
      )
      if (
        viewer.includes("@workspace/") ||
        (framework === "next" && !viewer.includes('"use client"'))
      )
        throw new Error(`Invalid installed ${name}`)
    }
    for (const name of ["anatomy-tree", "medication-schedule"]) {
      const installed = await readFile(
        resolve(dir, `src/components/ui/${name}.tsx`),
        "utf8"
      )
      if (
        installed.includes("@workspace/") ||
        (framework === "next" && !installed.includes('"use client"'))
      )
        throw new Error(`Invalid installed ${name} source`)
    }
    const vitals = await readFile(
      resolve(dir, "src/components/ui/vital-signs.tsx"),
      "utf8"
    )
    if (
      vitals.includes("@workspace/") ||
      !vitals.includes("@/components/ui/card")
    )
      throw new Error("Invalid installed vital signs")
    if ((await readFile(resolve(dir, "src/globals.css"), "utf8")) !== css)
      throw new Error("Consumer theme modified")
    await run(["bun", "run", "build"], dir)
  }
} finally {
  server.stop()
}

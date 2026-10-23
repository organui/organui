import { mkdir, writeFile, readFile, rm } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { heartModel } from "@workspace/registry/heart"
import { fixtureGlb } from "./fixture-glb.js"
import catalog from "@workspace/registry/registry.json"
import { githubConsumer } from "./github-consumer.js"
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
  // /styles/radix-*/ serves the Radix build, as the docs site does.
  fetch(request) {
    const path = new URL(request.url).pathname
    const name = path.split("/").at(-1) ?? ""
    const directory = path.startsWith("/styles/radix-")
      ? resolve(registry, "radix")
      : registry
    const file = Bun.file(resolve(directory, name))
    if (!/^[a-z0-9-]+\.json$/.test(name))
      return new Response(null, { status: 404 })
    return file
      .exists()
      .then((found) =>
        found ? new Response(file) : new Response(null, { status: 404 })
      )
  },
})
async function run(command: string[], cwd: string, declineOverwrites = false) {
  const child = Bun.spawn(command, {
    cwd,
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
    timeout: 180_000,
  })
  let pending = ""
  let inputClosed = false
  const closeInput = () => {
    if (!inputClosed) child.stdin.end()
    inputClosed = true
  }
  if (!declineOverwrites) closeInput()
  async function forward(
    stream: ReadableStream<Uint8Array>,
    output: NodeJS.WriteStream
  ) {
    const decoder = new TextDecoder()
    const reader = stream.getReader()
    while (true) {
      const { done, value: chunk } = await reader.read()
      if (done) break
      output.write(chunk)
      if (declineOverwrites) {
        pending += decoder.decode(chunk, { stream: true })
        if (
          !inputClosed &&
          pending.includes("Would you like to overwrite?") &&
          pending.includes("(y/N)")
        ) {
          child.stdin.write("n\n")
          child.stdin.flush()
          pending = ""
        }
        // prompts leaves stdin flowing after an answer. Close it once the CLI
        // reports its final file summary so the process can actually exit.
        if (/\b(?:Created|Updated|Skipped) \d+ files?/.test(pending))
          closeInput()
      }
    }
  }
  await Promise.all([
    forward(child.stdout, process.stdout),
    forward(child.stderr, process.stderr),
  ])
  closeInput()
  if (await child.exited) throw new Error(`${command.join(" ")} failed`)
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
const labHarness = `import { LabResultsTable } from "@/components/ui/lab-results"
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
// Made-up LMS tables stand in for the WHO standards, which are not redistributed.
const growthHarness = `import { GrowthChart, type GrowthTable } from "@/components/ui/growth-chart"
const table=(offset:number):GrowthTable=>({start:0,lms:Array.from({length:25},(_,month)=>[0.2,3.2+offset+0.45*month-0.006*month*month,0.12] as const)})
export default function GrowthHarness(){
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed growth chart</h1><GrowthChart standards={{weight:{female:table(0),male:table(0.3)}}} measure="weight" sex="female" measurements={[{ageMonths:0,value:3.1},{ageMonths:6,value:5.6},{ageMonths:12,value:8.9}]}/></main>
}`

const moleculeHarness = `"use client"
import { useState } from "react"
import { MoleculeViewer } from "@/components/molecule-viewer"
import { DnaHelix } from "@/components/dna-helix"
export default function MoleculeHarness(){
 const [residue,setResidue]=useState<string|null>(null)
 const [pair,setPair]=useState<number|null>(null)
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed molecules</h1><MoleculeViewer src="/crambin.pdb" selectedId={residue} onSelectionChange={setResidue}/><output aria-label="Residue">{residue??"none"}</output><button onClick={()=>setResidue("A:3")}>Select Cys 3</button><DnaHelix sequence="ATGC" selectedIndex={pair} onSelectionChange={setPair} autoRotate={false}/><output aria-label="Pair">{pair??"none"}</output></main>
}`
// The ECG harness pairs a recorded strip with a live synthetic stream.
const ecgHarness = `"use client"
import { useMemo } from "react"
import { EcgTrace, syntheticEcg, syntheticEcgStream } from "@/components/ui/ecg-trace"
const recording = syntheticEcg({ duration: 5 })
export default function EcgHarness(){
 const stream = useMemo(()=>syntheticEcgStream({heartRate:90}),[])
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed ECG trace</h1><EcgTrace samples={recording} label="Recorded ECG"/><EcgTrace stream={stream} label="Live ECG"/></main>
}`
const dermatomeHarness = `"use client"
import { useState } from "react"
import { DermatomeMap, type DermatomeId } from "@/components/ui/dermatome-map"
export default function DermatomeHarness(){
 const [selectedId,select]=useState<DermatomeId|null>(null)
 return <main style={{maxWidth:960,margin:"auto",padding:20}}><h1>Installed dermatome map</h1><DermatomeMap selectedId={selectedId} onSelectionChange={select} colors={{L4:"rgb(10, 20, 30)"}}/><output aria-label="Selected">{selectedId??"none"}</output><button onClick={()=>select("T10")}>Select T10</button></main>
}`
// The body map inside a form, so the hidden inputs are checked too.
const bodyMapHarness = `"use client"
import { useState } from "react"
import { BodyMap } from "@/components/ui/body-map"
export default function BodyMapHarness(){
 const [value,setValue]=useState<string[]>([])
 const [submitted,setSubmitted]=useState("")
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed body map</h1><form onSubmit={(event)=>{event.preventDefault();setSubmitted(new FormData(event.currentTarget).getAll("regions").join(","))}}><BodyMap label="Where does it hurt?" value={value} onValueChange={setValue} name="regions"/><button type="submit">Submit</button></form><output aria-label="Value">{value.join(",")}</output><output aria-label="Submitted">{submitted}</output><button onClick={()=>setValue(["gone","neck"])}>Unknown ID</button></main>
}`
// The image harness shows the installed phantom and type-checks the DICOM reader.
const imageHarness = `"use client"
import { useState } from "react"
import { ImageViewer, ctWindowPresets, type ImageWindow } from "@/components/ui/image-viewer"
import { parseDicom } from "@/lib/dicom"
import { createHeadPhantom } from "@/lib/head-phantom"
const phantom = createHeadPhantom()
export const readDicom: (buffer: ArrayBuffer) => { width: number } = parseDicom
export default function ImageHarness(){
 const [slice,setSlice]=useState(15)
 const [window,setWindow]=useState<ImageWindow|null>(null)
 return <main style={{maxWidth:720,margin:"auto",padding:20}}><h1>Installed image viewer</h1><ImageViewer {...phantom} label="Head phantom" presets={ctWindowPresets} slice={slice} onSliceChange={setSlice} onWindowChange={setWindow}/><output aria-label="Slice">{slice}</output><output aria-label="Window">{window?\`\${window.width}/\${window.center}\`:"default"}</output></main>
}`
// Vite has no file routing, so the CLI skips block pages there; these stand in
// for them. Next.js serves the installed pages at the same paths.
const blockHarness = `import { OrganExplorer } from "@/components/organ-explorer"
import { examplePatient, PatientDashboard } from "@/components/patient-dashboard"
import { AnatomyWorkspace } from "@/components/anatomy-workspace"
import { OrganSwitcher } from "@/components/organ-switcher"
import { heartModel } from "@/components/heart"
import { kidneysModel } from "@/components/kidneys"
import { pancreasModel } from "@/components/pancreas"
import { stomachModel } from "@/components/stomach"
export default function BlockHarness({path}:{path:string}){
 if(path==="/workspace")return <AnatomyWorkspace model={heartModel}/>
 if(path==="/dashboard")return <main className="mx-auto w-full max-w-7xl p-4 md:p-6"><PatientDashboard patient={examplePatient}/></main>
 return <main style={{padding:24}}><h1>{path==="/organs"?"Organs":"Heart"}</h1>{path==="/organs"?<OrganSwitcher models={[heartModel,kidneysModel,stomachModel,pancreasModel]}/>:<OrganExplorer model={heartModel}/>}</main>
}`
// Uses each helper and CSS utility, so the build type-checks the helpers
// and compiles the classes.
const utilitiesHarness = `import { formatAge, ageInMonths } from "@/lib/age"
import { bodyMassIndex } from "@/lib/body-measurements"
import { convertAnalyte } from "@/lib/clinical-units"
import { flagValue } from "@/lib/reference-ranges"
import { lmsZScore } from "@/lib/z-scores"
export default function UtilitiesHarness(){
 const z=lmsZScore(10,[0.2,9.4,0.11])
 return <main className="bg-ecg-grid ecg-grid-color-sky-500"><p className="animate-heartbeat heartbeat-rate-72 text-severity-critical">{formatAge(ageInMonths(new Date("2025-01-01"),new Date("2026-01-01")))} {bodyMassIndex(70,175).toFixed(1)} {convertAnalyte("glucose",100,"conventional","si").toFixed(1)} {flagValue(6.4,{high:5.1})} {z?.toFixed(2)}</p></main>
}`
const helpers = [
  "age",
  "z-scores",
  "reference-ranges",
  "clinical-units",
  "body-measurements",
]
const utilities = [...helpers, "utilities"]
// Built from shadcn components only, so one copy serves Base UI and Radix;
// the Radix consumer's build checks that.
const aiElements = [
  "ai-disclaimer",
  "clinical-citation",
  "clinical-sources",
  "differential-list",
  "clinician-review",
  "ai-note",
]
const blocks = ["explorer-01", "explorer-02", "explorer-03", "dashboard-01"]
const pages = ["explorer", "workspace", "organs", "dashboard"]
// Deliberately use distinct theme values to detect accidental theme overwrites.
const css = `@import "tailwindcss";
@theme inline { --color-background:var(--background);--color-foreground:var(--foreground);--color-muted:var(--muted);--color-muted-foreground:var(--muted-foreground);--color-accent:var(--accent);--color-border:var(--border);--color-ring:var(--ring); }
:root{--background:#f4f7fb;--foreground:#142d45;--muted:#e5edf4;--muted-foreground:#48627a;--accent:#d7e8f5;--border:#94a9ba;--ring:#225d9b;}body{background:var(--background);color:var(--foreground);font-family:system-ui;}button{cursor:pointer;}`
try {
  // Radix is a Next.js app on a Radix style, installing every item by name
  // through a {style} registry URL.
  for (const framework of ["next", "vite", "radix"]) {
    const dir = resolve(out, framework)
    const nextjs = framework !== "vite"
    const byName = framework !== "next"
    const radix = framework === "radix"
    // Exercise both a different prefix and independent component/UI folders.
    const customAliases = framework === "vite"
    const componentDir = customAliases ? "src/widgets" : "src/components"
    const uiDir = customAliases ? "src/primitives" : "src/components/ui"
    const source = (value: string) =>
      customAliases
        ? value
            .replaceAll("@/components/ui/", "~/primitives/")
            .replaceAll("@/components/", "~/widgets/")
        : value
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
      ...(nextjs ? { next: "16.3.3" } : { vite: "7.3.1" }),
    }
    await put(dir, "package.json", {
      name: `anatomy-consumer-${framework}`,
      private: true,
      type: "module",
      scripts: {
        build: nextjs ? "next build" : "tsc --noEmit && vite build",
        start: radix
          ? "next start --port 4320"
          : nextjs
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
        paths: { [customAliases ? "~/*" : "@/*"]: ["./src/*"] },
        ...(nextjs ? { plugins: [{ name: "next" }] } : {}),
      },
      include: ["src", "next-env.d.ts", ".next/types/**/*.ts"],
    })
    await put(dir, "components.json", {
      $schema: "https://ui.shadcn.com/schema.json",
      style: radix ? "radix-nova" : "base-nova",
      rsc: nextjs,
      tsx: true,
      tailwind: {
        config: "",
        css: "src/globals.css",
        baseColor: "neutral",
        cssVariables: true,
      },
      iconLibrary: "lucide",
      registries: {
        "@organui": radix
          ? `http://127.0.0.1:${server.port}/styles/{style}/{name}.json`
          : `http://127.0.0.1:${server.port}/{name}.json`,
      },
      aliases: customAliases
        ? {
            components: "~/widgets",
            ui: "~/primitives",
            utils: "~/support/utils",
            lib: "~/support",
            hooks: "~/hooks",
          }
        : {
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
    await put(dir, "src/harness.tsx", source(harness))
    await put(dir, "src/organ-harness.tsx", source(organHarness))
    await put(dir, "src/vitals-harness.tsx", source(vitalsHarness))
    await put(dir, "src/lab-harness.tsx", source(labHarness))
    await put(dir, "src/molecule-harness.tsx", source(moleculeHarness))
    await put(dir, "src/medication-harness.tsx", source(medicationHarness))
    await put(dir, "src/ecg-harness.tsx", source(ecgHarness))
    await put(dir, "src/growth-harness.tsx", source(growthHarness))
    await put(dir, "src/body-map-harness.tsx", source(bodyMapHarness))
    await put(dir, "src/dermatome-harness.tsx", source(dermatomeHarness))
    // Its lib files install by target, under src/lib whatever the aliases.
    await put(
      dir,
      "src/image-harness.tsx",
      source(imageHarness).replaceAll(
        "@/lib/",
        customAliases ? "~/lib/" : "@/lib/"
      )
    )
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
    if (nextjs) {
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
        "src/app/dermatome/page.tsx",
        'export {default} from "../../dermatome-harness"'
      )
      await put(
        dir,
        "src/app/ecg/page.tsx",
        'export {default} from "../../ecg-harness"'
      )
      await put(
        dir,
        "src/app/growth/page.tsx",
        'export {default} from "../../growth-harness"'
      )
      await put(
        dir,
        "src/app/body-map/page.tsx",
        'export {default} from "../../body-map-harness"'
      )
      await put(
        dir,
        "src/app/image/page.tsx",
        'export {default} from "../../image-harness"'
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
        'import React from "react";import {createRoot} from "react-dom/client";import Harness from "./harness";import OrganHarness from "./organ-harness";import MoleculeHarness from "./molecule-harness";import EcgHarness from "./ecg-harness";import GrowthHarness from "./growth-harness";import BodyMapHarness from "./body-map-harness";import DermatomeHarness from "./dermatome-harness";import BlockHarness from "./block-harness";import LabHarness from "./lab-harness";import MedicationHarness from "./medication-harness";import VitalsHarness from "./vitals-harness";import ImageHarness from "./image-harness";import "./globals.css";const path=location.pathname;createRoot(document.getElementById("root")!).render(path==="/organ"?<OrganHarness/>:path==="/ecg"?<EcgHarness/>:path==="/growth"?<GrowthHarness/>:path==="/body-map"?<BodyMapHarness/>:path==="/dermatome"?<DermatomeHarness/>:path==="/molecule"?<MoleculeHarness/>:path==="/lab"?<LabHarness/>:path==="/medication"?<MedicationHarness/>:path==="/vitals"?<VitalsHarness/>:path==="/image"?<ImageHarness/>:["/explorer","/workspace","/organs","/dashboard"].includes(path)?<BlockHarness path={path}/>:<Harness/>);'
      )
      await put(dir, "src/block-harness.tsx", source(blockHarness))
      await put(
        dir,
        "vite.config.ts",
        'import {defineConfig} from "vite";import {fileURLToPath} from "node:url";export default defineConfig({resolve:{alias:{"~":fileURLToPath(new URL("./src",import.meta.url))}},esbuild:{jsx:"automatic"}})'
      )
    }
    await run(["bun", "install"], dir)
    await run(
      [
        "node",
        shadcn,
        "add",
        // Vite exercises the documented namespace; Next installs by URL.
        byName
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
        byName
          ? "@organui/heart"
          : `http://127.0.0.1:${server.port}/heart.json`,
        "--yes",
      ],
      dir
    )
    // Only the sandboxed generated consumer is edited. A second organ must
    // not replace a consumer customization in the shared renderer.
    const sharedViewer = resolve(dir, `${componentDir}/organ-viewer.tsx`)
    const customizedViewer =
      (await readFile(sharedViewer, "utf8")) +
      "\n// Consumer customization: keep this renderer.\n"
    await writeFile(sharedViewer, customizedViewer)
    await run(
      [
        "node",
        shadcn,
        "add",
        byName
          ? "@organui/brain"
          : `http://127.0.0.1:${server.port}/brain.json`,
        "--yes",
      ],
      dir,
      true
    )
    if (!(await Bun.file(resolve(dir, `${componentDir}/brain.tsx`)).exists()))
      throw new Error("The second organ was not installed")
    if ((await readFile(sharedViewer, "utf8")) !== customizedViewer)
      throw new Error("Installing Brain replaced the existing organ renderer")
    // Restore the generated fixture before the remaining shared-file installs.
    await writeFile(
      sharedViewer,
      customizedViewer.replace(
        "\n// Consumer customization: keep this renderer.\n",
        ""
      )
    )
    const organs = catalog.items.filter(
      (item) =>
        "categories" in item &&
        (item.categories?.includes("organ") ||
          item.categories?.includes("cell"))
    )
    // Install all organs together through the real CLI and compile their public
    // APIs. Next uses URLs; Vite also exercises a namespace and custom aliases.
    await run(
      [
        "node",
        shadcn,
        "add",
        ...organs.map(({ name }) =>
          byName
            ? `@organui/${name}`
            : `http://127.0.0.1:${server.port}/${name}.json`
        ),
        ...(framework === "vite" ? ["--overwrite"] : []),
        "--yes",
      ],
      dir
    )
    await put(
      dir,
      "src/all-organs.tsx",
      source(
        '"use client"\n' +
          organs
            .map(({ name }) => {
              const component = name
                .split("-")
                .map((word) => word[0]!.toUpperCase() + word.slice(1))
                .join("")
              return `import { ${component}, type ${component}Props } from "@/components/${name}"\nexport function ${component}Example(props: ${component}Props) { return <${component} {...props} /> }`
            })
            .join("\n")
      )
    )
    await run(
      [
        "node",
        shadcn,
        "add",
        byName
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
        byName
          ? "@organui/medication-schedule"
          : `http://127.0.0.1:${server.port}/medication-schedule.json`,
        "--yes",
      ],
      dir
    )
    // These share shadcn components installed above; see the note on blocks
    // below for why Vite overwrites.
    for (const item of [
      "molecule-viewer",
      "dna-helix",
      "vital-signs",
      "ecg-trace",
      "dermatome-map",
      "body-map",
      "image-viewer",
      "growth-chart",
    ])
      await run(
        [
          "node",
          shadcn,
          "add",
          ...(byName
            ? [`@organui/${item}`, ...(radix ? [] : ["--overwrite"])]
            : [`http://127.0.0.1:${server.port}/${item}.json`]),
          "--yes",
        ],
        dir
      )
    // Blocks reuse the files installed above. Without RSC, shadcn (4.21–4.22) strips
    // "use client" from every other file it writes (a global regex keeps its
    // lastIndex), so a reinstall differs and prompts; overwrite instead.
    for (const block of blocks)
      await run(
        [
          "node",
          shadcn,
          "add",
          ...(byName
            ? [`@organui/${block}`, ...(radix ? [] : ["--overwrite"])]
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
      if (installed !== nextjs)
        throw new Error(`Unexpected ${page} page in ${framework}`)
    }
    for (const name of ["organ-viewer", "molecule-viewer", "dna-helix"]) {
      const viewer = await readFile(
        resolve(dir, `${componentDir}/${name}.tsx`),
        "utf8"
      )
      if (
        viewer.includes("@workspace/") ||
        (customAliases && viewer.includes('from "@/')) ||
        (nextjs && !viewer.includes('"use client"')) ||
        (radix && viewer.includes("render={"))
      )
        throw new Error(`Invalid installed ${name}`)
    }
    for (const name of [
      "anatomy-tree",
      "medication-schedule",
      "ecg-trace",
      "dermatome-map",
      "body-map",
      "image-viewer",
      "growth-chart",
    ]) {
      const installed = await readFile(
        resolve(dir, `${uiDir}/${name}.tsx`),
        "utf8"
      )
      if (
        installed.includes("@workspace/") ||
        (customAliases && installed.includes('from "@/')) ||
        (nextjs && !installed.includes('"use client"')) ||
        (radix && installed.includes("@base-ui/react"))
      )
        throw new Error(`Invalid installed ${name} source`)
    }
    for (const file of ["dicom.ts", "head-phantom.ts"])
      if (
        (await readFile(resolve(dir, "src/lib", file), "utf8")).includes(
          "@workspace/"
        )
      )
        throw new Error(`Invalid installed ${file}`)
    const vitals = await readFile(
      resolve(dir, `${uiDir}/vital-signs.tsx`),
      "utf8"
    )
    if (
      vitals.includes("@workspace/") ||
      !vitals.includes(
        customAliases ? "~/primitives/card" : "@/components/ui/card"
      )
    )
      throw new Error("Invalid installed vital signs")
    if ((await readFile(resolve(dir, "src/globals.css"), "utf8")) !== css)
      throw new Error("Consumer theme modified")
    // Utilities: helpers install in lib; CSS utilities add to the CSS file
    // and keep the consumer's theme. The growth chart and lab results
    // installed the helpers they use above.
    await run(
      [
        "node",
        shadcn,
        "add",
        ...utilities.map((name) =>
          byName
            ? `@organui/${name}`
            : `http://127.0.0.1:${server.port}/${name}.json`
        ),
        "--yes",
      ],
      dir
    )
    const libDir = customAliases ? "src/support" : "src/lib"
    for (const name of helpers)
      if (!(await Bun.file(resolve(dir, libDir, `${name}.ts`)).exists()))
        throw new Error(`The ${name} helper was not installed`)
    const growth = await readFile(
      resolve(dir, `${uiDir}/growth-chart.tsx`),
      "utf8"
    )
    if (
      !growth.includes(customAliases ? "~/support/z-scores" : "@/lib/z-scores")
    )
      throw new Error("The growth chart doesn't import the z-scores helper")
    const styles = await readFile(resolve(dir, "src/globals.css"), "utf8")
    for (const rule of [
      "@utility animate-heartbeat",
      "@utility bg-ecg-grid",
      "--severity-critical",
      "--color-severity-critical",
    ])
      if (!styles.includes(rule)) throw new Error(`Missing ${rule} in CSS`)
    if (!styles.includes("--background:#f4f7fb"))
      throw new Error("Consumer theme modified by a utility")
    await run(
      [
        "node",
        shadcn,
        "add",
        ...aiElements.map((name) =>
          byName
            ? `@organui/${name}`
            : `http://127.0.0.1:${server.port}/${name}.json`
        ),
        ...(framework === "vite" ? ["--overwrite"] : []),
        "--yes",
      ],
      dir
    )
    // Charts install as blocks, with shadcn's chart and card.
    const charts = catalog.items
      .filter(
        (item) => "categories" in item && item.categories?.includes("charts")
      )
      .map(({ name }) => name)
    await run(
      [
        "node",
        shadcn,
        "add",
        ...charts.map((name) =>
          byName
            ? `@organui/${name}`
            : `http://127.0.0.1:${server.port}/${name}.json`
        ),
        ...(framework === "vite" ? ["--overwrite"] : []),
        "--yes",
      ],
      dir
    )
    for (const name of charts)
      if (
        !(await Bun.file(resolve(dir, `${componentDir}/${name}.tsx`)).exists())
      )
        throw new Error(`The ${name} chart was not installed`)
    for (const name of aiElements) {
      const installed = await readFile(
        resolve(dir, `${uiDir}/${name}.tsx`),
        "utf8"
      )
      if (
        installed.includes("@workspace/") ||
        (customAliases && installed.includes('from "@/'))
      )
        throw new Error(`Invalid installed ${name}`)
    }
    // Helpers install in the lib alias, ~/support in the Vite consumer.
    await put(
      dir,
      "src/utilities-harness.tsx",
      utilitiesHarness.replaceAll(
        "@/lib/",
        customAliases ? "~/support/" : "@/lib/"
      )
    )
    await run(["bun", "run", "build"], dir)
  }
  await githubConsumer(resolve(out, "github"), shadcn)
} finally {
  server.stop()
}

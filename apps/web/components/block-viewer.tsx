"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  CheckIcon,
  FileIcon,
  FullscreenIcon,
  MonitorIcon,
  RotateCwIcon,
  SmartphoneIcon,
  TabletIcon,
  TerminalIcon,
} from "lucide-react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"
import { Separator } from "@workspace/ui/components/separator"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { cn } from "@workspace/ui/lib/utils"
import { copyText } from "@workspace/ui/lib/copy-text"
import { trackEvent } from "@/lib/events"

export type BlockViewerFile = { target: string; source: React.ReactNode }

type PanelHandle =
  NonNullable<
    React.ComponentProps<typeof ResizablePanel>["panelRef"]
  > extends React.Ref<infer T>
    ? T
    : never

const widths = [
  { value: "100%", label: "Desktop", icon: MonitorIcon },
  { value: "60%", label: "Tablet", icon: TabletIcon },
  { value: "30%", label: "Mobile", icon: SmartphoneIcon },
]

// One block on /blocks: a toolbar, then its page framed at a width you can
// drag or pick, or its files with their source.
export function BlockViewer({
  name,
  title,
  description,
  view: src,
  frameHeight,
  install,
  files,
  uses,
}: {
  name: string
  title: string
  description?: string
  view: string
  frameHeight: string
  install: string
  files: BlockViewerFile[]
  uses: string[]
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview")
  const [width, setWidth] = React.useState("100%")
  const [activeFile, setActiveFile] = React.useState(files[0]?.target)
  const [frameKey, setFrameKey] = React.useState(0)
  const panel = React.useRef<PanelHandle>(null)

  return (
    <section
      id={name}
      aria-labelledby={`${name}-title`}
      data-view={view}
      className="group/block flex min-w-0 scroll-mt-24 flex-col gap-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Tabs
          value={view}
          onValueChange={(value) => setView(value as "preview" | "code")}
        >
          <TabsList
            aria-label={`${title} view`}
            className="h-8 *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs"
          >
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </Tabs>
        <Separator
          orientation="vertical"
          className="mx-2 data-vertical:h-4 data-vertical:self-center"
        />
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h2 id={`${name}-title`} className="shrink-0 text-sm font-medium">
            <a href={`#${name}`} className="underline-offset-2 hover:underline">
              {title}
            </a>
          </h2>
          {description && (
            <p
              title={description}
              className="hidden min-w-0 truncate text-sm text-muted-foreground xl:block"
            >
              {description.replace(/\.$/, "")}
            </p>
          )}
        </div>
        <div className="flex max-w-full min-w-0 items-center gap-2">
          <div className="hidden h-8 items-center gap-1 rounded-lg border p-[3px] lg:flex">
            <ToggleGroup
              aria-label="Preview width"
              size="sm"
              spacing={1}
              value={[width]}
              onValueChange={(values) => {
                const next = values[0]
                if (next === undefined) return
                setWidth(next)
                setView("preview")
                panel.current?.resize(next)
              }}
            >
              {widths.map(({ value, label, icon: Icon }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  aria-label={label}
                  title={label}
                  className="size-6 min-w-6 rounded-md p-0"
                >
                  <Icon />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Separator
              orientation="vertical"
              className="data-vertical:h-4 data-vertical:self-center"
            />
            <Link
              href={src}
              target="_blank"
              title="Open in a new tab"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-xs" }),
                "rounded-md"
              )}
            >
              <FullscreenIcon />
              <span className="sr-only">Open {title} in a new tab</span>
            </Link>
            <Separator
              orientation="vertical"
              className="data-vertical:h-4 data-vertical:self-center"
            />
            <Button
              variant="ghost"
              size="icon-xs"
              title="Reload preview"
              className="rounded-md"
              onClick={() => setFrameKey((key) => key + 1)}
            >
              <RotateCwIcon />
              <span className="sr-only">Reload {title} preview</span>
            </Button>
          </div>
          <Separator
            orientation="vertical"
            className="mx-1 hidden lg:block data-vertical:h-4 data-vertical:self-center"
          />
          <InstallButton command={install} />
        </div>
      </div>
      {/* Phones get a picture of the page; wide screens get the page. */}
      <div className="overflow-hidden rounded-xl border group-data-[view=code]/block:hidden lg:hidden">
        <Image
          src={`/blocks/${name}-light.webp`}
          alt={`${title} preview`}
          width={1440}
          height={900}
          sizes="100vw"
          className="w-full dark:hidden"
        />
        <Image
          src={`/blocks/${name}-dark.webp`}
          alt={`${title} preview`}
          width={1440}
          height={900}
          sizes="100vw"
          className="hidden w-full dark:block"
        />
      </div>
      <div className="hidden lg:group-data-[view=preview]/block:block">
        <div className="relative">
          {/* A dotted backdrop that shows when the preview is narrowed. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[20px_20px] lg:right-4 lg:block"
          />
          {/* The frame ignores the pointer during a drag, so it can't swallow it. */}
          <ResizablePanelGroup
            orientation="horizontal"
            className="relative [&:has([data-separator=active])_iframe]:pointer-events-none"
          >
            <ResizablePanel
              panelRef={panel}
              defaultSize="100%"
              minSize="30%"
              className="relative overflow-hidden rounded-xl border bg-background"
            >
              <iframe
                key={frameKey}
                src={src}
                title={`${title} preview`}
                loading="lazy"
                style={{ height: frameHeight }}
                className="w-full bg-background"
              />
            </ResizablePanel>
            <ResizableHandle className="relative hidden w-4 bg-transparent after:absolute after:top-1/2 after:right-0 after:left-auto after:h-8 after:w-1.5 after:translate-x-0 after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all hover:after:h-10 lg:flex" />
            <ResizablePanel defaultSize="0%" minSize="0%" />
          </ResizablePanelGroup>
        </div>
      </div>
      <div className="flex min-h-[36rem] flex-col overflow-hidden rounded-xl border group-data-[view=preview]/block:hidden md:flex-row lg:me-4 lg:h-[44rem]">
        <nav
          aria-label={`${title} files`}
          className="flex shrink-0 flex-col gap-4 border-b bg-muted/30 p-2 text-sm md:w-64 md:border-e md:border-b-0"
        >
          <div className="flex flex-col gap-0.5">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Files
            </p>
            {files.map((file) => (
              <button
                key={file.target}
                type="button"
                aria-pressed={file.target === activeFile}
                onClick={() => setActiveFile(file.target)}
                className="flex h-8 items-center gap-2 rounded-md px-2 text-start font-mono text-xs whitespace-nowrap hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-accent aria-pressed:font-medium"
              >
                <FileIcon className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">{file.target}</span>
              </button>
            ))}
          </div>
          {uses.length > 0 && (
            <div className="flex flex-col gap-0.5">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Uses
              </p>
              {uses.map((item) => (
                <Link
                  key={item}
                  href={`/docs/components/${item}`}
                  className="flex h-8 items-center rounded-md px-2 text-xs font-medium hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </nav>
        <div className="min-h-0 min-w-0 flex-1">
          {files.map((file) => (
            <div
              key={file.target}
              hidden={file.target !== activeFile}
              className="h-full"
            >
              {file.source}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function InstallButton({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])
  return (
    <Button
      variant="outline"
      size="sm"
      className="max-w-full min-w-0 gap-1.5 font-mono text-xs shadow-none"
      title="Copy the install command"
      onClick={() =>
        copyText(command).then((ok) => {
          setCopied(ok)
          if (ok) trackEvent("copy_block_command", { command })
        })
      }
    >
      {copied ? <CheckIcon /> : <TerminalIcon />}
      <span className="truncate">{command}</span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </Button>
  )
}

"use client"

import { useState, type ReactNode } from "react"
import { DEFAULT_PRESET_CONFIG, encodePreset } from "shadcn/preset"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ThemeScope } from "@/components/theme-scope"
import { libraries, libraryNames, type Library } from "@/lib/libraries"
import {
  accentThemes,
  baseColors,
  defaultThemeChoice,
  radii,
  type ThemeChoice,
} from "@/lib/themes"
import { CopyButton } from "@/components/copy-button"

const templates = [
  { value: "next", label: "Next.js" },
  { value: "vite", label: "Vite" },
] as const

const iconLibraries = [
  { value: "lucide", label: "Lucide" },
  { value: "tabler", label: "Tabler" },
  { value: "hugeicons", label: "Hugeicons" },
  { value: "phosphor", label: "Phosphor" },
  { value: "remixicon", label: "Remix Icon" },
] as const

export type CreateGroup = {
  title: string
  items: { name: string; title: string }[]
}

type Option = { value: string; label: string; swatch?: string }

function Swatch({ color }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-3.5 shrink-0 rounded-full border border-foreground/10"
      style={{ background: color }}
    />
  )
}

// One setting as a row of the panel, as on shadcn/ui's create: its name
// above its value, opening a list.
function PickerRow({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string
  value: string
  options: readonly Option[]
  onValueChange: (value: string) => void
}) {
  const current = options.find((option) => option.value === value)
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => next && onValueChange(next)}
    >
      <SelectTrigger
        aria-label={label}
        className="h-auto w-full rounded-xl border bg-background px-3 py-2 data-[size=default]:h-auto dark:bg-background"
      >
        <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
          <span className="text-xs text-muted-foreground">{label}</span>
          <SelectValue className="font-medium" />
        </span>
        {current?.swatch && <Swatch color={current.swatch} />}
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.swatch && <Swatch color={option.swatch} />}
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Command({ title, code }: { title: string; code: string }) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{title}</CodeBlockTitle>
        <CodeBlockActions>
          <CopyButton event="copy_create_command" value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent role="region" aria-label={title}>
        {code}
      </CodeBlockContent>
    </CodeBlock>
  )
}

// /create, laid out as shadcn/ui's: a panel of settings beside a canvas of
// components in the chosen theme, and Get Code for the commands.
export function CreateStudio({
  shadcn,
  site,
  groups,
  children,
}: {
  // The pinned CLI, such as shadcn@4.22.1.
  shadcn: string
  site: string
  groups: CreateGroup[]
  children: ReactNode
}) {
  const [library, setLibrary] = useState<Library>("base")
  const [template, setTemplate] = useState<string>("next")
  const [icons, setIcons] = useState<string>("lucide")
  const [theme, setTheme] = useState<ThemeChoice>(defaultThemeChoice)
  const [selected, setSelected] = useState<string[]>(["vital-signs"])

  const preset = encodePreset({
    ...DEFAULT_PRESET_CONFIG,
    baseColor: theme.base as typeof DEFAULT_PRESET_CONFIG.baseColor,
    theme: (theme.accent ?? theme.base) as typeof DEFAULT_PRESET_CONFIG.theme,
    chartColor: (theme.accent ??
      theme.base) as typeof DEFAULT_PRESET_CONFIG.chartColor,
    radius: theme.radius,
    iconLibrary: icons as typeof DEFAULT_PRESET_CONFIG.iconLibrary,
  })
  const init = `bunx ${shadcn} init -t ${template} -b ${library} -p ${preset} -n my-app`
  const namespace = JSON.stringify(
    { registries: { "@organui": `${site}/r/styles/{style}/{name}.json` } },
    null,
    2
  )
  const add = selected.length
    ? `bunx ${shadcn} add ${selected.map((name) => `@organui/${name}`).join(" ")}`
    : null

  return (
    <div className="flex flex-col gap-4 p-4 pt-0 lg:h-[calc(100svh-var(--header-height))] lg:flex-row">
      <aside
        aria-label="Project settings"
        className="flex shrink-0 flex-col gap-2 rounded-2xl border bg-muted/30 p-2 lg:w-60 lg:overflow-y-auto"
      >
        <PickerRow
          label="Library"
          value={library}
          options={libraries.map((value) => ({
            value,
            label: libraryNames[value],
          }))}
          onValueChange={(value) => setLibrary(value as Library)}
        />
        <PickerRow
          label="Framework"
          value={template}
          options={templates}
          onValueChange={setTemplate}
        />
        <PickerRow
          label="Base Color"
          value={theme.base}
          options={baseColors.map((color) => ({
            value: color.name,
            label: color.title,
            swatch: color.cssVars.light["muted-foreground"],
          }))}
          onValueChange={(base) => setTheme({ ...theme, base })}
        />
        <PickerRow
          label="Theme"
          value={theme.accent ?? "none"}
          options={[
            { value: "none", label: "Base colour" },
            ...accentThemes.map((accent) => ({
              value: accent.name,
              label: accent.title,
              swatch: accent.cssVars.light.primary,
            })),
          ]}
          onValueChange={(accent) =>
            setTheme({ ...theme, accent: accent === "none" ? null : accent })
          }
        />
        <PickerRow
          label="Radius"
          value={theme.radius}
          options={radii.map((radius) => ({
            value: radius.name,
            label: radius.title,
          }))}
          onValueChange={(radius) =>
            setTheme({ ...theme, radius: radius as ThemeChoice["radius"] })
          }
        />
        <PickerRow
          label="Icons"
          value={icons}
          options={iconLibraries}
          onValueChange={setIcons}
        />
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="h-auto w-full flex-col items-start gap-0.5 rounded-xl bg-background px-3 py-2 dark:bg-background"
              />
            }
          >
            <span className="text-xs font-normal text-muted-foreground">
              OrganUI items
            </span>
            <span className="font-medium">{selected.length} selected</span>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            className="max-h-96 w-64 overflow-y-auto"
          >
            {groups.map((group) => (
              <fieldset key={group.title} className="flex flex-col gap-2">
                <legend className="mb-2 text-xs font-medium text-muted-foreground">
                  {group.title}
                </legend>
                {group.items.map((item) => {
                  const id = `create-${item.name}`
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={selected.includes(item.name)}
                        onCheckedChange={(checked) =>
                          setSelected((current) =>
                            checked
                              ? [...current, item.name]
                              : current.filter((name) => name !== item.name)
                          )
                        }
                      />
                      <Label htmlFor={id} className="font-normal">
                        {item.title}
                      </Label>
                    </div>
                  )
                })}
              </fieldset>
            ))}
          </PopoverContent>
        </Popover>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <p className="rounded-xl border bg-background px-3 py-2 text-center font-mono text-sm">
            --preset {preset}
          </p>
          <Dialog>
            <DialogTrigger render={<Button className="w-full rounded-xl" />}>
              Get Code
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create the project</DialogTitle>
                <DialogDescription>
                  Run these in a terminal. The preview uses this site&apos;s
                  icons and shadcn&apos;s nova style; your project gets the
                  icons you chose.
                </DialogDescription>
              </DialogHeader>
              <div className="flex min-w-0 flex-col gap-3">
                <Command title="Create the project" code={init} />
                {library === "radix" && (
                  <Command title="Registry namespace" code={namespace} />
                )}
                {add ? (
                  <Command title="Add OrganUI items" code={add} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Choose OrganUI items to add them too.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </aside>
      <ThemeScope
        choice={theme}
        className="min-h-0 min-w-0 flex-1 rounded-2xl border lg:overflow-y-auto"
      >
        {children}
      </ThemeScope>
    </div>
  )
}

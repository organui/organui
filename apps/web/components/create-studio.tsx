"use client"

import { useState, type ReactNode } from "react"
import { DEFAULT_PRESET_CONFIG, encodePreset } from "shadcn/preset"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@workspace/ui/components/code-block"
import { Label } from "@workspace/ui/components/label"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { ThemePicker } from "@/components/theme-picker"
import { ThemeScope } from "@/components/theme-scope"
import { libraries, libraryNames, type Library } from "@/lib/libraries"
import { defaultThemeChoice, type ThemeChoice } from "@/lib/themes"

const templates = [
  { name: "next", title: "Next.js" },
  { name: "vite", title: "Vite" },
] as const

const iconLibraries = [
  { name: "lucide", title: "Lucide" },
  { name: "tabler", title: "Tabler" },
  { name: "hugeicons", title: "Hugeicons" },
  { name: "phosphor", title: "Phosphor" },
  { name: "remixicon", title: "Remix Icon" },
] as const

export type CreateGroup = {
  title: string
  items: { name: string; title: string }[]
}

function Choice<T extends string>({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string
  value: T
  options: readonly { name: T; title: string }[]
  onValueChange: (value: T) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <ToggleGroup
        aria-label={label}
        variant="outline"
        size="sm"
        spacing={2}
        className="flex-wrap"
        value={[value]}
        onValueChange={([next]) => next && onValueChange(next as T)}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.name} value={option.name}>
            {option.title}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

function Command({ title, code }: { title: string; code: string }) {
  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{title}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent role="region" aria-label={title}>
        {code}
      </CodeBlockContent>
    </CodeBlock>
  )
}

// /create: choose a library, framework, theme, icons and OrganUI items, see
// the components in the theme, and copy the commands that set it all up.
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
  const [template, setTemplate] =
    useState<(typeof templates)[number]["name"]>("next")
  const [icons, setIcons] =
    useState<(typeof iconLibraries)[number]["name"]>("lucide")
  const [theme, setTheme] = useState<ThemeChoice>(defaultThemeChoice)
  const [selected, setSelected] = useState<string[]>(["vital-signs"])

  const preset = encodePreset({
    ...DEFAULT_PRESET_CONFIG,
    baseColor: theme.base as typeof DEFAULT_PRESET_CONFIG.baseColor,
    theme: (theme.accent ?? theme.base) as typeof DEFAULT_PRESET_CONFIG.theme,
    chartColor: (theme.accent ??
      theme.base) as typeof DEFAULT_PRESET_CONFIG.chartColor,
    radius: theme.radius,
    iconLibrary: icons,
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
    <div className="grid items-start gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="flex flex-col gap-6 rounded-xl border p-4 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:max-h-[calc(100svh-var(--header-height)-2rem)] lg:overflow-y-auto">
        <Choice
          label="Library"
          value={library}
          options={libraries.map((name) => ({
            name,
            title: libraryNames[name],
          }))}
          onValueChange={setLibrary}
        />
        <Choice
          label="Framework"
          value={template}
          options={templates}
          onValueChange={setTemplate}
        />
        <ThemePicker value={theme} onValueChange={setTheme} />
        <Choice
          label="Icons"
          value={icons}
          options={iconLibraries}
          onValueChange={setIcons}
        />
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
      </div>
      <div className="flex min-w-0 flex-col gap-6">
        <ol className="flex flex-col gap-4">
          <li className="flex flex-col gap-2">
            <p className="text-sm font-medium">1. Create the project</p>
            <Command title="Create the project" code={init} />
          </li>
          {library === "radix" && (
            <li className="flex flex-col gap-2">
              <p className="text-sm font-medium">
                2. Add OrganUI to <code>components.json</code>, for the Radix
                build
              </p>
              <Command title="Registry namespace" code={namespace} />
            </li>
          )}
          <li className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              {library === "radix" ? 3 : 2}. Add OrganUI items, in the{" "}
              <code>my-app</code> folder
            </p>
            {add ? (
              <Command title="Add OrganUI items" code={add} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Choose items to add.
              </p>
            )}
          </li>
        </ol>
        <p className="text-xs text-muted-foreground">
          The preview shows the theme with this site&apos;s icons and the nova
          style; your project gets the icons you chose.
        </p>
        <ThemeScope choice={theme} className="rounded-xl border">
          {children}
        </ThemeScope>
      </div>
    </div>
  )
}

"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { accentThemes, baseColors, radii, type ThemeChoice } from "@/lib/themes"

// A swatch of a theme's colour, beside its name.
function Swatch({ color }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-3.5 shrink-0 rounded-full border border-foreground/10"
      style={{ background: color }}
    />
  )
}

function Group({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

// Picks shadcn's base colour, an accent theme over it, and the radius.
export function ThemePicker({
  value,
  onValueChange,
}: {
  value: ThemeChoice
  onValueChange: (choice: ThemeChoice) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <Group label="Base colour">
        <ToggleGroup
          aria-label="Base colour"
          variant="outline"
          size="sm"
          spacing={2}
          className="flex-wrap"
          value={[value.base]}
          onValueChange={([next]) =>
            next && onValueChange({ ...value, base: next })
          }
        >
          {baseColors.map((theme) => (
            <ToggleGroupItem key={theme.name} value={theme.name}>
              <Swatch color={theme.cssVars.light["muted-foreground"]} />
              {theme.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Group>
      <Group label="Accent">
        <ToggleGroup
          aria-label="Accent"
          variant="outline"
          size="sm"
          spacing={2}
          className="flex-wrap"
          value={[value.accent ?? "none"]}
          onValueChange={([next]) =>
            next &&
            onValueChange({ ...value, accent: next === "none" ? null : next })
          }
        >
          <ToggleGroupItem value="none">None</ToggleGroupItem>
          {accentThemes.map((theme) => (
            <ToggleGroupItem key={theme.name} value={theme.name}>
              <Swatch color={theme.cssVars.light.primary} />
              {theme.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Group>
      <Group label="Radius">
        <ToggleGroup
          aria-label="Radius"
          variant="outline"
          size="sm"
          spacing={2}
          className="flex-wrap"
          value={[value.radius]}
          onValueChange={([next]) =>
            next &&
            onValueChange({
              ...value,
              radius: next as ThemeChoice["radius"],
            })
          }
        >
          {radii.map((radius) => (
            <ToggleGroupItem key={radius.name} value={radius.name}>
              {radius.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Group>
    </div>
  )
}
